import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import { BookReader } from '@/components/reader/book-reader';
import { ensureUser } from '@/lib/auth';
import { allowedPages, getBookBySlug, signedPageUrls } from '@/lib/db/books';
import { getProfileForUser } from '@/lib/db/profiles';
import { getActiveProfileId } from '@/lib/profile-cookie';
import { checkLimit } from '@/lib/ratelimit';

type Props = { params: Promise<{ slug: string }>; searchParams: Promise<{ page?: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const book = await getBookBySlug((await params).slug);
  return { title: book ? `Read · ${book.title}` : 'Read' };
}

export default async function ReadPage({ params, searchParams }: Props) {
  const [{ slug }, { page }, hdrs, activeId] = await Promise.all([params, searchParams, headers(), getActiveProfileId()]);
  const [book, user] = await Promise.all([getBookBySlug(slug), ensureUser()]);
  if (!book) notFound();

  const isMember = false; // subscriptions later
  const limit = allowedPages(book, isMember);
  const ip = hdrs.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'anon';

  const [allowed, pages, profile] = await Promise.all([
    checkLimit('reader', user?.id ?? ip),
    signedPageUrls(book.id, limit),
    user && activeId ? getProfileForUser(user.id, activeId) : Promise.resolve(null),
  ]);

  if (!allowed) {
    return <div className='flex min-h-screen items-center justify-center bg-royal-deep p-6 text-center font-heading text-2xl text-white'>Whoa, that's a lot of reading! Take a short break and try again in a minute.</div>;
  }

  const startPage = Math.min(Math.max(1, Number(page) || 1), Math.max(1, pages.length));

  return (
    <BookReader
      book={{ id: book.id, slug: book.slug, title: book.title, seriesName: book.series?.name ?? null, buyLinks: book.buy_links, pageCount: book.page_count }}
      pages={pages}
      startPage={startPage}
      isSample={limit < book.page_count}
      profile={profile ? { id: profile.id, name: profile.name } : null}
      signedIn={Boolean(user)}
    />
  );
}
