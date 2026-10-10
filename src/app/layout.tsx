import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import { StoreProvider } from '../context/StoreContext';
import { ToastContainer } from '../components/common/ToastContainer';

const sfUi = localFont({
  src: [
    { path: '../../public/fonts/SFUI-Regular.ttf', weight: '400', style: 'normal' },
    { path: '../../public/fonts/SFUI-Medium.ttf', weight: '500', style: 'normal' },
    { path: '../../public/fonts/SFUI-Bold.ttf', weight: '700', style: 'normal' },
    { path: '../../public/fonts/SFUI-Heavy.ttf', weight: '800', style: 'normal' },
  ],
  variable: '--font-sans',
  display: 'swap',
});

const codecCold = localFont({
  src: [
    { path: '../../public/fonts/CodecCold-900.ttf', weight: '900', style: 'normal' },
    { path: '../../public/fonts/CodecCold-1000.ttf', weight: '1000', style: 'normal' },
  ],
  variable: '--font-codec-cold',
  display: 'swap',
});


export const metadata: Metadata = {
  title: 'Anargya ITS EV Team: Formula Student Electric Vehicle',
  description: "Official digital platform and team merchandise store of Anargya ITS EV Team. Institut Teknologi Sepuluh Nopember's award-winning Formula Electric team.",
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
      { url: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
    ],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Anargya',
  },
  keywords: [
    'Anargya ITS',
    'Formula Student Electric',
    'FSAE Japan 2026',
    'ITS Surabaya',
    'Electric Vehicle',
    'Mark 6.0',
    'Anargya 9th Gen',
  ],
  authors: [{ name: 'Anargya ITS Visual Media Branding Team' }],
  openGraph: {
    title: 'Anargya ITS EV Team: Official Platform',
    description: "Explore Anargya Mark 6.0, FSAE Japan achievements, team divisions, and official 9th Gen merchandise.",
    url: 'https://anargyaits.com',
    siteName: 'Anargya ITS EV Team',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=1200&q=80',
        width: 1200,
        height: 630,
        alt: 'Anargya Mark 6.0 Electric Race Car',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
};

export const viewport: Viewport = {
  themeColor: '#121212',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Anargya" />
      </head>
      <body className={`${sfUi.variable} ${codecCold.variable} bg-main-dark text-white antialiased min-h-screen flex flex-col justify-between selection:bg-main-green selection:text-main-dark pb-16 lg:pb-0 font-sfui`}>
        <StoreProvider>
          <ToastContainer />
          {children}
        </StoreProvider>
      </body>
    </html>
  );
}
