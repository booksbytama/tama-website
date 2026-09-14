import type { Metadata } from 'next';
import Image from 'next/image';

export const metadata: Metadata = { title: 'Contact' };

export default function Contact() {
  return (
    <section className='wrapper flex max-w-3xl flex-col items-center gap-6 py-10 text-center md:py-16'>
      <Image src='/assets/images/stars.svg' alt='' width={900} height={400} className='max-h-48 w-auto' />
      <h1 className='text-[36px] font-bold md:text-[48px]'>We’d love to hear from you</h1>
      <p className='text-base leading-relaxed text-slate md:text-lg'>
        Whether you're a young reader, a parent, a teacher, or a book-loving supporter, your feedback is like a treasure map — guiding
        us toward even better stories. Leave a review or share your thoughts to help shape future adventures in the Starfish Super
        Squad series.
      </p>
      <div className='flex w-full flex-col gap-2 rounded-3xl border-2 border-sand-deep bg-white p-6 text-base leading-relaxed text-slate md:text-lg'>
        <p className='font-heading text-xl font-semibold text-royal'>Want to be part of the journey?</p>
        <p>
          If you'd like to proofread or review the next book before it launches — or you're a teacher or school looking for classroom
          copies — email Tama at{' '}
          <a href='mailto:tama@booksbytama.com' className='font-bold text-ocean underline underline-offset-4 hover:text-royal'>
            tama@booksbytama.com
          </a>
        </p>
      </div>
    </section>
  );
}
