import Link from 'next/link';
import { notFound } from 'next/navigation';
import { BookForm } from '@/components/admin/book-form';
import { CoverUploader } from '@/components/admin/cover-uploader';
import { PdfUploader } from '@/components/admin/pdf-uploader';
import { getBookById, listBookPages, listSeries } from '@/lib/db/books';
import { coverUrl, supabaseAdmin } from '@/lib/supabase/admin';
import { deleteBookAction } from '../../actions';

export default async function EditBookPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [book, series, pages] = await Promise.all([getBookById(id), listSeries(), listBookPages(id)]);
  if (!book) notFound();

  const thumbs =
    pages.length > 0
      ? ((await supabaseAdmin().storage.from('pages').createSignedUrls(pages.map((p) => p.storage_path), 600)).data ?? []).flatMap((d, i) =>
          d.signedUrl ? [{ page: pages[i].page_number, url: d.signedUrl }] : [],
        )
      : [];

  return (
    <div className='flex flex-col gap-6'>
      <div className='flex flex-wrap items-center justify-between gap-4'>
        <div>
          <div className='text-[13px] font-bold text-mist'>
            <Link href='/admin' className='text-ocean'>Books</Link> / Edit
          </div>
          <h1 className='text-[28px] font-semibold md:text-[32px]'>{book.title}</h1>
        </div>
        <div className='flex items-center gap-3'>
          <span className={`rounded-full px-3.5 py-2 text-[13px] font-bold ${book.is_listed ? 'bg-[#e6f7ee] text-[#1e7b4b]' : 'bg-[#eef2f7] text-mist'}`}>
            {book.is_listed ? 'Published' : 'Draft'}
          </span>
          <Link href={`/books/${book.slug}`} target='_blank' className='rounded-xl border-2 border-line bg-white px-4 py-2.5 text-[15px] font-bold text-royal'>
            Preview on site
          </Link>
        </div>
      </div>

      <div className='grid items-start gap-6 lg:grid-cols-[1fr_360px]'>
        <div className='flex flex-col gap-6'>
          <PdfUploader bookId={book.id} existing={thumbs} previewPages={book.preview_pages} />
          <BookForm book={book} series={series} />
        </div>
        <div className='flex flex-col gap-6'>
          <CoverUploader bookId={book.id} coverUrl={coverUrl(book.cover_path)} />
          <div className='rounded-[20px] border border-[#e3e9f2] bg-white p-6'>
            <h2 className='mb-2 text-lg font-semibold'>Danger zone</h2>
            <p className='mb-4 text-[13px] font-semibold text-mist'>Deletes the book, its pages and shelf entries. Cannot be undone.</p>
            <form action={deleteBookAction.bind(null, book.id)}>
              <button className='rounded-xl border-2 border-coral px-4 py-2.5 text-[15px] font-bold text-coral hover:bg-coral hover:text-white'>Delete book</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
