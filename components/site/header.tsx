import Link from 'next/link';
import { UserButton } from '@clerk/nextjs';
import { auth } from '@clerk/nextjs/server';
import { Logo } from './logo';
import { NavLinks } from './nav-links';

export async function Header() {
  const { userId } = await auth();
  return (
    <header className='sticky top-0 z-40 border-b border-sand-deep/60 bg-sand/95 backdrop-blur'>
      <div className='wrapper flex h-[72px] items-center justify-between'>
        <Logo />
        <NavLinks />
        <div className='flex items-center gap-2 md:gap-3'>
          {userId ? (
            <>
              <Link href='/account' className='btn-outline btn-sm hidden md:inline-flex md:btn-md'>
                My shelf
              </Link>
              <UserButton appearance={{ elements: { avatarBox: 'size-10 ring-2 ring-white shadow' } }} />
            </>
          ) : (
            <>
              <Link href='/sign-in' className='btn btn-sm border-2 border-royal text-royal hover:bg-royal hover:text-white md:btn-md'>
                Sign in
              </Link>
              <Link href='/sign-up' className='btn-cta btn-sm hidden md:inline-flex md:btn-md'>
                Get my free pack
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
