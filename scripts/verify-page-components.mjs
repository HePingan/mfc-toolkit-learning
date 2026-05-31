#!/usr/bin/env node
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const targets = [
  'src/pages/IntegrationPage.tsx',
  'src/pages/DesignerPage.tsx',
  'src/pages/TroubleshootingPage.tsx',
  'src/pages/PracticePage.tsx',
];

const requiredImports = {
  PageHero: '../components/ui/PageHero',
  SectionHead: '../components/ui/SectionHead',
};

const failures = [];

for (const file of targets) {
  const source = readFileSync(join(root, file), 'utf8');
  for (const [component, importPath] of Object.entries(requiredImports)) {
    if (!source.includes(component) || !source.includes(importPath)) {
      failures.push(`${file} should use shared ${component}`);
    }
  }
  if (source.includes('<section className="section-head"')) {
    failures.push(`${file} still has raw section-head markup`);
  }
  if (source.includes('<section className="hero ')) {
    failures.push(`${file} still has raw hero markup`);
  }
}

const practice = readFileSync(join(root, 'src/pages/PracticePage.tsx'), 'utf8');
if (!practice.includes('MetricCard') || !practice.includes('../components/ui/MetricCard')) {
  failures.push('src/pages/PracticePage.tsx should use MetricCard for dashboard metrics');
}
if (practice.includes('<span className="big-number">')) {
  failures.push('src/pages/PracticePage.tsx still has raw big-number metric markup');
}

if (failures.length) {
  throw new Error(`Page component convergence verification failed:\n- ${failures.join('\n- ')}`);
}

console.log(
  '[verify:page-components] OK targeted pages use shared PageHero/SectionHead/MetricCard primitives',
);
