import Image from 'next/image';
import Link from 'next/link';

export default function Activities() {
  return (
    <>
      {/* Heading section */}
      <section className='bg-[url(/assets/images/ocean-background.png)] bg-contain  object-center'>
        <div className='relative'>
          <h1 className='font-body text-3xl font-semibold md:text-5xl text-white absolute inset-0 flex items-center justify-center  '>
            ACTIVITIES
          </h1>
          <div className='flex flex-col items-center md:grid-cols-1 2xl:gap-0'>
            <Image
              src='/assets/images/activity_hero.png'
              alt='hero'
              width={1053}
              height={633}
              className='rounded max-h-[70vh] object-contain object-center 2xl:max-h-[50vh]'
            />
          </div>
        </div>
      </section>
      {/* Body Section */}
      <section className='flex flex-col py-5 md:py-12'>
        <div className='wrapper flex flex-col gap-4 md:gap-8 items-center justify-center text-center max-w-4xl mx-auto px-4'>
          <h1 className='font-heading text-3xl md:text-4xl text-blue-500'>
            💖 We're Glad That You Are Here!
          </h1>

          <p className='font-body text-base md:text-lg leading-relaxed'>
            Check out some of our fun activities and games below! We will keep
            adding to this collection so be sure to visit this page again for
            any updates. We hope you enjoy exploring and playing along with the
            Starfish Super Squad!
          </p>
        </div>
      </section>{' '}
      <section className=' bg-blue-50 py-5 md:py-12 '>
        <div className='flex flex-col gap-4 md:gap-8 items-center justify-center text-center max-w-4xl mx-auto px-4'>
          <h1 className='font-heading  text-3xl md:text-4xl text-blue-500'>
            Colouring-In Pictures
          </h1>
          <p className='font-body text-base md:text-lg leading-relaxed'>
            Join the Starfish Super Squad on a local treasure hunt! 🧭 Each
            colouring page is hidden in a nearby shop in Seddon and Yarraville —
            can you find them all?
          </p>
          <p className='font-body text-base font-semibold md:text-lg leading-relaxed'>
            Follow the clues below to collect every page in the set.
          </p>

          <div className='flex flex-col sm:flex-row gap-4 mt-2 md:mt-4  p-4'>
            <div className='p-2 border-2 rounded-2xl w-30 shadow-md  border-blue-300 shadow-blue-300 flex flex-col gap-2 items-center text-blue-400'>
              <Link
                href='#setA'
                className=' font-body font-semibold text-xl  items-center flex flex-col   '
              >
                <p>Set A</p>
              </Link>
            </div>
            <div className='p-2 border-2 rounded-2xl w-30 shadow-md  flex flex-col gap-2 items-center border-blue-300 shadow-blue-300  text-blue-400'>
              <Link
                href='#setB'
                className='font-body font-semibold text-xl  items-center flex flex-col'
              >
                <p>Set B</p>
              </Link>
            </div>
          </div>
          <div id='setA'>
            <h2 className='font-heading  text-2xl    p-4 rounded-xl md:text-3xl text-blue-500'>
              SET A
            </h2>
            <div className='mx-auto max-w-4xl px-4 md:px-6'>
              {/* Row 1 */}
              <div className='mb-4 grid grid-cols-1  md:grid-cols-2 gap-3 md:gap-4 rounded-xl border border-gray-200 bg-white/80 p-3 md:p-4 shadow-sm font-body'>
                {/* Picture */}

                <div className='relative w-full  rounded-lg'>
                  <Image
                    src='/assets/images/set-a-p1.png'
                    alt='Colouring page 1'
                    width={800}
                    height={800}
                    className='h-60 w-full object-contain md:h-80'
                  />
                </div>

                {/* Clue */}
                <div className='flex flex-col justify-center  w-full '>
                  <h3 className='font-heading  text-3xl md:text-4xl text-blue-500 text-center p-6 inline-flex size-10 items-center justify-center rounded-full border-2 border-current font-semibold self-center'>
                    1{' '}
                  </h3>

                  <p className='text-base md:text-lg text-left mt-4'>
                    <span className='font-semibold'>Seddon:</span> Shop starts
                    with ‘H’ — independent greengrocer known for fresh fruit &
                    veg, with a deli.
                  </p>
                </div>
              </div>
              {/* Row 2 */}
              <div className='mb-4 grid grid-cols-1  md:grid-cols-2 gap-3 md:gap-4 rounded-xl border border-gray-200 bg-white/80 p-3 md:p-4 shadow-sm font-body'>
                {/* Picture */}

                <div className='relative w-full  rounded-lg'>
                  <Image
                    src='/assets/images/set-a-p2.png'
                    alt='Colouring page 2'
                    width={800}
                    height={800}
                    className='h-60 w-full object-contain md:h-80'
                  />
                </div>

                {/* Clue */}
                <div className='flex flex-col justify-center  w-full '>
                  <h3 className='font-heading  text-3xl md:text-4xl text-blue-500 text-center p-6 inline-flex size-10 items-center justify-center rounded-full border-2 border-current font-semibold self-center'>
                    2{' '}
                  </h3>
                  {/* <p className='text-base md:text-lg text-left mt-4'>
                  <span className='font-semibold'>Seddon shop</span> that starts
                  with ‘19…’
                </p> */}
                  <p className='text-base md:text-lg text-left mt-4'>
                    <span className='font-semibold'>Seddon: </span>
                    Family-friendly café by Seddon Station that starts with
                    ‘F’—courtyard & play cubby.
                  </p>
                </div>
              </div>

              {/* Row 3 */}
              <div className='mb-4 grid grid-cols-1  md:grid-cols-2 gap-3 md:gap-4 rounded-xl border border-gray-200 bg-white/80 p-3 md:p-4 shadow-sm font-body'>
                {/* Picture */}

                <div className='relative w-full  rounded-lg'>
                  <Image
                    src='/assets/images/set-a-p3.png'
                    alt='Colouring page 3'
                    width={800}
                    height={800}
                    className='h-60 w-full object-contain md:h-80'
                  />
                </div>

                {/* Clue */}
                <div className='flex flex-col justify-center  w-full '>
                  <h3 className='font-heading  text-3xl md:text-4xl text-blue-500 text-center p-6 inline-flex size-10 items-center justify-center rounded-full border-2 border-current font-semibold self-center'>
                    3{' '}
                  </h3>

                  <p className='text-base md:text-lg text-left mt-4'>
                    <span className='font-semibold'>Seddon: </span> A family-run
                    café on Victoria St that starts with ‘A’; famous for
                    pastries & coffee.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div id='setB'>
            <h2 className='font-heading  text-2xl    p-4 rounded-xl md:text-3xl text-blue-500'>
              SET B
            </h2>
            <div className='mx-auto max-w-4xl px-4 md:px-6'>
              {/* Row 1 */}
              <div className='mb-4 grid grid-cols-1  md:grid-cols-2 gap-3 md:gap-4 rounded-xl border border-gray-200 bg-white/80 p-3 md:p-4 shadow-sm font-body'>
                {/* Picture */}

                <div className='relative w-full  rounded-lg'>
                  <Image
                    src='/assets/images/set-b-p1.png'
                    alt='Colouring page 1'
                    width={800}
                    height={800}
                    className='h-60 w-full object-contain md:h-80'
                  />
                </div>

                {/* Clue */}
                <div className='flex flex-col justify-center  w-full '>
                  <h3 className='font-heading  text-3xl md:text-4xl text-blue-500 text-center p-6 inline-flex size-10 items-center justify-center rounded-full border-2 border-current font-semibold self-center'>
                    1{' '}
                  </h3>
                  <p className='text-base md:text-lg text-left mt-4'>
                    <span className='font-semibold'>Seddon: </span> Café on
                    Charles St that starts with ‘19’ — spacious rooms & a sunny
                    courtyard.
                  </p>
                </div>
              </div>
              {/* Row 2 */}
              <div className='mb-4 grid grid-cols-1  md:grid-cols-2 gap-3 md:gap-4 rounded-xl border border-gray-200 bg-white/80 p-3 md:p-4 shadow-sm font-body'>
                {/* Picture */}

                <div className='relative w-full  rounded-lg'>
                  <Image
                    src='/assets/images/set-b-p2.png'
                    alt='Colouring page b'
                    width={800}
                    height={800}
                    className='h-60 w-full object-contain md:h-80'
                  />
                </div>

                {/* Clue */}
                <div className='flex flex-col justify-center  w-full '>
                  <h3 className='font-heading  text-3xl md:text-4xl text-blue-500 text-center p-6 inline-flex size-10 items-center justify-center rounded-full border-2 border-current font-semibold self-center'>
                    2{' '}
                  </h3>

                  <p className='text-base md:text-lg text-left mt-4'>
                    <span className='font-semibold'>Seddon: </span> Café starts
                    with ‘T’ — in the former post office on Victoria Street,
                    with bright interiors and a homey feel.
                  </p>
                </div>
              </div>

              {/* Row 3 */}
              <div className='mb-4 grid grid-cols-1  md:grid-cols-2 gap-3 md:gap-4 rounded-xl border border-gray-200 bg-white/80 p-3 md:p-4 shadow-sm font-body'>
                {/* Picture */}

                <div className='relative w-full  rounded-lg'>
                  <Image
                    src='/assets/images/set-b-p3.png'
                    alt='Colouring page 3'
                    width={800}
                    height={800}
                    className='h-60 w-full object-contain md:h-80'
                  />
                </div>

                {/* Clue */}
                <div className='flex flex-col justify-center  w-full '>
                  <h3 className='font-heading  text-3xl md:text-4xl text-blue-500 text-center p-6 inline-flex size-10 items-center justify-center rounded-full border-2 border-current font-semibold self-center'>
                    3{' '}
                  </h3>
                  <p className='text-base md:text-lg text-left mt-4'>
                    <span className='font-semibold'>Seddon: </span>
                    Family-friendly café by Seddon Station that starts with
                    ‘F’—courtyard & play cubby.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className='flex flex-col py-5 md:py-12'>
        <div className='wrapper flex flex-col gap-4 md:gap-8 items-center justify-center text-center max-w-4xl mx-auto px-4'>
          {/* <h1 className='font-heading text-3xl md:text-4xl text-blue-500'>
            💖 We're Glad That You Are Here!
          </h1> */}
          <div className='flex flex-col items-center md:grid-cols-1 2xl:gap-0'>
            <Image
              src='/assets/images/ShellySpikeSuzyGroupHug.png'
              alt='hero'
              width={400}
              height={400}
              className='rounded max-h-[70vh] object-contain object-center 2xl:max-h-[50vh]'
            />
          </div>

          <p className='font-body text-base md:text-lg leading-relaxed'>
            Watch this space for more activities coming soon!
          </p>
        </div>
      </section>{' '}
    </>
  );
}
