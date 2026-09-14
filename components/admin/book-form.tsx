'use client';

import { useActionState, useState } from 'react';
import { Trash2 } from 'lucide-react';
import { saveBookAction } from '@/app/admin/actions';
import type { BookWithSeries, BuyLink, Series } from '@/lib/db/types';

export function BookForm({ book, series }: { book: BookWithSeries; series: Series[] }) {
  const [links, setLinks] = useState<BuyLink[]>(book.buy_links.length ? book.buy_links : [{ label: 'Amazon US', url: '' }]);
  const [state, action, pending] = useActionState(async (_p: { error?: string; ok?: true } | null, fd: FormData) => saveBookAction(book.id, fd), null);

  return (
    <form action={action} className='flex flex-col gap-5 rounded-[20px] border border-[#e3e9f2] bg-white p-6'>
      <div className='flex items-center justify-between'>
        <h2 className='text-xl font-semibold'>Details</h2>
        <div className='flex items-center gap-3'>
          {state?.ok && <span className='text-sm font-bold text-seaweed'>Saved</span>}
          {state?.error && <span className='text-sm font-bold text-coral'>{state.error}</span>}
          <button type='submit' disabled={pending} className='rounded-xl bg-ocean px-5 py-2.5 text-[15px] font-bold text-white hover:bg-royal disabled:opacity-50'>
            {pending ? 'Saving…' : 'Save changes'}
          </button>
        </div>
      </div>

      <div className='grid gap-4 md:grid-cols-2'>
        <Field label='Title'><input name='title' defaultValue={book.title} required className='field' /></Field>
        <Field label='URL slug' hint='/books/…'><input name='slug' defaultValue={book.slug} required pattern='[a-z0-9-]+' className='field font-mono' /></Field>
        <Field label='Type'>
          <select name='book_type' defaultValue={book.book_type} className='field'>
            <option value='picture'>Picture book</option>
            <option value='colouring'>Colouring book</option>
          </select>
        </Field>
        <Field label='Series'>
          <div className='flex gap-2'>
            <select name='series_id' defaultValue={book.series_id ?? ''} className='field'>
              <option value=''>— none —</option>
              {series.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
            <input name='series_order' type='number' min={0} defaultValue={book.series_order ?? ''} placeholder='#' className='field w-20' />
          </div>
        </Field>
        <Field label='Ages' hint='Use ★ to separate, e.g. "Independent 6–10 ★ Read-aloud 4–6"'>
          <input name='ages_text' defaultValue={book.ages_text ?? ''} className='field' />
        </Field>
        <Field label='Sort order' hint='Lower shows first'><input name='sort_order' type='number' defaultValue={book.sort_order} className='field w-28' /></Field>
      </div>

      <Field label='Short description' hint='Subtitle under the title'>
        <input name='short_description' defaultValue={book.short_description ?? ''} maxLength={300} className='field' />
      </Field>
      <Field label='Description' hint='Blank line = new paragraph'>
        <textarea name='description' defaultValue={book.description ?? ''} rows={6} className='field leading-relaxed' />
      </Field>

      <div className='flex flex-col gap-2.5'>
        <div className='flex items-center justify-between'>
          <span className='text-[13px] font-bold text-slate'>Buy links</span>
          <button type='button' onClick={() => setLinks((l) => [...l, { label: '', url: '' }])} className='text-[13px] font-bold text-ocean'>+ Add link</button>
        </div>
        {links.map((l, i) => (
          <div key={i} className='grid grid-cols-[160px_1fr_36px] items-center gap-2.5'>
            <input name='buy_label' defaultValue={l.label} placeholder='Amazon AU' className='field py-2.5 text-sm' />
            <input name='buy_url' defaultValue={l.url} placeholder='https://…' type='url' className='field py-2.5 text-sm' />
            <button type='button' aria-label='Remove link' onClick={() => setLinks((ls) => ls.filter((_, j) => j !== i))} className='p-2 text-mist hover:text-coral'>
              <Trash2 className='size-[18px]' />
            </button>
          </div>
        ))}
      </div>

      <div className='grid gap-3 rounded-2xl bg-[#f4f6fa] p-4 md:grid-cols-2'>
        <Toggle name='is_listed' label='Listed on site' defaultChecked={book.is_listed} />
        <Toggle name='sample_enabled' label='Free sample available' defaultChecked={book.sample_enabled} />
        <label className='flex items-center gap-3 text-sm font-bold text-slate'>
          Free sample length
          <input name='preview_pages' type='number' min={0} max={500} defaultValue={book.preview_pages} className='field w-24 py-2' />
          pages
        </label>
        <Toggle name='member_reading_enabled' label='Whole book free for signed-in members' defaultChecked={book.member_reading_enabled} />
      </div>
    </form>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <label className='flex flex-col gap-1.5'>
      <span className='text-[13px] font-bold text-slate'>
        {label} {hint && <span className='font-semibold text-mist'>· {hint}</span>}
      </span>
      {children}
    </label>
  );
}

function Toggle({ name, label, defaultChecked }: { name: string; label: string; defaultChecked: boolean }) {
  return (
    <label className='flex items-center gap-3 text-sm font-bold text-slate'>
      <input name={name} type='checkbox' defaultChecked={defaultChecked} className='size-5 accent-seaweed' /> {label}
    </label>
  );
}
