/**
 * 誕生日からの月齢・年齢を計算する純関数群。
 *
 * 誕生日(`YYYY-MM-DD`または先頭がそれに一致するISO文字列)は暦日そのものとして扱い、
 * タイムゾーン変換を行わない(日付型フィールドにTZ変換をかけるとズレるため)。
 * 「今日」の判定だけはサーバーのTZがUTCでもズレないよう、Asia/Tokyoの暦日を使う。
 */

type DateParts = { year: number; month: number; day: number };

function parseDateOnly(value: string): DateParts {
  const match = value.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!match) {
    throw new Error(`不正な日付形式です: ${value}`);
  }
  return { year: Number(match[1]), month: Number(match[2]), day: Number(match[3]) };
}

function tokyoDateParts(date: Date): DateParts {
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Tokyo',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  const parts = formatter.formatToParts(date);
  const get = (type: string) => Number(parts.find((p) => p.type === type)?.value ?? NaN);
  return { year: get('year'), month: get('month'), day: get('day') };
}

/**
 * 誕生日から基準日時点の月齢(生後何か月か)を返す。日またぎの端数は切り捨てる
 * (例: 生後1か月と20日 → 1)。
 */
export function calculateAgeInMonths(birthday: string, asOf: Date = new Date()): number {
  const birth = parseDateOnly(birthday);
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
 * 年齢を「◯歳◯か月」の表示用文字列にする。1歳未満は「◯か月」のみ。
 */
export function formatAge(birthday: string, asOf: Date = new Date()): string {
  const totalMonths = calculateAgeInMonths(birthday, asOf);
  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;

  if (years === 0) {
    return `${months}か月`;
  }
  if (months === 0) {
    return `${years}歳`;
  }
  return `${years}歳${months}か月`;
}
