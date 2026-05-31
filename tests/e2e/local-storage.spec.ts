import { test, expect } from '@playwright/test';

test('localStorage persists notes and recovers from invalid progress JSON', async ({ page }) => {
  await page.goto('/notes', { waitUntil: 'networkidle' });
  await expect(page.getByRole('heading', { name: /本地学习笔记/ })).toBeVisible();

  const noteText = `e2e-note-${Date.now()}`;
  await page.locator('input[placeholder^="笔记标题"]').fill(noteText);
  await page.locator('textarea.note-textarea').fill(`content-${noteText}`);
  await page.getByRole('button', { name: '保存笔记' }).click();
  await expect(page.locator('body')).toContainText(noteText);

  await page.reload({ waitUntil: 'networkidle' });
  await expect(page.locator('body')).toContainText(noteText);

  await page.evaluate(() => {
    window.localStorage.setItem('mfc-toolkit-progress-v1', '{broken-json');
  });
  await page.goto('/dashboard', { waitUntil: 'networkidle' });
  await expect(page.getByRole('heading', { name: /学习仪表盘/ })).toBeVisible();
});
