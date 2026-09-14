'use client';

import Image from 'next/image';
import { useActionState } from 'react';
import { uploadCoverAction } from '@/app/admin/actions';

export function CoverUploader({ bookId, coverUrl }: { bookId: string; coverUrl: string | null }) {
  const [state, action, pending] = useActionState(async (_p: { error?: string; ok?: true } | null, fd: FormData) => uploadCoverAction(bookId, fd), null);
  return (
    <form action={action} className='flex flex-col gap-3.5 rounded-[20px] border border-[#e3e9f2] bg-white p-6'>
      <h2 className='text-lg font-semibold'>Cover</h2>
      <div className='aspect-square w-full overflow-hidden rounded-[14px] bg-foam'>
        {coverUrl && <Image src={coverUrl} alt='' width={600} height={600} className='size-full object-cover' />}
      </div>
      <input name='cover' type='file' accept='image/jpeg,image/png,image/webp' required className='text-sm font-semibold text-slate file:mr-3 file:rounded-lg file:border-0 file:bg-foam file:px-3 file:py-2 file:font-bold file:text-ocean' />
      {state?.error && <p className='text-sm font-bold text-coral'>{state.error}</p>}
      <button type='submit' disabled={pending} className='rounded-xl border-2 border-line px-4 py-2.5 text-[14px] font-bold text-royal hover:border-ocean disabled:opacity-50'>
        {pending ? 'Uploading…' : 'Upload cover'}
      </button>
    </form>
  );
}
