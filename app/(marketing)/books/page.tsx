import type { Metadata } from 'next';
import { BookCard, BookRow } from '@/components/books/book-card';
import { listBooks, listSeries } from '@/lib/db/books';

export const metadata: Metadata = { title: 'All books' };

export default async function BooksPage() {
  const [books, series] = await Promise.all([listBooks(), listSeries()]);
  const grouped = series
    .map((s) => ({ series: s, books: books.filter((b) => b.series_id === s.id) }))
    .filter((g) => g.books.length > 0);
  const loose = books.filter((b) => !b.series_id);

  return (
    <div className='wrapper flex flex-col gap-12 py-8 md:py-14'>
      <header className='flex flex-col gap-3'>
        <h1 className='text-[36px] font-bold md:text-[56px]'>All books</h1>
        <p className='max-w-2xl text-base text-slate md:text-lg'>Every book has a free sample. Read a few pages, then buy from the store you already use.</p>
      </header>
      {grouped.map(({ series: s, books: bs }) => (
        <section key={s.id} className='flex flex-col gap-5'>
          <div className='flex flex-col gap-1.5'>
            <h2 className='text-2xl font-semibold md:text-[32px]'>{s.name}</h2>
            {s.description && <p className='max-w-2xl text-slate'>{s.description}</p>}
          </div>
          <div className='flex flex-col gap-3 md:hidden'>
            {bs.map((b) => (
              <BookRow key={b.id} book={b} eyebrow={b.series_order ? `Book ${b.series_order}` : undefined} />
            ))}
          </div>
          <div className='hidden grid-cols-2 gap-7 md:grid lg:grid-cols-4'>
            {bs.map((b) => (
              <BookCard key={b.id} book={b} eyebrow={b.series_order ? `Book ${b.series_order}` : undefined} />
            ))}
          </div>
        </section>
      ))}
      {loose.length > 0 && (
        <section className='flex flex-col gap-5'>
          <h2 className='text-2xl font-semibold md:text-[32px]'>More books</h2>
          <div className='grid gap-3 md:grid-cols-2 md:gap-7 lg:grid-cols-4'>
            {loose.map((b) => (
              <BookCard key={b.id} book={b} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
