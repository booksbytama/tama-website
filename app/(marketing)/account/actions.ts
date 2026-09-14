'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { requireUser } from '@/lib/auth';
import { createProfile, deleteProfile, getProfileForUser, saveShelfProgress } from '@/lib/db/profiles';
import { PROFILE_COLOURS } from '@/lib/db/types';
import { checkLimit } from '@/lib/ratelimit';
import { clearActiveProfileId, setActiveProfileId } from '@/lib/profile-cookie';

const profileSchema = z.object({
  name: z.string().trim().min(1).max(30),
  age: z.coerce.number().int().min(0).max(18).nullable(),
  colour: z.enum(PROFILE_COLOURS),
  is_grown_up: z.boolean(),
});

export async function createProfileAction(formData: FormData) {
  const user = await requireUser();
  if (!(await checkLimit('profiles', user.id))) return { error: 'Too many profiles created recently. Try again later.' };
  const parsed = profileSchema.safeParse({
    name: formData.get('name'),
    age: formData.get('age') ? formData.get('age') : null,
    colour: formData.get('colour'),
    is_grown_up: formData.get('is_grown_up') === 'on',
  });
  if (!parsed.success) return { error: 'Please check the name, age and colour.' };
  const profile = await createProfile(user.id, parsed.data);
  await setActiveProfileId(profile.id);
  revalidatePath('/account');
  redirect('/account');
}

export async function deleteProfileAction(profileId: string) {
  const user = await requireUser();
  await deleteProfile(user.id, profileId);
  await clearActiveProfileId();
  revalidatePath('/account');
}

export async function pickProfileAction(profileId: string, next = '/account/shelf') {
  const user = await requireUser();
  const profile = await getProfileForUser(user.id, profileId);
  if (!profile) return;
  await setActiveProfileId(profile.id);
  redirect(next);
}

export async function saveProgressAction(profileId: string, bookId: string, page: number) {
  const user = await requireUser();
  const profile = await getProfileForUser(user.id, profileId);
  if (!profile) return;
  await saveShelfProgress(profile.id, bookId, Math.max(1, Math.floor(page)));
}
