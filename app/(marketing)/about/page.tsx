import Image from 'next/image';

export default function About() {
  return (
    <>
      <section className=' py-5 md:py-10'>
        <div className='wrapper grid grid-cols-1 '>
          <div className='flex flex-col justify-center gap-8 md:px-20'>
            <h1 className='h1-bold text-blue-800'>About Tama M.</h1>

            <p className='p-regular-16 md:p-regular-20'>
              I live in Seddon, a charming suburb tucked into a pocket of
              Melbourne, Australia. With a background in engineering, I never
              expected to discover my true passion in children's books—but
              facing a chronic illness led me to the magical world of
              storytelling and creativity.
            </p>
            <p className='p-regular-16 md:p-regular-20'>
              Through countless revisions, learning to write and draw, I’ve
              embarked on a bold journey: creating a collection of 24 children’s
              books, each diving into the wonders of the ocean.
            </p>
            <p className='p-regular-16 md:p-regular-20'>
              Fuelled by the joy of storytelling and the unwavering support of
              my partner, family, friends, and incredible proof-readers and
              reviewers, I’m excited to bring this vision to life.
            </p>

            <div className='flex flex-col md:flex-row justify-between'>
              <div className='p-2 md:p-6'>
                <Image
                  src='/assets/images/thankyou.svg'
                  alt='hero'
                  width={400}
                  height={400}
                  className='rounded max-h-[70vh] object-contain object-center 2xl:max-h-[50vh]'
                />
              </div>
              <div className='p-2 md:p-6 flex place-content-end'>
                <Image
                  src='/assets/images/tama.svg'
                  alt='hero'
                  width={200}
                  height={200}
                  className='rounded max-h-[70vh] object-contain object-center 2xl:max-h-[50vh]'
                />
              </div>
            </div>
          </div>
        </div>
      </section>{' '}
    </>
  );
}
