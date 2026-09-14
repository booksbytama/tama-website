import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, BookOpen, Check } from 'lucide-react';
import { BookCard, BookRow } from '@/components/books/book-card';
import { StarterPackBand } from '@/components/site/starter-pack';
import { Wave } from '@/components/site/wave';
import { getFreeMemberBook, listBooks } from '@/lib/db/books';
import { coverUrl } from '@/lib/supabase/admin';

export default async function Home() {
  const [picture, colouring, freeBook] = await Promise.all([listBooks({ type: 'picture' }), listBooks({ type: 'colouring' }), getFreeMemberBook()]);
  const firstSample = picture.find((b) => b.sample_enabled && b.page_count > 0);
  const heroBook = freeBook ?? firstSample;

  return (
    <>
      {/* HERO */}
      <section className='wrapper grid items-center gap-8 pt-6 md:grid-cols-2 md:gap-12 md:pt-12'>
        <div className='relative order-first h-[250px] md:order-last md:h-[560px]'>
          <div className='absolute inset-y-6 left-6 right-0 hidden rotate-3 rounded-[36px] bg-royal md:block' />
          <Image
            src='/assets/images/hero.png'
            alt='Welcome to Books by Tama — the creatures of Coral Cove'
            width={1053}
            height={633}
            priority
            className='absolute inset-0 h-[220px] w-[90%] rounded-3xl border-4 border-white object-cover shadow-[0_14px_30px_rgba(27,42,107,0.22)] md:bottom-10 md:right-6 md:h-[480px] md:w-auto md:rounded-[36px] md:border-[6px]'
          />
          <Image
            src='/assets/images/StarfishGroup.png'
            alt=''
            width={300}
            height={180}
            className='absolute -left-3 bottom-0 w-[150px] md:-left-10 md:-bottom-8 md:w-[300px]'
          />
        </div>
        <div className='flex flex-col gap-5 md:gap-6'>
          <span className='eyebrow inline-flex items-center gap-2 self-start rounded-full bg-foam px-3.5 py-2 text-ocean'>
            <BookOpen className='size-4' strokeWidth={2.4} /> {freeBook ? `Read ${freeBook.series_order ? `Book ${freeBook.series_order}` : freeBook.title} free when you join` : 'Free samples of every book'}
          </span>
          <h1 className='text-[40px] font-bold leading-[1.04] md:text-[68px] md:leading-[1.02]'>Ocean adventures for curious little readers</h1>
          <p className='max-w-lg text-base leading-relaxed text-slate md:text-xl'>
            {freeBook
              ? `Picture books and colouring books about friendship, courage and the creatures of Coral Cove. Read ${freeBook.series_order ? `Book ${freeBook.series_order}` : freeBook.title} in full for free, sample the rest, then buy wherever you like.`
              : 'Picture books and colouring books about friendship, courage and the creatures of Coral Cove. Read a sample right here, then buy wherever you like.'}
          </p>
          <div className='flex flex-col gap-3 sm:flex-row sm:items-center'>
            <Link href={heroBook ? `/read/${heroBook.slug}` : '/books'} className='btn-primary btn-lg'>
              <BookOpen className='size-5' strokeWidth={2.2} /> {freeBook ? `Start reading ${freeBook.series_order ? `Book ${freeBook.series_order}` : ''} free` : 'Read a free sample'}
            </Link>
            <Link href='/books' className='btn-outline btn-lg'>
              Shop the books
            </Link>
          </div>
          <div className='hidden items-center gap-2 text-[15px] font-semibold text-mist md:flex'>
            <Check className='size-[18px] text-seaweed' strokeWidth={2.6} /> Ages 4–10 · Independent readers 6–10 · Read-aloud 4–6
          </div>
        </div>
      </section>

      <Wave className='mt-8 md:mt-10' />

      {/* SERIES */}
      <section className='bg-foam pb-16 pt-2 md:pb-20'>
        <div className='wrapper flex flex-col gap-6 md:gap-8'>
          <div className='flex items-end justify-between gap-4'>
            <div className='flex flex-col gap-2'>
              <div className='eyebrow text-[#d97a00]'>Series · Treasure Map Adventures</div>
              <h2 className='text-[28px] font-semibold md:text-[44px]'>Starfish Super Squad</h2>
              <p className='hidden max-w-2xl text-lg text-slate md:block'>
                Shelly and Spike follow a mysterious treasure map across Coral Cove — a 24-book series, {picture.length} out now.
              </p>
            </div>
            <Link href='/books' className='hidden items-center gap-1.5 text-[17px] font-bold text-ocean hover:text-royal md:flex'>
              All books <ArrowRight className='size-[18px]' strokeWidth={2.4} />
            </Link>
          </div>
          <div className='flex flex-col gap-3 md:hidden'>
            {picture.map((b) => (
              <BookRow key={b.id} book={b} eyebrow={b.series_order ? `Book ${b.series_order}` : undefined} />
            ))}
          </div>
          <div className='hidden grid-cols-2 gap-7 md:grid lg:grid-cols-4'>
            {picture.map((b) => (
              <BookCard key={b.id} book={b} eyebrow={b.series_order ? `Book ${b.series_order}` : undefined} />
            ))}
          </div>
        </div>
      </section>

      {/* COLOURING */}
      <section className='wrapper grid gap-6 py-14 md:grid-cols-[1fr_1.4fr] md:items-center md:gap-14 md:py-20'>
        <div className='flex flex-col gap-3.5'>
          <div className='eyebrow text-[#f2a900]'>Colouring books</div>
          <h2 className='text-[28px] font-semibold md:text-[44px]'>Bold, easy pages for kids, teens and grown-ups</h2>
          <p className='text-base leading-relaxed text-slate md:text-lg'>
            Hand-drawn scenes that fit together into one big picture. Flip through a few pages before you buy.
          </p>
          <Link href='/colouring' className='mt-1 text-[17px] font-bold text-ocean hover:text-royal'>
            See all colouring books →
          </Link>
        </div>
        <div className='grid gap-4 sm:grid-cols-2'>
          {colouring.map((b) => {
            const cover = coverUrl(b.cover_path);
            const canSample = b.sample_enabled && b.page_count > 0;
            return (
              <article key={b.id} className='flex items-center gap-4 rounded-3xl border-2 border-sand-deep bg-white p-4'>
                <Link href={`/books/${b.slug}`} className='shrink-0 overflow-hidden rounded-2xl bg-foam'>
                  {cover && <Image src={cover} alt={b.title} width={264} height={264} className='size-24 object-cover md:size-[132px]' />}
                </Link>
                <div className='flex flex-col gap-2'>
                  <Link href={`/books/${b.slug}`} className='font-heading text-lg font-semibold leading-tight text-royal md:text-xl'>
                    {b.title.replace(/ Colouring Book$/i, '')}
                  </Link>
                  <div className='text-sm font-semibold text-mist'>{b.short_description}</div>
                  <Link href={canSample ? `/read/${b.slug}` : `/books/${b.slug}`} className='btn-sun btn-sm self-start font-body font-bold'>
                    {canSample ? 'Read sample' : 'See book'}
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <StarterPackBand />
      <div className='h-8 md:h-16' />
    </>
  );
}

// Cached at the edge; admin saves call revalidatePath.
export const revalidate = 300;
