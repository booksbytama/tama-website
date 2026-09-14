import 'server-only';
import { cache } from 'react';
import { supabaseAdmin } from '@/lib/supabase/admin';
import type { Profile, ProfileColour } from './types';

export const listProfiles = cache(async (userId: string) => {
  const { data, error } = await supabaseAdmin().from('profiles').select('*').eq('user_id', userId).order('created_at');
  if (error) throw error;
  return (data ?? []) as Profile[];
});

export async function createProfile(userId: string, input: { name: string; age: number | null; colour: ProfileColour; is_grown_up: boolean }) {
  const { data, error } = await supabaseAdmin().from('profiles').insert({ user_id: userId, ...input }).select('*').single();
  if (error) throw error;
  return data as Profile;
}

export async function deleteProfile(userId: string, profileId: string) {
  const { error } = await supabaseAdmin().from('profiles').delete().eq('id', profileId).eq('user_id', userId);
  if (error) throw error;
}

export async function getProfileForUser(userId: string, profileId: string) {
  const { data, error } = await supabaseAdmin().from('profiles').select('*').eq('id', profileId).eq('user_id', userId).maybeSingle();
  if (error) throw error;
  return (data ?? null) as Profile | null;
}

export async function saveShelfProgress(profileId: string, bookId: string, lastPage: number) {
  const { error } = await supabaseAdmin()
    .from('shelf_items')
    .upsert({ profile_id: profileId, book_id: bookId, last_page: lastPage, updated_at: new Date().toISOString() });
  if (error) throw error;
}

export const listShelf = cache(async (profileId: string) => {
  const { data, error } = await supabaseAdmin()
    .from('shelf_items')
    .select('last_page, updated_at, book:books(*)')
    .eq('profile_id', profileId)
    .order('updated_at', { ascending: false });
  if (error) throw error;
  return (data ?? []) as unknown as { last_page: number; updated_at: string; book: import('./types').Book }[];
});
