import type { VaccinationRow, VaccinationStatus } from '../../lib/vaccinations';

type Props = {
  rows: VaccinationRow[];
};

const STATUS_LABEL: Record<VaccinationStatus, { label: string; className: string }> = {
  completed: { label: '接種済', className: 'bg-brand-50 text-brand-700' },
  overdue: { label: '予定超過', className: 'bg-red-50 text-red-600' },
  upcoming: { label: '接種時期', className: 'bg-boy-500/10 text-boy-500' },
  not_yet_due: { label: 'まだ先', className: 'bg-gray-100 text-gray-500' },
};

/**
 * 予防接種の一覧表。月齢順(標準スケジュールの開始月齢→実記録の接種日)に並べる。
 */
export default function VaccinationsTable({ rows }: Props) {
  if (rows.length === 0) {
    return <p className="text-sm text-gray-500">対象の予防接種がありません。</p>;
  }

  const sorted = [...rows].sort((a, b) => (a.fromMonths ?? 0) - (b.fromMonths ?? 0));

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-100 bg-white">
      <table className="w-full min-w-[640px] text-sm">
        <thead className="border-b border-gray-100 bg-gray-50 text-left text-gray-500">
          <tr>
            <th className="px-3 py-2 font-medium">状態</th>
            <th className="px-3 py-2 font-medium">予防接種の種類</th>
            <th className="px-3 py-2 font-medium">回数</th>
            <th className="px-3 py-2 font-medium">標準的な時期</th>
            <th className="px-3 py-2 font-medium">接種日</th>
            <th className="px-3 py-2 font-medium">医療機関</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((row) => {
            const status = STATUS_LABEL[row.status];
            return (
              <tr key={`${row.vaccine}:${row.doseCount}`} className="border-b border-gray-50 last:border-0">
                <td className="px-3 py-2">
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium whitespace-nowrap ${status.className}`}>
                    {status.label}
                  </span>
                </td>
                <td className="px-3 py-2">{row.vaccine}</td>
                <td className="px-3 py-2 whitespace-nowrap">{row.doseCount}回目</td>
                <td className="px-3 py-2 whitespace-nowrap text-gray-500">
                  {row.fromMonths !== null && row.toMonths !== null
                    ? `生後${row.fromMonths}〜${row.toMonths}か月`
                    : '—'}
                </td>
                <td className="px-3 py-2 whitespace-nowrap">{row.record?.vaccinatedAt?.slice(0, 10) ?? '—'}</td>
                <td className="px-3 py-2 text-gray-500">{row.record?.clinic ?? ''}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
