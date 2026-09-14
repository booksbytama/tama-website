import { Footer } from '@/components/site/footer';
import { Header } from '@/components/site/header';
import { MobileTabBar } from '@/components/site/mobile-tabbar';

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className='flex min-h-screen flex-col pb-[72px] md:pb-0'>
      <Header />
      <main className='flex-1'>{children}</main>
      <Footer />
      <MobileTabBar />
    </div>
  );
}
