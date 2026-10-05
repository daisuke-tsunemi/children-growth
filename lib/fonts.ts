import { Nunito } from 'next/font/google';
import localFont from 'next/font/local';


export const nunito = Nunito({
  subsets: ['latin'],
  weight: ['400', '600', '700', '800'],
  variable: '--font-nunito',
  display: 'swap',
  preload: false,
});

export const zenMaruGothic = localFont({
  src: [
    { path: '../app/fonts/ZenMaruGothic-Regular.woff2', weight: '400', style: 'normal' },
    { path: '../app/fonts/ZenMaruGothic-Medium.woff2', weight: '500', style: 'normal' },
    { path: '../app/fonts/ZenMaruGothic-Bold.woff2', weight: '700', style: 'normal' },
  ],
  variable: '--font-zen-maru',
  display: 'swap',
  preload: false,
});
