import { test, expect, type Page } from '@playwright/test';

declare global {
  interface Window {
    __e2eDownloads?: Array<{ filename: string; text: string }>;
    __e2ePendingDownloadBlob?: Blob;
  }
}

type CapturedDownload = { filename: string; text: string };

async function installDownloadCapture(page: Page) {
  await page.addInitScript(() => {
    const downloads: Array<{ filename: string; text: string }> = [];
    Object.defineProperty(window, '__e2eDownloads', { value: downloads, configurable: true });

    window.URL.createObjectURL = ((blob: Blob) => {
      window.__e2ePendingDownloadBlob = blob;
      return `blob:e2e-${downloads.length}`;
    }) as typeof window.URL.createObjectURL;

    window.URL.revokeObjectURL = (() => undefined) as typeof window.URL.revokeObjectURL;

    const originalCreateElement = document.createElement.bind(document);
    document.createElement = ((tagName: string, options?: ElementCreationOptions) => {
      const element = originalCreateElement(tagName, options);
      if (tagName.toLowerCase() === 'a') {
        element.click = (() => {
          const anchor = element as HTMLAnchorElement;
          const blob = window.__e2ePendingDownloadBlob;
          const filename = anchor.download || 'download';
          if (blob) {
            downloads.push({
              filename,
              text: `[blob:${blob.type || 'application/octet-stream'}:${blob.size}]`,
            });
            void blob.text().then((text) => {
              const last = downloads[downloads.length - 1];
              if (last && last.filename === filename) last.text = text;
            });
          }
        }) as typeof element.click;
      }
      return element;
    }) as typeof document.createElement;
  });
}

async function waitForLastCapturedDownload(page: Page): Promise<CapturedDownload> {
  await page.waitForFunction(() => Boolean(window.__e2eDownloads?.length));
  return page.evaluate(() => {
    const downloads = window.__e2eDownloads ?? [];
    return downloads[downloads.length - 1] as CapturedDownload;
  });
}

async function captureDownloadClick(
  page: Page,
  buttonName: string | RegExp,
): Promise<CapturedDownload> {
  const beforeCount = await page.evaluate(() => window.__e2eDownloads?.length ?? 0);
  await page.getByRole('button', { name: buttonName }).click();
  await page.waitForFunction((count) => (window.__e2eDownloads?.length ?? 0) > count, beforeCount);
  return waitForLastCapturedDownload(page);
}

async function captureTextDownloadClick(
  page: Page,
  buttonName: string | RegExp,
): Promise<CapturedDownload> {
  await captureDownloadClick(page, buttonName);
  await page.waitForFunction(() => {
    const downloads = window.__e2eDownloads ?? [];
    const last = downloads[downloads.length - 1];
    return Boolean(last && !last.text.startsWith('[blob:'));
  });
  return waitForLastCapturedDownload(page);
}

test.describe('stage 7 critical interaction regressions', () => {
  test('dashboard imports legacy progress JSON and exports normalized backup', async ({ page }) => {
    await installDownloadCapture(page);
    await page.goto('/dashboard', { waitUntil: 'networkidle' });
    await expect(page.getByRole('heading', { name: /学习仪表盘/ })).toBeVisible();

    const legacyPayload = {
      completedModules: ['overview', 'overview', 5],
      completedLabs: ['serial-lab'],
      quizScores: { overview: 101 },
      wrongQuestions: ['q1', 'q1'],
    };

    await page.locator('#progress-import-json').fill(JSON.stringify(legacyPayload));
    await page.getByRole('button', { name: '导入进度' }).click();
    await expect(page.getByRole('status')).toContainText('进度导入成功');

    await expect
      .poll(() =>
        page.evaluate(() =>
          JSON.parse(window.localStorage.getItem('mfc-toolkit-progress-v2') ?? '{}'),
        ),
      )
      .toMatchObject({
        version: 2,
        completedModules: ['overview'],
        completedLabs: ['serial-lab'],
        quizScores: { overview: 100 },
        wrongQuestions: ['q1'],
      });

    const exportedDownload = await captureTextDownloadClick(page, '导出进度 JSON');
    expect(exportedDownload.filename).toMatch(/^mfc-toolkit-progress-\d+\.json$/);
    const exported = JSON.parse(exportedDownload.text);
    expect(exported.schema).toBe('mfc-toolkit-progress');
    expect(exported.version).toBe(2);
    expect(exported.progress.completedModules).toEqual(['overview']);
  });

  test('codegen downloads a ZIP mini project package with generated skeleton files', async ({
    page,
  }) => {
    await installDownloadCapture(page);
    await page.goto('/codegen', { waitUntil: 'networkidle' });
    await expect(page.getByRole('heading', { name: /MFC 项目代码骨架生成器/ })).toBeVisible();

    await page.getByRole('button', { name: '全选模块' }).click();
    await expect(page.locator('.codegen-stats')).toContainText('已选模块');

    const zipLoadedBefore = await page.evaluate(() =>
      performance
        .getEntriesByType('resource')
        .some((entry) => entry.name.includes('vendor-zip-lazy')),
    );
    expect(zipLoadedBefore).toBe(false);

    await page.getByRole('button', { name: '下载 ZIP Mini Project 包' }).click();
    await expect
      .poll(() =>
        page.evaluate(() =>
          performance
            .getEntriesByType('resource')
            .some((entry) => entry.name.includes('vendor-zip-lazy')),
        ),
      )
      .toBe(true);
  });

  test('designer switches presets, selects controls, and downloads markdown layout', async ({
    page,
  }) => {
    await installDownloadCapture(page);
    await page.goto('/designer', { waitUntil: 'networkidle' });
    await expect(page.getByRole('heading', { name: /MFC Dialog 控件布局设计器/ })).toBeVisible();

    await expect(page.locator('.designer-inspector')).toContainText('IDC_TAB_MAIN');
    await page.getByRole('button', { name: /TCP\/HTTP 调试面板/ }).click();
    await expect(page.locator('.designer-inspector')).toContainText('IDC_GROUP_TCP');

    await page.getByTitle(/IDC_BTN_TCP_CONNECT/).dispatchEvent('click');
    await expect(page.locator('.designer-inspector')).toContainText('IDC_BTN_TCP_CONNECT');
    await expect(page.locator('.designer-inspector')).toContainText('OnBnClickedTcpConnect');

    const markdownDownload = await captureTextDownloadClick(page, '下载布局说明');
    expect(markdownDownload.filename).toBe('mfc-dialog-layout-tcp-http-panel.md');
    expect(markdownDownload.text).toContain('TCP/HTTP 调试面板');
  });

  test('integration checklist persists localStorage state and resets cleanly', async ({ page }) => {
    await page.goto('/integration', { waitUntil: 'networkidle' });
    await expect(page.getByRole('heading', { name: /MFC 本地项目集成向导/ })).toBeVisible();

    await expect(page.locator('.integration-checklist-card')).toContainText('0/');
    await page.getByRole('button', { name: '全部标记完成' }).click();
    await expect(page.locator('.integration-checklist-card')).toContainText('100%');

    const storedAll = await page.evaluate(() =>
      JSON.parse(window.localStorage.getItem('mfc-local-integration-checklist-v1') ?? '[]'),
    );
    expect(storedAll.length).toBeGreaterThan(0);

    await page.reload({ waitUntil: 'networkidle' });
    await expect(page.locator('.integration-checklist-card')).toContainText('100%');

    await page.getByRole('button', { name: '重置清单' }).click();
    await expect(page.locator('.integration-checklist-card')).toContainText('0/');
    await expect
      .poll(() =>
        page.evaluate(() =>
          JSON.parse(window.localStorage.getItem('mfc-local-integration-checklist-v1') ?? '[]'),
        ),
      )
      .toEqual([]);
  });
});
