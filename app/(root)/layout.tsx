import type { Metadata } from 'next';
import Navigation from '@/components/ui/Navigation';


export const metadata: Metadata = {
  title: 'El Kratos Embassy - Where Spiritual Resilience Meets Life',
  description:
    'A transformative faith community empowering believers to lead fulfilling lives through spiritual wisdom and practical solutions.',
  icons: {
    icon: [
      {
        rel: 'icon',
        sizes: '32x32',
        type: 'image/png',
        url: '/favicon-32x32.png',
      },
      {
        rel: 'icon',
        sizes: '16x16',
        type: 'image/png',
        url: '/favicon-16x16.png',
      },
    ],
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
  viewport: 'width=device-width, initial-scale=1',
  themeColor: '#FFD2A4',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Navigation />

      <main className="grow">{children}</main>
    </>
  );
}
