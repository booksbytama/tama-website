import Image from 'next/image';
import Link from 'next/link';
import { coverUrl } from '@/lib/supabase/admin';
import type { BookWithSeries } from '@/lib/db/types';

export function BookCard({ book, eyebrow }: { book: BookWithSeries; eyebrow?: string }) {
  const cover = coverUrl(book.cover_path);
  const canSample = book.sample_enabled && book.page_count > 0 && book.preview_pages > 0;
  return (
    <article className='card-float flex flex-col gap-3.5 p-4'>
      <Link href={`/books/${book.slug}`} className='block overflow-hidden rounded-[18px] bg-foam'>
        {cover ? (
          <Image src={cover} alt={book.title} width={480} height={480} className='aspect-square w-full object-cover transition-transform hover:scale-[1.03]' />
        ) : (
          <div className='aspect-square w-full' />
        )}
      </Link>
      <div className='flex flex-col gap-1 px-1.5'>
        {eyebrow && <div className='text-[13px] font-bold text-mist'>{eyebrow}</div>}
        <Link href={`/books/${book.slug}`} className='font-heading text-xl font-semibold text-royal hover:text-ocean'>
          {book.title}
        </Link>
      </div>
      <div className='flex gap-2 px-1.5 pb-1.5'>
        <Link href={canSample ? `/read/${book.slug}` : `/books/${book.slug}`} className='btn-primary btn-sm flex-1 font-body font-bold shadow-none'>
          {canSample ? 'Read sample' : 'See book'}
        </Link>
        <Link href={`/books/${book.slug}#buy`} className='btn-outline btn-sm font-body font-bold'>
          Buy
        </Link>
      </div>
    </article>
  );
}

export function BookRow({ book, eyebrow }: { book: BookWithSeries; eyebrow?: string }) {
  const cover = coverUrl(book.cover_path);
  const canSample = book.sample_enabled && book.page_count > 0 && book.preview_pages > 0;
  return (
    <article className='card-float flex items-center gap-4 rounded-[20px] p-3'>
      <Link href={`/books/${book.slug}`} className='shrink-0 overflow-hidden rounded-[14px] bg-foam'>
        {cover ? <Image src={cover} alt={book.title} width={208} height={208} className='size-[104px] object-cover' /> : <div className='size-[104px]' />}
      </Link>
      <div className='flex min-w-0 flex-1 flex-col gap-1.5'>
        {eyebrow && <div className='text-[11px] font-bold text-mist'>{eyebrow}</div>}
        <Link href={`/books/${book.slug}`} className='font-heading text-lg font-semibold leading-tight text-royal'>
          {book.title}
        </Link>
        <div className='mt-1 flex gap-2'>
          <Link href={canSample ? `/read/${book.slug}` : `/books/${book.slug}`} className='btn-primary btn-sm font-body font-bold shadow-none'>
            {canSample ? 'Read sample' : 'See book'}
          </Link>
          <Link href={`/books/${book.slug}#buy`} className='btn-outline btn-sm font-body font-bold'>
            Buy
          </Link>
        </div>
      </div>
    </article>
  );
}
