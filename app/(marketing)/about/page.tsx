import Image from 'next/image';

export default function About() {
  return (
    <>
      <section className='py-5 md:py-10'>
        <div className='wrapper flex flex-col gap-4 md:gap-8 items-center justify-center text-center max-w-4xl mx-auto px-4'>
          <div className='p-2 md:p-4'>
            <Image
              src='/assets/images/Tama.svg'
              alt='Tama avatar'
              width={100}
              height={100}
              className='rounded max-h-[70vh] object-contain object-center 2xl:max-h-[50vh]'
            />
          </div>

          <h1 className='font-heading text-3xl md:text-4xl'>About Tama M.</h1>

          <p className='font-body text-base md:text-lg leading-relaxed'>
            I live in Seddon, a charming suburb tucked into a pocket of
            Melbourne, Australia. With a background in engineering, I never
            imagined I’d discover my true passion in children's books—but facing
            a chronic illness led me to the magical world of storytelling and
            creativity.
          </p>

          <p className='font-body text-base md:text-lg leading-relaxed'>
            Through countless revisions, learning to write and draw, I’ve
            embarked on a bold journey: creating a collection of 24 children’s
            books, each diving into the wonders of the ocean.
          </p>

          <p className='font-body text-base md:text-lg leading-relaxed'>
            Fueled by the joy of storytelling and the unwavering support of my
            partner, family, friends, and wonderful proofreaders and reviewers,
            I’m excited to bring this vision to life.
          </p>
        </div>
      </section>{' '}
    </>
  );
}
