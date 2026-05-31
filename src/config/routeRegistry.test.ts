import { describe, expect, it } from 'vitest';
import { routeMeta, resolveMeta } from './routeMeta';
import { appRoutes, routePaths } from './routeRegistry';

const requiredRoutes = [
  '/',
  '/roadmap',
  '/modules/:moduleId',
  '/labs',
  '/quiz',
  '/capstone',
  '/dashboard',
  '/codegen',
  '/designer',
  '/integration',
  '/build-checklist',
  '/comics',
  '/diagrams',
  '/review',
  '/planner',
  '/exam',
  '/portfolio',
  '/demo-script',
  '/delivery',
  '/submit-rehearsal',
  '/evidence',
  '/search',
  '/glossary',
  '/notes',
  '/resources',
  '/troubleshooting',
  '/reports',
  '/practice',
  '*',
];

describe('route registry', () => {
  it('exports every app route path in a single registry', () => {
    expect(routePaths).toEqual(requiredRoutes);
    expect(appRoutes.map((route) => route.path)).toEqual(requiredRoutes);
  });

  it('has metadata for every concrete top-level route', () => {
    const concreteRoutes = routePaths.filter((path) => path !== '*' && !path.includes(':'));
    for (const path of concreteRoutes) {
      expect(routeMeta[path], path).toBeDefined();
      expect(routeMeta[path].title).toContain('MFC 通用工具开发训练营');
    }
  });

  it('resolves dynamic module route metadata', () => {
    expect(resolveMeta('/modules/serial')).toEqual({
      title: '模块课程页 - MFC 通用工具开发训练营',
      description: '阅读模块目标、核心概念、代码片段、实验入口和本地 MFC 实践建议。',
    });
  });
});
