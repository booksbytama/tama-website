import { DownloadsManager } from '@/components/admin/downloads-manager';
import { listDownloads } from '@/lib/db/downloads';

export default async function AdminDownloadsPage() {
  const items = await listDownloads(true);
  return (
    <div className='flex flex-col gap-6'>
      <div>
        <h1 className='text-[32px] font-semibold'>Starter pack</h1>
        <p className='text-[15px] font-semibold text-mist'>PDFs members can download from their account. Stored privately; links expire after a few minutes.</p>
      </div>
      <DownloadsManager items={items} />
    </div>
  );
}
