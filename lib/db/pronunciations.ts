import 'server-only';
import { cache } from 'react';
import { supabaseAdmin } from '@/lib/supabase/admin';
import type { Pronunciations } from '@/lib/tts';

export const loadPronunciations = cache(async (): Promise<Pronunciations> => {
  const { data, error } = await supabaseAdmin().from('pronunciations').select('word, say_as').order('word');
  if (error) throw error;
  return Object.fromEntries((data ?? []).map((r) => [r.word, r.say_as]));
});
