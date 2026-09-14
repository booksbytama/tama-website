import 'server-only';
import { cache } from 'react';
import { supabaseAdmin } from '@/lib/supabase/admin';
import type { Book, BookPage, BookWithSeries, Series } from './types';

const BOOK_SELECT = '*, series(*)';

export const listBooks = cache(async (opts: { type?: Book['book_type']; includeUnlisted?: boolean } = {}) => {
  let q = supabaseAdmin().from('books').select(BOOK_SELECT).order('sort_order').order('series_order').order('created_at');
  if (opts.type) q = q.eq('book_type', opts.type);
  if (!opts.includeUnlisted) q = q.eq('is_listed', true);
  const { data, error } = await q;
  if (error) throw error;
  return (data ?? []) as BookWithSeries[];
});

export const getBookBySlug = cache(async (slug: string, includeUnlisted = false) => {
  let q = supabaseAdmin().from('books').select(BOOK_SELECT).eq('slug', slug);
  if (!includeUnlisted) q = q.eq('is_listed', true);
  const { data, error } = await q.maybeSingle();
  if (error) throw error;
  return (data ?? null) as BookWithSeries | null;
});

export const getBookById = cache(async (id: string) => {
  const { data, error } = await supabaseAdmin().from('books').select(BOOK_SELECT).eq('id', id).maybeSingle();
  if (error) throw error;
  return (data ?? null) as BookWithSeries | null;
});

export const listSeries = cache(async () => {
  const { data, error } = await supabaseAdmin().from('series').select('*').order('sort_order');
  if (error) throw error;
  return (data ?? []) as Series[];
});

export const listBooksInSeries = cache(async (seriesId: string) => {
  const { data, error } = await supabaseAdmin()
    .from('books')
    .select(BOOK_SELECT)
    .eq('series_id', seriesId)
    .eq('is_listed', true)
    .order('series_order');
  if (error) throw error;
  return (data ?? []) as BookWithSeries[];
});

export const listBookPages = cache(async (bookId: string) => {
  const { data, error } = await supabaseAdmin().from('book_pages').select('*').eq('book_id', bookId).order('page_number');
  if (error) throw error;
  return (data ?? []) as BookPage[];
});

// Signed URLs for the pages a reader may see. `limit` is the highest page number allowed.
export async function signedPageUrls(bookId: string, limit: number, expiresInSeconds = 60 * 60) {
  const pages = (await listBookPages(bookId)).filter((p) => p.page_number <= limit);
  if (pages.length === 0) return [] as { page_number: number; url: string; width: number | null; height: number | null }[];
  const { data, error } = await supabaseAdmin()
    .storage.from('pages')
    .createSignedUrls(
      pages.map((p) => p.storage_path),
      expiresInSeconds,
    );
  if (error) throw error;
  return pages.flatMap((p, i) => {
    const url = data[i]?.signedUrl;
    return url ? [{ page_number: p.page_number, url, width: p.width, height: p.height }] : [];
  });
}

// Signed-in members may read books flagged member_reading_enabled in full;
// everyone else gets the free sample. Paid tiers can refine `isMember` later.
export function allowedPages(book: Book, isMember: boolean): number {
  if (isMember && book.member_reading_enabled) return book.page_count;
  return book.sample_enabled ? Math.min(book.preview_pages, book.page_count) : 0;
}

export const getFreeMemberBook = cache(async () => {
  const { data, error } = await supabaseAdmin()
    .from('books')
    .select(BOOK_SELECT)
    .eq('is_listed', true)
    .eq('member_reading_enabled', true)
    .gt('page_count', 0)
    .order('sort_order')
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  return (data ?? null) as BookWithSeries | null;
});
