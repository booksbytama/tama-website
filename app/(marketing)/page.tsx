import Hero from '@/components/section/hero';
import BookListCover from './_components/ListCover';

export default function Home() {
  return (
    <>
      <Hero />

      <section className='py-5 md:py-10'>
        <div className='wrapper grid grid-cols-1 gap-6'>
          <BookListCover bookType='series' />
          {/* <BookListCover bookType='non-series' />  */}
        </div>
      </section>
    </>
  );
}
