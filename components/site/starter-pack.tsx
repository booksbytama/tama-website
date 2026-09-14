import Image from 'next/image';
import Link from 'next/link';
import { auth } from '@clerk/nextjs/server';
import { Check, Map } from 'lucide-react';

const ITEMS = [
  { title: 'Coral Cove poster', meta: 'A3 · PDF' },
  { title: '6 colouring pages', meta: 'One from each book · PDF' },
  { title: 'Treasure-map reading tracker', meta: 'Sticker a stop per book · PDF' },
];

export async function StarterPackBand() {
  const { userId } = await auth();
  return (
    <section className='wrapper'>
      <div className='relative overflow-hidden rounded-[2rem] bg-royal px-6 py-10 text-white md:rounded-[2.5rem] md:px-16 md:py-14'>
        <div className='pointer-events-none absolute -right-16 -top-16 size-80 rounded-full bg-ocean/50' />
        <div className='pointer-events-none absolute -bottom-32 right-32 size-64 rounded-full bg-aqua/35' />
        <div className='relative grid gap-10 md:grid-cols-[1.2fr_1fr] md:items-center'>
          <div className='flex flex-col gap-4'>
            <span className='eyebrow self-start rounded-full bg-sun px-3.5 py-2 text-royal'>Free when you join</span>
            <h2 className='text-3xl font-semibold text-white md:text-[40px] md:leading-tight'>Sign up and get the Coral Cove Starter Pack</h2>
            <p className='max-w-lg text-[17px] leading-relaxed text-[#c9ddf2] md:text-lg'>
              A printable poster, colouring pages and a reading map — yours to download the moment you join. Plus a profile for
              each of your kids to save their favourite samples. Free, no card needed.
            </p>
            <ul className='flex flex-col gap-2 text-[15px] font-semibold text-[#ddebf8] md:hidden'>
              {ITEMS.map((i) => (
                <li key={i.title} className='flex items-center gap-2.5'>
                  <Check className='size-[18px] text-sun' strokeWidth={2.8} /> {i.title}
                </li>
              ))}
            </ul>
            <div className='mt-2 flex flex-col gap-3 sm:flex-row'>
              {userId ? (
                <Link href='/account/pack' className='btn-cta btn-lg'>
                  Open my starter pack
                </Link>
              ) : (
                <>
                  <Link href='/sign-up' className='btn-cta btn-lg'>
                    Get my free pack
                  </Link>
                  <Link href='/sign-in' className='btn-ghost-light btn-lg'>
                    Sign in
                  </Link>
                </>
              )}
            </div>
          </div>
          <div className='hidden grid-cols-3 gap-3.5 md:grid'>
            <PackTile title={ITEMS[0].title} meta={ITEMS[0].meta}>
              <Image src='/assets/images/hero.png' alt='' width={300} height={400} className='size-full object-cover' />
            </PackTile>
            <PackTile title={ITEMS[1].title} meta={ITEMS[1].meta}>
              <Image src='/assets/images/StarfishGroup.png' alt='' width={300} height={300} className='w-[90%] grayscale contrast-150 brightness-110' />
            </PackTile>
            <PackTile title={ITEMS[2].title} meta={ITEMS[2].meta} tint>
              <Map className='size-16 text-royal' strokeWidth={1.8} />
            </PackTile>
          </div>
        </div>
      </div>
    </section>
  );
}

function PackTile({ title, meta, tint, children }: { title: string; meta: string; tint?: boolean; children: React.ReactNode }) {
  return (
    <div className='flex flex-col gap-2.5 rounded-[20px] border border-white/25 bg-white/10 p-4'>
      <div className={`flex aspect-[3/4] w-full items-center justify-center overflow-hidden rounded-xl ${tint ? 'bg-[#fbf3df]' : 'bg-white'}`}>
        {children}
      </div>
      <div className='font-heading text-base font-semibold'>{title}</div>
      <div className='text-xs font-semibold text-[#c9ddf2]'>{meta}</div>
    </div>
  );
}
