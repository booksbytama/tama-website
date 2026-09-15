'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Play, Volume2 } from 'lucide-react';
import { narratePageAction, previewVoiceAction, setNarrationAction } from '@/app/admin/actions';

type Props = {
  bookId: string;
  voices: { id: string; label: string }[];
  currentVoice: string | null;
  enabled: boolean;
  pageCount: number;
  pagesWithWords: number;
  pagesWithAudio: number;
  pageNumbersWithWords: number[];
  pageNumbersMissingAudio: number[];
};

export function NarrationPanel({ bookId, voices, currentVoice, enabled, pageCount, pagesWithWords, pagesWithAudio, pageNumbersWithWords, pageNumbersMissingAudio }: Props) {
  const router = useRouter();
  const [voice, setVoice] = useState(currentVoice ?? 'en-AU-Neural2-C');
  const [busy, setBusy] = useState<string | null>(null);
  const [progress, setProgress] = useState<{ done: number; total: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  async function preview(v: string) {
    setError(null);
    setBusy(`preview:${v}`);
    try {
      const { url } = await previewVoiceAction(v);
      audioRef.current?.pause();
      const a = new Audio(url);
      audioRef.current = a;
      await a.play();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Preview failed');
    } finally {
      setBusy(null);
    }
  }

  const [failed, setFailed] = useState<number[]>([]);

  // Google rate-limits bursts, so each page gets a couple of retries and a failure never stops the run.
  async function generate(pageNumbers: number[]) {
    setError(null);
    setFailed([]);
    setBusy('generate');
    setProgress({ done: 0, total: pageNumbers.length });
    const failures: number[] = [];
    let lastError = '';
    for (const [i, n] of pageNumbers.entries()) {
      let ok = false;
      for (let attempt = 0; attempt < 3 && !ok; attempt++) {
        try {
          await narratePageAction(bookId, n, voice);
          ok = true;
        } catch (e) {
          lastError = e instanceof Error ? e.message : String(e);
          // A missing key or config problem will fail every page — don't grind through 3 retries each.
          if (/GOOGLE_TTS_API_KEY|not set|API key/i.test(lastError)) break;
          await new Promise((r) => setTimeout(r, 1500 * (attempt + 1)));
        }
      }
      if (!ok) {
        failures.push(n);
        if (/GOOGLE_TTS_API_KEY|not set|API key/i.test(lastError)) {
          failures.push(...pageNumbers.slice(i + 1));
          break;
        }
      }
      setProgress({ done: i + 1, total: pageNumbers.length });
    }
    if (failures.length) setError(lastError || 'Generation failed');
    try {
      if (failures.length < pageNumbers.length) await setNarrationAction(bookId, { voice, enabled: true });
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not switch narration on');
    }
    setFailed(failures);
    setBusy(null);
    setProgress(null);
    router.refresh();
  }

  async function toggle(on: boolean) {
    setBusy('toggle');
    try {
      await setNarrationAction(bookId, { voice: currentVoice, enabled: on });
      router.refresh();
    } finally {
      setBusy(null);
    }
  }

  const noWords = pagesWithWords === 0;
  const stale = enabled === false && pagesWithAudio > 0;

  return (
    <section className='flex flex-col gap-4 rounded-[20px] border border-[#e3e9f2] bg-white p-6'>
      <div className='flex flex-wrap items-center justify-between gap-3'>
        <div>
          <h2 className='text-xl font-semibold'>Read aloud</h2>
          <p className='text-[13px] font-semibold text-mist'>
            {noWords
              ? 'Upload a PDF with real text first — no words were found on these pages.'
              : `Words on ${pagesWithWords} of ${pageCount} pages · voice generated for ${pagesWithAudio}${stale ? ' (from a previous upload — regenerate)' : ''}`}
          </p>
        </div>
        {pagesWithAudio > 0 && (
          <label className='flex items-center gap-2 text-sm font-bold text-slate'>
            <input type='checkbox' checked={enabled} disabled={busy !== null} onChange={(e) => void toggle(e.target.checked)} className='size-5 accent-seaweed' /> Show “Read to me” in the reader
          </label>
        )}
      </div>

      <div className='flex flex-col gap-2'>
        <span className='text-[13px] font-bold text-slate'>Narrator · Google Australian voices</span>
        <div className='grid gap-2 sm:grid-cols-2'>
          {voices.map((v) => (
            <label key={v.id} className={`flex items-center gap-3 rounded-xl border-2 px-3 py-2.5 ${voice === v.id ? 'border-ocean bg-foam' : 'border-line'}`}>
              <input type='radio' name='voice' value={v.id} checked={voice === v.id} onChange={() => setVoice(v.id)} className='accent-ocean' />
              <span className='flex-1 text-sm font-bold text-ink'>{v.label}</span>
              <button type='button' onClick={() => void preview(v.id)} disabled={busy !== null} aria-label={`Preview ${v.label}`} className='flex size-8 items-center justify-center rounded-full bg-sun text-royal disabled:opacity-50'>
                {busy === `preview:${v.id}` ? <Volume2 className='size-4 animate-pulse' /> : <Play className='size-4' fill='currentColor' />}
              </button>
            </label>
          ))}
        </div>
      </div>

      {progress && (
        <div className='flex flex-col gap-2 rounded-[14px] border border-foam-deep bg-foam px-5 py-4'>
          <div className='flex justify-between text-sm font-bold text-royal'>
            <span>Generating narration…</span>
            <span>{progress.done} / {progress.total}</span>
          </div>
          <div className='h-2.5 overflow-hidden rounded-full bg-white'>
            <div className='h-full rounded-full bg-ocean transition-[width]' style={{ width: `${(progress.done / Math.max(1, progress.total)) * 100}%` }} />
          </div>
        </div>
      )}
      {error && <p className='rounded-xl bg-[#fde8e7] px-4 py-3 text-sm font-bold text-coral'>{error}</p>}

      {failed.length > 0 && (
        <p className='rounded-xl bg-[#fff8e1] px-4 py-3 text-sm font-bold text-[#8a6100]'>
          Couldn't generate page{failed.length > 1 ? 's' : ''} {failed.join(', ')} — use “Generate missing pages” to try again.
        </p>
      )}

      <div className='flex flex-wrap items-center gap-3'>
        {pageNumbersMissingAudio.length > 0 && pagesWithAudio > 0 && (
          <button type='button' onClick={() => void generate(pageNumbersMissingAudio)} disabled={busy !== null} className='rounded-xl bg-ocean px-5 py-2.5 text-[15px] font-bold text-white hover:bg-royal disabled:opacity-50'>
            Generate missing pages ({pageNumbersMissingAudio.length})
          </button>
        )}
        <button
          type='button'
          onClick={() => void generate(pageNumbersWithWords)}
          disabled={busy !== null || noWords}
          className={`rounded-xl px-5 py-2.5 text-[15px] font-bold disabled:opacity-50 ${pagesWithAudio > 0 ? 'border-2 border-line bg-white text-royal hover:border-ocean' : 'bg-ocean text-white hover:bg-royal'}`}
        >
          {pagesWithAudio > 0 ? 'Regenerate all pages' : 'Generate voice for all pages'}
        </button>
        <form
          className='flex items-center gap-2'
          onSubmit={(e) => {
            e.preventDefault();
            const nums = String(new FormData(e.currentTarget).get('pages') ?? '').split(/[,\s]+/).map(Number).filter((n) => pageNumbersWithWords.includes(n));
            if (nums.length) void generate(nums);
          }}
        >
          <input name='pages' placeholder='e.g. 7, 20' className='field w-32 py-2 text-sm' aria-label='Pages to regenerate' />
          <button disabled={busy !== null} className='rounded-xl border-2 border-line bg-white px-4 py-2 text-[14px] font-bold text-royal hover:border-ocean disabled:opacity-50'>Regenerate pages</button>
        </form>
        <span className='w-full text-[12px] font-semibold text-mist'>About 1.5s per page. Uses your Google free allowance (a whole book is ~0.3% of a month).</span>
      </div>
    </section>
  );
}
