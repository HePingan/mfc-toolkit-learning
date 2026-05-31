import { test, expect } from '@playwright/test';

test('labs page supports core interactions', async ({ page }) => {
  await page.goto('/labs', { waitUntil: 'networkidle' });
  await expect(page.getByRole('heading', { name: /交互实验室/ })).toBeVisible();

  const body = page.locator('body');
  await expect(body).toContainText('串口参数模拟器');
  await expect(body).toContainText('ASCII / HEX 转换器');
  await expect(body).toContainText('Modbus RTU 帧构造器');

  await page.locator('select').first().selectOption('COM4');
  await expect(body).toContainText('当前配置：COM4');

  await page.getByRole('button', { name: '标记完成' }).click();
  await expect(page.getByRole('heading', { name: /串口参数模拟器 ✅/ })).toBeVisible();
});
