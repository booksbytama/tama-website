export function Wave({ fill = 'var(--color-foam)', flip = false, className = '' }: { fill?: string; flip?: boolean; className?: string }) {
  return (
    <svg
      viewBox='0 0 1440 90'
      preserveAspectRatio='none'
      aria-hidden
      className={`block h-10 w-full md:h-[90px] ${flip ? 'rotate-180' : ''} ${className}`}
    >
      <path
        d='M0 40 C 180 90 360 0 540 40 C 720 80 900 0 1080 40 C 1260 80 1350 20 1440 40 L1440 90 L0 90 Z'
        fill={fill}
      />
    </svg>
  );
}
