'use client';

import Link from 'next/link';
import { useAuth } from '@clerk/nextjs';
import { BookOpen, Sparkles } from 'lucide-react';

// Book pages are statically cached, so the "read" button decides client-side
// whether this visitor gets the whole book (signed in + flagged) or the sample.
export function ReadCta({ slug, samplePages, pageCount, memberFullBook }: { slug: string; samplePages: number; pageCount: number; memberFullBook: boolean }) {
  const { isLoaded, isSignedIn } = useAuth();
  if (pageCount === 0 || (samplePages === 0 && !memberFullBook)) {
    return <div className='rounded-full border-2 border-dashed border-line py-4 text-center text-sm font-bold text-mist'>Sample coming soon</div>;
  }
  if (memberFullBook && isLoaded && isSignedIn) {
    return (
      <Link href={`/read/${slug}`} className='btn-primary btn-lg w-full'>
        <BookOpen className='size-[22px]' strokeWidth={2.2} /> Read the whole book · {pageCount} pages
      </Link>
    );
  }
  return (
    <div className='flex flex-col gap-2.5'>
      <Link href={`/read/${slug}`} className='btn-primary btn-lg w-full'>
        <BookOpen className='size-[22px]' strokeWidth={2.2} /> Read the free sample · {samplePages} pages
      </Link>
      {memberFullBook && (
        <Link href='/sign-up' className='btn-sun btn-md w-full font-body font-bold'>
          <Sparkles className='size-[18px]' strokeWidth={2.2} /> Join free to read the whole book
        </Link>
      )}
    </div>
  );
}
