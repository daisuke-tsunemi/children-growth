'use client';

import {
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import type { Measurement, Child } from '../../types';
import { calculateAgeInMonths } from '../../lib/age';
import type { GrowthStandardPoint } from '../../constants/growth-standards';

type Metric = 'height' | 'weight';

type Props = {
  measurements: Measurement[];
  birthday: Child['birthday'];
  metric: Metric;
  standards: GrowthStandardPoint[];
};

const METRIC_LABEL: Record<Metric, { label: string; unit: string }> = {
  height: { label: '身長', unit: 'cm' },
  weight: { label: '体重', unit: 'kg' },
};

type ChartPoint = {
  ageMonths: number;
  value?: number;
  p3?: number;
  p50?: number;
  p97?: number;
};

export default function GrowthChart({ measurements, birthday, metric, standards }: Props) {
  const { label, unit } = METRIC_LABEL[metric];

  const measuredPoints: ChartPoint[] = measurements
    .filter((measurement) => measurement[metric] !== undefined)
    .map((measurement) => ({
      ageMonths: calculateAgeInMonths(birthday, new Date(measurement.measuredAt)),
      value: measurement[metric],
    }));

  // 実測値と成長曲線の基準値を、月齢(ageMonths)をキーにしてマージする
  const byAge = new Map<number, ChartPoint>();
  for (const point of measuredPoints) {
    byAge.set(point.ageMonths, { ...byAge.get(point.ageMonths), ...point });
  }
  for (const standard of standards) {
    byAge.set(standard.ageMonths, {
      ...byAge.get(standard.ageMonths),
      ageMonths: standard.ageMonths,
      p3: standard[metric].p3,
      p50: standard[metric].p50,
      p97: standard[metric].p97,
    });
  }
  const data = [...byAge.values()].sort((a, b) => a.ageMonths - b.ageMonths);

  if (measuredPoints.length === 0) {
    return <p className="text-sm text-gray-500">まだ記録がありません。</p>;
  }

  return (
    <div className="h-80 w-full rounded-lg border border-gray-100 bg-white p-4">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data} margin={{ top: 8, right: 16, bottom: 8, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
          <XAxis
            dataKey="ageMonths"
            type="number"
            domain={['dataMin', 'dataMax']}
            label={{ value: '月齢', position: 'insideBottomRight', offset: -4 }}
            tickFormatter={(value: number) => `${value}`}
          />
          <YAxis
            label={{ value: `${label}(${unit})`, angle: -90, position: 'insideLeft' }}
            domain={['auto', 'auto']}
          />
          <Tooltip
            formatter={(value, name) => [`${value}${unit}`, name]}
            labelFormatter={(value) => `生後${value}か月`}
          />
          <Legend />
          {standards.length > 0 && (
            <Area
              dataKey="p97"
              name="成長曲線(3〜97パーセンタイル)"
              stroke="none"
              fill="#fed7aa"
              fillOpacity={0.5}
              connectNulls
              isAnimationActive={false}
            />
          )}
          {standards.length > 0 && (
            <Area dataKey="p3" stroke="none" fill="#ffffff" connectNulls isAnimationActive={false} legendType="none" />
          )}
          {standards.length > 0 && (
            <Line
              dataKey="p50"
              name="中央値(50パーセンタイル)"
              stroke="#fb923c"
              strokeDasharray="4 4"
              dot={false}
              connectNulls
              isAnimationActive={false}
            />
          )}
          <Line
            dataKey="value"
            name={label}
            stroke="#ea580c"
            strokeWidth={2}
            dot={{ r: 3 }}
            connectNulls
            isAnimationActive={false}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
