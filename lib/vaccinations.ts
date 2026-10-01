import { calculateAgeInMonths } from './age';
import { VACCINE_SCHEDULES, type VaccineSchedule } from '../constants/vaccines';
import type { Vaccination, VaccineType } from '../types';

export type VaccinationStatus = 'completed' | 'overdue' | 'upcoming' | 'not_yet_due';

export type VaccinationRow = {
  vaccine: VaccineType;
  doseCount: number;
  /** 標準スケジュール外の記録(例: ロタテックの3回目)はnull */
  fromMonths: number | null;
  toMonths: number | null;
  /** 実際の接種記録(無ければ未接種・未登録) */
  record: Vaccination | null;
  status: VaccinationStatus;
};

/**
 * 同一ワクチン×回数の重複記録を1件に畳む(更新日が新しいものを優先する)。
 * `microcms-schema.md`「1子ども×vaccine×doseCountにつき1レコード(アプリ側で重複防止)」に対応。
 */
function dedupeByVaccineAndDose(vaccinations: Vaccination[]): Map<string, Vaccination> {
  const map = new Map<string, Vaccination>();

  for (const vaccination of vaccinations) {
    const key = `${vaccination.vaccine}:${vaccination.doseCount}`;
    const existing = map.get(key);

    if (!existing || new Date(vaccination.updatedAt) > new Date(existing.updatedAt)) {
      map.set(key, vaccination);
    }
  }

  return map;
}

function resolveStatus(record: Vaccination | null, ageMonths: number, toMonths: number | null): VaccinationStatus {
  if (record?.status) {
    return 'completed';
  }
  if (toMonths === null) {
    // 標準スケジュールに無い回数(ロタテックの3回目等)は、記録がある時点でcompleted以外にならない
    return 'not_yet_due';
  }
  if (ageMonths > toMonths) {
    return 'overdue';
  }
  return 'upcoming';
}

/**
 * 子どもの誕生日と実際の接種記録から、標準スケジュール上の全行(未接種含む)を組み立てる。
 * 標準スケジュールに定義の無い回数の記録(例: ロタテックの3回目)も、接種実績として末尾に含める。
 */
export function buildVaccinationSchedule(
  birthday: string,
  vaccinations: Vaccination[],
  asOf: Date = new Date(),
): VaccinationRow[] {
  const recordsByKey = dedupeByVaccineAndDose(vaccinations);
  const matchedKeys = new Set<string>();
  const ageMonths = calculateAgeInMonths(birthday, asOf);
  const rows: VaccinationRow[] = [];

  for (const [vaccine, schedule] of Object.entries(VACCINE_SCHEDULES) as [VaccineType, VaccineSchedule][]) {
    for (const dose of schedule.doses) {
      const key = `${vaccine}:${dose.doseCount}`;
      const record = recordsByKey.get(key) ?? null;
      matchedKeys.add(key);

      rows.push({
        vaccine,
        doseCount: dose.doseCount,
        fromMonths: dose.fromMonths,
        toMonths: dose.toMonths,
        record,
        status: resolveStatus(record, ageMonths, dose.toMonths),
      });
    }
  }

  // 標準スケジュールに定義の無い回数の実記録(ロタテックの3回目等)も取りこぼさず表示する
  for (const [key, record] of recordsByKey) {
    if (matchedKeys.has(key)) continue;

    rows.push({
      vaccine: record.vaccine,
      doseCount: record.doseCount,
      fromMonths: null,
      toMonths: null,
      record,
      status: resolveStatus(record, ageMonths, null),
    });
  }

  return rows;
}
