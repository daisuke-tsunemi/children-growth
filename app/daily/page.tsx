import type { Metadata } from 'next';
import Link from 'next/link';
import { getSelectedChild } from '../../lib/selected-child';
import { getDailyPage, DAILY_PAGE_SIZE } from '../../lib/microcms';
import { DAILY_CATEGORIES } from '../../constants/daily';
import { dailyCategorySchema } from '../../types';
import DailyTimeline from '../../components/timeline/DailyTimeline';
import Pagination from '../../components/nav/Pagination';
import BlockCastle from '@/components/illustrations/BlockCastle';
import styles from "../pages.module.scss";

export const metadata: Metadata = { title: '日々の記録' };

type Props = {
  searchParams: Promise<{ category?: string; page?: string }>;
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

  const { category: rawCategory, page: rawPage } = await searchParams;
  const parsedCategory = dailyCategorySchema.safeParse(rawCategory);
  const category = parsedCategory.success ? parsedCategory.data : undefined;

  const page = Math.max(1, Number.parseInt(rawPage ?? '1', 10) || 1);

  const { records, totalCount } = await getDailyPage(selected.id, page, category);
  const totalPages = Math.max(1, Math.ceil(totalCount / DAILY_PAGE_SIZE));

  return (
    <div>
      <div className={styles.castle}>
        <BlockCastle />
      </div>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className={`${styles.heading}`}>
          <h1 className="font-heading text-[28px] leading-[1.2] text-blue-900 font-bold">日々の記録</h1>
        </div>
        <div className={`${styles.content} space-y-6`}>
          <div className={`flex flex-wrap gap-2 text-sm`}>
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
          <Pagination basePath="/daily" page={page} totalPages={totalPages} query={{ category }} />
        </div>
      </div>
    </div>
  );
}
