import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { series } from '@/constants';

export default function Home() {
  return (
    <>
      <section className='bg-primary-50 bg-dotted-pattern bg-contain py-5 md:py-10'>
        <div className='wrapper grid grid-cols-1 gap-5 md:grid-cols-2 2xl:gap-0'>
          <div className='flex flex-col justify-center gap-8'>
            <h1 className='h1-bold'>Welcome to Books By Tama M.</h1>
            <p className='p-regular-20 md:p-regular-24'>
              Discover Tama M.'s Children's Book.
            </p>
            <p className='p-regular-16 md:p-regular-20'>
              Meet Shelly, Spike, and Billy - your guides to amazing sea
              creatures! Or join Buzzy the Bee on a pollen-packed adventure!
            </p>
            <Button size='lg' asChild className='button w-full sm:w-fit'>
              <Link href='#series'>Explore Now</Link>
            </Button>
          </div>

          <Image
            src='/assets/images/hero.png'
            alt='hero'
            width={1000}
            height={1000}
            className='rounded max-h-[70vh] object-contain object-center 2xl:max-h-[50vh]'
          />
        </div>
      </section>{' '}
      <section
        id='events'
        className='wrapper my-8 flex flex-col gap-8 md:gap-12'
      >
        <h2 className='h2-bold'>
          Trust by <br /> Thousands of Events
        </h2>

        <div className='flex w-full flex-col gap-5 md:flex-row'>
          {/* <Search />
          <CategoryFilter /> */}
        </div>

        <div className='flex flex-col sm:flex-row gap-4 mt-6 w-20'>
          <Link href='/series' className='p5 md:p-10 text-xl text-blue-500'>
            Series
          </Link>
        </div>
        <div className='grid grid-cols-1 gap-y-12 sm:grid-cols-2 sm:gap-x-6 lg:grid-cols-3 lg:gap-x-8 lg:gap-y-0'>
          {series.map((serie) => (
            <div
              key={serie.name}
              className='text-center md:flex md:items-start md:text-left lg:block lg:text-center'
            >
              <div className='md:flex-shrink-0 flex justify-center'>
                <div className='w-1/2 h-1/2  shadow-lg shadow-blue-600'>
                  <Link href={serie.route}>
                    <Image
                      src={`/assets/images/${serie.image}`}
                      width={1000}
                      height={1000}
                      alt={serie.name}
                      className='rounded max-h-[70vh] object-contain object-center 2xl:max-h-[50vh]'
                    />
                  </Link>
                </div>
              </div>

              <div className='mt-6 md:ml-4 md:mt-0 lg:ml-0 lg:mt-6'>
                <h3 className='text-lg font-medium text-gray-900'>
                  {serie.name}
                </h3>
                <p className='mt-3 text-base text-muted-foreground'>
                  {serie.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
      {/* <section className='border-t border-gray-200 bg-gray-50 '>
        <div className='flex flex-col sm:flex-row gap-4 mt-6 w-20'>
          <Link href='/series' className='p5 md:p-10 text-xl text-blue-500'>
            Series
          </Link>
        </div>
        <div className='grid grid-cols-1 gap-y-12 sm:grid-cols-2 sm:gap-x-6 lg:grid-cols-3 lg:gap-x-8 lg:gap-y-0'>
          {series.map((serie) => (
            <div
              key={serie.name}
              className='text-center md:flex md:items-start md:text-left lg:block lg:text-center'
            >
              <div className='md:flex-shrink-0 flex justify-center'>
                <div className='w-1/2 h-1/2  shadow-lg shadow-blue-600'>
                  <Link href={serie.route}>
                    <Image
                      src={`/assets/images/${serie.image}`}
                      width={1000}
                      height={1000}
                      alt={serie.name}
                      className='rounded max-h-[70vh] object-contain object-center 2xl:max-h-[50vh]'
                    />
                  </Link>
                </div>
              </div>

              <div className='mt-6 md:ml-4 md:mt-0 lg:ml-0 lg:mt-6'>
                <h3 className='text-lg font-medium text-gray-900'>
                  {serie.name}
                </h3>
                <p className='mt-3 text-base text-muted-foreground'>
                  {serie.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section> */}
    </>
  );
}
