'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BookOpen, Home, Palette, UserRound } from 'lucide-react';

const TABS = [
  { label: 'Home', href: '/', icon: Home, exact: true },
  { label: 'Books', href: '/books', icon: BookOpen },
  { label: 'Colouring', href: '/colouring', icon: Palette },
  { label: 'Account', href: '/account', icon: UserRound },
];

export function MobileTabBar() {
  const pathname = usePathname();
  return (
    <nav className='fixed inset-x-0 bottom-0 z-40 grid h-[72px] grid-cols-4 border-t border-line bg-white pb-[env(safe-area-inset-bottom)] shadow-[0_-6px_20px_rgba(27,42,107,0.08)] md:hidden'>
      {TABS.map(({ label, href, icon: Icon, exact }) => {
        const active = exact ? pathname === href : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className={`flex flex-col items-center justify-center gap-1 text-[11px] font-bold ${active ? 'text-ocean' : 'text-mist'}`}
          >
            <Icon className='size-6' strokeWidth={2.2} />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
