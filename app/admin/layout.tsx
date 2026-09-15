import Image from 'next/image';
import Link from 'next/link';
import { BookOpen, FileDown, ExternalLink, Speech } from 'lucide-react';
import { requireAdmin } from '@/lib/auth';

export const metadata = { title: 'Admin' };

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await requireAdmin();
  return (
    <div className='grid min-h-screen bg-[#f4f6fa] md:grid-cols-[240px_1fr]'>
      <aside className='flex flex-col gap-7 bg-royal px-5 py-6 text-white'>
        <div className='flex items-center gap-2.5'>
          <Image src='/assets/images/logo.png' alt='' width={34} height={34} />
          <div>
            <div className='font-heading text-lg font-semibold leading-tight'>Tama Admin</div>
            <div className='eyebrow text-[10px] text-[#9fc4e8]'>booksbytama.com</div>
          </div>
        </div>
        <nav className='flex flex-col gap-1 text-[15px] font-bold'>
          <Link href='/admin' className='flex items-center gap-2.5 rounded-xl px-3.5 py-3 hover:bg-white/15'>
            <BookOpen className='size-[18px]' /> Books
          </Link>
          <Link href='/admin/downloads' className='flex items-center gap-2.5 rounded-xl px-3.5 py-3 text-[#c9ddf2] hover:bg-white/15'>
            <FileDown className='size-[18px]' /> Starter pack
          </Link>
          <Link href='/admin/pronunciations' className='flex items-center gap-2.5 rounded-xl px-3.5 py-3 text-[#c9ddf2] hover:bg-white/15'>
            <Speech className='size-[18px]' /> Pronunciations
          </Link>
        </nav>
        <div className='mt-auto text-[13px] font-semibold text-[#9fc4e8]'>
          {user.display_name ?? user.email} ·{' '}
          <Link href='/' className='inline-flex items-center gap-1 text-white'>
            View site <ExternalLink className='size-3' />
          </Link>
        </div>
      </aside>
      <main className='px-5 py-7 md:px-10'>{children}</main>
    </div>
  );
}
