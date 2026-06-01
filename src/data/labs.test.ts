import { describe, expect, test } from 'vitest';
import { buildLabExportRecord, enrichLabDetails, labs } from './labs';

describe('lab detail enrichment', () => {
  test('adds structured steps, acceptance, pitfalls, and export fields for every lab', () => {
    const enriched = labs.map(enrichLabDetails);
    expect(enriched).toHaveLength(labs.length);
    enriched.forEach((lab) => {
      expect(lab.steps.length).toBeGreaterThanOrEqual(4);
      expect(lab.acceptance.length).toBeGreaterThanOrEqual(3);
      expect(lab.commonPitfalls.length).toBeGreaterThanOrEqual(3);
      expect(lab.exportRecord.markdown).toContain(lab.title);
      expect(lab.exportRecord.markdown).toContain('## 本地 MFC 文件');
    });
  });

  test('builds a copyable export record with completion state', () => {
    const lab = enrichLabDetails(labs[0]);
    const record = buildLabExportRecord(lab, true);
    expect(record.status).toBe('completed');
    expect(record.markdown).toContain('状态：completed');
    expect(record.markdown).toContain(lab.localMfc.goal);
  });
});
