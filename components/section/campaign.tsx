import Link from 'next/link';
import { Button } from '@/components/ui/button';

import { ShoppingCart, Star } from 'lucide-react';

export default function Campaign() {
  return (
    <>
      <section className='w-full flex flex-col items-center gap-4 mt-6'>
        {/* Amazon + Google Buttons */}
        <div className=' font-body grid grid-cols-1 gap-6 sm:grid-cols-1 md:grid-cols-2 '>
          <Button
            variant='secondary'
            className='bg-[#FF9900] text-white hover:bg-[#e68a00] flex items-center gap-2 px-6 py-6 text-base  shadow-lg rounded-xl '
            asChild
          >
            <Link href='/buy'>
              <ShoppingCart className='h-5 w-5' />
              Buy Online from Amazon & Google
            </Link>
          </Button>

          <Button
            variant='default'
            className='bg-teal-600 text-white hover:bg-teal-700 px-6 py-6 text-base font-semibold shadow-lg rounded-xl flex items-center gap-2'
            asChild
          >
            <Link href='/buy#buy-local'>
              <Star className='h-5 w-5' />
              Buy Local at Farfetched — Free Ocean Map!
            </Link>
          </Button>
        </div>
        {/* Clarifying text */}
        <p className='font-body text-sm text-muted-foreground mt-2 text-center px-4'>
          Bonus offer applies only to purchases made in-store at Farfetched
          Design, Seddon.
        </p>
      </section>
    </>
  );
}
