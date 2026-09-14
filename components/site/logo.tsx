import Image from 'next/image';
import Link from 'next/link';

export function Logo({ light = false, size = 44 }: { light?: boolean; size?: number }) {
  return (
    <Link href='/' className='flex items-center gap-3'>
      <Image src='/assets/images/logo.png' alt='' width={size} height={size} priority />
      <span className={`font-heading text-2xl font-semibold ${light ? 'text-white' : 'text-royal'}`}>Books by Tama</span>
    </Link>
  );
}
