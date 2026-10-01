import { cookies } from 'next/headers';
import { getChildren } from './microcms';
import { resolveSelectedChild, SELECTED_CHILD_COOKIE } from './config';
import type { Child } from '../types';

/**
 * 子ども一覧と、現在選択中の子ども(Cookie→先頭の順で解決)をまとめて返す。
 * 各ページ・Headerで共通して使う。
 */
export async function getSelectedChild(): Promise<{ children: Child[]; selected: Child | null }> {
  const [children, cookieStore] = await Promise.all([getChildren(), cookies()]);
  const selected = resolveSelectedChild(children, cookieStore.get(SELECTED_CHILD_COOKIE)?.value);
  return { children, selected };
}
