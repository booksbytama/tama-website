import 'server-only';
import { cache } from 'react';
import { supabaseAdmin } from '@/lib/supabase/admin';
import type { Download } from './types';

export const listDownloads = cache(async (includeUnlisted = false) => {
  let q = supabaseAdmin().from('downloads').select('*').order('sort_order');
  if (!includeUnlisted) q = q.eq('is_listed', true);
  const { data, error } = await q;
  if (error) throw error;
  return (data ?? []) as Download[];
});

export async function signedDownloadUrl(slug: string, expiresInSeconds = 60 * 5) {
  const { data: row, error } = await supabaseAdmin().from('downloads').select('*').eq('slug', slug).eq('is_listed', true).maybeSingle();
  if (error) throw error;
  if (!row) return null;
  const filename = row.storage_path.split('/').pop() ?? 'download.pdf';
  const { data, error: sErr } = await supabaseAdmin()
    .storage.from('downloads')
    .createSignedUrl(row.storage_path, expiresInSeconds, { download: filename });
  if (sErr) throw sErr;
  return data.signedUrl;
}
