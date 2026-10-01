import Header from '@/components/Header';
import Footer from '@/components/Footer';
import '@/styles/css/globals.css';
import styles from './layout.module.scss';
import { Suspense } from 'react';
import { Metadata } from 'next';
import SvgDefs from '@/components/SvgDefs';
import { montserrat, zenKaku } from '@/libs/fonts';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.BASE_URL || 'https://inner-communication.vercel.app'),
  robots: 'noindex, nofollow',
  title: {
    template: '%s | 子どもの成長記録一覧システム',
    default: '子どもの成長記録一覧システム',
  },
  description:'子どもの成長記録一覧システムです。',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  openGraph: {
    title: {
      template: '%s | 子どもの成長記録一覧システム',
      default: '子どもの成長記録一覧システム',
    },
    description:'子どもの成長記録一覧システムです。',
    type: 'website',
    url: '/',
    locale: 'ja_JP',
    siteName: '子どもの成長記録一覧システム',
  },
  twitter: {
    card: 'summary_large_image',
    title: '子どもの成長記録一覧システム',
    description:'子どもの成長記録一覧システムです。',
  },
  alternates: {
    canonical: '/',
  },
};

type Props = {
  children: React.ReactNode;
};

export default async function RootLayout({ children }: Props) {
  return (
    <html lang="ja" className={`${montserrat.variable} ${zenKaku.variable}`} data-scroll-behavior="smooth">
      <meta name="viewport" content="width=device-width,initial-scale=1" />
      <body>
        <Suspense fallback={<div className={styles.loading}>Loading...</div>}>
          <SvgDefs />
          <Header />
          <main className={styles.main}>{children}</main>
          <Footer />
        </Suspense>
      </body>
    </html>
  );
}
