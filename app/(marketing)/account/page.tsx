import type { Metadata } from 'next';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { ProfileAvatar } from '@/components/account/profile-avatar';
import { requireUser } from '@/lib/auth';
import { listProfiles } from '@/lib/db/profiles';
import { pickProfileAction } from './actions';

export const metadata: Metadata = { title: "Who's reading?" };

export default async function AccountPage() {
  const user = await requireUser();
  const profiles = await listProfiles(user.id);

  return (
    <div className='relative overflow-hidden bg-foam'>
      <svg viewBox='0 0 1440 200' preserveAspectRatio='none' aria-hidden className='pointer-events-none absolute inset-x-0 bottom-0 h-40 w-full'>
        <path d='M0 120 C 200 200 400 60 720 120 C 1040 180 1240 60 1440 120 L1440 200 L0 200 Z' fill='var(--color-ocean)' opacity='0.15' />
        <path d='M0 160 C 240 100 480 200 720 160 C 960 120 1200 200 1440 160 L1440 200 L0 200 Z' fill='var(--color-royal)' opacity='0.15' />
      </svg>
      <div className='wrapper relative flex min-h-[70vh] flex-col items-center justify-center gap-10 py-14 text-center md:py-20'>
        <div className='flex flex-col gap-2'>
          <h1 className='text-[36px] font-bold md:text-[56px]'>Who's reading today?</h1>
          <p className='text-base font-semibold text-slate md:text-lg'>
            {profiles.length ? 'Tap your starfish to open your shelf.' : 'Add a reader to start a shelf — a profile for each child, and one for you.'}
          </p>
        </div>
        <div className='flex flex-wrap items-start justify-center gap-8 md:gap-10'>
          {profiles.map((p) => (
            <form key={p.id} action={pickProfileAction.bind(null, p.id, '/account/shelf')}>
              <button type='submit' className='group flex flex-col items-center gap-3 rounded-3xl p-2 transition-transform hover:scale-105 focus-visible:ring-4 focus-visible:ring-ocean/30'>
                <ProfileAvatar colour={p.colour} size={132} className='md:!size-40' />
                <div className='font-heading text-2xl font-semibold text-royal'>{p.name}</div>
                <div className='eyebrow rounded-full bg-white px-3 py-1.5 text-mist'>{p.is_grown_up ? 'Grown-up' : p.age != null ? `Age ${p.age}` : 'Reader'}</div>
              </button>
            </form>
          ))}
          <Link href='/account/profiles/new' className='flex flex-col items-center gap-3 rounded-3xl p-2 transition-transform hover:scale-105'>
            <div className='flex size-[132px] items-center justify-center rounded-full border-4 border-dashed border-[#9fc4e8] bg-white md:size-40'>
              <Plus className='size-14 text-ocean' strokeWidth={2.6} />
            </div>
            <div className='font-heading text-2xl font-semibold text-ocean'>Add a reader</div>
            <div className='eyebrow text-mist'>Name, age & a colour</div>
          </Link>
        </div>
        <div className='flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm font-semibold text-slate'>
          <Link href='/account/pack' className='text-ocean hover:text-royal'>My starter pack</Link>
          <Link href='/account/profiles' className='hover:text-ocean'>Manage profiles</Link>
          {user.role === 'admin' && (
            <Link href='/admin' className='hover:text-ocean'>Admin</Link>
          )}
        </div>
      </div>
    </div>
  );
}
