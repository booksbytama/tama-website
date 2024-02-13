import Link from 'next/link';
import Image from 'next/image';

import { allbooks } from '@/constants';

const BookListCover = ({ bookType }: { bookType: string }) => {
  return (
    // <div className='grid grid-cols-1 gap-y-12 sm:grid-cols-2 sm:gap-x-6 lg:grid-cols-3 lg:gap-x-8 lg:gap-y-0 mt-2 md:mt-6'>
    <div className='grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 md:mt-6'>
      {allbooks
        .filter((book) => book.bookType === bookType)
        .map((book) => (
          <div
            key={book.id}
            // className='text-center md:flex md:items-start md:text-left lg:block lg:text-center'
            className='text-center grid-cols-1 md:grid-cols-3 items-center '
          >
            <div className='md:flex-shrink-0 flex justify-center'>
              <div className='shadow-lg shadow-blue-600'>
                <Link href={`/books/${book.slugId}`}>
                  <Image
                    src={`/assets/images/${book.image}`}
                    width={200}
                    height={200}
                    alt={book.name}
                    // className='rounded max-h-[70vh] object-contain object-center 2xl:max-h-[50vh]'
                  />
                </Link>
              </div>
            </div>

            <div className='mt-6 md:ml-4 md:mt-0 lg:ml-0 lg:mt-6'>
              <h3 className='text-lg font-medium text-gray-900'>
                {book.seriesname ? book.seriesname : book.shortname}
              </h3>
              <p className='mt-3 text-base text-muted-foreground'>
                {book.shortdescription}
              </p>
            </div>
          </div>
        ))}
    </div>
  );
};

export default BookListCover;
