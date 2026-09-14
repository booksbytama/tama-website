'use client';

import { useActionState, useState } from 'react';
import { createProfileAction } from '@/app/(marketing)/account/actions';
import { PROFILE_COLOURS, type ProfileColour } from '@/lib/db/types';
import { COLOUR_CLASS } from './profile-avatar';

export function ProfileForm() {
  const [colour, setColour] = useState<ProfileColour>('yellow');
  const [state, action, pending] = useActionState(async (_prev: { error?: string } | null, fd: FormData) => createProfileAction(fd), null);

  return (
    <form action={action} className='card-float flex flex-col gap-5 p-6 md:p-8'>
      <label className='flex flex-col gap-1.5'>
        <span className='text-sm font-bold text-slate'>Name</span>
        <input name='name' required maxLength={30} className='field' placeholder='Ava' autoComplete='off' />
      </label>
      <label className='flex flex-col gap-1.5'>
        <span className='text-sm font-bold text-slate'>Age (optional)</span>
        <input name='age' type='number' min={0} max={18} className='field w-32' placeholder='7' />
      </label>
      <div className='flex flex-col gap-2'>
        <span className='text-sm font-bold text-slate'>Starfish colour</span>
        <div className='flex flex-wrap gap-3'>
          {PROFILE_COLOURS.map((c) => (
            <button
              key={c}
              type='button'
              aria-label={c}
              aria-pressed={colour === c}
              onClick={() => setColour(c)}
              className={`size-11 rounded-full border-4 transition-transform ${COLOUR_CLASS[c]} ${colour === c ? 'scale-110 border-royal' : 'border-white'}`}
            />
          ))}
        </div>
        <input type='hidden' name='colour' value={colour} />
      </div>
      <label className='flex items-center gap-3 text-sm font-semibold text-slate'>
        <input name='is_grown_up' type='checkbox' className='size-5 accent-ocean' /> This is a grown-up
      </label>
      {state?.error && <p className='text-sm font-bold text-coral'>{state.error}</p>}
      <button type='submit' disabled={pending} className='btn-primary btn-lg'>
        {pending ? 'Saving…' : 'Add reader'}
      </button>
    </form>
  );
}
