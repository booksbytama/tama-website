'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { requireAdmin } from '@/lib/auth';
import { checkLimit } from '@/lib/ratelimit';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { NARRATION_VOICES, normaliseWord, synthesizeWords, type NarrationVoice } from '@/lib/tts';
import { loadPronunciations } from '@/lib/db/pronunciations';
import type { WordBox } from '@/lib/db/types';

const slug = z
  .string()
  .trim()
  .min(2)
  .max(80)
  .regex(/^[a-z0-9-]+$/, 'lowercase letters, numbers and dashes only');

const bookSchema = z.object({
  slug,
  title: z.string().trim().min(1).max(120),
  short_description: z.string().trim().max(300).nullable(),
  description: z.string().trim().max(4000).nullable(),
  book_type: z.enum(['picture', 'colouring']),
  series_id: z.string().uuid().nullable(),
  series_order: z.coerce.number().int().min(0).nullable(),
  ages_text: z.string().trim().max(120).nullable(),
  preview_pages: z.coerce.number().int().min(0).max(500),
  is_listed: z.boolean(),
  sample_enabled: z.boolean(),
  member_reading_enabled: z.boolean(),
  sort_order: z.coerce.number().int().default(0),
  buy_links: z.array(z.object({ label: z.string().trim().min(1).max(40), url: z.string().trim().url() })),
});

function str(fd: FormData, k: string) {
  const v = fd.get(k);
  return typeof v === 'string' && v.trim() !== '' ? v : null;
}

async function guard() {
  const user = await requireAdmin();
  if (!(await checkLimit('admin', user.id))) throw new Error('Slow down');
  return user;
}

export async function createBookAction() {
  await guard();
  const db = supabaseAdmin();
  const tempSlug = `new-book-${Date.now().toString(36)}`;
  const { data, error } = await db.from('books').insert({ slug: tempSlug, title: 'Untitled book', is_listed: false }).select('id').single();
  if (error) throw error;
  redirect(`/admin/books/${data.id}`);
}

export async function saveBookAction(id: string, formData: FormData): Promise<{ error?: string; ok?: true }> {
  await guard();
  const labels = formData.getAll('buy_label').map(String);
  const urls = formData.getAll('buy_url').map(String);
  const buy_links = labels.map((label, i) => ({ label, url: urls[i] ?? '' })).filter((l) => l.label.trim() && l.url.trim());

  const parsed = bookSchema.safeParse({
    slug: str(formData, 'slug'),
    title: str(formData, 'title'),
    short_description: str(formData, 'short_description'),
    description: str(formData, 'description'),
    book_type: str(formData, 'book_type'),
    series_id: str(formData, 'series_id'),
    series_order: str(formData, 'series_order'),
    ages_text: str(formData, 'ages_text'),
    preview_pages: str(formData, 'preview_pages') ?? 0,
    is_listed: formData.get('is_listed') === 'on',
    sample_enabled: formData.get('sample_enabled') === 'on',
    member_reading_enabled: formData.get('member_reading_enabled') === 'on',
    sort_order: str(formData, 'sort_order') ?? 0,
    buy_links,
  });
  if (!parsed.success) return { error: parsed.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join('; ') };

  const { error } = await supabaseAdmin().from('books').update(parsed.data).eq('id', id);
  if (error) return { error: error.message.includes('books_slug_key') ? 'That slug is already used by another book.' : error.message };
  revalidatePath('/', 'layout');
  return { ok: true };
}

export async function uploadCoverAction(id: string, formData: FormData): Promise<{ error?: string; ok?: true }> {
  await guard();
  const file = formData.get('cover');
  if (!(file instanceof File) || file.size === 0) return { error: 'Pick an image first.' };
  if (file.size > 4 * 1024 * 1024) return { error: 'Cover must be under 4 MB.' };
  if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) return { error: 'Use a JPG, PNG or WebP.' };
  const ext = file.type === 'image/png' ? 'png' : file.type === 'image/webp' ? 'webp' : 'jpg';
  const path = `${id}-${Date.now().toString(36)}.${ext}`;
  const db = supabaseAdmin();
  const { error } = await db.storage.from('covers').upload(path, Buffer.from(await file.arrayBuffer()), { contentType: file.type, upsert: true });
  if (error) return { error: error.message };
  const { error: uErr } = await db.from('books').update({ cover_path: path }).eq('id', id);
  if (uErr) return { error: uErr.message };
  revalidatePath('/', 'layout');
  return { ok: true };
}

export async function deleteBookAction(id: string) {
  await guard();
  const db = supabaseAdmin();
  const { data: pages } = await db.from('book_pages').select('storage_path').eq('book_id', id);
  if (pages?.length) await db.storage.from('pages').remove(pages.map((p) => p.storage_path));
  const { error } = await db.from('books').delete().eq('id', id);
  if (error) throw error;
  revalidatePath('/', 'layout');
  redirect('/admin');
}

// --- Page images (converted in the admin's browser) ---

export async function beginPageUploadAction(bookId: string, pageCount: number): Promise<{ uploads: { page: number; path: string; url: string; token: string }[] }> {
  await guard();
  if (pageCount < 1 || pageCount > 500) throw new Error('Page count out of range');
  const db = supabaseAdmin();
  const batch = Date.now().toString(36);
  const uploads = [] as { page: number; path: string; url: string; token: string }[];
  for (let page = 1; page <= pageCount; page++) {
    const path = `${bookId}/${batch}/${String(page).padStart(3, '0')}.webp`;
    const { data, error } = await db.storage.from('pages').createSignedUploadUrl(path);
    if (error) throw error;
    uploads.push({ page, path, url: data.signedUrl, token: data.token });
  }
  return { uploads };
}

export async function finishPageUploadAction(
  bookId: string,
  pages: { page_number: number; storage_path: string; width: number; height: number; text?: string | null; words?: WordBox[] | null }[],
): Promise<{ ok: true }> {
  await guard();
  const db = supabaseAdmin();
  const { data: old } = await db.from('book_pages').select('storage_path, audio_path').eq('book_id', bookId);
  const { error: delErr } = await db.from('book_pages').delete().eq('book_id', bookId);
  if (delErr) throw delErr;
  const { error } = await db
    .from('book_pages')
    .insert(pages.map((p) => ({ ...p, text: p.text ?? null, words: p.words ?? null, book_id: bookId })));
  if (error) throw error;
  const { data: book } = await db.from('books').select('preview_pages').eq('id', bookId).single();
  const preview = Math.min(book?.preview_pages || 8, pages.length);
  // New pages mean any narration is stale: switch it off until it's regenerated.
  await db.from('books').update({ page_count: pages.length, preview_pages: preview, read_aloud_enabled: false }).eq('id', bookId);
  const stale = (old ?? []).map((o) => o.storage_path).filter((p) => !pages.some((n) => n.storage_path === p));
  if (stale.length) await db.storage.from('pages').remove(stale);
  const staleAudio = (old ?? []).map((o) => o.audio_path).filter((p): p is string => Boolean(p));
  if (staleAudio.length) await db.storage.from('audio').remove(staleAudio);
  revalidatePath('/', 'layout');
  return { ok: true };
}

// --- Read-aloud narration (Google Cloud Text-to-Speech) ---

const voiceSchema = z.enum(NARRATION_VOICES.map((v) => v.id) as [NarrationVoice, ...NarrationVoice[]]);

export async function previewVoiceAction(voice: string): Promise<{ url: string }> {
  await guard();
  const v = voiceSchema.parse(voice);
  const db = supabaseAdmin();
  const path = `previews/${v}.mp3`;
  const { data: existing } = await db.storage.from('audio').createSignedUrl(path, 600);
  if (existing?.signedUrl) return { url: existing.signedUrl };
  const line = 'Deep in Coral Cove, two best friends lived under the sea. Shelly, a shy pink starfish, and Spike, a cheerful yellow starfish who loved adventures!';
  const { mp3 } = await synthesizeWords(line.split(' '), v);
  const { error } = await db.storage.from('audio').upload(path, mp3, { contentType: 'audio/mpeg', upsert: true });
  if (error) throw error;
  const { data } = await db.storage.from('audio').createSignedUrl(path, 600);
  return { url: data!.signedUrl };
}

// One page at a time so the admin can show progress and a long book never hits a function timeout.
export async function narratePageAction(bookId: string, pageNumber: number, voice: string): Promise<{ ok: true; skipped?: true }> {
  await guard();
  const v = voiceSchema.parse(voice);
  const db = supabaseAdmin();
  const { data: page, error } = await db.from('book_pages').select('id, words, audio_path').eq('book_id', bookId).eq('page_number', pageNumber).single();
  if (error) throw error;
  const words = (page.words as WordBox[] | null) ?? [];
  if (words.length === 0) return { ok: true, skipped: true };
  const { mp3, timings } = await synthesizeWords(words.map((w) => w.t), v, await loadPronunciations());
  const path = `${bookId}/${v}/${String(pageNumber).padStart(3, '0')}-${Date.now().toString(36)}.mp3`;
  const { error: upErr } = await db.storage.from('audio').upload(path, mp3, { contentType: 'audio/mpeg', upsert: true });
  if (upErr) throw upErr;
  const { error: rowErr } = await db.from('book_pages').update({ audio_path: path, timings }).eq('id', page.id);
  if (rowErr) throw rowErr;
  if (page.audio_path && page.audio_path !== path) await db.storage.from('audio').remove([page.audio_path]);
  return { ok: true };
}

export async function setNarrationAction(bookId: string, input: { voice: string | null; enabled: boolean }): Promise<{ ok: true }> {
  await guard();
  const voice = input.voice ? voiceSchema.parse(input.voice) : null;
  const { error } = await supabaseAdmin().from('books').update({ narration_voice: voice, read_aloud_enabled: input.enabled }).eq('id', bookId);
  if (error) throw error;
  revalidatePath('/', 'layout');
  return { ok: true };
}

// --- Starter pack downloads ---

export async function beginDownloadUploadAction(filename: string): Promise<{ path: string; url: string; token: string }> {
  await guard();
  const safe = filename.toLowerCase().replace(/[^a-z0-9.-]+/g, '-').replace(/^-+|-+$/g, '');
  const path = `${Date.now().toString(36)}-${safe}`;
  const { data, error } = await supabaseAdmin().storage.from('downloads').createSignedUploadUrl(path);
  if (error) throw error;
  return { path, url: data.signedUrl, token: data.token };
}

const downloadSchema = z.object({
  slug,
  title: z.string().trim().min(1).max(120),
  description: z.string().trim().max(300).nullable(),
  storage_path: z.string().min(1),
  sort_order: z.coerce.number().int().default(0),
});

export async function saveDownloadAction(input: unknown): Promise<{ error?: string; ok?: true }> {
  await guard();
  const parsed = downloadSchema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.issues.map((i) => i.message).join('; ') };
  const { error } = await supabaseAdmin().from('downloads').upsert(parsed.data, { onConflict: 'slug' });
  if (error) return { error: error.message };
  revalidatePath('/account/pack');
  revalidatePath('/admin/downloads');
  return { ok: true };
}

export async function deleteDownloadAction(id: string) {
  await guard();
  const db = supabaseAdmin();
  const { data } = await db.from('downloads').select('storage_path').eq('id', id).single();
  if (data) await db.storage.from('downloads').remove([data.storage_path]);
  await db.from('downloads').delete().eq('id', id);
  revalidatePath('/account/pack');
  revalidatePath('/admin/downloads');
}

export async function toggleDownloadListedAction(id: string, listed: boolean) {
  await guard();
  await supabaseAdmin().from('downloads').update({ is_listed: listed }).eq('id', id);
  revalidatePath('/account/pack');
  revalidatePath('/admin/downloads');
}

// --- Pronunciation dictionary ---

export async function savePronunciationAction(formData: FormData): Promise<{ error?: string; ok?: true }> {
  await guard();
  const word = normaliseWord(String(formData.get('word') ?? ''));
  const say_as = String(formData.get('say_as') ?? '').trim();
  if (!word || !say_as) return { error: 'Both the word and how to say it are needed.' };
  const { error } = await supabaseAdmin().from('pronunciations').upsert({ word, say_as }, { onConflict: 'word' });
  if (error) return { error: error.message };
  revalidatePath('/admin/pronunciations');
  return { ok: true };
}

export async function deletePronunciationAction(word: string) {
  await guard();
  await supabaseAdmin().from('pronunciations').delete().eq('word', word);
  revalidatePath('/admin/pronunciations');
}

// Which listed books contain a word (so the admin knows what to regenerate).
export async function booksUsingWordAction(word: string): Promise<{ slug: string; title: string; pages: number[] }[]> {
  await guard();
  const w = normaliseWord(word);
  const db = supabaseAdmin();
  const { data } = await db.from('book_pages').select('page_number, words, book:books(slug, title)').not('words', 'is', null);
  const out = new Map<string, { slug: string; title: string; pages: number[] }>();
  for (const row of (data ?? []) as unknown as { page_number: number; words: WordBox[]; book: { slug: string; title: string } | null }[]) {
    if (!row.book || !row.words.some((x) => normaliseWord(x.t) === w)) continue;
    const e = out.get(row.book.slug) ?? { slug: row.book.slug, title: row.book.title, pages: [] };
    e.pages.push(row.page_number);
    out.set(row.book.slug, e);
  }
  return [...out.values()];
}

// --- Members ---

export async function setReviewerAction(userId: string, on: boolean) {
  await guard();
  const { error } = await supabaseAdmin().from('users').update({ is_reviewer: on }).eq('id', userId);
  if (error) throw error;
  revalidatePath('/admin/members');
}
