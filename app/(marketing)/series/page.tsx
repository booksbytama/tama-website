import Link from 'next/link';
import Image from 'next/image';

import AllSeriesCard from '@/app/(marketing)/series/_components/AllSeriesCard';
import { Button } from '@/components/ui/button';

export default function AllSeriesPage() {
  return (
    <>
      <section className='py-5 md:py-10'>
        <div className='wrapper flex flex-col items-center gap-5 md:grid-cols-1 2xl:gap-0'>
          <h1 className='h1-bold'>
            All Series by <span className='text-blue-400'>Tama M.</span>
          </h1>
          {/* All buttons */}
          <div className='flex flex-col sm:flex-row gap-4 mt-2 md:mt-14 border-b p-4'>
            <div className='p-2 border-2 rounded-2xl w-60 shadow-lg bg-sky-500 border-sky-600 flex flex-col gap-2 items-center'>
              <Link
                href='#shellyandspike'
                className='text-xl text-white items-center flex flex-col'
              >
                <p className='mb-2'>Shelly and Spike</p>
                <Image
                  src='/assets/images/shellyandspikelogo.svg'
                  alt='shellyandspikelogo'
                  width={400}
                  height={250}
                />
              </Link>
            </div>
            <div className='p-2 border-2 rounded-2xl w-60 shadow-lg bg-purple-500 border-purple-600 flex flex-col gap-2 items-center'>
              <Link
                href='#billy'
                className='text-xl text-white items-center flex flex-col'
              >
                <p className='mb-2'>Billy</p>
                <Image
                  src='/assets/images/billylogo.svg'
                  alt='billylogo'
                  width={100}
                  height={100}
                />
              </Link>
            </div>
            <div className='p-2 border-2 rounded-2xl w-60 shadow-lg bg-emerald-500 border-emerald-600 flex flex-col gap-2 items-center'>
              <Link
                href='#buzzy'
                className='text-xl text-white items-center flex flex-col'
              >
                <p className='mb-2'>Buzzy and Zippy</p>
                <Image
                  src='/assets/images/buzzyandzippylogo.png'
                  alt='buzzyandzippylogo'
                  width={200}
                  height={200}
                />
              </Link>
            </div>
          </div>

          <div id='shellyandspike' className='mt-6'>
            <AllSeriesCard name='Treasure Map Adventures' />
          </div>
          <div id='billy' className='mt-6'>
            <AllSeriesCard name='Billy' />
          </div>
          <div id='buzzy' className='mt-6'>
            <AllSeriesCard name='Buzzy' />
          </div>
        </div>
      </section>
    </>
  );
}
