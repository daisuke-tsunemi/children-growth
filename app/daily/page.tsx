import type { Metadata } from 'next';
import Link from 'next/link';
import { getSelectedChild } from '../../lib/selected-child';
import { getDaily } from '../../lib/microcms';
import { DAILY_CATEGORIES } from '../../constants/daily';
import { dailyCategorySchema } from '../../types';
import DailyTimeline from '../../components/timeline/DailyTimeline';
import BlockCastle from '@/components/illustrations/BlockCastle';
import styles from "../pages.module.scss";

export const metadata: Metadata = { title: '日々の記録' };

type Props = {
  searchParams: Promise<{ category?: string }>;
};

export default async function DailyPage({ searchParams }: Props) {
  const { selected } = await getSelectedChild();

  if (!selected) {
    return (
      <div className="rounded-lg border-2 border-dashed border-gray-300 bg-white p-8 text-center text-gray-500">
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
      <div className={styles.castle}>
        <BlockCastle />
      </div>
      <div className={`${styles.heading}`}>
        <h1 className="font-heading text-[32px] leading-[1.2] text-primary-600">日々の記録</h1>
      </div>
      <div className={`${styles.content} flex flex-wrap gap-2 text-sm`}>
        <Link
          href="/daily"
          className={`rounded-full px-3.5 py-1.5 font-semibold ${!category ? 'bg-primary-500 text-white' : 'border border-primary-500/40 bg-primary-500/20 text-primary-600'}`}
        >
          すべて
        </Link>
        {DAILY_CATEGORIES.map((item) => (
          <Link
            key={item}
            href={`/daily?category=${encodeURIComponent(item)}`}
            className={`rounded-full px-3.5 py-1.5 font-semibold ${category === item ? 'bg-primary-500 text-white' : 'border border-primary-500/40 bg-primary-500/20 text-primary-600'}`}
          >
            {item}
          </Link>
        ))}
      </div>

      <DailyTimeline records={records} />
    </div>
  );
}
