import { expect, test } from '@playwright/test';

test('loads app and switches theme', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'PCB Panel Yield Visualizer' })).toBeVisible();
  await expect(page.locator('.result-card').filter({ hasText: '총 수량' })).toContainText('16 PCS');

  await page.getByRole('button', { name: /Dark/ }).click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
});
