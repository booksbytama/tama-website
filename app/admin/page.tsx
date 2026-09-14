import Image from 'next/image';
import Link from 'next/link';
import { listBooks } from '@/lib/db/books';
import { coverUrl } from '@/lib/supabase/admin';
import { createBookAction } from './actions';

export default async function AdminBooksPage() {
  const books = await listBooks({ includeUnlisted: true });
  return (
    <div className='flex flex-col gap-6'>
      <div className='flex items-center justify-between'>
        <h1 className='text-[32px] font-semibold'>Books</h1>
        <form action={createBookAction}>
          <button className='rounded-xl bg-ocean px-5 py-3 text-[15px] font-bold text-white hover:bg-royal'>New book</button>
        </form>
      </div>
      <div className='overflow-hidden rounded-[20px] border border-[#e3e9f2] bg-white'>
        <table className='w-full text-[15px]'>
          <thead className='bg-[#f4f6fa] text-left text-xs font-bold uppercase tracking-wider text-mist'>
            <tr>
              <th className='px-5 py-3'>Book</th>
              <th className='px-5 py-3'>Type</th>
              <th className='px-5 py-3'>Pages</th>
              <th className='px-5 py-3'>Sample</th>
              <th className='px-5 py-3'>Status</th>
            </tr>
          </thead>
          <tbody>
            {books.map((b) => {
              const cover = coverUrl(b.cover_path);
              return (
                <tr key={b.id} className='border-t border-[#e3e9f2] hover:bg-foam/40'>
                  <td className='px-5 py-3'>
                    <Link href={`/admin/books/${b.id}`} className='flex items-center gap-3 font-bold text-royal'>
                      <div className='size-12 shrink-0 overflow-hidden rounded-lg bg-foam'>
                        {cover && <Image src={cover} alt='' width={96} height={96} className='size-12 object-cover' />}
                      </div>
                      <div>
                        <div>{b.title}</div>
                        <div className='text-xs font-semibold text-mist'>
                          {b.series?.name ? `${b.series.name}${b.series_order ? ` · #${b.series_order}` : ''}` : '/' + b.slug}
                        </div>
                      </div>
                    </Link>
                  </td>
                  <td className='px-5 py-3 font-semibold capitalize text-slate'>{b.book_type}</td>
                  <td className='px-5 py-3 font-semibold text-slate'>{b.page_count || '—'}</td>
                  <td className='px-5 py-3 font-semibold text-slate'>{b.sample_enabled && b.page_count > 0 ? `${Math.min(b.preview_pages, b.page_count)} pages` : 'Off'}</td>
                  <td className='px-5 py-3'>
                    <span className={`rounded-full px-3 py-1 text-xs font-bold ${b.is_listed ? 'bg-[#e6f7ee] text-[#1e7b4b]' : 'bg-[#eef2f7] text-mist'}`}>
                      {b.is_listed ? 'Published' : 'Draft'}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
