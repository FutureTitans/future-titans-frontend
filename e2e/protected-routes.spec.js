import { test, expect } from '@playwright/test';

test.describe('Protected Routes Redirect to Login', () => {
  const protectedPaths = [
    '/student/dashboard',
    '/student/profile',
    '/admin',
    '/admin/students',
    '/admin/analytics',
  ];

  for (const path of protectedPaths) {
    test(`${path} redirects unauthenticated users`, async ({ page }) => {
      await page.goto(path);
      await page.waitForTimeout(2000);
      const url = page.url();
      const redirectedToLogin = url.includes('login') || url === new URL('/', page.url()).href;
      const hasLoginForm = await page.locator('input[type="password"]').count();
      expect(redirectedToLogin || hasLoginForm > 0).toBeTruthy();
    });
  }
});
