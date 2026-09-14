import { Star } from 'lucide-react';
import type { ProfileColour } from '@/lib/db/types';

export const COLOUR_CLASS: Record<ProfileColour, string> = {
  pink: 'bg-shelly',
  yellow: 'bg-sun',
  coral: 'bg-coral',
  aqua: 'bg-aqua',
  green: 'bg-seaweed',
  purple: 'bg-[#8b5cf6]',
};

export function ProfileAvatar({ colour, size = 96, className = '' }: { colour: ProfileColour; size?: number; className?: string }) {
  return (
    <div
      className={`flex items-center justify-center rounded-full border-[5px] border-white shadow-[0_10px_24px_rgba(27,42,107,0.18)] ${COLOUR_CLASS[colour]} ${className}`}
      style={{ width: size, height: size }}
    >
      <Star className='text-white' style={{ width: size * 0.55, height: size * 0.55 }} fill='currentColor' strokeWidth={0} />
    </div>
  );
}
