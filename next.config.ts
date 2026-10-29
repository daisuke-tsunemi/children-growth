import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 開発サーバーへスマホ等の別端末から(PCのIPアドレス等で)アクセスする場合に許可するホスト名。
  // 未指定だとNext.jsが開発用のJSへの接続を遮断し、チャートやボタンが動かなくなる(本番ビルドには影響しない)
  allowedDevOrigins: process.env.ALLOWED_DEV_ORIGINS?.split(',').map((origin) => origin.trim()).filter(Boolean),
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.microcms-assets.io',
      },
    ],
  },
};

export default nextConfig;
