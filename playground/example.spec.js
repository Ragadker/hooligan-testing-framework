import { test, expect } from '@playwright/test';

test('example.com loads', async ({ page }) => {
  await page.goto('https://example.com');
  await expect(page).toHaveTitle(/Example Domain/);
});

test('page has correct heading', async ({ page }) => {
  await page.goto('https://example.com');
  await expect(page.locator('h1')).toHaveText('Example Domain');
});

test('link is visible', async ({ page }) => {
  await page.goto('https://example.com');

  const link = page.locator('a');

  await expect(link).toBeVisible();
  await expect(link).toHaveAttribute('href', /iana\.org/);
});
