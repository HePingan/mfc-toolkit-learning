#!/usr/bin/env node
/* eslint-disable no-useless-escape */
/* Android mobile QA v7 static + HTTPS verification */
import { writeFile, mkdir } from 'node:fs/promises';
import http from 'node:http';
import https from 'node:https';

const base = process.env.MOBILE_QA_BASE || 'https://studymfc.hpa888.top';
const routes = [
  '/',
  '/dashboard',
  '/modules/serial',
  '/labs',
  '/codegen',
  '/designer',
  '/integration',
  '/reports',
  '/review',
  '/planner',
  '/exam',
  '/demo-script',
  '/delivery',
  '/submit-rehearsal',
  '/evidence',
  '/portfolio',
  '/build-checklist',
];
const required = {
  css: [
    'Android mobile QA v3',
    'android-v4-core-loop',
    'android-v5-final-handoff',
    'android-v6-submit-rehearsal',
    'android-v7-evidence-library',
    'android-dashboard-continue-card',
    'review-list-grid',
    'exam-list-card',
    'demo-step-list',
    'delivery-preview-card',
    'delivery-final-five-grid',
    'preview-actions',
    'submit-step-list',
    'submit-status-grid',
    'evidence-list-card',
    'evidence-status-grid',
    'delivery-evidence-library-card',
  ],
  main: ['bottom-tab-bar', '/evidence', '证据'],
  chunks: {
    DashboardPage: ['Learning loop v4', 'delivery-readiness-score', '/evidence', '证据库'],
    ReviewPage: ['复习训练台', 'Review Scope'],
    PlannerPage: ['Learning loop v4', '今日任务'],
    ExamPage: ['答辩训练场', 'Question List', '专注答题', 'focus-mode'],
    DemoScriptPage: ['Evidence Gap', 'Markdown Preview', '展开预览', 'is-collapsed'],
    DeliveryPage: [
      'delivery-quality-v2',
      'delivery-gap-wizard',
      'final-submit-five',
      '一键填充模板',
      '进入真实提交演练',
      'android-v7-evidence-library',
      '证据素材库',
    ],
    SubmitRehearsalPage: [
      'android-v6-submit-rehearsal',
      '项目提交演练',
      'Submit Order',
      '导出提交清单',
      'next-submit-gap',
      '证据库关联',
    ],
    EvidencePage: [
      'android-v7-evidence-library',
      '证据素材库',
      'Evidence Library',
      'next-evidence-gap',
      '导出证据索引',
    ],
  },
};

async function fetchText(path) {
  const url = new URL(path, base).toString();
  return requestText(url, 0);
}

function requestText(url, redirects = 0) {
  return new Promise((resolve, reject) => {
    const parsed = new URL(url);
    const client = parsed.protocol === 'https:' ? https : http;
    const req = client.get(parsed, { rejectUnauthorized: false, timeout: 15000 }, (res) => {
      const status = res.statusCode || 0;
      const location = res.headers.location;
      if ([301, 302, 303, 307, 308].includes(status) && location && redirects < 5) {
        res.resume();
        resolve(requestText(new URL(location, parsed).toString(), redirects + 1));
        return;
      }
      let text = '';
      res.setEncoding('utf8');
      res.on('data', (chunk) => {
        text += chunk;
      });
      res.on('end', () => resolve({ url, status, ok: status >= 200 && status < 300, text }));
    });
    req.on('timeout', () => req.destroy(new Error(`timeout ${url}`)));
    req.on('error', reject);
  });
}

function checkHttpsCertificate() {
  return new Promise((resolve, reject) => {
    const parsed = new URL(base);
    if (parsed.protocol !== 'https:') {
      resolve({ skipped: true, reason: `base protocol is ${parsed.protocol}` });
      return;
    }
    const req = https.get(
      {
        hostname: parsed.hostname,
        port: parsed.port || 443,
        path: '/',
        servername: parsed.hostname,
        rejectUnauthorized: false,
        timeout: 15000,
      },
      (res) => {
        const cert = res.socket.getPeerCertificate();
        res.resume();
        const subjectAltName = cert?.subjectaltname || '';
        const cn = cert?.subject?.CN || '';
        const validTo = cert?.valid_to || '';
        const names = `${cn} ${subjectAltName}`;
        const host = parsed.hostname;
        const wildcard =
          host.split('.').length > 2 ? `*.${host.split('.').slice(1).join('.')}` : '';
        const matchesHost =
          names.includes(`DNS:${host}`) ||
          names.includes(host) ||
          (wildcard && names.includes(`DNS:${wildcard}`));
        resolve({ host, cn, subjectAltName, validTo, matchesHost });
      },
    );
    req.on('timeout', () => req.destroy(new Error(`certificate timeout ${base}`)));
    req.on('error', reject);
  });
}

function must(condition, message) {
  if (!condition) throw new Error(message);
}

function findAsset(html, kind) {
  if (kind === 'css') return html.match(/href="(\/assets\/index-[^"]+\.css)"/)?.[1];
  if (kind === 'main') return html.match(/src="(\/assets\/index-[^"]+\.js)"/)?.[1];
  return undefined;
}

async function main() {
  const certificate = await checkHttpsCertificate();
  must(
    certificate.skipped || certificate.matchesHost,
    `HTTPS certificate SAN/CN does not include ${new URL(base).hostname}`,
  );
  const results = [];
  for (const route of routes) {
    const page = await fetchText(route);
    must(page.ok, `${route} HTTP ${page.status}`);
    must(page.text.includes('<div id="root">'), `${route} is not the SPA shell`);
    results.push({ route, status: page.status, bytes: page.text.length });
  }

  const home = await fetchText('/');
  const cssPath = findAsset(home.text, 'css');
  const mainPath = findAsset(home.text, 'main');
  must(cssPath, 'index CSS asset not found');
  must(mainPath, 'main JS asset not found');

  const css = await fetchText(cssPath);
  const mainBundle = await fetchText(mainPath);
  for (const token of required.css) must(css.text.includes(token), `CSS missing token: ${token}`);
  for (const token of required.main)
    must(mainBundle.text.includes(token), `main JS missing token: ${token}`);

  const assets = { css: cssPath, main: mainPath };
  for (const [chunkName, tokens] of Object.entries(required.chunks)) {
    const chunkAsset =
      [
        ...home.text.matchAll(
          new RegExp(`(?:href|src)=\"(\\/assets\\/[^\"]+${chunkName}[^\"]+\\.js)\"`, 'g'),
        ),
      ][0]?.[1] ||
      [...mainBundle.text.matchAll(new RegExp(`${chunkName}-[A-Za-z0-9_-]+\\.js`, 'g'))][0]?.[0];
    const chunkPath = chunkAsset?.startsWith('/') ? chunkAsset : `/assets/${chunkAsset}`;
    must(chunkPath && chunkPath.includes(chunkName), `${chunkName} chunk not found`);
    const chunk = await fetchText(chunkPath);
    for (const token of tokens)
      must(chunk.text.includes(token), `${chunkName} chunk missing token: ${token}`);
    assets[chunkName] = chunkPath;
  }

  const report = {
    base,
    generatedAt: new Date().toISOString(),
    routes: results,
    assets,
    certificate,
    tokens: required,
    note: 'Static mobile QA v7 passed. It verifies Android v7 evidence library route, Dashboard/Delivery/Submit evidence links, Android mobile tokens, SPA routes, assets, chunks, and HTTPS certificate SAN/CN.',
  };
  await mkdir('qa/mobile', { recursive: true });
  await writeFile('qa/mobile/mobile-qa-v7-report.json', JSON.stringify(report, null, 2));
  console.log('[mobile-qa-v7] PASS');
  console.log(JSON.stringify(report.assets, null, 2));
}

main().catch((error) => {
  console.error('[mobile-qa-v7] FAIL', error.message);
  process.exit(1);
});
