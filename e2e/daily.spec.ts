import { test, expect } from '@playwright/test';

test('日々の記録は記録が無い場合に空状態を表示し、分類で絞り込める', async ({ page }) => {
  await page.goto('/daily');

  await expect(page.getByRole('heading', { name: '日々の記録' })).toBeVisible();
  await expect(page.getByText('まだ記録がありません')).toBeVisible();

  await page.getByRole('link', { name: 'からだ', exact: true }).click();

  await expect(page).toHaveURL(/category=/);
  await expect(page.getByText('まだ記録がありません')).toBeVisible();
});
