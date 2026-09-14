'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Lock, Maximize2, Minimize2, X } from 'lucide-react';
import { saveProgressAction } from '@/app/(marketing)/account/actions';
import type { BuyLink } from '@/lib/db/types';

type Page = { page_number: number; url: string; width: number | null; height: number | null };

type Props = {
  book: { id: string; slug: string; title: string; seriesName: string | null; buyLinks: BuyLink[]; pageCount: number };
  pages: Page[];
  startPage: number;
  isSample: boolean;
  profile: { id: string; name: string } | null;
  signedIn: boolean;
};

export function BookReader({ book, pages, startPage, isSample, profile, signedIn }: Props) {
  const total = pages.length;
  const [twoUp, setTwoUp] = useState(false);
  const [current, setCurrent] = useState(startPage);
  const [fullscreen, setFullscreen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const [showGate, setShowGate] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 900px) and (orientation: landscape)');
    const apply = () => setTwoUp(mq.matches);
    apply();
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, []);

  // In two-up mode the cover (page 1) sits alone on the right, like a real book.
  const spread = useMemo(() => {
    if (!twoUp) return [current];
    if (current === 1) return [1];
    const left = current % 2 === 0 ? current : current - 1;
    return [left, left + 1].filter((n) => n <= total);
  }, [current, twoUp, total]);

  const atEnd = spread[spread.length - 1] >= total;
  const atStart = current <= 1;

  const go = useCallback(
    (dir: 1 | -1) => {
      setShowGate(false);
      setCurrent((c) => {
        if (dir === -1) {
          if (c <= 1) return c;
          if (!twoUp) return c - 1;
          return c === 2 ? 1 : c % 2 === 0 ? c - 2 : c - 3;
        }
        const last = twoUp ? (c === 1 ? 1 : c % 2 === 0 ? c + 1 : c) : c;
        if (last >= total) {
          if (isSample) setShowGate(true);
          return c;
        }
        if (!twoUp) return c + 1;
        return c === 1 ? 2 : c % 2 === 0 ? c + 2 : c + 1;
      });
    },
    [twoUp, total, isSample],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') go(1);
      if (e.key === 'ArrowLeft') go(-1);
      if (e.key === 'Escape') setShowGate(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [go]);

  useEffect(() => {
    if (!profile) return;
    const t = setTimeout(() => void saveProgressAction(profile.id, book.id, current), 800);
    return () => clearTimeout(t);
  }, [current, profile, book.id]);

  useEffect(() => {
    const onChange = () => setFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener('fullscreenchange', onChange);
    return () => document.removeEventListener('fullscreenchange', onChange);
  }, []);

  const toggleFullscreen = () => {
    if (document.fullscreenElement) void document.exitFullscreen();
    else void rootRef.current?.requestFullscreen?.();
  };

  // Preload neighbours
  useEffect(() => {
    [current + 1, current + 2].forEach((n) => {
      const p = pages.find((x) => x.page_number === n);
      if (p) {
        const img = new window.Image();
        img.src = p.url;
      }
    });
  }, [current, pages]);

  const touchX = useRef<number | null>(null);

  if (total === 0) {
    return (
      <div className='flex min-h-screen flex-col items-center justify-center gap-4 bg-royal-deep p-6 text-center text-white'>
        <div className='font-heading text-3xl'>No sample yet for {book.title}</div>
        <Link href={`/books/${book.slug}`} className='btn-sun btn-md font-body font-bold'>Back to the book</Link>
      </div>
    );
  }

  return (
    <div ref={rootRef} className='relative flex h-dvh flex-col overflow-hidden bg-gradient-to-b from-royal-deep to-[#1479c4] text-white select-none'>
      <Bubbles />

      <header className='relative z-10 flex items-center justify-between px-4 py-3 md:px-8 md:py-5'>
        <div className='flex items-center gap-3'>
          <Link href={`/books/${book.slug}`} aria-label='Close reader' className='flex size-11 items-center justify-center rounded-full bg-white/15 hover:bg-white/25'>
            <X className='size-[22px]' strokeWidth={2.4} />
          </Link>
          <div className='flex flex-col'>
            <div className='font-heading text-base font-semibold leading-tight md:text-xl'>{book.title}</div>
            <div className='text-xs font-semibold text-[#9fc4e8] md:text-[13px]'>
              {book.seriesName ? `${book.seriesName} · ` : ''}
              {isSample ? 'Free sample' : 'Full book'}
              {profile ? ` · ${profile.name}'s shelf` : ''}
            </div>
          </div>
        </div>
        <div className='flex items-center gap-2 md:gap-3'>
          <div className='rounded-full bg-white/15 px-3.5 py-2 text-[13px] font-bold md:text-sm'>
            {spread.length === 2 ? `Pages ${spread[0]}–${spread[1]}` : `Page ${spread[0]}`} of {total}
          </div>
          <button onClick={toggleFullscreen} aria-label='Toggle fullscreen' className='hidden size-11 items-center justify-center rounded-full bg-white/15 hover:bg-white/25 md:flex'>
            {fullscreen ? <Minimize2 className='size-[22px]' /> : <Maximize2 className='size-[22px]' />}
          </button>
        </div>
      </header>

      <div
        className='relative z-10 flex flex-1 items-center justify-center gap-3 px-2 md:gap-7 md:px-8'
        onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
        onTouchEnd={(e) => {
          if (touchX.current == null) return;
          const dx = e.changedTouches[0].clientX - touchX.current;
          if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
          touchX.current = null;
        }}
      >
        <NavButton dir={-1} disabled={atStart} onClick={() => go(-1)} />
        <div className='relative flex h-full max-h-[calc(100dvh-190px)] w-full items-center justify-center'>
          <div className={`grid h-full ${spread.length === 2 ? 'grid-cols-2 gap-[3px]' : 'grid-cols-1'} max-w-full overflow-hidden rounded-[14px] shadow-[0_30px_60px_rgba(0,0,0,0.45)]`}>
            {spread.map((n) => {
              const p = pages.find((x) => x.page_number === n)!;
              return (
                <div key={n} className='relative flex h-full items-center justify-center bg-[#f7fbff]'>
                  <Image
                    src={p.url}
                    alt={`${book.title} page ${n}`}
                    width={p.width ?? 1200}
                    height={p.height ?? 1200}
                    unoptimized
                    priority
                    draggable={false}
                    className='h-full w-auto max-w-full object-contain'
                  />
                </div>
              );
            })}
          </div>
          {showGate && <EndGate book={book} signedIn={signedIn} profile={profile} onClose={() => setShowGate(false)} />}
        </div>
        <NavButton dir={1} disabled={atEnd && !isSample} onClick={() => go(1)} />
      </div>

      <footer className='relative z-10 flex items-center justify-center gap-2 px-4 pb-4 pt-2 md:pb-6'>
        <div className='flex max-w-full gap-1.5 overflow-x-auto px-2 py-1'>
          {pages.map((p) => (
            <button
              key={p.page_number}
              onClick={() => {
                setShowGate(false);
                setCurrent(p.page_number);
              }}
              aria-label={`Go to page ${p.page_number}`}
              className={`size-2.5 shrink-0 rounded-full transition-colors md:size-3 ${spread.includes(p.page_number) ? 'bg-sun' : 'bg-white/35 hover:bg-white/60'}`}
            />
          ))}
        </div>
        {isSample && book.pageCount > total && (
          <div className='ml-2 hidden items-center gap-2 rounded-full border-2 border-dashed border-white/35 px-4 py-2 text-[13px] font-bold text-[#c9ddf2] md:flex'>
            <Lock className='size-4' strokeWidth={2.4} /> {book.pageCount - total} more pages in the paperback
          </div>
        )}
      </footer>
    </div>
  );
}

function NavButton({ dir, disabled, onClick }: { dir: 1 | -1; disabled: boolean; onClick: () => void }) {
  const Icon = dir === 1 ? ChevronRight : ChevronLeft;
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={dir === 1 ? 'Next page' : 'Previous page'}
      className='flex size-12 shrink-0 items-center justify-center rounded-full bg-sun text-royal shadow-[0_5px_0_var(--color-sun-deep)] transition-all hover:brightness-105 active:translate-y-[3px] active:shadow-[0_2px_0_var(--color-sun-deep)] disabled:opacity-30 disabled:shadow-none md:size-[72px]'
    >
      <Icon className='size-7 md:size-9' strokeWidth={3} />
    </button>
  );
}

function EndGate({ book, signedIn, profile, onClose }: { book: Props['book']; signedIn: boolean; profile: Props['profile']; onClose: () => void }) {
  return (
    <div className='absolute inset-0 z-20 flex items-center justify-center rounded-[14px] bg-royal-deep/70 p-4 backdrop-blur-sm' onClick={onClose}>
      <div className='flex max-w-md flex-col items-center gap-4 rounded-[28px] bg-sand p-7 text-center text-ink shadow-2xl md:p-9' onClick={(e) => e.stopPropagation()}>
        <Image src='/assets/images/StarfishGroup.png' alt='' width={220} height={130} className='w-40 md:w-52' />
        <div className='font-heading text-2xl font-semibold text-royal md:text-[28px]'>That's the end of the free sample!</div>
        <p className='text-[15px] font-semibold text-slate'>Get the paperback to find out where the map leads.</p>
        <div className='grid w-full grid-cols-2 gap-2'>
          {book.buyLinks.map((l) => (
            <a key={l.url} href={l.url} target='_blank' rel='noopener noreferrer' className='btn-cta btn-sm font-body font-bold'>
              {l.label}
            </a>
          ))}
        </div>
        {!signedIn ? (
          <p className='text-[13px] font-semibold text-mist'>
            <Link href='/sign-up' className='text-ocean underline underline-offset-2'>Join free</Link> to save samples to a shelf and get the starter pack.
          </p>
        ) : profile ? (
          <p className='text-[13px] font-semibold text-mist'>Saved to {profile.name}'s shelf</p>
        ) : (
          <p className='text-[13px] font-semibold text-mist'>
            <Link href='/account' className='text-ocean underline underline-offset-2'>Pick a reader</Link> to save this to a shelf.
          </p>
        )}
      </div>
    </div>
  );
}

function Bubbles() {
  return (
    <div aria-hidden className='pointer-events-none absolute inset-0 overflow-hidden'>
      <span className='absolute left-[8%] top-[70%] size-3.5 rounded-full border-2 border-white/25' />
      <span className='absolute left-[12%] top-[78%] size-2 rounded-full border-2 border-white/25' />
      <span className='absolute right-[10%] top-[22%] size-[18px] rounded-full border-2 border-white/20' />
      <span className='absolute right-[6%] top-[60%] size-2.5 rounded-full border-2 border-white/20' />
    </div>
  );
}
