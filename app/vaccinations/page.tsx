import type { Metadata } from 'next';
import { getSelectedChild } from '../../lib/selected-child';
import { getVaccinations } from '../../lib/microcms';
import { buildVaccinationSchedule } from '../../lib/vaccinations';
import { formatAge } from '../../lib/age';
import VaccinationsTable from '../../components/tables/VaccinationsTable';

export const metadata: Metadata = { title: '予防接種' };

export default async function VaccinationsPage() {
  const { selected } = await getSelectedChild();

  if (!selected) {
    return (
      <div className="rounded-lg border-2 border-dashed border-gray-300 bg-white p-8 text-center text-gray-500">
        まだ子どもが登録されていません。microCMSの管理画面から「子どもプロフィール」を登録してください。
      </div>
    );
  }

  const vaccinations = await getVaccinations(selected.id);
  const rows = buildVaccinationSchedule(selected.birthday, vaccinations);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-[32px] leading-[1.2] text-gray-800">予防接種</h1>
        <p className="text-sm text-gray-500">
          {selected.name}({formatAge(selected.birthday)})
        </p>
      </div>

      <p className="rounded-md bg-tertiary-500/15 px-4 py-3 text-sm font-medium text-[#854d0e]">
        「標準的な時期」は厚生労働省の定期接種スケジュールを月齢換算した目安です。実際の接種時期は医療機関・自治体の案内に従ってください。本アプリは記録用であり、医療上の判断を示すものではありません。
      </p>

      <VaccinationsTable rows={rows} />
    </div>
  );
}
