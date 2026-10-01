import { test, expect } from '@playwright/test';

test('予防接種の標準スケジュールが表示され、未接種は接種済にならない', async ({ page }) => {
  await page.goto('/vaccinations');

  await expect(page.getByRole('heading', { name: '予防接種' })).toBeVisible();

  const bcgRow = page.getByRole('row', { name: /BCG（結核）/ });
  await expect(bcgRow).toBeVisible();
  await expect(bcgRow).not.toContainText('接種済');

  // サンプルの子どもはまだ接種記録が無いため、標準的な時期を過ぎたワクチンは「予定超過」になる
  await expect(page.getByText('予定超過').first()).toBeVisible();
});
