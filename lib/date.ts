/**
 * microCMSの日付を日本時間(Asia/Tokyo)の暦日・日時として扱うための関数群。
 *
 * microCMSの日付フィールドはUTCのISO文字列で返る。管理画面で「日付のみ」を指定していても、
 * 日本時間の0時が`2024-01-14T15:00:00.000Z`のように前日の15時(UTC)として返るため、
 * 先頭10文字をそのまま使うと1日ずれる。必ず日本時間に変換してから日付を取り出す。
 */

const TIME_ZONE = 'Asia/Tokyo';

export type DateParts = { year: number; month: number; day: number };

const formatter = new Intl.DateTimeFormat('en-US', {
  timeZone: TIME_ZONE,
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  hourCycle: 'h23',
});

function tokyoParts(date: Date) {
  const parts = formatter.formatToParts(date);
  const get = (type: Intl.DateTimeFormatPartTypes) => parts.find((p) => p.type === type)?.value ?? '';
  return { year: get('year'), month: get('month'), day: get('day'), hour: get('hour'), minute: get('minute') };
}

function toDate(value: string): Date {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    throw new Error(`不正な日付形式です: ${value}`);
  }
  return date;
}

/**
 * 日時を日本時間の暦日(年・月・日)に分解する。
 */
export function tokyoDateParts(date: Date): DateParts {
  const { year, month, day } = tokyoParts(date);
  return { year: Number(year), month: Number(month), day: Number(day) };
}

/**
 * microCMSの日付文字列を日本時間の暦日(年・月・日)に分解する。
 */
export function parseTokyoDate(value: string): DateParts {
  return tokyoDateParts(toDate(value));
}

/**
 * microCMSの日付文字列を日本時間の`YYYY-MM-DD`にする。
 */
export function formatDate(value: string): string {
  const { year, month, day } = tokyoParts(toDate(value));
  return `${year}-${month}-${day}`;
}

/**
 * microCMSの日時文字列を日本時間の`YYYY-MM-DD HH:mm`にする。
 */
export function formatDateTime(value: string): string {
  const { year, month, day, hour, minute } = tokyoParts(toDate(value));
  return `${year}-${month}-${day} ${hour}:${minute}`;
}
