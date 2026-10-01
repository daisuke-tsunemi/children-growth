import { test } from 'node:test';
import assert from 'node:assert/strict';
import { calculateAgeInMonths, calculateAgeInYears, formatAge } from './age.ts';

test('calculateAgeInMonths: ちょうど誕生日なら満1か月', () => {
  assert.equal(calculateAgeInMonths('2024-01-15', new Date('2024-02-15T12:00:00Z')), 1);
});

test('calculateAgeInMonths: 誕生日前日はまだ満0か月のまま', () => {
  assert.equal(calculateAgeInMonths('2024-01-15', new Date('2024-02-14T12:00:00Z')), 0);
});

test('calculateAgeInMonths: 31日生まれ・翌月が30日までしか無い場合は末日で繰り上がる', () => {
  // 1/31生まれ → 2/28時点では「2月は31日が無い」ため日比較(28 < 31)でまだ繰り上がらず0のまま、
  // 3/31時点で満2か月になる(2/31は存在しないため2月分はスキップされる)
  assert.equal(calculateAgeInMonths('2024-01-31', new Date('2024-02-28T12:00:00Z')), 0);
  assert.equal(calculateAgeInMonths('2024-01-31', new Date('2024-03-31T12:00:00Z')), 2);
});

test('calculateAgeInMonths: うるう年をまたいでも正しく計算する', () => {
  assert.equal(calculateAgeInMonths('2023-02-28', new Date('2024-02-29T12:00:00Z')), 12);
});

test('calculateAgeInMonths: 未来日(基準日より前の誕生日)は0未満にならない', () => {
  assert.equal(calculateAgeInMonths('2099-01-01', new Date('2024-01-01T12:00:00Z')), 0);
});

test('calculateAgeInYears: 24か月は満2歳', () => {
  assert.equal(calculateAgeInYears('2022-01-15', new Date('2024-01-20T12:00:00Z')), 2);
});

test('formatAge: 1歳未満は「◯か月」', () => {
  assert.equal(formatAge('2024-01-15', new Date('2024-06-15T12:00:00Z')), '5か月');
});

test('formatAge: ちょうど◯歳は「◯歳」のみ', () => {
  assert.equal(formatAge('2022-01-15', new Date('2024-01-15T12:00:00Z')), '2歳');
});

test('formatAge: 端数月があれば「◯歳◯か月」', () => {
  assert.equal(formatAge('2022-01-15', new Date('2024-04-20T12:00:00Z')), '2歳3か月');
});
