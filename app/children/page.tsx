import type { Metadata } from 'next';
import Image from 'next/image';
import { getChildren } from '../../lib/microcms';
import { formatAge } from '../../lib/age';

export const metadata: Metadata = { title: '子ども' };

const GENDER_BADGE_CLASS: Record<string, string> = {
  男の子: 'bg-boy-500/10 text-boy-500',
  女の子: 'bg-girl-500/10 text-girl-500',
  未設定: 'bg-gray-100 text-gray-500',
};

export default async function ChildrenPage() {
  const children = await getChildren();

  if (children.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-gray-300 bg-white p-8 text-center text-gray-500">
        まだ子どもが登録されていません。microCMSの管理画面から「子どもプロフィール」を登録してください。
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold text-gray-800">子ども</h1>
      <ul className="grid gap-4 sm:grid-cols-2">
        {children.map((child) => (
          <li key={child.id} className="flex gap-4 rounded-lg border border-gray-100 bg-white p-4 shadow-sm">
            <div className="h-16 w-16 shrink-0 overflow-hidden rounded-full bg-gray-100">
              {child.photo && (
                <Image
                  src={child.photo.url}
                  alt={child.name}
                  width={64}
                  height={64}
                  className="h-full w-full object-cover"
                />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-bold text-gray-800">{child.name}</p>
                {child.gender && (
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${GENDER_BADGE_CLASS[child.gender] ?? GENDER_BADGE_CLASS['未設定']}`}
                  >
                    {child.gender}
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-500">
                {child.birthday} 生まれ({formatAge(child.birthday)})
              </p>
              {child.memo && <p className="mt-2 text-sm text-gray-600">{child.memo}</p>}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
