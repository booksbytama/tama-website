import Footer from '@/components/section/footer';
import Header from '@/components/section/header';

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className='flex h-screen flex-col'>
      <Header />
      <main className='flex-1 pb-14 pt-14 md:pt-16'>{children}</main>
      <Footer />
    </div>
  );
}
