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
      className="rounded-md border-2 border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-primary-600 hover:border-gray-400 focus:border-primary-500 focus:ring-[3px] focus:ring-primary-500/25 focus:outline-none"
    >
      {childList.map((child) => (
        <option key={child.id} value={child.id}>
          {child.name}
        </option>
      ))}
    </select>
  );
}
