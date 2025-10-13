import type { Metadata } from 'next';
import { Geist, Geist_Mono, Fredoka, Quicksand } from 'next/font/google';
import './globals.css';
import { GoogleAnalytics } from '@next/third-parties/google';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const fredoka = Fredoka({
  variable: '--font-fredoka',
  subsets: ['latin'],
});

const quicksand = Quicksand({
  variable: '--font-quicksan',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Books By Tama',
  description:
    "Dive into fun, illustrated children's books about ocean animals, friendship, and adventure. Perfect for ages 4–10. Shop books, activities & teacher tools!",
  icons: {
    icon: [
      {
        url: '/assets/images/tamalogo.png', // /public path
        href: '/assets/images/tamalogo.png', // /public path
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body className={`${quicksand.variable} ${fredoka.variable} antialiased`}>
        {children} <GoogleAnalytics gaId='G-KX1JZYLVMY' />
      </body>
    </html>
  );
}
