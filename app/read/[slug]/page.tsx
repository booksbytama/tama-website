import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { BookReader } from '@/components/reader/book-reader';
import { ensureUser } from '@/lib/auth';
import { allowedPages, getBookBySlug, signedPageUrls } from '@/lib/db/books';
import { getProfileForUser } from '@/lib/db/profiles';
import { getActiveProfileId } from '@/lib/profile-cookie';
import { checkLimit } from '@/lib/ratelimit';
import { headers } from 'next/headers';

type Props = { params: Promise<{ slug: string }>; searchParams: Promise<{ page?: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const book = await getBookBySlug((await params).slug);
  return { title: book ? `Read · ${book.title}` : 'Read' };
}

export default async function ReadPage({ params, searchParams }: Props) {
  const [{ slug }, { page }] = await Promise.all([params, searchParams]);
  const book = await getBookBySlug(slug);
  if (!book) notFound();

  const user = await ensureUser();
  const ip = (await headers()).get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'anon';
  if (!(await checkLimit('reader', user?.id ?? ip))) {
    return <div className='flex min-h-screen items-center justify-center bg-royal-deep p-6 text-center font-heading text-2xl text-white'>Whoa, that's a lot of reading! Take a short break and try again in a minute.</div>;
  }

  const isMember = false; // subscriptions later
  const limit = allowedPages(book, isMember);
  const pages = await signedPageUrls(book.id, limit);
  const activeId = user ? await getActiveProfileId() : null;
  const profile = user && activeId ? await getProfileForUser(user.id, activeId) : null;
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
