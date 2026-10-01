import type { Child } from '../types';

/**
 * 出典: こども家庭庁「令和5年（2023年）乳幼児身体発育調査」(2024年12月25日公表)
 * - 身長: 表２ 一般調査及び病院調査による身長の身体発育値
 *   https://www.e-stat.go.jp/stat-search/file-download?statInfId=000040240362&fileKind=0
 * - 体重: 表１ 一般調査及び病院調査による体重の身体発育値
 *   https://www.e-stat.go.jp/stat-search/file-download?statInfId=000040240361&fileKind=0
 *
 * 原資料は3・10・25・50・75・90・97パーセンタイル値を公表しているが、本アプリはチャートの帯表示用に
 * p3・p50・p97のみを使う(値はcm/kgとも原資料を小数第1位で丸めたもの)。
 *
 * `ageMonths`は原資料の年齢区分「n～n+1月未満」の下限値をキーにしている
 * (例: 「０年１～２月未満」の区分 → ageMonths: 1)。生後0日・30日・1〜4日等の区分は採用せず、
 * 出生時(0日)のみ ageMonths: 0 として採用した(月単位のチャート表示には十分なため)。
 * 生後12か月以降は原資料が6か月幅の区分のため、区分の下限値(12, 18, 24, ...)をそのままキーにしている。
 */
export type GrowthStandardPoint = {
  ageMonths: number;
  height: { p3: number; p50: number; p97: number };
  weight: { p3: number; p50: number; p97: number };
};

const BOYS: GrowthStandardPoint[] = [
  { ageMonths: 0, height: { p3: 45.2, p50: 49.4, p97: 52.7 }, weight: { p3: 2.3, p50: 3.1, p97: 3.8 } },
  { ageMonths: 1, height: { p3: 51.3, p50: 55.5, p97: 58.9 }, weight: { p3: 3.8, p50: 4.8, p97: 5.8 } },
  { ageMonths: 2, height: { p3: 54.9, p50: 59.2, p97: 62.7 }, weight: { p3: 4.6, p50: 5.8, p97: 7.0 } },
  { ageMonths: 3, height: { p3: 58.0, p50: 62.3, p97: 65.9 }, weight: { p3: 5.2, p50: 6.6, p97: 7.8 } },
  { ageMonths: 4, height: { p3: 60.2, p50: 64.6, p97: 68.3 }, weight: { p3: 5.7, p50: 7.1, p97: 8.5 } },
  { ageMonths: 5, height: { p3: 61.9, p50: 66.2, p97: 70.1 }, weight: { p3: 6.1, p50: 7.6, p97: 9.0 } },
  { ageMonths: 6, height: { p3: 63.2, p50: 67.6, p97: 71.6 }, weight: { p3: 6.4, p50: 7.9, p97: 9.4 } },
  { ageMonths: 7, height: { p3: 64.4, p50: 68.8, p97: 72.8 }, weight: { p3: 6.6, p50: 8.2, p97: 9.7 } },
  { ageMonths: 8, height: { p3: 65.5, p50: 70.0, p97: 74.0 }, weight: { p3: 6.9, p50: 8.4, p97: 10.0 } },
  { ageMonths: 9, height: { p3: 66.5, p50: 71.0, p97: 75.2 }, weight: { p3: 7.0, p50: 8.6, p97: 10.2 } },
  { ageMonths: 10, height: { p3: 67.4, p50: 72.1, p97: 76.3 }, weight: { p3: 7.2, p50: 8.8, p97: 10.4 } },
  { ageMonths: 11, height: { p3: 68.4, p50: 73.1, p97: 77.4 }, weight: { p3: 7.4, p50: 9.0, p97: 10.7 } },
  { ageMonths: 12, height: { p3: 71.6, p50: 76.5, p97: 81.1 }, weight: { p3: 7.9, p50: 9.7, p97: 11.4 } },
  { ageMonths: 18, height: { p3: 76.7, p50: 82.1, p97: 87.2 }, weight: { p3: 8.9, p50: 10.8, p97: 12.8 } },
  { ageMonths: 24, height: { p3: 80.5, p50: 86.3, p97: 91.9 }, weight: { p3: 9.9, p50: 12.0, p97: 14.2 } },
  { ageMonths: 30, height: { p3: 84.3, p50: 90.5, p97: 96.6 }, weight: { p3: 10.7, p50: 12.9, p97: 15.5 } },
  { ageMonths: 36, height: { p3: 87.8, p50: 94.3, p97: 100.8 }, weight: { p3: 11.4, p50: 13.8, p97: 16.7 } },
  { ageMonths: 42, height: { p3: 91.0, p50: 97.8, p97: 104.7 }, weight: { p3: 12.1, p50: 14.7, p97: 17.9 } },
  { ageMonths: 48, height: { p3: 94.2, p50: 101.3, p97: 108.6 }, weight: { p3: 12.8, p50: 15.6, p97: 19.3 } },
  { ageMonths: 54, height: { p3: 97.3, p50: 104.7, p97: 112.3 }, weight: { p3: 13.6, p50: 16.6, p97: 20.7 } },
  { ageMonths: 60, height: { p3: 100.3, p50: 108.0, p97: 116.0 }, weight: { p3: 14.5, p50: 17.7, p97: 22.3 } },
  { ageMonths: 66, height: { p3: 103.3, p50: 111.3, p97: 119.7 }, weight: { p3: 15.4, p50: 18.7, p97: 24.1 } },
  { ageMonths: 72, height: { p3: 106.3, p50: 114.5, p97: 123.2 }, weight: { p3: 16.3, p50: 19.9, p97: 26.0 } },
];

const GIRLS: GrowthStandardPoint[] = [
  { ageMonths: 0, height: { p3: 44.5, p50: 48.8, p97: 52.0 }, weight: { p3: 2.2, p50: 3.0, p97: 3.7 } },
  { ageMonths: 1, height: { p3: 50.5, p50: 54.5, p97: 57.9 }, weight: { p3: 3.5, p50: 4.4, p97: 5.4 } },
  { ageMonths: 2, height: { p3: 53.9, p50: 57.9, p97: 61.5 }, weight: { p3: 4.3, p50: 5.3, p97: 6.4 } },
  { ageMonths: 3, height: { p3: 56.5, p50: 60.6, p97: 64.3 }, weight: { p3: 4.9, p50: 6.1, p97: 7.2 } },
  { ageMonths: 4, height: { p3: 58.6, p50: 62.8, p97: 66.6 }, weight: { p3: 5.4, p50: 6.6, p97: 7.9 } },
  { ageMonths: 5, height: { p3: 60.4, p50: 64.7, p97: 68.6 }, weight: { p3: 5.8, p50: 7.1, p97: 8.5 } },
  { ageMonths: 6, height: { p3: 61.9, p50: 66.3, p97: 70.3 }, weight: { p3: 6.1, p50: 7.5, p97: 8.9 } },
  { ageMonths: 7, height: { p3: 63.2, p50: 67.6, p97: 71.7 }, weight: { p3: 6.3, p50: 7.8, p97: 9.2 } },
  { ageMonths: 8, height: { p3: 64.3, p50: 68.8, p97: 73.0 }, weight: { p3: 6.5, p50: 8.0, p97: 9.5 } },
  { ageMonths: 9, height: { p3: 65.3, p50: 69.9, p97: 74.2 }, weight: { p3: 6.7, p50: 8.2, p97: 9.8 } },
  { ageMonths: 10, height: { p3: 66.2, p50: 70.9, p97: 75.2 }, weight: { p3: 6.8, p50: 8.4, p97: 10.0 } },
  { ageMonths: 11, height: { p3: 67.1, p50: 71.9, p97: 76.3 }, weight: { p3: 7.0, p50: 8.5, p97: 10.2 } },
  { ageMonths: 12, height: { p3: 70.3, p50: 75.3, p97: 80.0 }, weight: { p3: 7.5, p50: 9.1, p97: 11.0 } },
  { ageMonths: 18, height: { p3: 75.6, p50: 81.0, p97: 86.2 }, weight: { p3: 8.5, p50: 10.3, p97: 12.4 } },
  { ageMonths: 24, height: { p3: 79.5, p50: 85.2, p97: 90.8 }, weight: { p3: 9.5, p50: 11.5, p97: 13.9 } },
  { ageMonths: 30, height: { p3: 83.4, p50: 89.6, p97: 95.6 }, weight: { p3: 10.5, p50: 12.6, p97: 15.3 } },
  { ageMonths: 36, height: { p3: 86.8, p50: 93.2, p97: 99.7 }, weight: { p3: 11.2, p50: 13.5, p97: 16.5 } },
  { ageMonths: 42, height: { p3: 89.9, p50: 96.7, p97: 103.6 }, weight: { p3: 11.8, p50: 14.3, p97: 17.7 } },
  { ageMonths: 48, height: { p3: 93.2, p50: 100.4, p97: 107.7 }, weight: { p3: 12.5, p50: 15.2, p97: 19.1 } },
  { ageMonths: 54, height: { p3: 96.5, p50: 104.0, p97: 111.8 }, weight: { p3: 13.2, p50: 16.2, p97: 20.7 } },
  { ageMonths: 60, height: { p3: 99.6, p50: 107.5, p97: 115.7 }, weight: { p3: 14.0, p50: 17.2, p97: 22.4 } },
  { ageMonths: 66, height: { p3: 102.5, p50: 110.8, p97: 119.5 }, weight: { p3: 14.7, p50: 18.3, p97: 24.5 } },
  { ageMonths: 72, height: { p3: 105.4, p50: 114.1, p97: 123.2 }, weight: { p3: 15.5, p50: 19.5, p97: 27.0 } },
];

/**
 * 性別に応じた成長曲線の基準値を返す。「未設定」・未入力の場合は帯を表示しない(空配列)。
 */
export function getGrowthStandards(gender: Child['gender']): GrowthStandardPoint[] {
  if (gender === '男の子') return BOYS;
  if (gender === '女の子') return GIRLS;
  return [];
}
