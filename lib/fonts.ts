import { Zen_Kaku_Gothic_New } from 'next/font/google';

// 全ページで使用するフォントを一元管理する(重複読み込みを防ぐ)
export const zenKaku = Zen_Kaku_Gothic_New({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-zen-kaku',
  display: 'swap',
  preload: false,
  adjustFontFallback: true,
});
