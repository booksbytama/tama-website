import type { Metadata } from 'next';
import { Fredoka, Quicksand } from 'next/font/google';
import { ClerkProvider } from '@clerk/nextjs';
import { GoogleAnalytics } from '@next/third-parties/google';
import { siteUrl } from '@/lib/site-url';
import './globals.css';

const fredoka = Fredoka({ variable: '--font-fredoka', subsets: ['latin'] });
const quicksand = Quicksand({ variable: '--font-quicksand', subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: siteUrl(),
  title: { default: 'Books by Tama', template: '%s · Books by Tama' },
  description:
    "Ocean adventures for curious little readers. Picture books and colouring books about friendship, courage and the creatures of Coral Cove. Read a free sample, then buy wherever you like.",
  icons: { icon: '/assets/images/tamalogo.png' },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <ClerkProvider
      appearance={{
        variables: {
          colorPrimary: '#0e7fc0',
          colorForeground: '#1f2b4d',
          colorBackground: '#ffffff',
          borderRadius: '0.9rem',
          fontFamily: 'var(--font-quicksand), sans-serif',
        },
        elements: { card: 'shadow-[0_20px_50px_rgba(27,42,107,0.12)]', formButtonPrimary: 'font-heading text-base' },
      }}
    >
      <html lang='en'>
        <body className={`${quicksand.variable} ${fredoka.variable}`}>
          {children}
          {process.env.NODE_ENV === 'production' && <GoogleAnalytics gaId='G-KX1JZYLVMY' />}
        </body>
      </html>
    </ClerkProvider>
  );
}
