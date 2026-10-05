import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="rounded-lg border-2 border-dashed border-gray-300 bg-white p-40 text-center text-gray-500">
      <p>ページが見つかりませんでした。</p>
      <Link
        href="/"
        className="mt-4 inline-block rounded-md bg-primary-500 px-6 py-2.5 text-sm font-semibold text-white hover:bg-primary-600"
      >
        ホームへ戻る
      </Link>
    </div>
  );
}
