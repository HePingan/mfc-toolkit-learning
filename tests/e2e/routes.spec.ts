import { test, expect } from '@playwright/test';

const routes = [
  '/',
  '/roadmap',
  '/modules/overview',
  '/modules/serial',
  '/labs',
  '/quiz',
  '/practice',
  '/codegen',
  '/designer',
  '/integration',
  '/build-checklist',
  '/troubleshooting',
  '/diagrams',
  '/review',
  '/planner',
  '/portfolio',
  '/demo-script',
  '/delivery',
  '/submit-rehearsal',
  '/evidence',
  '/reports',
  '/dashboard',
  '/search',
  '/glossary',
  '/notes',
  '/resources',
  '/comics',
];

for (const route of routes) {
  test(`route ${route} renders without console errors`, async ({ page }) => {
    const consoleErrors: string[] = [];
    const pageErrors: string[] = [];
    const failedRequests: string[] = [];

    page.on('console', (message) => {
      if (message.type() === 'error') consoleErrors.push(message.text());
    });
    page.on('pageerror', (error) => pageErrors.push(error.message));
    page.on('requestfailed', (request) =>
      failedRequests.push(`${request.method()} ${request.url()}`),
    );

    const response = await page.goto(route, { waitUntil: 'networkidle' });
    expect(response?.ok(), `${route} should return HTTP 2xx`).toBe(true);
    await expect(page.locator('#root')).toBeVisible();
    await expect(page.locator('body')).not.toHaveText(/页面加载失败|Application error/i);
    expect(consoleErrors, `${route} console errors`).toEqual([]);
    expect(pageErrors, `${route} page errors`).toEqual([]);
    expect(failedRequests, `${route} failed requests`).toEqual([]);
  });
}
