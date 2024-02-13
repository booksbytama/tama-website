import Image from 'next/image';

export default function Contact() {
  return (
    <>
      <section className='py-5 md:py-10'>
        <div className='wrapper flex flex-col gap-2 md:gap-6 items-center justify-center text-center'>
          <div className='p-2 md:p-6'>
            <Image
              src='/assets/images/stars.svg'
              alt='hero'
              width={900}
              height={400}
              className='rounded max-h-[70vh] object-contain object-center 2xl:max-h-[50vh]'
            />
          </div>

          <p className='p-regular-20 md:p-regular-24'>
            Your thoughts mean a lot! Please leave a review or share your
            feedback. Each review is like a treasure map guiding me to craft an
            even better story. I'll read every word with a heart full of
            gratitude!
          </p>
          <p className='p-regular-20 md:p-regular-24'>
            Email <span className='text-blue-600'>tama@booksbytama.com</span> if
            you would like to proofread or review the draft of the next book in
            the series.
          </p>
          <div className='p-2 md:p-6'>
            <Image
              src='/assets/images/thankyou.svg'
              alt='hero'
              width={800}
              height={400}
              className='rounded max-h-[70vh] object-contain object-center 2xl:max-h-[50vh]'
            />
          </div>
        </div>
      </section>{' '}
    </>
  );
}
