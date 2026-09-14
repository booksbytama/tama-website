'use client';

import Link from 'next/link';
import { UserButton, useAuth } from '@clerk/nextjs';

// Client-side auth state so the pages that render these stay statically cacheable.

export function HeaderAuth() {
  const { isLoaded, isSignedIn } = useAuth();
  if (!isLoaded) return <div className='h-10 w-[88px]' aria-hidden />;
  if (isSignedIn) {
    return (
      <>
        <Link href='/account' className='btn-outline btn-sm hidden md:inline-flex md:btn-md'>
          My shelf
        </Link>
        <UserButton appearance={{ elements: { avatarBox: 'size-10 ring-2 ring-white shadow' } }} />
      </>
    );
  }
  return (
    <>
      <Link href='/sign-in' className='btn btn-sm border-2 border-royal text-royal hover:bg-royal hover:text-white md:btn-md'>
        Sign in
      </Link>
      <Link href='/sign-up' className='btn-cta btn-sm hidden md:inline-flex md:btn-md'>
        Get my free pack
      </Link>
    </>
  );
}

export function StarterPackCta() {
  const { isSignedIn } = useAuth();
  if (isSignedIn) {
    return (
      <Link href='/account/pack' className='btn-cta btn-lg'>
        Open my starter pack
      </Link>
    );
  }
  return (
    <>
      <Link href='/sign-up' className='btn-cta btn-lg'>
        Get my free pack
      </Link>
      <Link href='/sign-in' className='btn-ghost-light btn-lg'>
        Sign in
      </Link>
    </>
  );
}
