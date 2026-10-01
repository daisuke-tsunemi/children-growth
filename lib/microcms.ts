import { createClient } from 'microcms-js-sdk';
import { cache } from 'react';
import {
  childSchema,
  measurementSchema,
  vaccinationSchema,
  dailySchema,
  type Child,
  type Measurement,
  type Vaccination,
  type Daily,
  type DailyCategory,
} from '../types';

if (!process.env.MICROCMS_SERVICE_DOMAIN) {
  throw new Error('MICROCMS_SERVICE_DOMAIN is required');
}
if (!process.env.MICROCMS_API_KEY) {
  throw new Error('MICROCMS_API_KEY is required');
}

// 読み取り専用クライアント。本アプリは表示専用のため書き込み用キーは持たない
export const client = createClient({
  serviceDomain: process.env.MICROCMS_SERVICE_DOMAIN,
  apiKey: process.env.MICROCMS_API_KEY,
});

// microCMSの1回の取得上限
const MAX_LIMIT = 100;

type MicroCMSListResponse = {
  contents: unknown[];
  totalCount: number;
};

/**
 * `offset`で全件取得するヘルパー。100件を超えるコンテンツ数に備える。
 */
async function fetchAllContents(endpoint: string, queries: Record<string, unknown> = {}): Promise<unknown[]> {
  const all: unknown[] = [];
  let offset = 0;

  for (;;) {
    const res = (await client.get({
      endpoint,
      queries: { ...queries, limit: MAX_LIMIT, offset },
    })) as MicroCMSListResponse;

    all.push(...res.contents);

    if (all.length >= res.totalCount || res.contents.length === 0) {
      break;
    }

    offset += MAX_LIMIT;
  }

  return all;
}

/**
 * 子どもプロフィール一覧(登録順)。
 */
export const getChildren = cache(async (): Promise<Child[]> => {
  const raw = await fetchAllContents('children', { orders: 'createdAt' });
  return raw.map((item) => childSchema.parse(item));
});

/**
 * 指定した子どものからだの成長記録(測定日の昇順。チャート表示に使う並び順)。
 */
export const getMeasurements = cache(async (childId: string): Promise<Measurement[]> => {
  const raw = await fetchAllContents('measurements', {
    filters: `child[equals]${childId}`,
    orders: 'measuredAt',
    depth: 1,
  });
  return raw.map((item) => measurementSchema.parse(item));
});

/**
 * 指定した子どもの予防接種記録。
 */
export const getVaccinations = cache(async (childId: string): Promise<Vaccination[]> => {
  const raw = await fetchAllContents('vaccinations', {
    filters: `child[equals]${childId}`,
    depth: 1,
  });
  return raw.map((item) => vaccinationSchema.parse(item));
});

/**
 * 指定した子どもの日々の記録(新しい順)。`category`を指定すると絞り込む。
 */
export const getDaily = cache(async (childId: string, category?: DailyCategory): Promise<Daily[]> => {
  const filters = category
    ? `child[equals]${childId}[and]category[equals]${category}`
    : `child[equals]${childId}`;

  const raw = await fetchAllContents('daily', {
    filters,
    orders: '-createdAt',
    depth: 1,
  });
  return raw.map((item) => dailySchema.parse(item));
});
