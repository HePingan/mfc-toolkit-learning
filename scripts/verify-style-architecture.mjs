#!/usr/bin/env node
import { existsSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const styleDir = join(root, 'src/styles');
const requiredFiles = [
  'index.css',
  'tokens.css',
  'base.css',
  'layout.css',
  'components.css',
  'pages.css',
  'legacy.css',
];
const failures = [];

for (const file of requiredFiles) {
  if (!existsSync(join(styleDir, file))) failures.push(`missing src/styles/${file}`);
}

const mainSource = readFileSync(join(root, 'src/main.tsx'), 'utf8');
if (!mainSource.includes('./styles/index.css')) {
  failures.push('src/main.tsx must import ./styles/index.css');
}
if (mainSource.includes('./styles/global.css')) {
  failures.push('src/main.tsx must not import global.css directly');
}

const indexCssPath = join(styleDir, 'index.css');
if (existsSync(indexCssPath)) {
  const indexCss = readFileSync(indexCssPath, 'utf8');
  const expectedImports = [
    './tokens.css',
    './base.css',
    './layout.css',
    './components.css',
    './pages.css',
    './legacy.css',
  ];
  for (const importPath of expectedImports) {
    if (!indexCss.includes(`@import '${importPath}';`)) {
      failures.push(`src/styles/index.css must import ${importPath}`);
    }
  }
}

const legacyPath = join(styleDir, 'legacy.css');
if (existsSync(legacyPath)) {
  const legacyLines = readFileSync(legacyPath, 'utf8').split(/\r?\n/).length;
  if (legacyLines > 3500) {
    failures.push(`legacy.css should be <= 3500 lines after first split, got ${legacyLines}`);
  }
}

const uiFiles = ['PageHero.tsx', 'SectionHead.tsx', 'ActionRow.tsx', 'MetricCard.tsx'];
for (const file of uiFiles) {
  if (!existsSync(join(root, 'src/components/ui', file))) {
    failures.push(`missing src/components/ui/${file}`);
  }
}

const globalPath = join(styleDir, 'global.css');
if (existsSync(globalPath)) {
  const sizeKb = statSync(globalPath).size / 1024;
  if (sizeKb > 5)
    failures.push(`global.css should be removed or reduced to shim, got ${sizeKb.toFixed(1)} kB`);
}

if (failures.length) {
  throw new Error(`Style architecture verification failed:\n- ${failures.join('\n- ')}`);
}

console.log('[verify:styles] OK layered CSS and shared UI primitives are in place');
