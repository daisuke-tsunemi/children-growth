import { test } from 'node:test';
import assert from 'node:assert/strict';
import { formatDate, formatDateTime, parseTokyoDate } from './date.ts';

test('formatDate: 日本時間0時(UTCでは前日15時)の日付は日本時間の暦日になる', () => {
  assert.equal(formatDate('2024-01-14T15:00:00.000Z'), '2024-01-15');
});

test('formatDate: UTC0時で返る日付も同じ暦日になる', () => {
  assert.equal(formatDate('2024-01-15T00:00:00.000Z'), '2024-01-15');
});

test('formatDate: 日付だけの文字列もそのままの暦日になる', () => {
  assert.equal(formatDate('2024-01-15'), '2024-01-15');
});

test('formatDateTime: 日本時間の日時にする(日付またぎ)', () => {
  assert.equal(formatDateTime('2024-01-14T20:05:00.000Z'), '2024-01-15 05:05');
});

test('formatDateTime: 日本時間0時台は24時ではなく00時と表示する', () => {
  assert.equal(formatDateTime('2024-01-14T15:30:00.000Z'), '2024-01-15 00:30');
});

test('parseTokyoDate: 不正な文字列はエラーにする', () => {
  assert.throws(() => parseTokyoDate('not-a-date'));
});
