import Image from 'next/image';

export default function Contact() {
  return (
    <>
      <section className='py-5 md:py-10'>
        <div className='wrapper flex flex-col gap-4 md:gap-8 items-center justify-center text-center max-w-4xl mx-auto px-4'>
          <div className='p-2 md:p-4'>
            <Image
              src='/assets/images/stars.svg'
              alt='Decorative starfish-themed illustration'
              width={900}
              height={400}
              className='rounded max-h-[70vh] object-contain object-center 2xl:max-h-[50vh]'
            />
          </div>

          <h1 className='font-heading text-3xl md:text-4xl'>
            🌟 We’d Love to Hear From You!
          </h1>

          <p className='font-body text-base md:text-lg leading-relaxed'>
            Your thoughts mean the world to us! Whether you're a young reader, a
            parent, a teacher, or a book-loving supporter, your feedback is like
            a treasure map — guiding us toward even better stories.
          </p>

          <p className='font-body text-base md:text-lg leading-relaxed'>
            <span className='font-semibold'>
              ✨ Leave a review or share your feedback
            </span>{' '}
            to help shape future adventures in the Starfish Super Squad series.
            Every message is read with a heart full of gratitude!
          </p>

          <div className='p-4 flex flex-col border-1 rounded-3xl font-body text-base md:text-lg leading-relaxed'>
            <p className='font-semibold text-blue-500'>
              ✨ Want to be part of the journey?
            </p>{' '}
            <p>
              If you'd like to proofread or review the next book before it
              launches, we’d love to hear from you! Email Tama at:{' '}
              <a
                href='mailto:tama@booksbytama.com'
                className='text-blue-700 underline hover:text-blue-900 transition-colors duration-200 my-auto'
              >
                tama@booksbytama.com
              </a>
            </p>
          </div>
        </div>
      </section>{' '}
    </>
  );
}
