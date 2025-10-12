'use client';

import { useState, use } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import BuyButton from '../_components/BuyButton';

import { allbooks } from '@/constants';
// import BuyButton from '../../../../components/shared/BuyButton';
import React from 'react';
import { Separator } from '@/components/ui/separator';

interface BookSlugPageProps {
  params: Promise<{
    slugId: string;
  }>;
}

export default function AllBooksPage(props: BookSlugPageProps) {
  const params = use(props.params);
  const [shown, setShown] = useState(false);

  return (
    <>
      {allbooks
        .filter((book) => book.slugId === params.slugId)
        .map((book) => (
          <div key={book.id}>
            {/* Heading */}
            <section className='font-heading bg-blue-50 py-3 md:py-5'>
              <div className='wrapper flex flex-col justify-center gap-8 items-center '>
                <h1 className='font-heading text-3xl md:text-4xl text-blue-500'>
                  {book.seriesname ? book.seriesname : ''}
                </h1>
                <h2 className='font-heading text-2xl md:text-3xl text-blue-500'>
                  {book.shortdescription}
                </h2>
              </div>
            </section>
            {/* Content */}
            <section className='font-body py-5 md:py-10 wrapper'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-8 mt-6  md:px-20'>
                {/* Coloum 1 */}
                <div className=' flex flex-col place-items-center gap-2  md:gap-4 '>
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
                        className='font-body bg-blue-500 hover:bg-blue-700 mb-4'
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
                <div className='font-body text-base md:text-lg leading-relaxed flex flex-col gap-2 md:gap-8'>
                  <p>{book.description}</p>

                  {/* <div className='flex flex-col gap-2 '>
                    {book.longdescription &&
                      book.longdescription.map((desc, index) => (
                        <div key={index} className='pb-2'>
                          {desc}
                        </div>
                      ))}
                  </div> */}
                </div>
              </div>
            </section>
          </div>
        ))}

      {/* End Section */}
      <Separator className='border border-gray-100' />
      <div className='wrapper  flex flex-col md:flex-row md:place-content-center  gap-4 mt-10 mb-10'>
        <Button
          variant='ghost'
          size='lg'
          className='text-xl font-body bg-primary-50 text-blue-500 hover:text-blue-700 hover:bg-blue-200'
        >
          <Link href='/books'>All Books</Link>
        </Button>
        <Button
          variant='ghost'
          size='lg'
          className='text-xl font-body bg-primary-50 text-blue-500 hover:text-blue-700 hover:bg-blue-200'
        >
          <Link href='/'>Home</Link>
        </Button>
      </div>
    </>
  );
}
