import type { Metadata } from 'next';
import Image from 'next/image';

export const metadata: Metadata = { title: 'About Tama M.' };

export default function About() {
  return (
    <section className='wrapper flex max-w-3xl flex-col items-center gap-6 py-10 text-center md:py-16'>
      <Image src='/assets/images/newTama.svg' alt='Tama avatar' width={120} height={120} />
      <h1 className='text-[36px] font-bold md:text-[48px]'>About Tama M.</h1>
      <p className='text-base leading-relaxed text-slate md:text-lg'>
        I live in Seddon, a charming suburb tucked into a pocket of Melbourne, Australia. With a background in engineering, I never
        imagined I’d discover my true passion in children's books—but facing a chronic illness led me to the magical world of
        storytelling and creativity.
      </p>
      <p className='text-base leading-relaxed text-slate md:text-lg'>
        Through countless revisions, learning to write and draw, I’ve embarked on a bold journey: creating a collection of 24
        children’s books, each diving into the wonders of the ocean.
      </p>
      <p className='text-base leading-relaxed text-slate md:text-lg'>
        Fueled by the joy of storytelling and the unwavering support of my partner, family, friends, and wonderful proofreaders and
        reviewers, I’m excited to bring this vision to life.
      </p>
    </section>
  );
}
