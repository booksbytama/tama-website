'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Lock, Maximize2, Minimize2, X } from 'lucide-react';
import { saveProgressAction } from '@/app/(marketing)/account/actions';
import type { BuyLink } from '@/lib/db/types';

type Page = { page_number: number; url: string; width: number | null; height: number | null };

type Props = {
  book: { id: string; slug: string; title: string; seriesName: string | null; buyLinks: BuyLink[]; pageCount: number };
  pages: Page[];
  startPage: number;
  isSample: boolean;
  memberFullBook: boolean;
  profile: { id: string; name: string } | null;
  signedIn: boolean;
};

const TURN_MS = 900;
const COMPLETE_AT = 0.35; // fraction of a page width dragged before a release completes the turn

export function BookReader({ book, pages, startPage, isSample, memberFullBook, profile, signedIn }: Props) {
  const total = pages.length;
  const [twoUp, setTwoUp] = useState(false);
  const [current, setCurrent] = useState(startPage);
  const [showGate, setShowGate] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [saved, setSaved] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [moving, setMoving] = useState<number | null>(null);
  const [dragAngle, setDragAngle] = useState<{ k: number; deg: number } | null>(null);
  const [zoom, setZoom] = useState({ s: 1, x: 0, y: 0 });
  const zoomed = zoom.s > 1.02;
  const rootRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const [stage, setStage] = useState({ w: 0, h: 0 });
  const busy = moving !== null;

  // Sheet model. Two-up: sheet k carries page 2k+1 on its front (right-hand) and 2k+2 on its back (left-hand).
  // Single: one page per sheet. `turned` = sheets folded over to the left.
  const maxTurned = twoUp ? Math.floor(total / 2) : Math.max(0, total - 1);
  const turned = Math.min(maxTurned, twoUp ? Math.floor(current / 2) : current - 1);
  const sheetCount = twoUp ? Math.ceil(total / 2) : total;
  const pageFor = (t: number) => (twoUp ? (t === 0 ? 1 : Math.min(2 * t + 1, total)) : t + 1);
  const leftPage = twoUp && turned > 0 ? 2 * turned : null;
  const rightPage = twoUp ? (2 * turned + 1 <= total ? 2 * turned + 1 : null) : current;

  useEffect(() => {
    const mq = window.matchMedia('(orientation: landscape) and (min-width: 640px)');
    const apply = () => setTwoUp(mq.matches);
    apply();
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, []);

  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setStage({ w: e.contentRect.width, h: e.contentRect.height }));
    ro.observe(el);
    return () => ro.disconnect();
  }, [total]);

  const turnTo = useCallback(
    (t: number, sheet: number) => {
      setZoom({ s: 1, x: 0, y: 0 });
      setMoving(sheet);
      setCurrent(pageFor(t));
      setTimeout(() => setMoving(null), TURN_MS + 50);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [twoUp, total],
  );

  const go = useCallback(
    (dir: 1 | -1) => {
      if (busy) return;
      setShowGate(false);
      if (dir === 1) {
        if (turned >= maxTurned) {
          setShowGate(true);
          return;
        }
        turnTo(turned + 1, turned);
      } else if (turned > 0) {
        turnTo(turned - 1, turned - 1);
      }
    },
    [busy, turned, maxTurned, turnTo],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        go(1);
      }
      if (e.key === 'ArrowLeft') go(-1);
      if (e.key === 'Escape') setShowGate(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [go]);

  useEffect(() => {
    if (!profile) return;
    setSaved('saving');
    const t = setTimeout(() => {
      saveProgressAction(profile.id, book.id, current).then(() => setSaved('saved')).catch(() => setSaved('idle'));
    }, 800);
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

  // Fetch AND decode the pages around the current one so a turn paints instantly.
  const decoded = useRef(new Set<number>());
  useEffect(() => {
    for (const n of [current - 3, current - 2, current - 1, current + 1, current + 2, current + 3, current + 4]) {
      const p = pages.find((x) => x.page_number === n);
      if (!p || decoded.current.has(n)) continue;
      decoded.current.add(n);
      const img = new window.Image();
      img.src = p.url;
      img.decode().catch(() => decoded.current.delete(n));
    }
  }, [current, pages]);

  // Book box from the stage: pages share the first page's aspect ratio.
  const p0 = pages[0] as Page | undefined;
  const ratio = p0?.width && p0?.height ? p0.width / p0.height : 1;
  const pageH = Math.min(stage.h, (twoUp ? stage.w / 2 : stage.w) / ratio);
  const bookW = (twoUp ? 2 : 1) * pageH * ratio;

  // Tap / swipe / drag-the-corner / pinch-zoom, all through pointer events on the book.
  const drag = useRef<{ k: number; forward: boolean; startX: number; startT: number; width: number; moved: boolean } | null>(null);
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const pinch = useRef<{ dist: number; mid: { x: number; y: number }; s: number; x: number; y: number } | null>(null);
  const pan = useRef<{ x: number; y: number; zx: number; zy: number } | null>(null);
  const lastTap = useRef<{ t: number; x: number; y: number } | null>(null);

  const clampZoom = (z: { s: number; x: number; y: number }, w: number, h: number) => {
    const s = Math.max(1, Math.min(3.5, z.s));
    const mx = ((s - 1) * w) / 2;
    const my = ((s - 1) * h) / 2;
    return { s, x: Math.max(-mx, Math.min(mx, z.x)), y: Math.max(-my, Math.min(my, z.y)) };
  };
  // Zoom about a screen point (px relative to the box's untransformed centre).
  const zoomAbout = (nextS: number, px: number, py: number, rect: DOMRect) => {
    setZoom((z) => {
      const q = { x: (px - z.x) / z.s, y: (py - z.y) / z.s };
      return clampZoom({ s: nextS, x: px - nextS * q.x, y: py - nextS * q.y }, rect.width, rect.height);
    });
  };
  // The box is centred in the stage, so its untransformed rect is derivable even while scaled.
  const boxRect = (): DOMRect => {
    const r = stageRef.current!.getBoundingClientRect();
    return new DOMRect(r.left + (r.width - bookW) / 2, r.top + (r.height - pageH) / 2, bookW, pageH);
  };
  const rel = (e: { clientX: number; clientY: number }, rect: DOMRect) => ({ x: e.clientX - rect.left - rect.width / 2, y: e.clientY - rect.top - rect.height / 2 });

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (showGate) return;
    const rect = boxRect();
    e.currentTarget.setPointerCapture(e.pointerId);
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

    if (pointers.current.size === 2) {
      // Second finger: start a pinch, abandon any page drag.
      drag.current = null;
      pan.current = null;
      setDragAngle(null);
      const [a, b] = [...pointers.current.values()];
      const mid = rel({ clientX: (a.x + b.x) / 2, clientY: (a.y + b.y) / 2 }, rect);
      pinch.current = { dist: Math.hypot(a.x - b.x, a.y - b.y), mid, s: zoom.s, x: zoom.x, y: zoom.y };
      return;
    }
    if (pointers.current.size > 2) return;

    if (zoomed) {
      pan.current = { x: e.clientX, y: e.clientY, zx: zoom.x, zy: zoom.y };
      return;
    }
    if (busy || e.button !== 0) return;
    const onRight = e.clientX > rect.left + rect.width / 2;
    const k = onRight ? turned : turned - 1;
    if (k < 0 || k >= sheetCount) {
      drag.current = { k: -1, forward: onRight, startX: e.clientX, startT: Date.now(), width: rect.width, moved: false };
      return;
    }
    drag.current = { k, forward: onRight, startX: e.clientX, startT: Date.now(), width: twoUp ? rect.width / 2 : rect.width, moved: false };
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!pointers.current.has(e.pointerId)) return;
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    const rect = boxRect();

    if (pinch.current && pointers.current.size >= 2) {
      const [a, b] = [...pointers.current.values()];
      const dist = Math.hypot(a.x - b.x, a.y - b.y);
      const mid = rel({ clientX: (a.x + b.x) / 2, clientY: (a.y + b.y) / 2 }, rect);
      const p0 = pinch.current;
      const s = Math.max(1, Math.min(3.5, (p0.s * dist) / p0.dist));
      const q = { x: (p0.mid.x - p0.x) / p0.s, y: (p0.mid.y - p0.y) / p0.s };
      setZoom(clampZoom({ s, x: mid.x - s * q.x, y: mid.y - s * q.y }, rect.width, rect.height));
      return;
    }
    if (pan.current) {
      const p0 = pan.current;
      setZoom((z) => clampZoom({ s: z.s, x: p0.zx + (e.clientX - p0.x), y: p0.zy + (e.clientY - p0.y) }, rect.width, rect.height));
      return;
    }
    const d = drag.current;
    if (!d || d.k < 0) return;
    const dx = e.clientX - d.startX;
    if (Math.abs(dx) > 6) d.moved = true;
    if (!d.moved) return;
    const base = d.forward ? 0 : -180;
    const deg = Math.max(-180, Math.min(0, base + Math.max(-180, Math.min(180, (-dx / d.width) * 180))));
    setDragAngle({ k: d.k, deg });
  };

  const onPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = boxRect();
    pointers.current.delete(e.pointerId);
    if (pinch.current) {
      if (pointers.current.size < 2) {
        pinch.current = null;
        const rest = [...pointers.current.values()][0];
        if (rest) pan.current = { x: rest.x, y: rest.y, zx: zoom.x, zy: zoom.y };
      }
      return;
    }
    if (pan.current) {
      const moved = Math.hypot(e.clientX - pan.current.x, e.clientY - pan.current.y) > 6;
      pan.current = null;
      if (!moved) handleTap(e, rect);
      return;
    }
    const d = drag.current;
    if (!d) return;
    drag.current = null;
    setDragAngle(null);
    if (!d.moved && handleTap(e, rect)) return;
    if (d.k < 0) {
      if (!d.moved && d.forward && turned >= maxTurned) setShowGate(true);
      return;
    }
    const dx = e.clientX - d.startX;
    const progress = Math.abs(dx) / d.width;
    const flick = Date.now() - d.startT < 300 && Math.abs(dx) > 40;
    const rightWay = d.forward ? dx <= 0 : dx >= 0;
    const complete = !d.moved || (rightWay && (progress > COMPLETE_AT || flick));
    if (!complete) {
      setMoving(d.k);
      setTimeout(() => setMoving(null), TURN_MS + 50);
      return;
    }
    if (d.forward) turnTo(turned + 1, turned);
    else turnTo(turned - 1, turned - 1);
  };

  // Double-tap toggles zoom; returns true when it consumed the tap.
  const handleTap = (e: { clientX: number; clientY: number }, rect: DOMRect): boolean => {
    const now = Date.now();
    const prev = lastTap.current;
    lastTap.current = { t: now, x: e.clientX, y: e.clientY };
    if (prev && now - prev.t < 320 && Math.hypot(e.clientX - prev.x, e.clientY - prev.y) < 30) {
      lastTap.current = null;
      const p = rel(e, rect);
      if (zoomed) setZoom({ s: 1, x: 0, y: 0 });
      else zoomAbout(2.5, p.x, p.y, rect);
      return true;
    }
    return false;
  };

  // Trackpad pinch (ctrl+wheel) zooms; a plain wheel pans while zoomed.
  const onWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    const rect = boxRect();
    if (e.ctrlKey) {
      e.preventDefault();
      const p = rel(e, rect);
      zoomAbout(zoom.s * Math.exp(-e.deltaY / 200), p.x, p.y, rect);
    } else if (zoomed) {
      e.preventDefault();
      setZoom((z) => clampZoom({ s: z.s, x: z.x - e.deltaX, y: z.y - e.deltaY }, rect.width, rect.height));
    }
  };

  if (total === 0) {
    return (
      <div className='flex min-h-screen flex-col items-center justify-center gap-4 bg-royal-deep p-6 text-center text-white'>
        <div className='font-heading text-3xl'>No sample yet for {book.title}</div>
        <Link href={`/books/${book.slug}`} className='btn-sun btn-md font-body font-bold'>Back to the book</Link>
      </div>
    );
  }

  const visible = (k: number) => k >= turned - 2 && k <= turned + 2;
  const label = twoUp
    ? leftPage && rightPage
      ? `Pages ${leftPage}–${rightPage}`
      : `Page ${leftPage ?? rightPage}`
    : `Page ${current}`;

  return (
    <div ref={rootRef} className='relative flex h-dvh flex-col overflow-hidden bg-gradient-to-b from-royal-deep to-[#1479c4] text-white select-none'>
      <Bubbles />

      <header className='relative z-10 flex shrink-0 items-center justify-between px-4 py-2 md:px-8 md:py-5 [@media(max-height:520px)]:py-1.5'>
        <div className='flex items-center gap-3'>
          <Link href={`/books/${book.slug}`} aria-label='Close reader' className='flex size-11 items-center justify-center rounded-full bg-white/15 hover:bg-white/25'>
            <X className='size-[22px]' strokeWidth={2.4} />
          </Link>
          <div className='flex flex-col'>
            <div className='font-heading text-base font-semibold leading-tight md:text-xl'>{book.title}</div>
            <div className='text-xs font-semibold text-[#9fc4e8] md:text-[13px] [@media(max-height:520px)]:hidden'>
              {book.seriesName ? `${book.seriesName} · ` : ''}
              {isSample ? 'Free sample' : 'Full book'}
              {profile ? ` · ${profile.name}'s shelf` : ''}
            </div>
          </div>
        </div>
        <div className='flex items-center gap-2 md:gap-3'>
          {zoomed && (
            <button onClick={() => setZoom({ s: 1, x: 0, y: 0 })} className='rounded-full bg-sun px-3.5 py-2 text-[13px] font-bold text-royal md:text-sm'>
              {Math.round(zoom.s * 10) / 10}× · reset
            </button>
          )}
          <div className='rounded-full bg-white/15 px-3.5 py-2 text-[13px] font-bold tabular-nums md:text-sm'>
            {label} of {total}
          </div>
          <button onClick={toggleFullscreen} aria-label='Toggle fullscreen' className='hidden size-11 items-center justify-center rounded-full bg-white/15 hover:bg-white/25 md:flex'>
            {fullscreen ? <Minimize2 className='size-[22px]' /> : <Maximize2 className='size-[22px]' />}
          </button>
        </div>
      </header>

      <div className='relative z-10 flex min-h-0 flex-1 items-center justify-center gap-2 px-2 py-2 md:gap-7 md:px-8 md:py-3'>
        <NavButton dir={-1} disabled={turned === 0} onClick={() => go(-1)} />
        <div ref={stageRef} className='relative flex h-full min-w-0 flex-1 items-center justify-center overflow-visible'>
          {stage.w > 0 && (
            <div
              className={`relative touch-none [perspective:2600px] drop-shadow-[0_30px_50px_rgba(0,0,0,0.45)] ${pinch.current || pan.current ? '' : 'transition-transform duration-200 ease-out motion-reduce:transition-none'}`}
              style={{ width: bookW, height: pageH, transform: `translate(${zoom.x}px, ${zoom.y}px) scale(${zoom.s})`, transformOrigin: 'center' }}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onPointerCancel={onPointerUp}
              onWheel={onWheel}
            >
              {twoUp && <div className='pointer-events-none absolute left-1/2 top-0 z-[5] h-full w-10 -translate-x-1/2 bg-[linear-gradient(90deg,rgba(0,0,0,0)_0%,rgba(0,0,0,.14)_48%,rgba(0,0,0,.2)_50%,rgba(0,0,0,.14)_52%,rgba(0,0,0,0)_100%)]' />}
              {Array.from({ length: sheetCount }, (_, k) => k)
                .filter(visible)
                .map((k) => {
                  const front = pages[twoUp ? 2 * k : k];
                  const back = twoUp ? pages[2 * k + 1] : undefined;
                  const flipped = k < turned;
                  const isMoving = moving === k || dragAngle?.k === k;
                  const dragging = dragAngle?.k === k;
                  const hiddenSingle = !twoUp && flipped && !isMoving;
                  return (
                    <div
                      key={k}
                      className={`absolute top-0 h-full origin-left [transform-style:preserve-3d] will-change-transform ${twoUp ? 'left-1/2 w-1/2' : 'left-0 w-full'} ${dragging ? '' : 'transition-transform duration-[900ms] ease-[cubic-bezier(.2,.75,.25,1)] motion-reduce:transition-none'} ${hiddenSingle ? 'invisible' : ''} ${busy ? 'cursor-default' : 'cursor-grab active:cursor-grabbing'}`}
                      style={{
                        zIndex: isMoving ? 30 : flipped ? 1 + k : 10 + (sheetCount - k),
                        transform: dragging ? `rotateY(${dragAngle.deg}deg)` : flipped ? 'rotateY(-180deg)' : 'rotateY(0deg)',
                      }}
                    >
                      <Face page={front} title={book.title} side='front' shaded={isMoving} rounded={twoUp ? 'rounded-r-[14px] rounded-l-[3px]' : 'rounded-[14px]'} />
                      <Face page={back} title={book.title} side='back' shaded={isMoving} rounded={twoUp ? 'rounded-l-[14px] rounded-r-[3px]' : 'rounded-[14px]'} />
                    </div>
                  );
                })}
            </div>
          )}
        </div>
        <NavButton dir={1} disabled={false} onClick={() => go(1)} />
      </div>

      {showGate && (
        <EndGate book={book} isSample={isSample} memberFullBook={memberFullBook} signedIn={signedIn} profile={profile} saved={saved} onClose={() => setShowGate(false)} />
      )}

      <footer className='relative z-10 flex shrink-0 items-center justify-center gap-2 px-4 pb-3 pt-1 md:pb-6 md:pt-2 [@media(max-height:520px)]:pb-1.5 [@media(max-height:520px)]:pt-0'>
        <div className='flex max-w-full gap-1.5 overflow-x-auto px-2 py-1'>
          {pages.map((p) => (
            <button
              key={p.page_number}
              onClick={() => {
                if (busy) return;
                setShowGate(false);
                setCurrent(p.page_number);
              }}
              aria-label={`Go to page ${p.page_number}`}
              className={`size-2.5 shrink-0 rounded-full transition-colors md:size-3 ${p.page_number === leftPage || p.page_number === rightPage ? 'bg-sun' : 'bg-white/35 hover:bg-white/60'}`}
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

function Face({ page, title, side, shaded, rounded }: { page?: Page; title: string; side: 'front' | 'back'; shaded: boolean; rounded: string }) {
  return (
    <div
      className={`absolute inset-0 overflow-hidden bg-[#f7fbff] [backface-visibility:hidden] ${rounded}`}
      style={side === 'back' ? { transform: 'rotateY(180deg)' } : undefined}
    >
      {page && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={page.url} alt={`${title} page ${page.page_number}`} draggable={false} className='size-full object-contain' />
      )}
      <div
        className={`pointer-events-none absolute inset-0 transition-opacity duration-300 ${shaded ? 'opacity-100' : 'opacity-0'} ${
          side === 'front'
            ? 'bg-[linear-gradient(90deg,rgba(0,0,0,.35)_0%,rgba(0,0,0,0)_30%,rgba(255,255,255,.18)_55%,rgba(0,0,0,.28)_100%)]'
            : 'bg-[linear-gradient(270deg,rgba(0,0,0,.35)_0%,rgba(0,0,0,0)_30%,rgba(255,255,255,.18)_55%,rgba(0,0,0,.28)_100%)]'
        }`}
      />
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

function EndGate({
  book,
  isSample,
  memberFullBook,
  signedIn,
  profile,
  saved,
  onClose,
}: {
  book: Props['book'];
  isSample: boolean;
  memberFullBook: boolean;
  signedIn: boolean;
  profile: Props['profile'];
  saved: 'idle' | 'saving' | 'saved';
  onClose: () => void;
}) {
  const joinToRead = isSample && memberFullBook && !signedIn;
  return (
    <div className='absolute inset-0 z-20 flex items-center justify-center bg-royal-deep/70 p-4 backdrop-blur-sm' onClick={onClose}>
      <div
        className='flex max-h-full w-full max-w-md flex-col items-center gap-3 overflow-y-auto rounded-[28px] bg-sand p-5 text-center text-ink shadow-2xl md:gap-4 md:p-9'
        onClick={(e) => e.stopPropagation()}
      >
        <Image src='/assets/images/StarfishGroup.png' alt='' width={220} height={130} className='w-32 md:w-52 [@media(max-height:520px)]:hidden' />
        <div className='font-heading text-xl font-semibold text-royal md:text-[28px]'>
          {!isSample ? 'The End!' : joinToRead ? 'Want to keep reading?' : "That's the end of the free sample!"}
        </div>
        <p className='text-sm font-semibold text-slate md:text-[15px]'>
          {!isSample
            ? 'Loved it? The paperback makes a great bedtime read — and the next adventure is waiting.'
            : joinToRead
              ? 'Join free and read the whole book right here. No card needed.'
              : 'Get the paperback to find out where the map leads.'}
        </p>
        {joinToRead && (
          <Link href='/sign-up' className='btn-primary btn-md w-full'>
            Join free &amp; read the whole book
          </Link>
        )}
        <div className='flex w-full flex-wrap justify-center gap-2'>
          {book.buyLinks.map((l) => (
            <a key={l.url} href={l.url} target='_blank' rel='noopener noreferrer' className={`${joinToRead ? 'btn-outline' : 'btn-cta'} btn-sm font-body font-bold`}>
              {l.label}
            </a>
          ))}
        </div>
        {!isSample && (
          <Link href='/books' className='text-[13px] font-bold text-ocean underline underline-offset-2'>See the next book</Link>
        )}
        {!signedIn ? (
          !joinToRead && (
            <p className='text-[13px] font-semibold text-mist'>
              <Link href='/sign-up' className='text-ocean underline underline-offset-2'>Join free</Link> to save books to a shelf and get the starter pack.
            </p>
          )
        ) : profile ? (
          <p className='text-[13px] font-semibold text-mist'>
            {saved === 'saved' ? `On ${profile.name}'s shelf` : saved === 'saving' ? `Saving to ${profile.name}'s shelf…` : `Couldn't save to ${profile.name}'s shelf`}
          </p>
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
