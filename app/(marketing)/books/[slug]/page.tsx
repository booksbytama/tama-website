import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { BookOpen } from 'lucide-react';
import { BuyLinks } from '@/components/books/buy-links';
import { getBookBySlug, listBooks, listBooksInSeries } from '@/lib/db/books';
import { coverUrl } from '@/lib/supabase/admin';

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return (await listBooks()).map((b) => ({ slug: b.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const book = await getBookBySlug(slug);
  if (!book) return {};
  const cover = coverUrl(book.cover_path);
  return {
    title: book.title,
    description: book.short_description ?? book.description ?? undefined,
    openGraph: cover ? { images: [cover] } : undefined,
  };
}

export default async function BookPage({ params }: Props) {
  const { slug } = await params;
  const book = await getBookBySlug(slug);
  if (!book) notFound();
  const siblings = book.series_id ? (await listBooksInSeries(book.series_id)).filter((b) => b.id !== book.id) : [];
  const cover = coverUrl(book.cover_path);
  const samplePages = book.sample_enabled ? Math.min(book.preview_pages, book.page_count) : 0;
  const ages = book.ages_text?.split('★').map((s) => s.trim()) ?? [];

  return (
    <div className='wrapper flex flex-col gap-10 py-6 md:py-10'>
      <nav className='flex flex-wrap gap-2 text-sm font-semibold text-mist'>
        <Link href='/books' className='hover:text-ocean'>Books</Link>
        {book.series && (
          <>
            <span>/</span>
            <Link href='/books' className='hover:text-ocean'>{book.series.name}</Link>
          </>
        )}
        <span>/</span>
        <span className='text-ink'>{book.series_order ? `Book ${book.series_order}` : book.title}</span>
      </nav>

      <div className='grid gap-8 md:grid-cols-[420px_1fr] md:gap-14'>
        <div className='flex flex-col gap-4'>
          <div className='overflow-hidden rounded-[28px] bg-foam shadow-[0_20px_40px_rgba(27,42,107,0.22)]'>
            {cover && <Image src={cover} alt={book.title} width={840} height={840} priority className='aspect-square w-full object-cover' />}
          </div>
          {samplePages > 0 ? (
            <Link href={`/read/${book.slug}`} className='btn-primary btn-lg w-full'>
              <BookOpen className='size-[22px]' strokeWidth={2.2} /> Read the free sample · {samplePages} pages
            </Link>
          ) : (
            <div className='rounded-full border-2 border-dashed border-line py-4 text-center text-sm font-bold text-mist'>Sample coming soon</div>
          )}
          <BuyLinks links={book.buy_links} />
          <div className='text-center text-[13px] font-semibold text-mist'>Paperback · Printed on demand, ships worldwide</div>
        </div>

        <div className='flex flex-col gap-5'>
          <div className='flex flex-wrap gap-2.5'>
            {book.series && (
              <span className='eyebrow rounded-full bg-[#fff1db] px-3.5 py-2 text-[#b85e00]'>
                {book.series.name}
                {book.series_order ? ` · Book ${book.series_order}` : ''}
              </span>
            )}
            {ages[0] && <span className='eyebrow rounded-full bg-foam px-3.5 py-2 text-ocean'>{book.book_type === 'picture' ? 'Ages 4–10' : ages[0]}</span>}
          </div>
          <h1 className='text-[40px] font-bold leading-[1.05] md:text-[56px]'>{book.title}</h1>
          {book.short_description && book.short_description !== book.title && (
            <p className='text-lg font-semibold text-slate'>{book.short_description}</p>
          )}
          {book.description?.split(/\n\n+/).map((para, i) => (
            <p key={i} className={`leading-relaxed text-slate ${i === 0 ? 'text-lg md:text-[19px]' : 'text-base md:text-[17px]'}`}>
              {para}
            </p>
          ))}

          {book.book_type === 'picture' && (
            <dl className='flex flex-wrap gap-x-8 gap-y-3 rounded-[20px] border-2 border-sand-deep bg-white px-6 py-5'>
              {ages.map((a) => {
                const [label, value] = a.split(/\s(?=\d)/);
                return (
                  <div key={a} className='flex flex-col gap-0.5'>
                    <dt className='eyebrow text-mist'>{label}</dt>
                    <dd className='font-heading text-xl text-royal'>{value ? `${value} yrs` : ''}</dd>
                  </div>
                );
              })}
              {book.page_count > 0 && (
                <div className='flex flex-col gap-0.5'>
                  <dt className='eyebrow text-mist'>Pages</dt>
                  <dd className='font-heading text-xl text-royal'>{book.page_count}</dd>
                </div>
              )}
            </dl>
          )}

          {siblings.length > 0 && (
            <div className='mt-2 flex flex-col gap-3'>
              <div className='text-[15px] font-bold text-royal'>More in this series</div>
              <div className='flex flex-wrap gap-3'>
                {siblings.map((s) => {
                  const c = coverUrl(s.cover_path);
                  return (
                    <Link key={s.id} href={`/books/${s.slug}`} title={s.title} className='overflow-hidden rounded-[14px] bg-foam'>
                      {c && <Image src={c} alt={s.title} width={192} height={192} className='size-24 object-cover transition-transform hover:scale-105' />}
                    </Link>
                  );
                })}
                {book.series?.slug === 'starfish-super-squad' && (
                  <div className='flex size-24 items-center justify-center rounded-[14px] border-2 border-dashed border-line text-center text-xs font-bold text-mist'>
                    Book {siblings.length + 2}
                    <br />
                    coming
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Cached at the edge; admin saves call revalidatePath.
export const revalidate = 300;
