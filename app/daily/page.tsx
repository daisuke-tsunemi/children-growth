import type { Metadata } from 'next';
import Link from 'next/link';
import { getSelectedChild } from '../../lib/selected-child';
import { getDaily } from '../../lib/microcms';
import { DAILY_CATEGORIES } from '../../constants/daily';
import { dailyCategorySchema } from '../../types';
import DailyTimeline from '../../components/timeline/DailyTimeline';

export const metadata: Metadata = { title: '日々の記録' };

type Props = {
  searchParams: Promise<{ category?: string }>;
};

export default async function DailyPage({ searchParams }: Props) {
  const { selected } = await getSelectedChild();

  if (!selected) {
    return (
      <div className="rounded-lg border border-dashed border-gray-300 bg-white p-8 text-center text-gray-500">
        まだ子どもが登録されていません。microCMSの管理画面から「子どもプロフィール」を登録してください。
      </div>
    );
  }

  const { category: rawCategory } = await searchParams;
  const parsedCategory = dailyCategorySchema.safeParse(rawCategory);
  const category = parsedCategory.success ? parsedCategory.data : undefined;

  const records = await getDaily(selected.id, category);

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold text-gray-800">日々の記録</h1>

      <div className="flex flex-wrap gap-2 text-sm">
        <Link
          href="/daily"
          className={`rounded-full px-3 py-1 ${!category ? 'bg-brand-600 text-white' : 'bg-white text-gray-600 border border-gray-200'}`}
        >
          すべて
        </Link>
        {DAILY_CATEGORIES.map((item) => (
          <Link
            key={item}
            href={`/daily?category=${encodeURIComponent(item)}`}
            className={`rounded-full px-3 py-1 ${category === item ? 'bg-brand-600 text-white' : 'bg-white text-gray-600 border border-gray-200'}`}
          >
            {item}
          </Link>
        ))}
      </div>

      <DailyTimeline records={records} />
    </div>
  );
}
