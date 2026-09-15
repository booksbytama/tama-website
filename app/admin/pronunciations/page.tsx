import { PronunciationsManager } from '@/components/admin/pronunciations-manager';
import { supabaseAdmin } from '@/lib/supabase/admin';

export default async function PronunciationsPage() {
  const { data } = await supabaseAdmin().from('pronunciations').select('word, say_as').order('word');
  return (
    <div className='flex flex-col gap-6'>
      <div>
        <h1 className='text-[32px] font-semibold'>Pronunciations</h1>
        <p className='max-w-2xl text-[15px] font-semibold text-mist'>
          Words the narrator gets wrong, and how to say them. Applies to every book the next time its voice is generated — after adding a word, regenerate the pages that use it.
        </p>
      </div>
      <PronunciationsManager items={data ?? []} />
    </div>
  );
}
