import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { DM_Sans } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });
const dm_sans = DM_Sans({ subsets: ['latin'], weight: ['400', '500', '700'] });

export const metadata: Metadata = {
  title: 'Tama Portforlio',
  description: 'Books By Tama',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body className={dm_sans.className}>{children}</body>
    </html>
  );
}
