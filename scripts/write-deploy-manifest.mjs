#!/usr/bin/env node
import { writeFileSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';

const root = new URL('..', import.meta.url).pathname;
const dist = join(root, 'dist');
const published = join(root, 'published');
const targetDir = process.env.DEPLOY_MANIFEST_TARGET === 'dist' ? dist : published;

function git(args, fallback = 'unknown') {
  try {
    return execFileSync('git', args, { cwd: root, encoding: 'utf8' }).trim() || fallback;
  } catch {
    return fallback;
  }
}

function firstMatch(pattern) {
  try {
    const html = readFileSync(join(targetDir, 'index.html'), 'utf8');
    return html.match(pattern)?.[0] ?? null;
  } catch {
    return null;
  }
}

const manifest = {
  deployedAt: new Date().toISOString(),
  branch: process.env.DEPLOY_BRANCH || git(['branch', '--show-current']),
  commit: process.env.DEPLOY_COMMIT || git(['rev-parse', 'HEAD']),
  shortCommit: process.env.DEPLOY_SHORT_COMMIT || git(['rev-parse', '--short', 'HEAD']),
  mainJs: firstMatch(/\/assets\/index-[^" ]+\.js/),
  css: firstMatch(/\/assets\/index-[^" ]+\.css/),
  domain: process.env.DOMAIN || 'studymfc.hpa888.top',
  baseUrl: process.env.BASE_URL || `https://${process.env.DOMAIN || 'studymfc.hpa888.top'}`,
};

writeFileSync(join(targetDir, 'deploy-manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`);
console.log(`[deploy:manifest] wrote ${join(targetDir, 'deploy-manifest.json')}`);
console.log(JSON.stringify(manifest, null, 2));
