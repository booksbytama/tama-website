import type { Metadata } from 'next';
import Link from 'next/link';
import { Trash2 } from 'lucide-react';
import { ProfileAvatar } from '@/components/account/profile-avatar';
import { requireUser } from '@/lib/auth';
import { listProfiles } from '@/lib/db/profiles';
import { deleteProfileAction } from '../actions';

export const metadata: Metadata = { title: 'Manage profiles' };

export default async function ProfilesPage() {
  const user = await requireUser();
  const profiles = await listProfiles(user.id);
  return (
    <div className='wrapper flex max-w-2xl flex-col gap-6 py-10 md:py-16'>
      <div className='flex items-end justify-between gap-4'>
        <h1 className='text-[32px] font-bold md:text-[44px]'>Manage profiles</h1>
        <Link href='/account/profiles/new' className='btn-primary btn-md font-body font-bold'>Add reader</Link>
      </div>
      {profiles.length === 0 && <p className='text-slate'>No profiles yet.</p>}
      <ul className='flex flex-col gap-3'>
        {profiles.map((p) => (
          <li key={p.id} className='flex items-center gap-4 rounded-2xl border-2 border-sand-deep bg-white p-3'>
            <ProfileAvatar colour={p.colour} size={56} />
            <div className='flex-1'>
              <div className='font-heading text-lg font-semibold text-royal'>{p.name}</div>
              <div className='text-sm font-semibold text-mist'>{p.is_grown_up ? 'Grown-up' : p.age != null ? `Age ${p.age}` : 'Reader'}</div>
            </div>
            <form action={deleteProfileAction.bind(null, p.id)}>
              <button type='submit' aria-label={`Remove ${p.name}`} className='rounded-full p-2.5 text-mist hover:bg-foam hover:text-coral'>
                <Trash2 className='size-5' />
              </button>
            </form>
          </li>
        ))}
      </ul>
    </div>
  );
}
