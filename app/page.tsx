import Link from 'next/link';
import Image from 'next/image';
import { getSelectedChild } from '../lib/selected-child';
import { getMeasurements, getVaccinations, getDaily } from '../lib/microcms';
import { buildVaccinationSchedule } from '../lib/vaccinations';
import { getGrowthStandards } from '../constants/growth-standards';
import { formatAge } from '../lib/age';
import GrowthChart from '../components/charts/GrowthChart';
import BlockCastle from '../components/illustrations/BlockCastle';
import styles from "./home.module.scss";

export default async function Home() {
  const { children, selected } = await getSelectedChild();

  if (!selected) {
    return (
      <div className="rounded-lg border-2 border-dashed border-gray-300 bg-white p-8 text-center text-gray-500">
        まだ子どもが登録されていません。microCMSの管理画面から「子どもプロフィール」を登録してください。
      </div>
    );
  }

  const [measurements, vaccinations, daily] = await Promise.all([
    getMeasurements(selected.id),
    getVaccinations(selected.id),
    getDaily(selected.id),
  ]);

  const latestMeasurement = measurements.at(-1) ?? null;
  const latestDaily = daily[0] ?? null;
  const overdueCount = buildVaccinationSchedule(selected.birthday, vaccinations).filter(
    (row) => row.status === 'overdue',
  ).length;
  const standards = getGrowthStandards(selected.gender);

  return (
    <div className="space-y-4">
      <section className="grid gap-8 overflow-hidden rounded-lg border-2 border-dashed border-primary-500/30 bg-gradient-to-br from-primary-500/10 to-surface p-4 sm:p-6 lg:grid-cols-2 lg:items-center">
        <div className="space-y-5">
          <p className="font-semibold text-primary-600">子ども成長記録</p>
          <h1 className="font-heading text-4xl leading-relaxed text-gray-800 sm:text-5xl">
            子どもの成長を
            <br />
            積み重ねよう
          </h1>
          <p className="max-w-lg text-base leading-relaxed text-gray-500">
            身長・体重・予防接種・日々のできごと。
            <br />ひとつひとつの記録を積み重ねて、
            <br />かけがえのない成長の記録にしていきます。
          </p>
          <BlockCastle />
        </div>

        <div>
          <div className="flex items-center justify-between gap-4 mb-2 rounded-lg border-2 border-dashed border-gray-200 bg-white p-3 shadow-sm">
            <div className="h-24 w-24 shrink-0 overflow-hidden rounded-full bg-gray-100">
              {selected.photo && (
                <Image
                  src={selected.photo.url}
                  alt={selected.name}
                  width={88}
                  height={88}
                  className="h-full w-full object-cover"
                />
              )}
            </div>
            <div>
              <p className="font-heading text-lg text-gray-800">{selected.name}</p>
              <p className="text-sm text-gray-500">{formatAge(selected.birthday)}</p>
            </div>
            {children.length > 1 && (
              <p className="ml-auto text-sm font-semibold text-gray-400">他{children.length - 1}人登録中</p>
            )}
          </div>
          <GrowthChart
            measurements={measurements}
            birthday={selected.birthday}
            metric="height"
            standards={standards}
            showTabs
          />
        </div>
      </section>
      <div className={`${styles.linkWrapper} grid gap-4 lg:grid-cols-3`}>
        <Link
          href="/growth"
          className="block rounded-lg border-2 border-dashed border-primary-500 bg-white p-5 shadow-sm hover:border-primary-600 flex items-center justify-between hover:text-primary-600"
        >
          <div className="flex-auto">
            <p className="text-sm font-medium">からだの成長</p>
            {latestMeasurement ? (
              <div className="flex gap-1 items-end text-gray-800">
                <p className="font-heading">
                  身長
                </p>
                <p className="font-heading text-3xl ">
                  {latestMeasurement.height !== undefined && latestMeasurement.height}
                </p>
                <p className="font-heading ">
                  cm / 体重
                </p>
                <p className="font-heading text-3xl ">
                  {latestMeasurement.height !== undefined && latestMeasurement.weight !== undefined}
                  {latestMeasurement.weight !== undefined && latestMeasurement.weight}
                </p>
                <p className="font-heading ">
                  kg
                </p>
              </div>
            ) : (
              <p className="mt-2 text-sm text-gray-400">まだ記録がありません</p>
            )}
            {latestMeasurement && (
              <p className="mt-1 text-sm text-gray-400">{latestMeasurement.measuredAt.slice(0, 10)}</p>
            )}
          </div>
          <svg className="aspect-square size-1/4"><use href="#arrow_right" /></svg>
        </Link>

        <Link
          href="/vaccinations"
          className="block rounded-lg border-2 border-dashed border-primary-500 bg-white p-5 shadow-sm hover:border-primary-600 flex items-center justify-between hover:text-primary-600"
        >
          <div className="flex-auto">
            <p className="text-sm font-medium">予防接種</p>
            <p className={`font-heading mt-2 text-lg ${overdueCount > 0 ? 'text-error-500' : 'text-gray-800'}`}>
              {overdueCount > 0 ? `予定超過 ${overdueCount} 件` : '予定超過なし'}
            </p>
          </div>
          <svg className="aspect-square size-1/4"><use href="#arrow_right" /></svg>
        </Link>

        <Link
          href="/daily"
          className="block rounded-lg border-2 border-dashed border-primary-500 bg-white p-5 shadow-sm hover:border-primary-600 flex items-center justify-between hover:text-primary-600"
        >
          <div className="flex-auto">
            <p className="text-sm font-medium">日々の記録</p>
            {latestDaily ? (
              <>
                <p className="mt-2 line-clamp-2 text-sm text-gray-800">{latestDaily.note}</p>
                <p className="mt-1 text-sm text-gray-400">{latestDaily.createdAt.slice(0, 10)}</p>
              </>
            ) : (
              <p className="mt-2 text-sm text-gray-400">まだ記録がありません</p>
            )}
          </div>
          <svg className="aspect-square size-1/4"><use href="#arrow_right" /></svg>
        </Link>
      </div>
    </div>
  );
}
