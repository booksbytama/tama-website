import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

export const metadata: Metadata = { title: 'Activities' };

const CLUES = {
  L: 'Seddon: Café starts with ‘L’ — Spanish-Portuguese inspired, with a kids’ corner and warm local vibe on Charles Street.',
  F: 'Seddon: Family-friendly café by Seddon Station that starts with ‘F’ — courtyard & play cubby.',
  C: 'West Footscray: Bookshop starts with ‘C’ — filled with stories, plants, and local charm in the heart of Barkly Street.',
};

const SETS = [
  {
    id: 'setA',
    name: 'Set A',
    pages: [
      { image: 'set-a-p1.png', clues: ['Seddon: Shop starts with ‘H’ — independent greengrocer known for fresh fruit & veg, with a deli.', CLUES.L] },
      { image: 'set-a-p2.png', clues: [CLUES.F] },
      { image: 'set-a-p3.png', clues: ['Seddon: A family-run café on Victoria St that starts with ‘A’; famous for pastries & coffee.', 'Seddon: Bakery starts with ‘S’ — warm bread, yummy pastries, and big smiles on Victoria Street!'] },
    ],
  },
  {
    id: 'setB',
    name: 'Set B',
    pages: [
      { image: 'set-b-p1.png', clues: ['Seddon: Café on Charles St that starts with ‘19’ — spacious rooms & a sunny courtyard.', CLUES.L, CLUES.C] },
      { image: 'set-b-p2.png', clues: ['Seddon: Café starts with ‘T’ — in the former post office on Victoria Street, with bright interiors and a homey feel.', CLUES.L, CLUES.C] },
      { image: 'set-b-p3.png', clues: [CLUES.F, CLUES.C] },
    ],
  },
];

export default function Activities() {
  return (
    <>
      <section className='relative bg-royal'>
        <Image src='/assets/images/activity_hero.png' alt='' width={1053} height={633} className='mx-auto max-h-[50vh] w-auto object-contain' priority />
        <h1 className='absolute inset-0 flex items-center justify-center text-4xl font-bold text-white drop-shadow md:text-6xl'>Activities</h1>
      </section>

      <section className='wrapper flex max-w-3xl flex-col items-center gap-4 py-10 text-center md:py-14'>
        <h2 className='text-[28px] font-semibold md:text-[40px]'>We're glad you're here</h2>
        <p className='text-base leading-relaxed text-slate md:text-lg'>
          Check out some of our fun activities and games below. We keep adding to this collection, so visit again for updates. Enjoy
          exploring and playing along with the Starfish Super Squad!
        </p>
      </section>

      <section className='bg-foam py-10 md:py-14'>
        <div className='wrapper flex max-w-4xl flex-col items-center gap-6 text-center'>
          <h2 className='text-[28px] font-semibold md:text-[40px]'>Colouring-in treasure hunt</h2>
          <p className='text-base leading-relaxed text-slate md:text-lg'>
            Each colouring page is hidden in a nearby shop in Seddon, Yarraville and West Footscray — can you find them all? Follow the
            clues to collect every page in the set.
          </p>
          <div className='flex gap-3'>
            {SETS.map((s) => (
              <Link key={s.id} href={`#${s.id}`} className='btn-outline btn-md font-body font-bold'>
                {s.name}
              </Link>
            ))}
          </div>
          {SETS.map((s) => (
            <div key={s.id} id={s.id} className='flex w-full scroll-mt-24 flex-col gap-4 pt-6'>
              <h3 className='text-2xl font-semibold md:text-3xl'>{s.name}</h3>
              {s.pages.map((p, i) => (
                <div key={p.image} className='grid gap-4 rounded-3xl border-2 border-sand-deep bg-white p-4 text-left md:grid-cols-2'>
                  <Image src={`/assets/images/${p.image}`} alt={`Colouring page ${i + 1}`} width={800} height={800} className='h-60 w-full object-contain md:h-80' />
                  <div className='flex flex-col justify-center gap-3'>
                    <div className='flex size-11 items-center justify-center self-center rounded-full border-2 border-royal font-heading text-2xl text-royal'>{i + 1}</div>
                    {p.clues.map((c) => {
                      const [place, ...rest] = c.split(': ');
                      return (
                        <p key={c} className='text-base text-slate md:text-lg'>
                          <span className='font-bold text-ink'>{place}:</span> {rest.join(': ')}
                        </p>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>

      <section className='wrapper flex flex-col items-center gap-4 py-10 text-center md:py-14'>
        <Image src='/assets/images/ShellySpikeSuzyGroupHug.png' alt='' width={360} height={220} />
        <p className='text-base text-slate md:text-lg'>Watch this space for more activities coming soon!</p>
      </section>
    </>
  );
}
