import type { BuyLink } from '@/lib/db/types';

export function BuyLinks({ links, className = '' }: { links: BuyLink[]; className?: string }) {
  if (links.length === 0) return null;
  return (
    <div id='buy' className={`grid grid-cols-2 gap-2.5 ${className}`}>
      {links.map((l) => (
        <a
          key={l.url}
          href={l.url}
          target='_blank'
          rel='noopener noreferrer'
          className='rounded-2xl border-2 border-line bg-white px-3 py-3.5 text-center text-[15px] font-bold text-royal transition-colors hover:border-ocean hover:text-ocean'
        >
          {l.label}
        </a>
      ))}
    </div>
  );
}
