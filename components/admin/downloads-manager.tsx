'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2 } from 'lucide-react';
import { beginDownloadUploadAction, deleteDownloadAction, saveDownloadAction, toggleDownloadListedAction } from '@/app/admin/actions';
import type { Download } from '@/lib/db/types';

export function DownloadsManager({ items }: { items: Download[] }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const file = fd.get('file');
    if (!(file instanceof File) || file.size === 0) return setError('Pick a PDF first.');
    if (file.size > 20 * 1024 * 1024) return setError('Keep files under 20 MB.');
    setBusy(true);
    setError(null);
    try {
      const { path, url } = await beginDownloadUploadAction(file.name);
      const resp = await fetch(url, { method: 'PUT', headers: { 'Content-Type': file.type || 'application/pdf', 'x-upsert': 'true' }, body: file });
      if (!resp.ok) throw new Error(`Upload failed (${resp.status})`);
      const res = await saveDownloadAction({
        slug: String(fd.get('slug')),
        title: String(fd.get('title')),
        description: String(fd.get('description') || '') || null,
        storage_path: path,
        sort_order: Number(fd.get('sort_order') || 0),
      });
      if (res.error) throw new Error(res.error);
      form.reset();
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className='grid items-start gap-6 lg:grid-cols-[1fr_380px]'>
      <div className='overflow-hidden rounded-[20px] border border-[#e3e9f2] bg-white'>
        {items.length === 0 ? (
          <p className='p-8 text-center text-sm font-bold text-mist'>Nothing uploaded yet.</p>
        ) : (
          <ul>
            {items.map((d) => (
              <li key={d.id} className='flex items-center gap-4 border-b border-[#e3e9f2] px-5 py-4 last:border-0'>
                <div className='flex-1'>
                  <div className='font-bold text-royal'>{d.title}</div>
                  <div className='text-xs font-semibold text-mist'>/{d.slug} · {d.description ?? 'no description'}</div>
                </div>
                <label className='flex items-center gap-2 text-xs font-bold text-slate'>
                  <input type='checkbox' defaultChecked={d.is_listed} onChange={(e) => void toggleDownloadListedAction(d.id, e.target.checked)} className='size-4 accent-seaweed' /> Listed
                </label>
                <button
                  onClick={() => {
                    if (confirm(`Delete "${d.title}"?`)) void deleteDownloadAction(d.id);
                  }}
                  aria-label='Delete'
                  className='p-2 text-mist hover:text-coral'
                >
                  <Trash2 className='size-[18px]' />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <form onSubmit={onSubmit} className='flex flex-col gap-3.5 rounded-[20px] border border-[#e3e9f2] bg-white p-6'>
        <h2 className='text-lg font-semibold'>Add a file</h2>
        <input name='title' required placeholder='Coral Cove poster (A3)' className='field' />
        <input name='slug' required pattern='[a-z0-9-]+' placeholder='coral-cove-poster' className='field font-mono' />
        <input name='description' placeholder='A3 · PDF' className='field' />
        <input name='sort_order' type='number' defaultValue={0} className='field w-28' />
        <input name='file' type='file' accept='application/pdf' required className='text-sm font-semibold text-slate file:mr-3 file:rounded-lg file:border-0 file:bg-foam file:px-3 file:py-2 file:font-bold file:text-ocean' />
        {error && <p className='text-sm font-bold text-coral'>{error}</p>}
        <button disabled={busy} className='rounded-xl bg-ocean px-5 py-3 text-[15px] font-bold text-white hover:bg-royal disabled:opacity-50'>
          {busy ? 'Uploading…' : 'Upload'}
        </button>
      </form>
    </div>
  );
}
