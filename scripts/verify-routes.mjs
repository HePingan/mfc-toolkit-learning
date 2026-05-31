#!/usr/bin/env node
import { readFileSync } from 'node:fs';
import { createServer } from 'node:http';
import { join, extname } from 'node:path';

const root = new URL('..', import.meta.url).pathname;
const dist = join(root, 'dist');
const port = Number(process.env.VERIFY_PORT || 4174);
const baseUrl = process.env.VERIFY_BASE_URL || `http://127.0.0.1:${port}`;

const moduleIds = ['overview', 'serial', 'network', 'mfc', 'cpp-core', 'storage', 'capstone'];
const routes = [
  '/', '/roadmap', '/labs', '/quiz', '/capstone', '/practice', '/codegen', '/designer',
  '/integration', '/build-checklist', '/comics', '/diagrams', '/review', '/planner',
  '/exam', '/portfolio', '/demo-script', '/delivery', '/submit-rehearsal', '/evidence',
  '/dashboard', '/search', '/glossary', '/notes', '/troubleshooting', '/reports', '/resources',
  ...moduleIds.map((id) => `/modules/${id}`),
];

const mime = {
  '.html': 'text/html;charset=utf-8',
  '.js': 'text/javascript;charset=utf-8',
  '.css': 'text/css;charset=utf-8',
  '.svg': 'image/svg+xml',
  '.txt': 'text/plain;charset=utf-8',
  '.xml': 'text/xml;charset=utf-8',
};

function readDist(pathname) {
  const clean = pathname === '/' ? '/index.html' : pathname;
  try {
    return { body: readFileSync(join(dist, clean)), type: mime[extname(clean)] || 'application/octet-stream' };
  } catch {
    return null;
  }
}

const server = createServer((req, res) => {
  const url = new URL(req.url || '/', `http://${req.headers.host}`);
  const file = readDist(url.pathname) || readDist('/index.html');
  res.writeHead(file ? 200 : 404, { 'content-type': file?.type || 'text/plain;charset=utf-8' });
  res.end(file?.body || 'not found');
});

function listen() {
  return new Promise((resolve) => server.listen(port, '127.0.0.1', resolve));
}

async function check(url, expectHtml = false) {
  const response = await fetch(url);
  const body = await response.text();
  if (response.status !== 200) throw new Error(`${url} returned HTTP ${response.status}`);
  if (expectHtml && !body.includes('<div id="root"></div>')) throw new Error(`${url} did not return SPA index.html`);
  return body;
}

try {
  if (!process.env.VERIFY_BASE_URL) await listen();
  const html = await check(`${baseUrl}/`, true);
  const assets = Array.from(html.matchAll(/(?:src|href)="(\/assets\/[^"]+)"/g), (match) => match[1]);
  if (!assets.length) throw new Error('No built /assets references found in index.html');

  for (const route of routes) await check(`${baseUrl}${route}`, true);
  for (const asset of assets) await check(`${baseUrl}${asset}`);

  console.log(`[verify:routes] OK ${routes.length} routes, ${assets.length} assets @ ${baseUrl}`);
} finally {
  server.close();
}
