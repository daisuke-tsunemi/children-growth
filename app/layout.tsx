import type { Metadata } from 'next';
import './globals.css';
import { zenKaku } from '../lib/fonts';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { SITE_NAME } from '../lib/config';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.BASE_URL || 'http://localhost:3000'),
  robots: 'noindex, nofollow',
  title: {
    template: `%s | ${SITE_NAME}`,
    default: SITE_NAME,
  },
  description: '子どもの成長記録(身長・体重・予防接種・日々の記録)を管理するアプリです。',
};

type Props = {
  children: React.ReactNode;
};

export default function RootLayout({ children }: Props) {
  return (
    <html lang="ja" className={zenKaku.variable}>
      <body className="flex min-h-screen flex-col bg-gray-50 text-gray-900">
        <Header />
        <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
