import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import Image from 'next/image';
import { Separator } from '../ui/separator';
import NavItems from './navItems';

const MobileNav = () => {
  return (
    <nav className='md:hidden'>
      <Sheet>
        <SheetTrigger className='align-middle'>
          <Image
            src='/assets/icons/menu.svg'
            alt='menu'
            width={24}
            height={24}
            className='cursor-pointer'
          />
        </SheetTrigger>
        <SheetContent className='flex flex-col gap-6 bg-white md:hidden w-60'>
          {/* <Image
            src='/assets/images/newTama.svg'
            alt='logo'
            width={40}
            height={24}
          /> */}
          <SheetTitle>menu</SheetTitle>
          <Separator className='border border-gray-50' />

          <NavItems />
        </SheetContent>
      </Sheet>
    </nav>
  );
};

export default MobileNav;
