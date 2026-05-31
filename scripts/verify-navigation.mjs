#!/usr/bin/env node
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = new URL('..', import.meta.url).pathname;
const navigationSource = readFileSync(join(root, 'src/config/navigation.ts'), 'utf8');
const registrySource = readFileSync(join(root, 'src/config/routeRegistry.tsx'), 'utf8');

const navLinks = [...navigationSource.matchAll(/to:\s*'([^']+)'/g)].map((match) => match[1]);
const routePaths = [...registrySource.matchAll(/path:\s*'([^']+)'/g)].map((match) => match[1]);
const knownRoutes = new Set(routePaths);
const failures = [];

function isCoveredByRoute(path) {
  if (knownRoutes.has(path)) return true;
  return routePaths.some((routePath) => {
    if (!routePath.includes(':')) return false;
    const pattern = new RegExp(`^${routePath.replace(/:[^/]+/g, '[^/]+')}$`);
    return pattern.test(path);
  });
}

for (const link of [...new Set(navLinks)]) {
  if (!link.startsWith('/')) {
    failures.push(`${link}: navigation links must be absolute app paths`);
    continue;
  }
  if (!isCoveredByRoute(link)) {
    failures.push(`${link}: no matching route in src/config/routeRegistry.tsx`);
  }
}

const headerMatch = navigationSource.match(/export const mainHeaderNav[\s\S]*?\];/);
const headerCount = headerMatch ? [...headerMatch[0].matchAll(/to:\s*'/g)].length : 0;
if (headerCount !== 5) {
  failures.push(`mainHeaderNav must contain exactly 5 links, got ${headerCount}`);
}

const bottomMatch = navigationSource.match(/export const bottomTabs[\s\S]*?\] as const;/);
const bottomCount = bottomMatch ? [...bottomMatch[0].matchAll(/to:\s*'/g)].length : 0;
if (bottomCount !== 5) {
  failures.push(`bottomTabs must contain exactly 5 links, got ${bottomCount}`);
}

if (failures.length) {
  throw new Error(`Navigation verification failed:\n- ${failures.join('\n- ')}`);
}

console.log(
  `[verify:navigation] OK ${new Set(navLinks).size} unique navigation links covered by ${routePaths.length} routes`,
);
