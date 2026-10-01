import type { DailyCategory, DailyMood } from '../types';

/**
 * `daily.category`の選択肢。microCMSのセレクト値(`microcms-template.json`)と完全一致させる。
 * `/daily`の分類フィルタの候補として使う。
 */
export const DAILY_CATEGORIES: readonly DailyCategory[] = [
  'からだ',
  'ことば',
  '食べ物',
  '生活',
  'おでかけ',
  '行事',
  'その他',
];

/**
 * `daily.mood`の選択肢と表示用の絵文字・色。
 */
export const DAILY_MOODS: Record<DailyMood, { emoji: string; colorClass: string }> = {
  良い: { emoji: '😊', colorClass: 'text-brand-600' },
  ふつう: { emoji: '😐', colorClass: 'text-gray-500' },
  悪い: { emoji: '😣', colorClass: 'text-blue-600' },
};
