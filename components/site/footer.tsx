import Link from 'next/link';
import { Logo } from './logo';

const COLUMNS = [
  {
    title: 'Read',
    links: [
      { label: 'All books', href: '/books' },
      { label: 'Colouring books', href: '/colouring' },
      { label: 'Where to buy', href: '/buy' },
    ],
  },
  {
    title: 'Buy',
    links: [
      { label: 'Amazon US', href: 'https://www.amazon.com/dp/1923337033/' },
      { label: 'Amazon AU', href: 'https://www.amazon.com.au/dp/1923337033' },
      { label: 'Google Play', href: 'https://play.google.com/store/books/details?id=b3hZEQAAQBAJ' },
      { label: 'Buy local', href: '/buy#buy-local' },
    ],
  },
  {
    title: 'Tama',
    links: [
      { label: 'About', href: '/about' },
      { label: 'Contact', href: '/contact' },
      { label: 'Teachers & schools', href: '/contact' },
    ],
  },
];

export function Footer() {
  return (
    <footer className='wrapper flex flex-col gap-10 py-14 md:flex-row md:items-start md:justify-between md:py-16'>
      <div className='flex max-w-xs flex-col gap-3'>
        <Logo size={32} />
        <p className='text-[15px] leading-relaxed text-mist'>
          Written and illustrated by Tama M. Printed on demand and shipped worldwide via Amazon and IngramSpark.
        </p>
      </div>
      <div className='grid grid-cols-2 gap-8 text-[15px] font-semibold text-slate sm:grid-cols-3 md:gap-16'>
        {COLUMNS.map((col) => (
          <div key={col.title} className='flex flex-col gap-2.5'>
            <div className='font-bold text-royal'>{col.title}</div>
            {col.links.map((l) =>
              l.href.startsWith('http') ? (
                <a key={l.label} href={l.href} target='_blank' rel='noopener noreferrer' className='hover:text-ocean'>
                  {l.label}
                </a>
              ) : (
                <Link key={l.label} href={l.href} className='hover:text-ocean'>
                  {l.label}
                </Link>
              ),
            )}
          </div>
        ))}
      </div>
    </footer>
  );
}
