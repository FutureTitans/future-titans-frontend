import { test, expect } from '@playwright/test';

const publicPages = [
  { path: '/about-us', title: /about/i },
  { path: '/contact', title: /contact/i },
  { path: '/blog', title: /blog/i },
  { path: '/for-schools', title: /school/i },
  { path: '/for-parents', title: /parent/i },
];

test.describe('Public Marketing Pages', () => {
  for (const { path, title } of publicPages) {
    test(`${path} loads and renders content`, async ({ page }) => {
      const response = await page.goto(path);
      expect(response.status()).toBeLessThan(400);
      await expect(page.locator('main, [role="main"], body')).not.toBeEmpty();
    });
  }

  test('contact page has a form or contact info', async ({ page }) => {
    await page.goto('/contact');
    const hasForm = await page.locator('form').count();
    const hasEmail = await page.locator('text=/@|email|contact/i').count();
    expect(hasForm + hasEmail).toBeGreaterThan(0);
  });
});
