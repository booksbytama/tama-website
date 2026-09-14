'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FileText, Upload } from 'lucide-react';
import { beginPageUploadAction, finishPageUploadAction } from '@/app/admin/actions';

type Thumb = { page: number; url: string };
type Status = { phase: 'idle' } | { phase: 'working'; done: number; total: number; label: string } | { phase: 'error'; message: string };

const TARGET_WIDTH = 1600;
const WEBP_QUALITY = 0.82;

export function PdfUploader({ bookId, existing, previewPages }: { bookId: string; existing: Thumb[]; previewPages: number }) {
  const [status, setStatus] = useState<Status>({ phase: 'idle' });
  const [thumbs, setThumbs] = useState<Thumb[]>(existing);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  async function convert(file: File) {
    try {
      setStatus({ phase: 'working', done: 0, total: 0, label: 'Reading PDF…' });
      const pdfjs = await import('pdfjs-dist');
      pdfjs.GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/build/pdf.worker.min.mjs', import.meta.url).toString();
      const doc = await pdfjs.getDocument({ data: await file.arrayBuffer() }).promise;
      const total = doc.numPages;
      const { uploads } = await beginPageUploadAction(bookId, total);

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d', { alpha: false })!;
      const results: { page_number: number; storage_path: string; width: number; height: number }[] = [];
      const local: Thumb[] = [];

      for (let n = 1; n <= total; n++) {
        setStatus({ phase: 'working', done: n - 1, total, label: `Converting page ${n} of ${total}` });
        const page = await doc.getPage(n);
        const base = page.getViewport({ scale: 1 });
        const scale = Math.min(TARGET_WIDTH / base.width, 4);
        const vp = page.getViewport({ scale });
        canvas.width = Math.round(vp.width);
        canvas.height = Math.round(vp.height);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        await page.render({ canvasContext: ctx, viewport: vp, canvas }).promise;
        const blob = await new Promise<Blob>((res, rej) => canvas.toBlob((b) => (b ? res(b) : rej(new Error('toBlob failed'))), 'image/webp', WEBP_QUALITY));

        const u = uploads[n - 1];
        setStatus({ phase: 'working', done: n - 1, total, label: `Uploading page ${n} of ${total}` });
        const resp = await fetch(u.url, { method: 'PUT', headers: { 'Content-Type': 'image/webp', 'x-upsert': 'true' }, body: blob });
        if (!resp.ok) throw new Error(`Upload of page ${n} failed (${resp.status})`);
        results.push({ page_number: n, storage_path: u.path, width: canvas.width, height: canvas.height });
        if (n <= 16) local.push({ page: n, url: URL.createObjectURL(blob) });
        page.cleanup();
      }

      setStatus({ phase: 'working', done: total, total, label: 'Saving…' });
      await finishPageUploadAction(bookId, results);
      setThumbs(local);
      setStatus({ phase: 'idle' });
      router.refresh();
    } catch (e) {
      setStatus({ phase: 'error', message: e instanceof Error ? e.message : 'Something went wrong' });
    }
  }

  const working = status.phase === 'working';

  return (
    <section className='flex flex-col gap-5 rounded-[20px] border border-[#e3e9f2] bg-white p-6'>
      <div className='flex flex-wrap items-center justify-between gap-3'>
        <div>
          <h2 className='text-xl font-semibold'>Book pages</h2>
          <p className='text-[13px] font-semibold text-mist'>Drop the print PDF — pages are converted to images in your browser; the PDF never leaves your computer.</p>
        </div>
        <input
          ref={inputRef}
          type='file'
          accept='application/pdf'
          hidden
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) void convert(f);
            e.target.value = '';
          }}
        />
        <button type='button' disabled={working} onClick={() => inputRef.current?.click()} className='inline-flex items-center gap-2 rounded-xl border-2 border-line px-4 py-2.5 text-[14px] font-bold text-royal hover:border-ocean disabled:opacity-50'>
          <Upload className='size-4' strokeWidth={2.4} /> {thumbs.length ? 'Replace PDF' : 'Choose PDF'}
        </button>
      </div>

      {working && (
        <div className='flex items-center gap-4 rounded-[14px] border border-foam-deep bg-foam px-5 py-4'>
          <FileText className='size-7 text-ocean' />
          <div className='flex flex-1 flex-col gap-2'>
            <div className='flex justify-between text-sm font-bold text-royal'>
              <span>{status.label}</span>
              {status.total > 0 && <span>{status.done} / {status.total}</span>}
            </div>
            <div className='h-2.5 overflow-hidden rounded-full bg-white'>
              <div className='h-full rounded-full bg-ocean transition-[width]' style={{ width: status.total ? `${(status.done / status.total) * 100}%` : '5%' }} />
            </div>
          </div>
        </div>
      )}
      {status.phase === 'error' && <p className='rounded-xl bg-[#fde8e7] px-4 py-3 text-sm font-bold text-coral'>{status.message}</p>}

      {thumbs.length === 0 && !working ? (
        <button type='button' onClick={() => inputRef.current?.click()} className='rounded-[14px] border-2 border-dashed border-line py-12 text-center text-sm font-bold text-mist hover:border-ocean hover:text-ocean'>
          No pages yet — choose a PDF to convert
        </button>
      ) : (
        <div className='grid grid-cols-4 gap-3 md:grid-cols-8'>
          {thumbs.map((t) => (
            <div key={t.page} className={`relative aspect-square overflow-hidden rounded-[10px] bg-[#f7fbff] ${t.page <= previewPages ? 'ring-[3px] ring-sun' : 'border border-[#e3e9f2]'}`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={t.url} alt='' className='size-full object-contain' />
              <span className='absolute bottom-1 left-1.5 text-[11px] font-bold text-mist'>{t.page}</span>
              {t.page === previewPages && <span className='absolute -right-1 -top-1 rounded-full bg-sun px-2 py-0.5 text-[10px] font-bold text-royal'>FREE ENDS</span>}
            </div>
          ))}
          {existing.length > 16 && thumbs.length <= 16 && <div className='flex aspect-square items-center justify-center rounded-[10px] bg-[#eef2f7] text-xs font-bold text-mist'>+ more</div>}
        </div>
      )}
      <p className='text-[12px] font-semibold text-mist'>Yellow ring = free sample pages. Change the length under Details → “Free sample length”.</p>
    </section>
  );
}
