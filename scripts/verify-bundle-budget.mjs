#!/usr/bin/env node
import { gzipSync } from 'node:zlib';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const distAssets = join(process.cwd(), 'dist/assets');
const budgets = [
  { pattern: /^index-[\w-]+\.js$/, label: 'main', gzipKb: 80 },
  { pattern: /^CodegenPage-[\w-]+\.js$/, label: 'CodegenPage', gzipKb: 45 },
  { pattern: /^vendor-react-[\w-]+\.js$/, label: 'vendor-react', gzipKb: 60 },
  { pattern: /^vendor-router-[\w-]+\.js$/, label: 'vendor-router', gzipKb: 25 },
  { pattern: /^vendor-zip-lazy-[\w-]+\.js$/, label: 'vendor-zip-lazy', gzipKb: 35 },
];

function gzipKb(path) {
  return gzipSync(readFileSync(path)).length / 1024;
}

const files = readdirSync(distAssets).filter((file) => file.endsWith('.js'));
const failures = [];
const rows = [];

for (const budget of budgets) {
  const file = files.find((candidate) => budget.pattern.test(candidate));
  if (!file) {
    failures.push(`${budget.label}: missing chunk ${budget.pattern}`);
    continue;
  }
  const path = join(distAssets, file);
  const gz = gzipKb(path);
  rows.push({ label: budget.label, file, gzipKb: Number(gz.toFixed(2)) });
  if (gz > budget.gzipKb) {
    failures.push(
      `${budget.label}: ${gz.toFixed(2)} kB gzip > ${budget.gzipKb} kB budget (${file})`,
    );
  }
}

for (const file of files) {
  const rawKb = statSync(join(distAssets, file)).size / 1024;
  if (rawKb > 190) {
    failures.push(`${file}: ${rawKb.toFixed(2)} kB raw > 190 kB per-chunk budget`);
  }
}

const codegenFile = files.find((candidate) => /^CodegenPage-[\w-]+\.js$/.test(candidate));
if (codegenFile) {
  const codegenSource = readFileSync(join(distAssets, codegenFile), 'utf8');
  if (!codegenSource.includes('vendor-zip-lazy')) {
    failures.push(
      `${codegenFile}: expected ZIP implementation to stay in lazy vendor-zip-lazy chunk`,
    );
  }
}

if (failures.length) {
  console.table(rows);
  throw new Error(`Bundle budget failed:\n- ${failures.join('\n- ')}`);
}

console.table(rows);
console.log(`[verify:bundle] OK ${files.length} js chunks within budget`);
