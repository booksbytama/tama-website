export default function Loading() {
  return (
    <div className='wrapper flex flex-col gap-6 py-10'>
      <div className='h-10 w-2/3 max-w-md animate-pulse rounded-full bg-foam' />
      <div className='h-5 w-1/2 max-w-sm animate-pulse rounded-full bg-foam' />
      <div className='grid grid-cols-2 gap-4 md:grid-cols-4'>
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className='aspect-square animate-pulse rounded-3xl bg-foam' />
        ))}
      </div>
    </div>
  );
}
