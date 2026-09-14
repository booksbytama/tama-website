// One-off: fill book_pages.text/words for a book from a local PDF (no re-upload needed).
// Usage: npx tsx --env-file=.env.local scripts/backfill-words.mjs <book-slug> <path/to/book.pdf>
import { readFileSync } from 'node:fs';
import * as pdfjs from 'pdfjs-dist/legacy/build/pdf.mjs';
import { createClient } from '@supabase/supabase-js';
import { extractWords } from '../lib/pdf-words.ts';

const [slug, file] = process.argv.slice(2);
if (!slug || !file) throw new Error('usage: backfill-words.mjs <slug> <pdf>');
const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SECRET_KEY, { auth: { persistSession: false } });
const { data: book, error } = await db.from('books').select('id, page_count').eq('slug', slug).single();
if (error) throw error;
const doc = await pdfjs.getDocument({ data: new Uint8Array(readFileSync(file)), useSystemFonts: true }).promise;
if (doc.numPages !== book.page_count) console.warn(`warning: PDF has ${doc.numPages} pages, book has ${book.page_count}`);
let withText = 0;
for (let n = 1; n <= doc.numPages; n++) {
  const page = await doc.getPage(n);
  const vp = page.getViewport({ scale: 1 });
  const tc = await page.getTextContent();
  const { text, words } = extractWords(tc.items.filter((i) => 'str' in i), vp.width, vp.height);
  if (words.length) withText++;
  const { error: uErr } = await db.from('book_pages').update({ text: text || null, words: words.length ? words : null }).eq('book_id', book.id).eq('page_number', n);
  if (uErr) throw uErr;
}
console.log(`${slug}: words on ${withText} of ${doc.numPages} pages`);
