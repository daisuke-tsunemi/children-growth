'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

type Props = {
  basePath: string;
  page: number;
  totalPages: number;
  /** ページ以外に引き継ぐクエリ(例: category) */
  query?: Record<string, string | undefined>;
};

function buildHref(basePath: string, page: number, query: Record<string, string | undefined>): string {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    if (value) params.set(key, value);
  }
  if (page > 1) params.set('page', String(page));
  const qs = params.toString();
  return qs ? `${basePath}?${qs}` : basePath;
}

/**
 * 前へ/次へと「現在ページ(入力可) / 総ページ数」を並べたページャ。
 * 数字を入力してEnter(またはフォーカスを外す)とそのページへ移動する。1ページ以下なら何も表示しない。
 */
export default function Pagination({ basePath, page, totalPages, query = {} }: Props) {
  const router = useRouter();
  // 入力途中の値。ページが変わったら実ページに追従させる(レンダー中の状態調整)
  const [draft, setDraft] = useState(String(page));
  const [syncedPage, setSyncedPage] = useState(page);
  if (syncedPage !== page) {
    setSyncedPage(page);
    setDraft(String(page));
  }

  if (totalPages <= 1) {
    return null;
  }

  const go = () => {
    const parsed = Number.parseInt(draft, 10);
    if (Number.isNaN(parsed)) {
      setDraft(String(page));
      return;
    }
    const target = Math.min(totalPages, Math.max(1, parsed));
    setDraft(String(target));
    if (target !== page) {
      router.push(buildHref(basePath, target, query));
    }
  };

  const linkClass =
    'rounded-full border border-primary-500/40 bg-primary-500/20 px-3.5 py-1.5 font-semibold text-primary-600';
  const disabledClass = 'rounded-full border border-gray-200 px-3.5 py-1.5 font-semibold text-gray-300';

  return (
    <nav aria-label="ページ送り" className="flex items-center justify-center gap-4 text-sm">
      {page > 1 ? (
        <Link href={buildHref(basePath, page - 1, query)} className={linkClass}>
          ← 前へ
        </Link>
      ) : (
        <span className={disabledClass}>← 前へ</span>
      )}
      <form
        className="flex items-center gap-1.5 text-gray-500"
        onSubmit={(event) => {
          event.preventDefault();
          go();
        }}
      >
        <input
          type="number"
          inputMode="numeric"
          min={1}
          max={totalPages}
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onBlur={go}
          aria-label="ページ番号"
          className="w-14 rounded-md border border-primary-500/40 bg-white px-2 py-1 text-center font-semibold text-primary-600"
        />
        <span>/ {totalPages}</span>
      </form>
      {page < totalPages ? (
        <Link href={buildHref(basePath, page + 1, query)} className={linkClass}>
          次へ →
        </Link>
      ) : (
        <span className={disabledClass}>次へ →</span>
      )}
    </nav>
  );
}
