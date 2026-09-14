'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className='flex min-h-screen flex-col items-center justify-center gap-5 bg-sand px-6 text-center'>
      <Image src='/assets/images/StarfishGroup.png' alt='' width={260} height={160} />
      <h1 className='text-3xl font-bold md:text-[44px]'>Whoops, a wave knocked us over</h1>
      <p className='max-w-md font-semibold text-slate'>Something went wrong loading this page. It's usually a blip — try again in a moment.</p>
      {error.digest && <p className='text-xs font-semibold text-mist'>Ref {error.digest}</p>}
      <div className='flex gap-3'>
        <button onClick={reset} className='btn-primary btn-md'>Try again</button>
        <Link href='/' className='btn-outline btn-md'>Home</Link>
      </div>
    </div>
  );
}
