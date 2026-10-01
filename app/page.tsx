import Link from 'next/link';
import Image from 'next/image';
import { getSelectedChild } from '../lib/selected-child';
import { getMeasurements, getVaccinations, getDaily } from '../lib/microcms';
import { buildVaccinationSchedule } from '../lib/vaccinations';
import { formatAge } from '../lib/age';

export default async function Home() {
  const { children, selected } = await getSelectedChild();

  if (!selected) {
    return (
      <div className="rounded-lg border border-dashed border-gray-300 bg-white p-8 text-center text-gray-500">
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

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4 rounded-lg border border-gray-100 bg-white p-6 shadow-sm">
        <div className="h-20 w-20 shrink-0 overflow-hidden rounded-full bg-gray-100">
          {selected.photo && (
            <Image
              src={selected.photo.url}
              alt={selected.name}
              width={80}
              height={80}
              className="h-full w-full object-cover"
            />
          )}
        </div>
        <div>
          <p className="text-lg font-bold text-gray-800">{selected.name}</p>
          <p className="text-sm text-gray-500">{formatAge(selected.birthday)}</p>
        </div>
        {children.length > 1 && (
          <p className="ml-auto text-xs text-gray-400">他{children.length - 1}人登録中</p>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Link
          href="/growth"
          className="block rounded-lg border border-gray-100 bg-white p-5 shadow-sm hover:border-brand-200"
        >
          <p className="text-sm font-medium text-gray-500">からだの成長</p>
          {latestMeasurement ? (
            <p className="mt-2 text-lg font-bold text-gray-800">
              {latestMeasurement.height !== undefined && `身長 ${latestMeasurement.height}cm`}
              {latestMeasurement.height !== undefined && latestMeasurement.weight !== undefined && ' / '}
              {latestMeasurement.weight !== undefined && `体重 ${latestMeasurement.weight}kg`}
            </p>
          ) : (
            <p className="mt-2 text-sm text-gray-400">まだ記録がありません</p>
          )}
          {latestMeasurement && (
            <p className="mt-1 text-xs text-gray-400">{latestMeasurement.measuredAt.slice(0, 10)}</p>
          )}
        </Link>

        <Link
          href="/vaccinations"
          className="block rounded-lg border border-gray-100 bg-white p-5 shadow-sm hover:border-brand-200"
        >
          <p className="text-sm font-medium text-gray-500">予防接種</p>
          <p className={`mt-2 text-lg font-bold ${overdueCount > 0 ? 'text-red-600' : 'text-gray-800'}`}>
            {overdueCount > 0 ? `予定超過 ${overdueCount}件` : '予定超過なし'}
          </p>
        </Link>

        <Link
          href="/daily"
          className="block rounded-lg border border-gray-100 bg-white p-5 shadow-sm hover:border-brand-200"
        >
          <p className="text-sm font-medium text-gray-500">日々の記録</p>
          {latestDaily ? (
            <>
              <p className="mt-2 line-clamp-2 text-sm text-gray-800">{latestDaily.note}</p>
              <p className="mt-1 text-xs text-gray-400">{latestDaily.createdAt.slice(0, 10)}</p>
            </>
          ) : (
            <p className="mt-2 text-sm text-gray-400">まだ記録がありません</p>
          )}
        </Link>
      </div>
    </div>
  );
}
