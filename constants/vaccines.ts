import type { VaccineType } from '../types';

/**
 * 日本の定期接種スケジュール(標準的な接種期間)。
 *
 * 出典: 厚生労働省 予防接種実施規則 関連ページ(2026-10-01時点)
 * - 5種混合: https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/kenkou_iryou/kenkou/kekkaku-kansenshou/yobou-sesshu/vaccine/dpt-ipv-hib/index.html
 * - B型肝炎: https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/kenkou_iryou/kenkou/kekkaku-kansenshou/yobou-sesshu/vaccine/hepatitis-b/index.html
 * - ロタウイルス: https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/kenkou_iryou/kenkou/kekkaku-kansenshou/yobou-sesshu/vaccine/rota/index.html
 * - BCG: https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/kenkou_iryou/kenkou/kekkaku-kansenshou/yobou-sesshu/vaccine/bcg/index.html
 * - MR(1期・2期): https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/kenkou_iryou/kenkou/kekkaku-kansenshou/yobou-sesshu/vaccine/mr/index.html
 * - 水痘: https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/kenkou_iryou/kenkou/kekkaku-kansenshou/varicella/index.html
 * - 日本脳炎: https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/kenkou_iryou/kenkou/kekkaku-kansenshou/yobou-sesshu/vaccine/japanese-encephalitis/index.html
 * - HPV: https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/kenkou/hpv_qa.html
 *
 * `fromMonths`/`toMonths`は「標準的な接種期間」を月齢換算した絶対的な目安(このテンプレートの
 * 「予定超過」判定に使う簡略値)。`minIntervalDays`は前回接種からの最短接種間隔(参考値)。
 * 小児用肺炎球菌のブランド(PCV13/15/20)は接種時期に影響しないため区別しない。
 *
 * 以下は原典の制度が複雑で、本テンプレートでは簡略化している箇所(コード側のコメントも参照):
 * - ロタウイルス: ロタリックス(2回)を採用。ロタテック(3回)の3回目は本テンプレートでは対象外
 * - 日本脳炎: 1期(初回2回+追加1回。doseCount 1〜3)+2期(doseCount 4)としてモデル化。
 *   旧キャッチアップ制度(特例対象者)は対象外
 * - MR2期: 制度上は「小学校就学前1年間(学年ベース)」。月齢換算は近似
 * - HPV: 15歳未満で1回目を受ける場合の2回接種パスのみモデル化。15歳以上开始の3回接種パスは対象外。
 *   制度上は学年ベース(定期接種対象は高校1年相当の年度末まで)のため月齢換算は近似
 */
export type VaccineDoseSchedule = {
  doseCount: number;
  /** 標準的な接種開始月齢の目安 */
  fromMonths: number;
  /** 標準的な接種終了月齢の目安(これを超えると「予定超過」表示の対象) */
  toMonths: number;
  /** 前回接種からの最短接種間隔(日数)。doseCount:1には無い */
  minIntervalDays?: number;
};

export type VaccineSchedule = {
  doses: VaccineDoseSchedule[];
};

export const VACCINE_SCHEDULES: Record<VaccineType, VaccineSchedule> = {
  '5種混合（百日せき・ジフテリア・破傷風・ポリオ・Hib）': {
    doses: [
      { doseCount: 1, fromMonths: 2, toMonths: 7 },
      { doseCount: 2, fromMonths: 3, toMonths: 8, minIntervalDays: 20 },
      { doseCount: 3, fromMonths: 4, toMonths: 9, minIntervalDays: 20 },
      { doseCount: 4, fromMonths: 13, toMonths: 24, minIntervalDays: 180 },
    ],
  },
  小児用肺炎球菌: {
    doses: [
      { doseCount: 1, fromMonths: 2, toMonths: 7 },
      { doseCount: 2, fromMonths: 3, toMonths: 8, minIntervalDays: 27 },
      { doseCount: 3, fromMonths: 4, toMonths: 9, minIntervalDays: 27 },
      { doseCount: 4, fromMonths: 12, toMonths: 15, minIntervalDays: 60 },
    ],
  },
  B型肝炎: {
    doses: [
      { doseCount: 1, fromMonths: 2, toMonths: 4 },
      { doseCount: 2, fromMonths: 3, toMonths: 5, minIntervalDays: 27 },
      { doseCount: 3, fromMonths: 7, toMonths: 9, minIntervalDays: 139 },
    ],
  },
  ロタウイルス: {
    doses: [
      { doseCount: 1, fromMonths: 1.4, toMonths: 3.4 },
      { doseCount: 2, fromMonths: 2, toMonths: 5.5, minIntervalDays: 27 },
    ],
  },
  'BCG（結核）': {
    doses: [{ doseCount: 1, fromMonths: 5, toMonths: 8 }],
  },
  'MR（麻しん・風しん混合）': {
    doses: [{ doseCount: 1, fromMonths: 12, toMonths: 24 }],
  },
  '水痘（水ぼうそう）': {
    doses: [
      { doseCount: 1, fromMonths: 12, toMonths: 15 },
      { doseCount: 2, fromMonths: 18, toMonths: 24, minIntervalDays: 90 },
    ],
  },
  日本脳炎: {
    doses: [
      { doseCount: 1, fromMonths: 36, toMonths: 48 },
      { doseCount: 2, fromMonths: 36, toMonths: 48, minIntervalDays: 6 },
      { doseCount: 3, fromMonths: 48, toMonths: 60, minIntervalDays: 365 },
      { doseCount: 4, fromMonths: 108, toMonths: 156 },
    ],
  },
  'MR 2期（麻しん・風しんの追加）': {
    doses: [{ doseCount: 1, fromMonths: 60, toMonths: 84 }],
  },
  'DT（2種混合）：ジフテリア・破傷風（11歳〜12歳）': {
    doses: [{ doseCount: 1, fromMonths: 132, toMonths: 156 }],
  },
  'HPV（ヒトパピローマウイルス感染症／子宮頸がん予防）': {
    doses: [
      { doseCount: 1, fromMonths: 132, toMonths: 204 },
      { doseCount: 2, fromMonths: 138, toMonths: 210, minIntervalDays: 180 },
    ],
  },
  その他: { doses: [] },
};
