import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { SELECTED_CHILD_COOKIE } from '../../../lib/config';

/**
 * 表示する子どもを切り替える。microCMSへの書き込みは発生せず、選択状態をCookieへ保存するのみ。
 */
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const childId = searchParams.get('childId');
  const redirectTo = searchParams.get('redirect') ?? '/';

  const response = NextResponse.redirect(new URL(redirectTo, request.url));

  if (childId) {
    response.cookies.set(SELECTED_CHILD_COOKIE, childId, {
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 365,
      path: '/',
    });
  }

  return response;
}
