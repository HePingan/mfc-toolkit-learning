import { describe, expect, it } from 'vitest';
import {
  bottomTabs,
  homePrimaryActions,
  homeToolShortcuts,
  mainHeaderNav,
  toolLinks,
  toolNavGroups,
} from './navigation';

const routeLike = /^\/($|[a-z0-9-]+|modules\/overview)/;

describe('navigation policy', () => {
  it('keeps the header focused on five primary destinations', () => {
    expect(mainHeaderNav.map((link) => link.to)).toEqual([
      '/',
      '/roadmap',
      '/labs',
      '/capstone',
      '/dashboard',
    ]);
    expect(mainHeaderNav).toHaveLength(5);
  });

  it('keeps bottom tabs focused on the mobile learning loop', () => {
    expect(bottomTabs.map((tab) => tab.to)).toEqual([
      '/',
      '/labs',
      '/dashboard',
      '/review',
      '/evidence',
    ]);
    expect(bottomTabs).toHaveLength(5);
  });

  it('groups the complete tool matrix for sidebar and dashboard use', () => {
    expect(toolNavGroups.map((group) => group.label)).toEqual(['学习', '工程', '交付', '资料']);
    expect(toolNavGroups.flatMap((group) => group.links.map((link) => link.to))).toEqual(
      toolLinks.map((link) => link.to),
    );
  });

  it('uses curated homepage actions and shortcuts instead of ad hoc links', () => {
    expect(homePrimaryActions.map((action) => action.to)).toEqual([
      '/modules/overview',
      '/roadmap',
      '/labs',
      '/practice',
    ]);
    expect(homeToolShortcuts).toHaveLength(8);
  });

  it('exports only route-like absolute paths', () => {
    const allLinks = [
      ...mainHeaderNav,
      ...bottomTabs,
      ...homePrimaryActions,
      ...toolLinks,
      ...toolNavGroups.flatMap((group) => group.links),
    ];
    for (const link of allLinks) {
      expect(link.to, link.label ?? link.text).toMatch(routeLike);
    }
  });
});
