/**
 * 誕生日からの月齢・年齢を計算する純関数群。
 *
 * 誕生日・基準日はどちらも日本時間(Asia/Tokyo)の暦日に揃えてから比較する
 * (microCMSの日付はUTCで返るため。詳細は`lib/date.ts`)。
 */

import { parseTokyoDate, tokyoDateParts } from './date.ts';

/**
 * 誕生日から基準日時点の月齢(生後何ヶ月か)を返す。日またぎの端数は切り捨てる
 * (例: 生後1ヶ月と20日 → 1)。
 */
export function calculateAgeInMonths(birthday: string, asOf: Date = new Date()): number {
  const birth = parseTokyoDate(birthday);
  const today = tokyoDateParts(asOf);

  let months = (today.year - birth.year) * 12 + (today.month - birth.month);

  if (today.day < birth.day) {
    months -= 1;
  }

  return Math.max(0, months);
}

/**
 * 誕生日から基準日時点の満年齢を返す。
 */
export function calculateAgeInYears(birthday: string, asOf: Date = new Date()): number {
  return Math.floor(calculateAgeInMonths(birthday, asOf) / 12);
}

/**
 * 年齢を「◯歳◯ヶ月」の表示用文字列にする。1歳未満は「◯ヶ月」のみ。
 */
export function formatAge(birthday: string, asOf: Date = new Date()): string {
  const totalMonths = calculateAgeInMonths(birthday, asOf);
  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;

  if (years === 0) {
    return `${months}ヶ月`;
  }
  if (months === 0) {
    return `${years}歳`;
  }
  return `${years}歳${months}ヶ月`;
}

/**
 * 月齢(整数)を「◯歳◯ヶ月」の表示用文字列にする。1歳未満は「◯ヶ月」のみ。
 */
export function formatMonthsAsAge(totalMonths: number): string {
  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;

  if (years === 0) {
    return `${months}ヶ月`;
  }
  if (months === 0) {
    return `${years}歳`;
  }
  return `${years}歳${months}ヶ月`;
}
