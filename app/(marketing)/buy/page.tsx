import Image from 'next/image';
import { ShoppingCart, BookOpen } from 'lucide-react';

import { Button } from '@/components/ui/button';

export default function Buy() {
  return (
    <>
      <section className='py-5 md:py-10'>
        <div className='wrapper flex flex-col gap-4 md:gap-8 items-center justify-center text-center max-w-4xl mx-auto px-4'>
          <div id='buy-online' className='p-2 md:p-4 '>
            <Image
              src='/assets/images/StarfishGroup.png'
              alt='Starfish Group'
              width={300}
              height={300}
              className='rounded max-h-[70vh] object-contain object-center 2xl:max-h-[50vh]'
            />
          </div>
          {/* Intro */}
          <p className='font-body text-lg text-muted-foreground max-w-xl'>
            Choose your preferred store to buy Starfish Super Squad books —
            online or locally in Seddon.
          </p>
          <div className=''>
            <h2 className='font-heading text-3xl md:text-4xl mb-4'>
              Buy Online
            </h2>

            <div className='mt-10 flex flex-col sm:flex-row flex-wrap justify-center gap-4 font-body w-full  p-6 border-blue-300 border rounded-xl  max-w-xl'>
              {/* Amazon AU */}
              <Button
                variant='secondary'
                className='bg-[#FF9900] text-white hover:bg-[#e68a00]'
                asChild
              >
                <a
                  href='https://www.amazon.com.au/dp/1923337033'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='flex items-center gap-2'
                >
                  <ShoppingCart className='h-4 w-4' />
                  Buy on Amazon (AU)
                </a>
              </Button>

              {/* Amazon US */}
              <Button
                variant='secondary'
                className='bg-[#FF9900] text-white hover:bg-[#e68a00]'
                asChild
              >
                <a
                  href='https://www.amazon.com/dp/1923337033/'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='flex items-center gap-2'
                >
                  <ShoppingCart className='h-4 w-4' />
                  Buy on Amazon (US)
                </a>
              </Button>

              {/* Google Play */}
              <Button
                variant='secondary'
                className='bg-[#4285F4] text-white hover:bg-[#3367D6]'
                asChild
              >
                <a
                  href='https://play.google.com/store/books/details?id=b3hZEQAAQBAJ'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='flex items-center gap-2'
                >
                  <BookOpen className='h-4 w-4' />
                  Buy Digital on Google Play
                </a>
              </Button>
            </div>
          </div>

          {/* BUY LOCAL */}
          <div
            id='buy-local'
            className='flex flex-col items-center justify-center text-center'
          >
            <h2 className='font-heading text-3xl md:text-4xl mb-2'>
              Buy Local
            </h2>
            <div className='p-2 md:p-4 '>
              <Image
                src='/assets/images/shoplocal.png'
                alt='Tama avatar'
                width={300}
                height={300}
                className='rounded max-h-[70vh] object-contain object-center 2xl:max-h-[50vh]'
              />
            </div>
            <div className=' font-body w-full mt-10 p-6 border-blue-300 border rounded-xl  max-w-xl'>
              <p className='text-base md:text-lg leading-relaxed'>
                Visit <strong>Far Fetched Designs</strong> in Seddon to shop
                locally.
              </p>

              <p className='text-base md:text-lg leading-relaxed   '>
                Get a <strong>FREE Ocean Map</strong> when you buy any 2
                Starfish Super Squad books — while stocks last.
              </p>
            </div>
          </div>
        </div>
      </section>{' '}
    </>
  );
}
