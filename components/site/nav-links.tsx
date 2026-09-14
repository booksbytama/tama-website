'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export const NAV = [
  { label: 'Books', href: '/books' },
  { label: 'Colouring', href: '/colouring' },
  { label: 'Buy', href: '/buy' },
  { label: 'About', href: '/about' },
];

export function NavLinks() {
  const pathname = usePathname();
  return (
    <nav className='hidden items-center gap-9 text-[17px] font-semibold md:flex'>
      {NAV.map((item) => {
        const active = pathname === item.href || pathname.startsWith(item.href + '/');
        return (
          <Link key={item.href} href={item.href} className={active ? 'text-ocean' : 'text-ink hover:text-ocean'}>
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
