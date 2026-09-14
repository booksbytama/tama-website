import Image from 'next/image';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className='flex min-h-screen flex-col items-center justify-center gap-5 bg-sand px-6 text-center'>
      <Image src='/assets/images/worrywhale.png' alt='' width={220} height={220} className='rounded-3xl' />
      <h1 className='text-3xl font-bold md:text-[44px]'>This page swam away</h1>
      <p className='max-w-md font-semibold text-slate'>We couldn't find that page. The treasure map may have changed.</p>
      <div className='flex gap-3'>
        <Link href='/books' className='btn-primary btn-md'>All books</Link>
        <Link href='/' className='btn-outline btn-md'>Home</Link>
      </div>
    </div>
  );
}
