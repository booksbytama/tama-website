import 'server-only';
import { auth, clerkClient, currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { cache } from 'react';
import { supabaseAdmin } from '@/lib/supabase/admin';

export type AppUser = {
  id: string;
  clerk_id: string;
  email: string | null;
  display_name: string | null;
  role: 'parent' | 'admin';
};

// Upserts the Clerk user into our users table. Works without the webhook, which
// may not be configured locally.
export const ensureUser = cache(async (): Promise<AppUser | null> => {
  const { userId } = await auth();
  if (!userId) return null;
  const db = supabaseAdmin();
  const { data: existing } = await db.from('users').select('*').eq('clerk_id', userId).maybeSingle();
  if (existing) return existing as AppUser;

  const cu = await currentUser();
  const email = cu?.primaryEmailAddress?.emailAddress ?? null;
  const display_name = cu?.firstName ?? email?.split('@')[0] ?? null;
  const role = (cu?.publicMetadata as { role?: string } | undefined)?.role === 'admin' ? 'admin' : 'parent';
  const { data, error } = await db
    .from('users')
    .upsert({ clerk_id: userId, email, display_name, role }, { onConflict: 'clerk_id' })
    .select('*')
    .single();
  if (error) throw error;
  return data as AppUser;
});

export async function requireUser(): Promise<AppUser> {
  const user = await ensureUser();
  if (!user) redirect('/sign-in');
  return user;
}

export const isAdmin = cache(async (): Promise<boolean> => {
  const { userId } = await auth();
  if (!userId) return false;
  const user = await ensureUser();
  if (user?.role === 'admin') return true;
  // Clerk publicMetadata is the source of truth; promote the DB row when it says admin.
  const client = await clerkClient();
  const cu = await client.users.getUser(userId);
  if ((cu.publicMetadata as { role?: string })?.role === 'admin') {
    await supabaseAdmin().from('users').update({ role: 'admin' }).eq('clerk_id', userId);
    return true;
  }
  return false;
});

export async function requireAdmin(): Promise<AppUser> {
  const user = await requireUser();
  if (!(await isAdmin())) redirect('/');
  return user;
}
