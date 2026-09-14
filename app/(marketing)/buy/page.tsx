import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { listBooks } from '@/lib/db/books';
import { BuyLinks } from '@/components/books/buy-links';
import { coverUrl } from '@/lib/supabase/admin';

export const metadata: Metadata = { title: 'Where to buy' };

export default async function Buy() {
  const books = await listBooks();
  return (
    <div className='wrapper flex flex-col gap-12 py-10 md:py-16'>
      <header className='flex flex-col items-center gap-4 text-center'>
        <Image src='/assets/images/StarfishGroup.png' alt='' width={260} height={160} />
        <h1 className='text-[36px] font-bold md:text-[48px]'>Where to buy</h1>
        <p className='max-w-xl text-base text-slate md:text-lg'>Every book is printed on demand and ships worldwide. Pick the store you already use, or visit us locally in Seddon.</p>
      </header>

      <section className='flex flex-col gap-4'>
        {books.map((b) => {
          const cover = coverUrl(b.cover_path);
          return (
            <div key={b.id} className='grid items-center gap-4 rounded-3xl border-2 border-sand-deep bg-white p-4 md:grid-cols-[96px_1fr_2fr] md:gap-6'>
              <Link href={`/books/${b.slug}`} className='overflow-hidden rounded-2xl bg-foam'>
                {cover && <Image src={cover} alt={b.title} width={192} height={192} className='size-24 object-cover' />}
              </Link>
              <Link href={`/books/${b.slug}`} className='font-heading text-xl font-semibold text-royal'>
                {b.title}
              </Link>
              <BuyLinks links={b.buy_links} className='md:grid-cols-3' />
            </div>
          );
        })}
      </section>

      <section id='buy-local' className='grid items-center gap-6 rounded-[2rem] bg-foam p-6 md:grid-cols-[300px_1fr] md:p-10'>
        <Image src='/assets/images/shoplocal.png' alt='Shop local' width={300} height={300} className='mx-auto' />
        <div className='flex flex-col gap-3'>
          <h2 className='text-[28px] font-semibold md:text-[36px]'>Buy local in Seddon</h2>
          <p className='text-base leading-relaxed text-slate md:text-lg'>
            Visit <strong>Far Fetched Designs</strong> in Seddon to shop locally. Get a <strong>free Ocean Map</strong> when you buy any 2
            Starfish Super Squad books in-store — while stocks last.
          </p>
        </div>
      </section>
    </div>
  );
}
