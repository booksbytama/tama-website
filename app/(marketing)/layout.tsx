import Footer from '@/components/shared/Footer';
import Header from '@/components/shared/Header';

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className='flex h-screen flex-col'>
      <Header />
      <main className='flex-1 pt-14 pb-14'>{children}</main>
      <Footer />
    </div>
  );
}
