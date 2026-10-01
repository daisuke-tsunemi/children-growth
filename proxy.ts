import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * 全ルートをBasic認証で保護する(子どもの写真・健康情報を扱うため)。
 *
 * `BASIC_AUTH_USER`・`BASIC_AUTH_PASSWORD`の両方が設定されている場合のみ保護を有効にする。
 * テンプレートとして配布する前提のため、未設定でも起動は継続し、保護なしであることを警告する
 * (`詳細設計書`ではなく`CLAUDE.md`「セキュリティ・プライバシー」参照)。
 */
export function proxy(request: NextRequest) {
  const user = process.env.BASIC_AUTH_USER;
  const password = process.env.BASIC_AUTH_PASSWORD;

  // 現在のパスをServer Component(`headers()`)から読めるよう、リクエストヘッダへ転記する
  // (`ChildSwitcher`が「切り替え後に同じページへ戻る」ために使う)
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-pathname', request.nextUrl.pathname);
  const nextOptions = { request: { headers: requestHeaders } };

  if (!user || !password) {
    console.warn(
      '[proxy] BASIC_AUTH_USER / BASIC_AUTH_PASSWORD が未設定のため、Basic認証なしで起動しています。' +
        '子どもの写真・健康情報を扱うアプリのため、本番公開前に設定してください。',
    );
    return NextResponse.next(nextOptions);
  }

  const authorization = request.headers.get('authorization');

  if (authorization) {
    const [scheme, encoded] = authorization.split(' ');

    if (scheme === 'Basic' && encoded) {
      const decoded = Buffer.from(encoded, 'base64').toString('utf-8');
      const separatorIndex = decoded.indexOf(':');
      const inputUser = decoded.slice(0, separatorIndex);
      const inputPassword = decoded.slice(separatorIndex + 1);

      if (inputUser === user && inputPassword === password) {
        return NextResponse.next(nextOptions);
      }
    }
  }

  return new NextResponse('Authentication required', {
    status: 401,
    headers: { 'WWW-Authenticate': 'Basic realm="children-growth"' },
  });
}

export const config = {
  // 静的アセット・favicon・画像最適化エンドポイント以外の全パスを対象にする
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
