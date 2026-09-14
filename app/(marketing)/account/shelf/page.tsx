import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { ProfileAvatar } from '@/components/account/profile-avatar';
import { requireUser } from '@/lib/auth';
import { listBooks } from '@/lib/db/books';
import { getProfileForUser, listShelf } from '@/lib/db/profiles';
import { getActiveProfileId } from '@/lib/profile-cookie';
import { coverUrl } from '@/lib/supabase/admin';

export const metadata: Metadata = { title: 'My shelf' };

export default async function ShelfPage() {
  const user = await requireUser();
  const activeId = await getActiveProfileId();
  const profile = activeId ? await getProfileForUser(user.id, activeId) : null;
  if (!profile) redirect('/account');
  const [shelf, all] = await Promise.all([listShelf(profile.id), listBooks()]);
  const onShelf = new Set(shelf.map((s) => s.book.id));
  const more = all.filter((b) => !onShelf.has(b.id) && b.sample_enabled && b.page_count > 0);

  return (
    <div className='wrapper flex flex-col gap-10 py-8 md:py-14'>
      <header className='flex items-center gap-4'>
        <ProfileAvatar colour={profile.colour} size={64} />
        <div className='flex flex-col'>
          <h1 className='text-[32px] font-bold md:text-[44px]'>{profile.name}'s shelf</h1>
          <Link href='/account' className='text-sm font-bold text-ocean hover:text-royal'>Switch reader</Link>
        </div>
      </header>

      <section className='flex flex-col gap-4'>
        <h2 className='text-2xl font-semibold'>Keep reading</h2>
        {shelf.length === 0 ? (
          <p className='rounded-2xl border-2 border-dashed border-line p-6 text-center font-semibold text-mist'>Nothing here yet — open any sample below and it lands on this shelf.</p>
        ) : (
          <div className='grid grid-cols-2 gap-4 md:grid-cols-4'>
            {shelf.map(({ book, last_page }) => {
              const cover = coverUrl(book.cover_path);
              return (
                <Link key={book.id} href={`/read/${book.slug}?page=${last_page}`} className='card-float flex flex-col gap-2 p-3'>
                  {cover && <Image src={cover} alt={book.title} width={400} height={400} className='aspect-square w-full rounded-2xl object-cover' />}
                  <div className='font-heading text-base font-semibold text-royal'>{book.title}</div>
                  <div className='text-xs font-bold text-mist'>Page {last_page}</div>
                </Link>
              );
            })}
          </div>
        )}
      </section>

      {more.length > 0 && (
        <section className='flex flex-col gap-4'>
          <h2 className='text-2xl font-semibold'>Try a free sample</h2>
          <div className='grid grid-cols-2 gap-4 md:grid-cols-4'>
            {more.map((book) => {
              const cover = coverUrl(book.cover_path);
              return (
                <Link key={book.id} href={`/read/${book.slug}`} className='card-float flex flex-col gap-2 p-3'>
                  {cover && <Image src={cover} alt={book.title} width={400} height={400} className='aspect-square w-full rounded-2xl object-cover' />}
                  <div className='font-heading text-base font-semibold text-royal'>{book.title}</div>
                </Link>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
