'use client';

import type { Child } from '../../types';

type Props = {
  childList: Child[];
  selectedChildId: string | null;
  currentPath: string;
};

/**
 * 子どもの切り替え。選択すると`/api/select-child`へ遷移し、Cookieを更新してから現在のページへ戻る。
 * microCMSへの書き込みは発生しない(表示専用アプリの切り替えUIのため`'use client'`が必要)。
 */
export default function ChildSwitcher({ childList, selectedChildId, currentPath }: Props) {
  if (childList.length === 0) {
    return null;
  }

  return (
    <select
      aria-label="表示する子どもを選択"
      defaultValue={selectedChildId ?? childList[0].id}
      onChange={(event) => {
        const params = new URLSearchParams({
          childId: event.target.value,
          redirect: currentPath,
        });
        // Route Handlerでcookieを設定してから戻すため、ソフトナビゲーションではなく実リクエストにする
        // eslint-disable-next-line @next/next/no-location-assign-relative-destination
        window.location.href = `/api/select-child?${params.toString()}`;
      }}
      className="rounded-md border border-brand-200 bg-white px-3 py-1.5 text-sm font-medium text-brand-700 shadow-sm"
    >
      {childList.map((child) => (
        <option key={child.id} value={child.id}>
          {child.name}
        </option>
      ))}
    </select>
  );
}
