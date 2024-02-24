import Image from 'next/image';

import BookListCover from './_components/BookListCover';

export default function Home() {
  return (
    <>
      <section className='bg-primary-50 bg-dotted-pattern bg-contain first-letter:py-5 md:py-10'>
        <div className='wrapper flex flex-col items-center gap-5 md:grid-cols-1 2xl:gap-0'>
          <h1 className='h1-bold items-center flex flex-col mb-2 md:hidden'>
            <div> Welcome to</div>
            <span className='text-blue-500'>
              Books By Tama <span className='text-blue-800'>M.</span>
            </span>
          </h1>
          <p className='p-regular-16  md:hidden items-center '>
            To the children with curious hearts who love reading around the
            world.
          </p>
          <div className='m-4 md:hidden'>
            <Image
              src='/assets/images/mobilecover.png'
              alt='hero mobile'
              width={1053}
              height={633}
              className='rounded max-h-[70vh] object-contain object-center 2xl:max-h-[50vh]'
            />
          </div>

          <div className='hidden m-4 md:block md:m-6'>
            <Image
              src='/assets/images/chars1.png'
              alt='hero'
              width={1053}
              height={633}
              className='rounded max-h-[70vh] object-contain object-center 2xl:max-h-[50vh]'
            />
          </div>
        </div>
      </section>
      <section className='py-5 md:py-10'>
        <div
          // className='wrapper flex flex-col items-center gap-5 md:grid-cols-1 2xl:gap-0'
          className='wrapper grid grid-cols-1 '
        >
          <BookListCover bookType='series' />
          <BookListCover bookType='non-series' />
        </div>
      </section>
    </>
  );
}
