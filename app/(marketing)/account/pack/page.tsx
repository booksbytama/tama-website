import type { Metadata } from 'next';
import Link from 'next/link';
import { Download, FileText } from 'lucide-react';
import Image from 'next/image';
import { BookOpen } from 'lucide-react';
import { requireUser } from '@/lib/auth';
import { getFreeMemberBook } from '@/lib/db/books';
import { listDownloads } from '@/lib/db/downloads';
import { coverUrl } from '@/lib/supabase/admin';

export const metadata: Metadata = { title: 'Coral Cove Starter Pack' };

export default async function PackPage({ searchParams }: { searchParams: Promise<{ welcome?: string }> }) {
  await requireUser();
  const { welcome } = await searchParams;
  const [items, freeBook] = await Promise.all([listDownloads(), getFreeMemberBook()]);
  const freeCover = coverUrl(freeBook?.cover_path);

  return (
    <div className='wrapper flex max-w-3xl flex-col gap-8 py-10 md:py-16'>
      <header className='flex flex-col gap-3'>
        <span className='eyebrow self-start rounded-full bg-sun px-3.5 py-2 text-royal'>{welcome ? 'Welcome aboard' : 'Free for members'}</span>
        <h1 className='text-[36px] font-bold md:text-[52px]'>{welcome ? "You're in! Here's your welcome pack" : 'Your Coral Cove Starter Pack'}</h1>
        <p className='text-base text-slate md:text-lg'>
          {welcome
            ? 'Thanks for joining! Start reading, grab your printables, then add a reader profile for each of your kids.'
            : 'Printables for the whole family. Links are private to your account.'}
        </p>
      </header>

      {freeBook && (
        <Link href={`/read/${freeBook.slug}`} className='card-float flex items-center gap-5 p-4 transition-transform hover:-translate-y-0.5 md:p-5'>
          {freeCover && <Image src={freeCover} alt='' width={220} height={220} className='size-24 shrink-0 rounded-2xl object-cover md:size-[110px]' />}
          <div className='flex flex-1 flex-col gap-1'>
            <span className='eyebrow text-[#d97a00]'>Free to read · members only</span>
            <span className='font-heading text-xl font-semibold text-royal md:text-2xl'>
              {freeBook.series?.name}
              {freeBook.series_order ? ` · Book ${freeBook.series_order}` : ''}: {freeBook.title}
            </span>
            <span className='text-sm font-semibold text-mist'>The whole book, cover to cover, right here. {freeBook.page_count} pages.</span>
          </div>
          <span className='btn-primary btn-md hidden shrink-0 md:inline-flex'>
            <BookOpen className='size-5' strokeWidth={2.2} /> Read now
          </span>
        </Link>
      )}

      {items.length === 0 ? (
        <p className='rounded-2xl border-2 border-dashed border-line p-6 text-center font-semibold text-mist'>The pack is being put together — check back soon.</p>
      ) : (
        <ul className='flex flex-col gap-3'>
          {items.map((d) => (
            <li key={d.id} className='flex items-center gap-4 rounded-2xl border-2 border-sand-deep bg-white p-4'>
              <div className='flex size-12 shrink-0 items-center justify-center rounded-xl bg-foam text-ocean'>
                <FileText className='size-6' />
              </div>
              <div className='flex-1'>
                <div className='font-heading text-lg font-semibold text-royal'>{d.title}</div>
                {d.description && <div className='text-sm font-semibold text-mist'>{d.description}</div>}
              </div>
              <a href={`/api/downloads/${d.slug}`} className='btn-primary btn-sm font-body font-bold shadow-none'>
                <Download className='size-4' strokeWidth={2.4} /> Download
              </a>
            </li>
          ))}
        </ul>
      )}

      <div className='flex flex-col gap-3 rounded-[2rem] bg-royal p-6 text-white md:flex-row md:items-center md:justify-between md:p-8'>
        <div>
          <div className='font-heading text-xl font-semibold'>Next: set up your readers</div>
          <div className='text-sm font-semibold text-[#c9ddf2]'>A starfish for each child so samples land on their own shelf.</div>
        </div>
        <Link href='/account/profiles/new' className='btn-sun btn-md font-body font-bold'>Add a reader</Link>
      </div>
    </div>
  );
}
