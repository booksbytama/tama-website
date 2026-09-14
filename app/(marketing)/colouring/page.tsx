import type { Metadata } from 'next';
import { BookCard, BookRow } from '@/components/books/book-card';
import { listBooks } from '@/lib/db/books';

export const metadata: Metadata = { title: 'Colouring books' };

export default async function ColouringPage() {
  const books = await listBooks({ type: 'colouring' });
  return (
    <div className='wrapper flex flex-col gap-8 py-8 md:py-14'>
      <header className='flex flex-col gap-3'>
        <div className='eyebrow text-[#f2a900]'>Colouring books</div>
        <h1 className='text-[36px] font-bold md:text-[56px]'>Bold, easy pages for all ages</h1>
        <p className='max-w-2xl text-base text-slate md:text-lg'>Hand-drawn scenes for kids, teens and grown-ups. Flip through a sample before you buy.</p>
      </header>
      <div className='flex flex-col gap-3 md:hidden'>
        {books.map((b) => (
          <BookRow key={b.id} book={b} />
        ))}
      </div>
      <div className='hidden grid-cols-2 gap-7 md:grid lg:grid-cols-4'>
        {books.map((b) => (
          <BookCard key={b.id} book={b} />
        ))}
      </div>
    </div>
  );
}
