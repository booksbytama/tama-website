import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { BookOpen } from 'lucide-react';
import { hasFullAccess, requireUser } from '@/lib/auth';
import { listBooks } from '@/lib/db/books';
import { coverUrl } from '@/lib/supabase/admin';

export const metadata: Metadata = { title: 'Books to review' };

export default async function ReviewPage() {
  await requireUser();
  if (!(await hasFullAccess())) redirect('/account');
  const books = await listBooks({ includeUnlisted: true });

  return (
    <div className='wrapper flex flex-col gap-8 py-10 md:py-16'>
      <header className='flex flex-col gap-3'>
        <span className='eyebrow self-start rounded-full bg-sun px-3.5 py-2 text-royal'>Reviewer access</span>
        <h1 className='text-[36px] font-bold md:text-[52px]'>Books to review</h1>
        <p className='max-w-2xl text-base text-slate md:text-lg'>
          Every book, cover to cover — including ones that aren't public yet. Thank you for reading along; send Tama your thoughts at{' '}
          <a href='mailto:tama@booksbytama.com' className='font-bold text-ocean underline underline-offset-4'>tama@booksbytama.com</a>.
        </p>
      </header>
      <div className='grid grid-cols-2 gap-4 md:grid-cols-4'>
        {books.map((b) => {
          const cover = coverUrl(b.cover_path);
          const ready = b.page_count > 0;
          return (
            <Link key={b.id} href={ready ? `/read/${b.slug}` : '#'} aria-disabled={!ready} className={`card-float flex flex-col gap-2.5 p-3 ${ready ? '' : 'opacity-60'}`}>
              <div className='relative overflow-hidden rounded-2xl bg-foam'>
                {cover && <Image src={cover} alt={b.title} width={400} height={400} className='aspect-square w-full object-cover' />}
                {!b.is_listed && <span className='absolute left-2 top-2 rounded-full bg-royal px-2.5 py-1 text-[11px] font-bold text-white'>Draft</span>}
              </div>
              <div className='font-heading text-base font-semibold text-royal'>{b.title}</div>
              <div className='flex items-center gap-1.5 text-xs font-bold text-mist'>
                <BookOpen className='size-3.5' /> {ready ? `${b.page_count} pages${b.read_aloud_enabled ? ' · read-aloud' : ''}` : 'Pages not uploaded yet'}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
