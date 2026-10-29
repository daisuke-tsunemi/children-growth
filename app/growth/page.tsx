import type { Metadata } from 'next';
import { getSelectedChild } from '../../lib/selected-child';
import { getMeasurements } from '../../lib/microcms';
import { getGrowthStandards } from '../../constants/growth-standards';
import { formatAge } from '../../lib/age';
import GrowthChart from '../../components/charts/GrowthChart';
import Pagination from '../../components/nav/Pagination';
import MeasurementsTable from '../../components/tables/MeasurementsTable';
import BlockCastle from '@/components/illustrations/BlockCastle';
import styles from "../pages.module.scss";

export const metadata: Metadata = { title: 'からだの成長' };

const TABLE_PAGE_SIZE = 20;

type Props = {
  searchParams: Promise<{ page?: string }>;
};

export default async function GrowthPage({ searchParams }: Props) {
  const { children, selected } = await getSelectedChild();

  if (!selected) {
    return (
      <div className="rounded-lg border-2 border-dashed border-gray-300 bg-white p-8 text-center text-gray-500">
        まだ子どもが登録されていません。microCMSの管理画面から「子どもプロフィール」を登録してください。
      </div>
    );
  }

  const measurements = await getMeasurements(selected.id);
  const totalPages = Math.max(1, Math.ceil(measurements.length / TABLE_PAGE_SIZE));
  const { page: rawPage } = await searchParams;
  const page = Math.min(totalPages, Math.max(1, Number.parseInt(rawPage ?? '1', 10) || 1));
  // 一覧は新しい順。チャートは全件を使うため、ページングは表にだけ適用する
  const newestFirst = [...measurements].reverse();
  const tableRows = newestFirst.slice((page - 1) * TABLE_PAGE_SIZE, page * TABLE_PAGE_SIZE);
  const standards = getGrowthStandards(selected.gender);

  return (
    <div className="space-y-8">
      <div className={styles.castle}>
        <BlockCastle />
      </div>
      <div>
        <div className={`${styles.heading} flex items-end gap-8 flex-wrap`}>
          <h1 className="font-heading text-[28px] leading-[1.2] text-primary-700 font-bold">からだの成長</h1>
          <p className="text-lg text-gray-500">
            {selected.name}<small>（{formatAge(selected.birthday)}）</small>
          </p>
        </div>
        {children.length > 0 && !selected.gender && (
          <p className="mt-1 rounded-sm bg-tertiary-500/20 px-2 py-1 text-sm font-semibold text-[#854d0e]">
            性別が未設定のため、成長曲線の基準値(帯)は表示されません。
          </p>
        )}
      </div>
      <div className={`${styles.content}`}>
        <section className="space-y-3">
          <GrowthChart
            measurements={measurements}
            birthday={selected.birthday}
            metric="height"
            standards={standards}
            showTabs
          />
        </section>

        <section className="space-y-3 mt-4">
          <h2 className="font-heading text-xl leading-[1.35] text-gray-700">記録一覧</h2>
          <MeasurementsTable measurements={tableRows} />
          <Pagination basePath="/growth" page={page} totalPages={totalPages} />
        </section>
      </div>
    </div>
  );
}
