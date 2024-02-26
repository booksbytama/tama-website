import Image from 'next/image';
import Link from 'next/link';
//import { Button } from '../ui/button';
import NavItems from './NavItems';
import MobileNav from './MobileNav';

const Header = () => {
  return (
    <header className='w-full'>
      <div className='flex items-center justify-between fixed top-0 h-14 bg-white w-full mx-auto'>
        <Link href='/' className='w-36 pl-4'>
          <Image
            src='/assets/images/logo.svg'
            width={128}
            height={38}
            alt='Tama logo'
          />
        </Link>
        <nav className='md:flex-between hidden w-full max-w-xs'>
          <NavItems />
        </nav>
        <div className='flex w-32 justify-end gap-3'>
          <MobileNav />{' '}
        </div>

        {/* <SignedIn>
          <nav className="md:flex-between hidden w-full max-w-xs">
            <NavItems />
          </nav>
        </SignedIn> */}

        {/* <div className="flex w-32 justify-end gap-3">
          <SignedIn>
            <UserButton afterSignOutUrl="/" />
            <MobileNav />
          </SignedIn>
          <SignedOut>
            <Button asChild className="rounded-full" size="lg">
              <Link href="/sign-in">
                Login
              </Link>
            </Button>
          </SignedOut>
        </div> */}
      </div>
    </header>
  );
};

export default Header;
