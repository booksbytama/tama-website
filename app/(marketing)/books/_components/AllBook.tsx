import Link from 'next/link';
import Image from 'next/image';

import { Card, CardContent } from '@/components/ui/card';

import { allbooks } from '@/constants';

const AllBookCard = ({ bookType }: { bookType: string }) => {
  return (
    <>
      <div className='flex flex-col gap-2 md:gap-4 wrapper max-w-5xl'>
        {allbooks
          .filter((book) => book.bookType === bookType)
          .map((book) => (
            <div
              key={book.name}
              className='font-body text-center md:flex md:items-start md:text-left lg:block lg:text-center'
            >
              <Card className='shawdow-lg p-4'>
                <CardContent>
                  <div className='grid grid-cols-1 md:grid-cols-3 gap-4  place-items-center'>
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
                    </div>
                    <div className='mx-auto items-center flex flex-col gap-2 col-span-2'>
                      <h2 className='text-2xl font-heading text-blue-700'>
                        {book.name}
                      </h2>
                      {/* Show series */}
                      <p className='p-2 bg-yellow-300 rounded-full pl-3 pr-3 text-gray-700 text-sm font-body shadow-md'>
                        {' '}
                        {book.seriesname} Series
                      </p>

                      {/* {book.seriesname && (
                        <Link
                          href={`/series#${book.serieslink}`}
                          className='p-2 bg-yellow-300 rounded-full pl-3 pr-3 text-gray-700 text-sm font-body shadow-md'
                        >
                          {book.seriesname} Series
                        </Link>
                      )} */}
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
