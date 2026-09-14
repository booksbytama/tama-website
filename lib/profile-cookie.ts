import 'server-only';
import { cookies } from 'next/headers';

const NAME = 'bbt_profile';

export async function getActiveProfileId(): Promise<string | null> {
  return (await cookies()).get(NAME)?.value ?? null;
}

export async function setActiveProfileId(id: string) {
  (await cookies()).set(NAME, id, { httpOnly: true, sameSite: 'lax', path: '/', maxAge: 60 * 60 * 24 * 365 });
}

export async function clearActiveProfileId() {
  (await cookies()).delete(NAME);
}
