"use client";
import { useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

function NotFoundContent({ error }: { error: Error }) {
  const searchParams = useSearchParams();
  const query = searchParams.get('q');

  useEffect(() => {
    console.error("404 Error:", error);
  }, [error]);

  return (
    <div style={{ textAlign: "center", padding: "240px 50px" }}>
      <h1>404 - ページが見つかりません</h1>
      <p>お探しのページは存在しません。</p>
      {query && <p className="c-txt__md ">検索クエリ: {query}</p>}
      <Link href='/'>トップへ戻る</Link>
    </div>
  );
}

export default function NotFound({ error }: { error: Error }) {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
      <NotFoundContent error={error} />
    </Suspense>
  );
}
