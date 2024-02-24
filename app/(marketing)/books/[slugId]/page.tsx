'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

//import AllBookCard from '@/components/shared/AllBookCard';
import { allbooks } from '@/constants';
import BuyButton from '../../../../components/shared/BuyButton';
import React from 'react';
import { Separator } from '@/components/ui/separator';

interface BookSlugPageProps {
  params: {
    slugId: string;
  };
}

export default function AllBooksPage({ params }: BookSlugPageProps) {
  const [shown, setShown] = useState(false);

  return (
    <>
      {allbooks
        .filter((book) => book.slugId === params.slugId)
        .map((book) => (
          <div key={book.id}>
            <section className='bg-primary-50  bg-no-repeat bg-right-center first-letter:py-5 md:py-10'>
              <div className='wrapper flex flex-col justify-center gap-8 items-center '>
                <h1 className='h1-bold text-blue-500'>
                  {book.seriesname ? book.seriesname : book.shortname}
                </h1>
                <h2 className='h2-bold text-blue-400'>
                  {book.shortdescription}
                </h2>
              </div>
            </section>
            <section className='py-5 md:py-10 wrapper'>
              <div className='grid grid-cols-1 md:grid-cols-2  gap-8 mt-6 place-items-center md:px-20'>
                {/* Coloum 1 */}
                <div className='flex flex-col place-items-center gap-2  md:gap-6'>
                  {!shown && (
                    <Link href={`/books/${book.slugId}`}>
                      <Image
                        src={`/assets/images/${book.image}`}
                        width={250}
                        height={250}
                        alt={book.name}
                        className='m-2 rounded-2xl shadow-lg shadow-blue-300 object-center object-fill'
                      />
                    </Link>
                  )}

                  <div>
                    {book.sample && shown && (
                      <iframe
                        allowFullScreen
                        scrolling='no'
                        className='fp-iframe'
                        src={book.sample}
                        style={{
                          border: '1px solid lightgray',
                          width: '100%',
                          height: '400px',
                        }}
                      ></iframe>
                    )}
                  </div>
                  <div>
                    {' '}
                    {book.sample && (
                      <Button
                        className='bg-blue-500 hover:bg-blue-700 mb-4'
                        onClick={() => setShown(!shown)}
                      >
                        {' '}
                        {shown ? 'Close Sample' : 'Read Sample'}
                      </Button>
                    )}
                  </div>

                  <div className=' '>
                    {book.available === 'yes' && book.buylinks ? (
                      <BuyButton urlists={book.buylinks} />
                    ) : (
                      <div className='mt-2 p-regular-16 md:p-regular-20'>
                        {' '}
                        Available on{' '}
                        <span className='text-blue-600 font-semibold'>
                          {book.available}{' '}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Columun 2 */}
                <div className='flex flex-col gap-2 md:gap-8 '>
                  <p className='p-regular-16 md:p-regular-20 font-semibold'>
                    {book.description}
                  </p>
                  <div className='font-semibold text-blue-600 p-regular-16 md:p-regular-20'>
                    Reading Age: {book.ages}
                  </div>
                  <div className='p-regular-16 md:p-regular-20 flex flex-col gap-2 '>
                    {book.longdescription &&
                      book.longdescription.map((desc, index) => (
                        <div key={index} className='pb-2'>
                          {desc}
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </section>
          </div>
        ))}
      <Separator className='border border-gray-100' />
      <div className='wrapper flex flex-col md:flex-row md:place-content-center  gap-4 mt-10 mb-10'>
        <Button
          variant='ghost'
          size='lg'
          className='text-lg bg-primary-50 text-blue-500 hover:text-blue-700 hover:bg-blue-200'
        >
          <Link href='/series'>All Series</Link>
        </Button>
        <Button
          variant='ghost'
          size='lg'
          className='text-lg bg-primary-50 text-blue-500 hover:text-blue-700 hover:bg-blue-200'
        >
          <Link href='/books'>All Books</Link>
        </Button>
        <Button
          variant='ghost'
          size='lg'
          className='text-lg bg-primary-50 text-blue-500 hover:text-blue-700 hover:bg-blue-200'
        >
          <Link href='/'>Home</Link>
        </Button>
      </div>
    </>
  );
}
