export default function ReaderLoading() {
  return (
    <div className='flex h-dvh flex-col items-center justify-center gap-4 bg-gradient-to-b from-royal-deep to-[#1479c4] text-white'>
      <div className='h-[60vh] w-[min(80vw,42vh)] animate-pulse rounded-[14px] bg-white/15' />
      <div className='font-heading text-lg font-semibold text-[#c9ddf2]'>Opening the book…</div>
    </div>
  );
}
