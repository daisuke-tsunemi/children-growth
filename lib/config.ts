import type { Child } from '../types';

/** サイト名。各画面の見出し・メタデータに使う。 */
export const SITE_NAME = '子ども成長記録';

/** 選択中の子どもIDを保持するCookie名。 */
export const SELECTED_CHILD_COOKIE = 'selectedChildId';

/**
 * 初期表示する子どもを決定する。
 * Cookieに保存された子どもが一覧に存在すればそれを使い、無ければ先頭(登録順)の子どもにする。
 * 子どもが1人も登録されていない場合はnull。
 */
export function resolveSelectedChild(children: Child[], cookieChildId: string | undefined): Child | null {
  if (children.length === 0) {
    return null;
  }

  const fromCookie = cookieChildId ? children.find((child) => child.id === cookieChildId) : undefined;

  return fromCookie ?? children[0];
}
