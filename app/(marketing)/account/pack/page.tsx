import type { Metadata } from 'next';
import Link from 'next/link';
import { Download, FileText } from 'lucide-react';
import { requireUser } from '@/lib/auth';
import { listDownloads } from '@/lib/db/downloads';

export const metadata: Metadata = { title: 'Coral Cove Starter Pack' };

export default async function PackPage({ searchParams }: { searchParams: Promise<{ welcome?: string }> }) {
  await requireUser();
  const { welcome } = await searchParams;
  const items = await listDownloads();

  return (
    <div className='wrapper flex max-w-3xl flex-col gap-8 py-10 md:py-16'>
      <header className='flex flex-col gap-3'>
        <span className='eyebrow self-start rounded-full bg-sun px-3.5 py-2 text-royal'>{welcome ? 'Welcome aboard' : 'Free for members'}</span>
        <h1 className='text-[36px] font-bold md:text-[52px]'>Your Coral Cove Starter Pack</h1>
        <p className='text-base text-slate md:text-lg'>
          {welcome
            ? 'Thanks for joining! Grab your printables below, then add a reader profile for each of your kids.'
            : 'Printables for the whole family. Links are private to your account.'}
        </p>
      </header>

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
