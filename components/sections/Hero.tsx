import Image from 'next/image';

export default function Hero() {
  return (
    <section className=' bg-ocean-background bg-contain object-cover object-center'>
      <div className='flex flex-col items-center md:grid-cols-1 2xl:gap-0'>
        <Image
          src='/assets/images/hero.png'
          alt='hero'
          width={1053}
          height={633}
          className='rounded max-h-[70vh] object-contain object-center 2xl:max-h-[50vh]'
        />
      </div>
    </section>
  );
}
