import { test, expect } from '@playwright/test';

test('home page loads', async ({ page }) => {
  await page.goto('http://localhost:5050');

  await expect(page.locator('h1')).toHaveText('Sample App');
  await expect(page.getByText('example project')).toBeVisible();
});

test('navigation to contact page works', async ({ page }) => {
  await page.goto('http://localhost:5050');

  await page.getByRole('link', { name: 'Contact' }).click();

  await expect(page).toHaveURL(/\/contact/);
  await expect(page.locator('h1')).toHaveText('Contact');
});

test('contact form submission works', async ({ page }) => {
  await page.goto('http://localhost:5050/contact');

  await page.locator('input[name="name"]').fill('Ragad');
  await page.getByRole('button', { name: 'Submit' }).click();

  await expect(page.locator('h1')).toHaveText('Thank you');
  await expect(page.getByText('Thanks, Ragad.')).toBeVisible();
});
