import Link from 'next/link';
import Image from 'next/image';

import { allbooks } from '@/constants';

const BookListCover = ({ bookType }: { bookType: string }) => {
  return (
    <div className=' font-body grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 md:mt-6'>
      {allbooks
        .filter((book) => book.bookType === bookType)
        .map((book) => (
          <div
            key={book.id}
            className='font-body text-center grid-cols-1 md:grid-cols-3 items-center '
          >
            <div className='md:flex-shrink-0 flex justify-center'>
              <div className='shadow-lg shadow-blue-600'>
                <Link href={`/books/${book.slugId}`}>
                  <Image
                    src={`/assets/images/${book.image}`}
                    width={200}
                    height={200}
                    alt={book.name}
                  />
                </Link>
              </div>
            </div>

            <div className='mt-6 md:ml-4 md:mt-2 lg:ml-0 lg:mt-6'>
              <h3 className='text-lg font-semibold text-gray-700'>
                {book.seriesname ? book.seriesname : ''}
              </h3>
              <p className='mt-3 md:mt-2 text-base text-muted-foreground'>
                {book.shortdescription}
              </p>
            </div>
          </div>
        ))}
    </div>
  );
};

export default BookListCover;
