import { test, expect } from '@playwright/test';

test('記録が無い場合は空状態を表示する', async ({ page }) => {
  await page.goto('/growth');

  await expect(page.getByRole('heading', { name: 'からだの成長' })).toBeVisible();
  await expect(page.getByText('まだ記録がありません')).toHaveCount(3); // 身長チャート・体重チャート・一覧表それぞれ
});
