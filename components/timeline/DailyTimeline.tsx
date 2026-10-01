import Image from 'next/image';
import type { Daily } from '../../types';
import { DAILY_MOODS } from '../../constants/daily';

type Props = {
  records: Daily[];
};

export default function DailyTimeline({ records }: Props) {
  if (records.length === 0) {
    return <p className="text-sm text-gray-500">まだ記録がありません。</p>;
  }

  return (
    <ul className="space-y-4">
      {records.map((record) => {
        const mood = record.mood ? DAILY_MOODS[record.mood] : null;

        return (
          <li key={record.id} className="rounded-lg border border-gray-100 bg-white p-4 shadow-sm">
            <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500">
              <time dateTime={record.createdAt}>{record.createdAt.slice(0, 16).replace('T', ' ')}</time>
              <span className="rounded-full bg-brand-50 px-2 py-0.5 font-medium text-brand-700">
                {record.category}
              </span>
              {mood && <span className={mood.colorClass}>{mood.emoji}</span>}
              {record.temperature !== undefined && <span>体温 {record.temperature}℃</span>}
            </div>
            <p className="mt-2 text-sm whitespace-pre-wrap text-gray-800">{record.note}</p>
            {record.photos && record.photos.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {record.photos.map((photo, index) => (
                  <Image
                    key={`${record.id}-${index}`}
                    src={photo.url}
                    alt=""
                    width={96}
                    height={96}
                    className="h-24 w-24 rounded-md object-cover"
                  />
                ))}
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
