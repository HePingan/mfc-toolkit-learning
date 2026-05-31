import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { evidenceSummary, evidenceTemplate, evidenceTypes, exportEvidenceMarkdown, normalizeEvidence, type EvidenceItem, type EvidenceStatus, type EvidenceType } from '../data/evidence';
import { downloadMarkdown } from '../utils/download';
import { storageKeys } from '../data/storageKeys';

type EvidenceState = { items: EvidenceItem[] };

const statusLabel: Record<EvidenceStatus, string> = {
  missing: '缺失',
  draft: '草稿',
  ready: '可提交',
};

export function EvidencePage() {
  const [state, setState] = useLocalStorage<EvidenceState>(storageKeys.evidenceLibrary, { items: evidenceTemplate });
  const items = normalizeEvidence(state.items);
  const summary = evidenceSummary(items);
  const [typeFilter, setTypeFilter] = useState<'全部' | EvidenceType>('全部');
  const [activeId, setActiveId] = useState(summary.next?.id ?? items[0].id);
  const filtered = items.filter((item) => typeFilter === '全部' || item.type === typeFilter).sort((a, b) => {
    const rank = { missing: 0, draft: 1, ready: 2 } as Record<EvidenceStatus, number>;
    return rank[a.status] - rank[b.status];
  });
  const active = items.find((item) => item.id === activeId) ?? filtered[0] ?? items[0];
  const markdown = useMemo(() => exportEvidenceMarkdown(items), [items]);

  const updateItem = (id: string, patch: Partial<EvidenceItem>) => {
    setState({ items: items.map((item) => item.id === id ? { ...item, ...patch } : item) });
  };
  const fillTemplate = (id: string) => {
    const item = items.find((entry) => entry.id === id);
    if (!item) return;
    updateItem(id, {
      status: item.status === 'missing' ? 'draft' : item.status,
      path: item.path || `docs/evidence/${item.id}`,
      note: item.note || '- 截图/日志说明：\n- 关联源码：\n- 验收场景：\n- 复核结果：',
    });
  };
  const reset = () => setState({ items: evidenceTemplate });

  return (
    <div>
      <section className="hero evidence-hero">
        <div className="eyebrow">Android v7 · android-v7-evidence-library · evidence-linkage</div>
        <h2>证据素材库</h2>
        <p>集中管理截图、日志、源码、Markdown 和配置文件路径。提交演练、交付包、演示稿和答辩记录都可以引用同一份证据索引。</p>
        <div className="form-row">
          <Link className="button button-primary" to="/submit-rehearsal">提交演练</Link>
          <Link className="button button-ghost" to="/delivery">交付包</Link>
          <Link className="button button-ghost" to="/build-checklist">构建清单</Link>
          <Button className="button-ghost" onClick={() => downloadMarkdown('mfc-evidence-index.md', markdown)}>导出证据索引</Button>
        </div>
      </section>

      <section className="evidence-summary-grid">
        <Card><strong>{summary.percent}%</strong><span>证据完整度</span><p className="muted">可提交 + 草稿折算</p></Card>
        <Card><strong>{summary.ready}/{summary.total}</strong><span>可提交</span><p className="muted">可直接进入提交包</p></Card>
        <Card><strong>{summary.draft}</strong><span>草稿</span><p className="muted">需要补路径或截图</p></Card>
        <Card><strong>{summary.missing}</strong><span>缺失</span><p className="muted">优先补齐</p></Card>
      </section>

      <Card className="evidence-next-card">
        <div className="diagram-head compact-head">
          <div><div className="eyebrow">next-evidence-gap</div><h3>下一条最该补：{summary.next?.title ?? '全部完成'}</h3></div>
          <span className="badge">{summary.percent >= 90 ? '证据可提交' : '继续补素材'}</span>
        </div>
        <div className="dashboard-readiness-meter"><i style={{ width: `${summary.percent}%` }} /></div>
        <p>{summary.next?.note ?? '证据素材已经准备充分，可以进入提交演练。'}</p>
        <div className="form-row">
          {summary.next && <Button onClick={() => { setActiveId(summary.next.id); fillTemplate(summary.next.id); }}>补这条证据</Button>}
          <Link className="button button-ghost" to="/submit-rehearsal">查看提交关联</Link>
          <Button className="button-ghost" onClick={reset}>重置素材库</Button>
        </div>
      </Card>

      <Card className="evidence-filter-card">
        <div className="diagram-head compact-head">
          <div><div className="eyebrow">Evidence Type Filter</div><h3>按类型筛选</h3></div>
          <span className="badge">{filtered.length} 条</span>
        </div>
        <div className="evidence-chip-row">
          {evidenceTypes.map((type) => <button key={type} className={typeFilter === type ? 'active' : ''} onClick={() => setTypeFilter(type)}>{type}</button>)}
        </div>
      </Card>

      <section className="evidence-layout">
        <Card className="evidence-list-card">
          <div className="eyebrow">Evidence Library</div>
          {filtered.map((item) => (
            <button key={item.id} className={active.id === item.id ? 'active' : item.status} onClick={() => setActiveId(item.id)}>
              <span>{item.title}</span>
              <small>{statusLabel[item.status]} · {item.type} · {item.module}</small>
            </button>
          ))}
        </Card>

        <Card className="evidence-detail-card">
          <div className="diagram-head compact-head">
            <div><div className="eyebrow">{statusLabel[active.status]} · {active.type} · {active.module}</div><h3>{active.title}</h3></div>
            <span className="badge">关联：{active.linkedSubmitIds.join(' / ')}</span>
          </div>
          <div className="evidence-status-grid">
            {(['missing', 'draft', 'ready'] as EvidenceStatus[]).map((status) => (
              <button key={status} className={active.status === status ? 'active' : ''} onClick={() => updateItem(active.id, { status })}>{statusLabel[status]}</button>
            ))}
          </div>
          <label className="field-label">文件路径 / 证据说明
            <input value={active.path} onChange={(event) => updateItem(active.id, { path: event.target.value })} placeholder="例如：docs/screenshots/vs-build-success.png 或 logs/serial-2026-xx.txt" />
          </label>
          <label className="field-label">备注
            <textarea value={active.note} onChange={(event) => updateItem(active.id, { note: event.target.value })} rows={7} placeholder="记录截图含义、日志时间、源码位置、验收场景。" />
          </label>
          <div className="form-row">
            <Button className="button-ghost" onClick={() => fillTemplate(active.id)}>生成路径模板</Button>
            <Button onClick={() => updateItem(active.id, { status: 'ready' })}>标记可提交</Button>
          </div>
        </Card>
      </section>

      <Card className="evidence-export-card">
        <div className="diagram-head compact-head">
          <div><div className="eyebrow">Markdown Preview</div><h3>证据索引导出</h3></div>
          <Button className="button-ghost" onClick={() => downloadMarkdown('mfc-evidence-index.md', markdown)}>下载 Markdown</Button>
        </div>
        <pre>{markdown}</pre>
      </Card>
    </div>
  );
}
