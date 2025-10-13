import Image from 'next/image';
import Link from 'next/link';

import NavItems from './navItems';
import MobileNav from './mobileNav';

const Header = () => {
  return (
    <header className='w-full fixed top-0 inset-x-0 z-[1000]'>
      <div className='font-heading flex items-center justify-between fixed top-0 h-14 bg-white w-full mx-auto'>
        <Link href='/' className='p-1'>
          <Image
            src='/assets/images/logo.png'
            width={50}
            height={50}
            alt='Tama logo'
          />
        </Link>
        <nav className='md:flex-between hidden w-full max-w-xs'>
          <NavItems />
        </nav>
        <div className='flex w-32 justify-end gap-3'>
          <MobileNav />{' '}
        </div>
      </div>
    </header>
  );
};

export default Header;
