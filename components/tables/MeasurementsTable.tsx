import type { Measurement } from '../../types';

type Props = {
  measurements: Measurement[];
};

/**
 * からだの成長記録の一覧表。`GrowthChart`と同じデータを表形式で見られるようにする
 * (チャートのツールチップに値を閉じ込めない)。
 */
export default function MeasurementsTable({ measurements }: Props) {
  if (measurements.length === 0) {
    return <p className="text-sm text-gray-500">まだ記録がありません。</p>;
  }

  // チャートは測定日の昇順、一覧は新しい順のほうが見やすいため表示直前に反転する
  const rows = [...measurements].reverse();

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-100 bg-white">
      <table className="w-full min-w-[480px] text-sm">
        <thead className="border-b border-gray-100 bg-gray-50 text-left text-gray-500">
          <tr>
            <th className="px-3 py-2 font-medium">測定日</th>
            <th className="px-3 py-2 font-medium">身長(cm)</th>
            <th className="px-3 py-2 font-medium">体重(kg)</th>
            <th className="px-3 py-2 font-medium">頭囲(cm)</th>
            <th className="px-3 py-2 font-medium">メモ</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((measurement) => (
            <tr key={measurement.id} className="border-b border-gray-50 last:border-0">
              <td className="px-3 py-2 whitespace-nowrap">{measurement.measuredAt.slice(0, 10)}</td>
              <td className="px-3 py-2">{measurement.height ?? '—'}</td>
              <td className="px-3 py-2">{measurement.weight ?? '—'}</td>
              <td className="px-3 py-2">{measurement.headCircumference ?? '—'}</td>
              <td className="px-3 py-2 text-gray-500">{measurement.note ?? ''}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
