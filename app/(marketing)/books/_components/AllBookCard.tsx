import Link from 'next/link';
import Image from 'next/image';

import { Card, CardContent } from '@/components/ui/card';

import { allbooks } from '@/constants';
import BuyButton from '@/components/shared/BuyButton';

const AllBookCard = ({ bookType }: { bookType: string }) => {
  return (
    <>
      <div className='flex flex-col gap-2 md:gap-4'>
        {allbooks
          .filter((book) => book.bookType === bookType)
          .map((book) => (
            <div
              key={book.name}
              className='text-center md:flex md:items-start md:text-left lg:block lg:text-center'
            >
              <Card className='shawdow-lg p-4'>
                <CardContent>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4  place-items-center'>
                    <div className='mx-auto items-center flex flex-col gap-2'>
                      <Link href={`/books/${book.slugId}`}>
                        <Image
                          src={`/assets/images/${book.image}`}
                          width={200}
                          height={200}
                          alt={book.name}
                          className='m-2 rounded-2xl shadow-lg shadow-blue-300 object-center object-fill'
                        />
                      </Link>

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
                    <div className='mx-auto items-center flex flex-col gap-2'>
                      <h2 className='text-2xl font-medium text-blue-700'>
                        {book.name}
                      </h2>
                      {book.seriesname && (
                        <Link
                          href={`/series#${book.serieslink}`}
                          className='p-1 bg-yellow-300 rounded-full pl-2 pr-2 text-gray-700 text-xs font-mono shadow-md'
                        >
                          {book.seriesname} Series
                        </Link>
                      )}
                      <div className='mt-2 text-gray-700'>
                        {book.description}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
      </div>
    </>
  );
};

export default AllBookCard;
