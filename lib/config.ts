import type { Child } from '../types';

/** サイト名。各画面の見出し・メタデータに使う。 */
export const SITE_NAME = '子ども成長記録アプリ';

export const SELECTED_CHILD_COOKIE = 'selectedChildId';
export function resolveSelectedChild(children: Child[], cookieChildId: string | undefined): Child | null {
  if (children.length === 0) {
    return null;
  }

  const fromCookie = cookieChildId ? children.find((child) => child.id === cookieChildId) : undefined;

  return fromCookie ?? children[0];
}
