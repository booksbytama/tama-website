import type { Metadata } from 'next';
import { ProfileForm } from '@/components/account/profile-form';
import { requireUser } from '@/lib/auth';

export const metadata: Metadata = { title: 'Add a reader' };

export default async function NewProfilePage() {
  await requireUser();
  return (
    <div className='wrapper flex max-w-xl flex-col gap-6 py-10 md:py-16'>
      <div className='flex flex-col gap-2'>
        <h1 className='text-[32px] font-bold md:text-[44px]'>Add a reader</h1>
        <p className='text-slate'>A name, an age (optional) and a colour. Kids tap their starfish to open their shelf — no password needed.</p>
      </div>
      <ProfileForm />
    </div>
  );
}
