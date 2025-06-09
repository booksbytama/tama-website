import Image from 'next/image';
import Hero from '@/components/sections/Hero';

import BookListCover from './_components/BookListCover';

export default function Home() {
  return (
    <>
      <Hero />

      <section className='py-5 md:py-10'>
        <div
          // className='wrapper flex flex-col items-center gap-5 md:grid-cols-1 2xl:gap-0'
          className='wrapper grid grid-cols-1 gap-6'
        >
          <BookListCover bookType='series' />
          <BookListCover bookType='non-series' />
        </div>
      </section>
    </>
  );
}
