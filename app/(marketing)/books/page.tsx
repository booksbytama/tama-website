import AllBookCard from './_components/AllBookCard';

export default function AllBooksPage() {
  return (
    <>
      <section className='py-5 md:py-10'>
        <div className='wrapper flex flex-col items-center gap-5 md:grid-cols-1 2xl:gap-0'>
          <AllBookCard bookType='series' />
          <AllBookCard bookType='non-series' />
        </div>
      </section>
    </>
  );
}
