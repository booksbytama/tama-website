'use client';

import { useActionState, useState } from 'react';
import Link from 'next/link';
import { Trash2 } from 'lucide-react';
import { booksUsingWordAction, deletePronunciationAction, savePronunciationAction } from '@/app/admin/actions';

type Item = { word: string; say_as: string };

export function PronunciationsManager({ items }: { items: Item[] }) {
  const [state, action, pending] = useActionState(async (_p: { error?: string; ok?: true } | null, fd: FormData) => savePronunciationAction(fd), null);
  const [usage, setUsage] = useState<Record<string, { slug: string; title: string; pages: number[] }[]>>({});

  async function whereUsed(word: string) {
    const found = await booksUsingWordAction(word);
    setUsage((u) => ({ ...u, [word]: found }));
  }

  return (
    <div className='grid items-start gap-6 lg:grid-cols-[1fr_380px]'>
      <div className='overflow-hidden rounded-[20px] border border-[#e3e9f2] bg-white'>
        {items.length === 0 ? (
          <p className='p-8 text-center text-sm font-bold text-mist'>No corrections yet.</p>
        ) : (
          <ul>
            {items.map((it) => (
              <li key={it.word} className='flex flex-col gap-2 border-b border-[#e3e9f2] px-5 py-4 last:border-0'>
                <div className='flex items-center gap-4'>
                  <div className='flex-1'>
                    <span className='font-heading text-lg font-semibold text-royal'>{it.word}</span>
                    <span className='mx-2 text-mist'>→</span>
                    <span className='font-mono text-sm font-bold text-ink'>{it.say_as}</span>
                  </div>
                  <button onClick={() => void whereUsed(it.word)} className='text-[13px] font-bold text-ocean'>Where used?</button>
                  <button onClick={() => { if (confirm(`Remove "${it.word}"?`)) void deletePronunciationAction(it.word); }} aria-label='Delete' className='p-2 text-mist hover:text-coral'>
                    <Trash2 className='size-[18px]' />
                  </button>
                </div>
                {usage[it.word] && (
                  <div className='text-[13px] font-semibold text-slate'>
                    {usage[it.word].length === 0
                      ? 'Not used in any book.'
                      : usage[it.word].map((b) => (
                          <div key={b.slug}>
                            <Link href='/admin' className='text-ocean'>{b.title}</Link> · pages {b.pages.join(', ')} — regenerate those pages in the book's Read-aloud panel.
                          </div>
                        ))}
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      <form action={action} className='flex flex-col gap-3.5 rounded-[20px] border border-[#e3e9f2] bg-white p-6'>
        <h2 className='text-lg font-semibold'>Add a correction</h2>
        <label className='flex flex-col gap-1'>
          <span className='text-[13px] font-bold text-slate'>Word</span>
          <input name='word' required placeholder='chuckled' className='field' autoCapitalize='off' />
          <span className='text-xs font-semibold text-mist'>Exactly as it appears in the book (case and punctuation don't matter).</span>
        </label>
        <label className='flex flex-col gap-1'>
          <span className='text-[13px] font-bold text-slate'>How to say it</span>
          <input name='say_as' required placeholder='chuck-uld  or  /ˈtʃʌkəld/' className='field' autoCapitalize='off' />
          <span className='text-xs font-semibold text-mist'>Either a “sounds like” spelling, or IPA between slashes for exact control.</span>
        </label>
        {state?.error && <p className='text-sm font-bold text-coral'>{state.error}</p>}
        {state?.ok && <p className='text-sm font-bold text-seaweed'>Saved. Now regenerate the pages that use it.</p>}
        <button disabled={pending} className='rounded-xl bg-ocean px-5 py-3 text-[15px] font-bold text-white hover:bg-royal disabled:opacity-50'>
          {pending ? 'Saving…' : 'Save'}
        </button>
      </form>
    </div>
  );
}
