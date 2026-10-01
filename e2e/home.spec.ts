import { test, expect } from '@playwright/test';

// 実際のmicroCMSサービスに登録済みのサンプルデータ(山田太郎・山田花子)に対して実行する。
// `measurements`・`vaccinations`・`daily`はサンプル未登録のため、空状態の表示を確認する。

test('ホームで子どもを切り替えられる', async ({ page }) => {
  await page.goto('/');
  const main = page.getByRole('main');

  await expect(main.getByText('山田 太郎')).toBeVisible();

  await page.getByRole('combobox', { name: '表示する子どもを選択' }).selectOption({ label: '山田 花子' });

  await expect(page).toHaveURL('/');
  await expect(main.getByText('山田 花子')).toBeVisible();
});

test('ホームに記録のサマリーが表示される(記録が無い場合)', async ({ page }) => {
  await page.goto('/');
  const main = page.getByRole('main');

  await expect(main.getByRole('link', { name: /からだの成長/ })).toContainText('まだ記録がありません');
  await expect(main.getByRole('link', { name: /予防接種/ })).toContainText(/予定超過 \d+件/);
  await expect(main.getByRole('link', { name: /日々の記録/ })).toContainText('まだ記録がありません');
});
