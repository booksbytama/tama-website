import Image from 'next/image';
import { Check } from 'lucide-react';
import { Logo } from '@/components/site/logo';

const POINTS = [
  'Printable poster, colouring pages and a reading tracker — instantly',
  'Free samples of every book, saved to each child’s shelf',
  'Kids pick their profile — no passwords for little ones',
  'Be first to hear when the next Squad book lands',
];

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className='grid min-h-screen md:grid-cols-2'>
      <aside className='relative flex flex-col justify-between overflow-hidden bg-gradient-to-b from-royal to-ocean px-7 py-8 text-white md:px-14 md:py-10'>
        <div className='pointer-events-none absolute -bottom-32 -left-20 size-[420px] rounded-full bg-aqua/35' />
        <div className='relative'>
          <Logo light size={40} />
        </div>
        <div className='relative my-8 flex max-w-lg flex-col gap-5 md:my-0'>
          <h1 className='text-3xl font-bold leading-tight text-white md:text-[52px] md:leading-[1.05]'>Join free. Get the Coral Cove Starter Pack.</h1>
          <ul className='flex flex-col gap-3 text-[15px] font-semibold text-[#ddebf8] md:text-[17px]'>
            {POINTS.map((p) => (
              <li key={p} className='flex items-start gap-3'>
                <Check className='mt-0.5 size-[22px] shrink-0 text-sun' strokeWidth={2.6} /> {p}
              </li>
            ))}
          </ul>
        </div>
        <Image src='/assets/images/StarfishGroup.png' alt='' width={340} height={200} className='pointer-events-none absolute -right-8 bottom-0 hidden w-[340px] md:block' />
        <div className='relative text-[13px] font-semibold text-[#9fc4e8]'>Accounts are for parents, carers and teachers (18+).</div>
      </aside>
      <main className='flex items-center justify-center bg-sand px-5 py-10'>{children}</main>
    </div>
  );
}
