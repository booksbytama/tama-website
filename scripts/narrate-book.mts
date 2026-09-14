// Generate (or regenerate) narration for every text page of a book from the command line.
// Usage: npx tsx --env-file=.env.local scripts/narrate-book.mts <book-slug> <voice-id>
import { createClient } from '@supabase/supabase-js';
import { NARRATION_VOICES, synthesizeWords, type NarrationVoice } from '../lib/tts';

const [slug, voice] = process.argv.slice(2) as [string, NarrationVoice];
if (!slug || !NARRATION_VOICES.some((v) => v.id === voice)) throw new Error(`usage: narrate-book.mts <slug> <${NARRATION_VOICES.map((v) => v.id).join('|')}>`);
const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SECRET_KEY!, { auth: { persistSession: false } });
const { data: book, error } = await db.from('books').select('id').eq('slug', slug).single();
if (error) throw error;
const { data: pages } = await db.from('book_pages').select('id, page_number, words, audio_path').eq('book_id', book.id).not('words', 'is', null).order('page_number');
const failed: number[] = [];
for (const p of pages ?? []) {
  const words = (p.words as { t: string }[]).map((w) => w.t);
  let done = false;
  for (let attempt = 0; attempt < 3 && !done; attempt++) {
    try {
      const { mp3, timings } = await synthesizeWords(words, voice);
      const path = `${book.id}/${voice}/${String(p.page_number).padStart(3, '0')}-${Date.now().toString(36)}.mp3`;
      const { error: upErr } = await db.storage.from('audio').upload(path, mp3, { contentType: 'audio/mpeg' });
      if (upErr) throw upErr;
      await db.from('book_pages').update({ audio_path: path, timings }).eq('id', p.id);
      if (p.audio_path) await db.storage.from('audio').remove([p.audio_path]);
      done = true;
      process.stdout.write(`${p.page_number} `);
    } catch (e) {
      await new Promise((r) => setTimeout(r, 1500 * (attempt + 1)));
      if (attempt === 2) failed.push(p.page_number);
    }
  }
}
await db.from('books').update({ narration_voice: voice, read_aloud_enabled: true }).eq('id', book.id);
console.log(`\n${slug}: narrated with ${voice}${failed.length ? `, failed: ${failed.join(', ')}` : ''}`);
