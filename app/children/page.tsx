import type { Metadata } from 'next';
import Image from 'next/image';
import { getChildren } from '../../lib/microcms';
import { formatAge } from '../../lib/age';

export const metadata: Metadata = { title: '子ども' };

const GENDER_BADGE_CLASS: Record<string, string> = {
  男の子: 'bg-primary-500/10 text-primary-600',
  女の子: 'bg-girl-500/10 text-girl-600',
  未設定: 'bg-gray-100 text-gray-500',
};

export default async function ChildrenPage() {
  const children = await getChildren();

  if (children.length === 0) {
    return (
      <div className="rounded-lg border-2 border-dashed border-gray-300 bg-white p-8 text-center text-gray-500">
        まだ子どもが登録されていません。microCMSの管理画面から「子どもプロフィール」を登録してください。
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-[32px] leading-[1.2] text-gray-800">子ども</h1>
      <ul className="grid gap-4 sm:grid-cols-2">
        {children.map((child) => (
          <li
            key={child.id}
            className="flex gap-4 rounded-lg border-2 border-dashed border-gray-200 bg-white p-5 shadow-sm"
          >
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
                <p className="font-heading text-lg text-gray-800">{child.name}</p>
                {child.gender && (
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-sm font-semibold ${GENDER_BADGE_CLASS[child.gender] ?? GENDER_BADGE_CLASS['未設定']}`}
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
