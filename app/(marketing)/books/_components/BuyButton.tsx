import Link from 'next/link';
import { Button } from '@/components/ui/button';

// interface URLListProps {
//   [index: number]: { id: number; urllink: string; typename: string };
// }

interface BuyListProps {
  buyname: string;
  buylink: string;
}
interface ListProps {
  urlists: Array<BuyListProps>;
}
const BuyButton = ({ urlists }: { urlists: Array<any> }) => {
  return (
    <>
      <div className='mt-2 grid grid-cols-1 md:grid-cols-2  place-self-stretch gap-2 md:gap-4 '>
        {urlists.map((buylist) => (
          <div key={buylist.buyname}>
            <Button
              size='sm'
              asChild
              variant='outline'
              className='font-body rounded-2xl border-blue-500  text-blue-700  hover:bg-blue-500 shadow-md hover:text-white w-full'
            >
              <Link
                href={buylist.buylink}
                rel='noopener noreferrer'
                target='_blank'
              >
                {buylist.buyname}
              </Link>
            </Button>
          </div>
        ))}
      </div>
    </>
  );
};

export default BuyButton;
