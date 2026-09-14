import { HeaderAuth } from './auth-buttons';
import { Logo } from './logo';
import { NavLinks } from './nav-links';

export function Header() {
  return (
    <header className='sticky top-0 z-40 border-b border-sand-deep/60 bg-sand/95 backdrop-blur'>
      <div className='wrapper flex h-[72px] items-center justify-between'>
        <Logo />
        <NavLinks />
        <div className='flex items-center gap-2 md:gap-3'>
          <HeaderAuth />
        </div>
      </div>
    </header>
  );
}
