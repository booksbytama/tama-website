import Image from 'next/image';

export default function About() {
  return (
    <>
      <section className=' py-5 md:py-10'>
        <div className='wrapper grid grid-cols-1 '>
          <div className='flex flex-col justify-center gap-8 md:px-20'>
            <h1 className='h1-bold text-blue-800'>A Note from the Author</h1>

            <p className='p-regular-16 md:p-regular-20'>
              Children’s books filled my childhood with wonder. Each page held a
              portal to adventure, a spark of imagination, and a treasure trove
              of knowledge. Yet, I had limited access to these stories, which
              created a sense of longing for more that still fuels my passion
              today.
            </p>
            <p className='p-regular-16 md:p-regular-20'>
              Today, I strive to bridge that gap, crafting books that ignite
              curiosity and foster learning in young minds. Driven by a love for
              vibrant imagination and the power of storytelling, I embarked on
              creating a series of children’s books that immerse young minds in
              the wonders of the underwater world. I believe in fostering
              curiosity, compassion, and a love for learning through engaging
              narratives and captivating illustrations.
            </p>
            <p className='p-regular-16 md:p-regular-20'>
              As an author, my goal is to create books that help children learn
              about the natural world, important values, and emotional
              intelligence.
            </p>
            <p className='p-regular-16 md:p-regular-20'>
              My debut book, released on Christmas Eve 2023, marked the
              beginning of an ambitious journey. I envision a collection of 24
              children’s books, each delving into the fascinating world of the
              ocean. Although I am uncertain about how to achieve this ambitious
              vision, I believe the sheer joy of creation and the unwavering
              support from my partner, family, friends, and superstar
              proofreaders and reviewers will help drive this vision and make it
              possible.
            </p>
            <p className='p-regular-16 md:p-regular-20'>
              Your feedback is invaluable to me as I embark on this ongoing
              adventure. Every review serves as a compass, guiding me toward
              crafting even more enriching and captivating stories for young
              readers. I truly appreciate your thoughts and insights. Please
              share your experience with my book.
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
