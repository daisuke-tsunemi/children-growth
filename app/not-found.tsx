import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="rounded-lg border border-dashed border-gray-300 bg-white p-8 text-center text-gray-500">
      <p>ページが見つかりませんでした。</p>
      <Link href="/" className="mt-2 inline-block text-brand-600 underline">
        ホームへ戻る
      </Link>
    </div>
  );
}
