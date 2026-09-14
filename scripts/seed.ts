import 'dotenv/config';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { createClient } from '@supabase/supabase-js';

// One-off: moves the books that used to live in constants/index.ts into Supabase.
// Safe to re-run; upserts by slug.

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SECRET_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) throw new Error('NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SECRET_KEY are required');
const db = createClient(url, key, { auth: { persistSession: false } });

const series: { slug: string; name: string; description: string | null; sort_order: number }[] = [
  { slug: 'starfish-super-squad', name: 'Starfish Super Squad', description: 'Shelly and Spike follow a mysterious treasure map across Coral Cove — a 24-book series.', sort_order: 1 },
  { slug: 'ocean-adventure-colouring', name: 'Ocean Adventure Colouring Book', description: null, sort_order: 2 },
  { slug: 'cutie-colouring', name: 'Cutie Colouring Book', description: null, sort_order: 3 },
];

const books = [
  {
    slug: 'starfishsupersquadbook1',
    title: 'A Mystery Map',
    short_description: 'Starfish Super Squad Book 1 - A Mystery Map',
    description:
      'Deep in Coral Cove, two best friends lived under the sea—Shelly, a shy pink starfish, and Spike, a cheerful yellow starfish who loved adventures! One sunny day, they discovered a mysterious treasure map that would change everything.\n\nJoin Shelly and Spike in the very first book of their 24-book series, packed with exciting discoveries, ocean creatures, and underwater fun. What treasures and secrets will they uncover next?',
    book_type: 'picture',
    series: 'starfish-super-squad',
    series_order: 1,
    ages_text: 'Independent 6–10 ★ Read-aloud 4–6',
    cover: 'starfishsupersquadbook1.jpg',
    buy_links: [
      { label: 'Amazon US', url: 'https://www.amazon.com/dp/1923337033/' },
      { label: 'Amazon AU', url: 'https://www.amazon.com.au/dp/1923337033' },
      { label: 'Google Play ebook', url: 'https://play.google.com/store/books/details?id=b3hZEQAAQBAJ' },
    ],
  },
  {
    slug: 'starfishsupersquadbook2',
    title: 'Coral Reef Heroes',
    short_description: 'Starfish Super Squad Book 2 - Coral Reef Heroes',
    description:
      'Follow Shelly and Spike as they set off on a big adventure and make new friends. But before they can search for treasure, they discover the coral reefs are in trouble! Now, they must work together with their new friends to save the reefs before continuing their quest.\n\nJoin Shelly, Spike, and the rest of the Starfish Super Squad in the second book of their 24-book series, as they embark on an exciting mission to protect the coral reefs and uncover even more underwater wonders.',
    book_type: 'picture',
    series: 'starfish-super-squad',
    series_order: 2,
    ages_text: 'Independent 6–10 ★ Read-aloud 4–6',
    cover: 'starfishsupersquadbook2.jpg',
    buy_links: [
      { label: 'Amazon US', url: 'https://www.amazon.com/dp/1923337068' },
      { label: 'Amazon AU', url: 'https://www.amazon.com.au/dp/1923337068' },
      { label: 'Google Play ebook', url: 'https://play.google.com/store/books/details?id=7opfEQAAQBAJ' },
    ],
  },
  {
    slug: 'starfishsupersquadbook3',
    title: 'The Grumpy Quest',
    short_description: 'Starfish Super Squad Book 3 - The Grumpy Quest',
    description:
      'Follow Shelly and Spike as they set off on a big adventure and make new friends. But before they searched for treasure, they stopped at the Coral Reef Garden to save the coral reefs. There, they met a grumpy sea creature who needed their help.',
    book_type: 'picture',
    series: 'starfish-super-squad',
    series_order: 3,
    ages_text: 'Independent 6–10 ★ Read-aloud 4–6',
    cover: 'starfishsupersquadbook3.jpg',
    buy_links: [
      { label: 'Amazon US', url: 'https://www.amazon.com/dp/1923337076' },
      { label: 'Amazon AU', url: 'https://www.amazon.com.au/dp/1923337076' },
      { label: 'Google Play ebook', url: 'https://play.google.com/store/books/details/?id=ze1iEQAAQBAJ' },
    ],
  },
  {
    slug: 'starfishsupersquadbook4',
    title: 'The Mystery of Grumble Rock',
    short_description: 'Starfish Super Squad Book 4 - The Mystery of Grumble Rock',
    description:
      'The treasure map has brought Shelly and Spike to the Deep Sea of Stingrays — but danger lies ahead at their next stop, Grumble Rock! Uma, a wise little sea urchin, races to warn them before it’s too late. Along the way, she encounters sea otters, while the Squad meets Sandy, a gentle manta ray with a secret.',
    book_type: 'picture',
    series: 'starfish-super-squad',
    series_order: 4,
    ages_text: 'Independent 6–10 ★ Read-aloud 4–6',
    cover: 'starfishsupersquadbook4.jpg',
    buy_links: [
      { label: 'Amazon US', url: 'https://www.amazon.com/dp/1923337092' },
      { label: 'Amazon AU', url: 'https://www.amazon.com.au/dp/1923337092' },
    ],
  },
  {
    slug: 'oceancolour1',
    title: 'Ocean Adventure Colouring Book',
    short_description: 'A Relaxing and Creative Journey Through 40 Connected Underwater Scenes',
    description:
      'Dive into calm, creativity, and ocean wonder with Ocean Adventure Colouring Book—a hand-drawn collection of 40 connected underwater scenes that come together to form one stunning ocean masterpiece. Designed for kids, teens, adults—and anyone who loves the sea. Whether you’re searching for a coloring book for teens or a heartfelt gift for ocean loving moms, this bold, easy and cozy collection brings underwater magic to every page.',
    book_type: 'colouring',
    series: 'ocean-adventure-colouring',
    series_order: 1,
    ages_text: 'Kids, teens & adults',
    cover: 'oceancolour1.jpg',
    buy_links: [
      { label: 'Amazon US', url: 'https://www.amazon.com/dp/B0FZBHGVZN' },
      { label: 'Amazon AU', url: 'https://www.amazon.com.au/dp/B0FZBHGVZN' },
    ],
  },
  {
    slug: 'xmascolour',
    title: 'Christmas Cutie Colouring Book',
    short_description: '52 Bold and Easy Designs for Kids, Teens and Adults',
    description:
      'Christmas Cutie Colouring Book is filled with 52 cute, hand-drawn Christmas designs made for relaxing and joyful colouring. Enjoy simple, cosy pages featuring festive characters, holiday treats, snowy scenes and more — perfect for adults, teens and kids who love adorable art.',
    book_type: 'colouring',
    series: 'cutie-colouring',
    series_order: 1,
    ages_text: 'Kids, teens & adults',
    cover: 'xmascolour.png',
    buy_links: [
      { label: 'Amazon US', url: 'https://www.amazon.com/dp/B0G539N3BF' },
      { label: 'Amazon AU', url: 'https://www.amazon.com.au/dp/B0G539N3BF' },
    ],
  },
];

async function main() {
  const seriesIds = new Map<string, string>();
  for (const s of series) {
    const { data, error } = await db.from('series').upsert(s, { onConflict: 'slug' }).select('id, slug').single();
    if (error) throw error;
    seriesIds.set(data.slug, data.id);
  }

  for (const [i, b] of books.entries()) {
    const ext = b.cover.split('.').pop();
    const cover_path = `${b.slug}.${ext}`;
    const file = readFileSync(join(process.cwd(), 'public', 'assets', 'images', b.cover));
    const { error: upErr } = await db.storage.from('covers').upload(cover_path, file, {
      contentType: ext === 'png' ? 'image/png' : 'image/jpeg',
      upsert: true,
    });
    if (upErr) throw upErr;

    const { error } = await db.from('books').upsert(
      {
        slug: b.slug,
        title: b.title,
        short_description: b.short_description,
        description: b.description,
        book_type: b.book_type,
        series_id: seriesIds.get(b.series) ?? null,
        series_order: b.series_order,
        ages_text: b.ages_text,
        cover_path,
        buy_links: b.buy_links,
        is_listed: true,
        sample_enabled: true,
        preview_pages: 8,
        sort_order: i,
      },
      { onConflict: 'slug' },
    );
    if (error) throw error;
    console.log(`seeded ${b.slug}`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
