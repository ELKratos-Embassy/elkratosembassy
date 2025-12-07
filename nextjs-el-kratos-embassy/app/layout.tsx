import { Montserrat } from 'next/font/google';
import './globals.css';

const montserrat = Montserrat({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-montserrat',
  weight: ['400', '500', '600', '700'],
});


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={montserrat.variable}>
      <body
        className={`${montserrat.className} antialiased min-h-screen flex flex-col`}
      >
        <main className="grow">{children}</main>
      </body>
    </html>
  );
}
