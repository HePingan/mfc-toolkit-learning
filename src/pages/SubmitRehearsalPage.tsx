import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { exportSubmitMarkdown, submitEvidenceTemplate, submitReadiness, type SubmitEvidenceItem, type SubmitEvidenceStatus } from '../data/submitRehearsal';
import { evidenceForSubmit, evidenceTemplate, normalizeEvidence, type EvidenceItem } from '../data/evidence';
import { downloadMarkdown } from '../utils/download';
import { storageKeys } from '../data/storageKeys';

type SubmitRehearsalState = {
  items: SubmitEvidenceItem[];
};

type EvidenceState = { items: EvidenceItem[] };

const statusLabel: Record<SubmitEvidenceStatus, string> = {
  missing: '缺失',
  draft: '草稿',
  ready: '已就绪',
};

function normalizeItems(items: SubmitEvidenceItem[]) {
  return submitEvidenceTemplate.map((template) => ({ ...template, ...(items.find((item) => item.id === template.id) ?? {}) }));
}

export function SubmitRehearsalPage() {
  const [state, setState] = useLocalStorage<SubmitRehearsalState>(storageKeys.submitRehearsal, { items: submitEvidenceTemplate });
  const [evidenceState] = useLocalStorage<EvidenceState>(storageKeys.evidenceLibrary, { items: evidenceTemplate });
  const items = normalizeItems(state.items);
  const evidenceItems = normalizeEvidence(evidenceState.items);
  const score = submitReadiness(items);
  const [activeId, setActiveId] = useState(score.next?.id ?? items[0].id);
  const active = items.find((item) => item.id === activeId) ?? score.next ?? items[0];
  const markdown = useMemo(() => exportSubmitMarkdown(items), [items]);

  const updateItem = (id: string, patch: Partial<SubmitEvidenceItem>) => {
    setState({ items: items.map((item) => item.id === id ? { ...item, ...patch } : item) });
  };
  const markReady = (id: string) => updateItem(id, { status: 'ready' });
  const fillDraft = (id: string) => {
    const item = items.find((entry) => entry.id === id);
    if (!item) return;
    updateItem(id, { status: item.status === 'missing' ? 'draft' : item.status, note: item.note || `- 证据路径：\n- 截图文件：\n- 源码位置：\n- 运行日志：\n- 验收备注：${item.required}` });
  };
  const reset = () => setState({ items: submitEvidenceTemplate });

  return (
    <div>
      <section className="hero submit-hero">
        <div className="eyebrow">Android v6 · android-v6-submit-rehearsal · final handoff</div>
        <h2>项目提交演练</h2>
        <p>按真实验收顺序检查 README、源码、编译、运行截图、通讯日志、持久化、演示稿和答辩记录。目标是在提交前知道“缺哪一张图、哪一段日志、哪一个文件”。</p>
        <div className="form-row">
          <Link className="button button-primary" to="/delivery">交付包</Link>
          <Link className="button button-ghost" to="/evidence">证据素材库</Link>
          <Link className="button button-ghost" to="/demo-script">演示稿</Link>
          <Link className="button button-ghost" to="/exam">答辩记录</Link>
          <Button className="button-ghost" onClick={() => downloadMarkdown('mfc-submit-rehearsal.md', markdown)}>导出提交清单</Button>
        </div>
      </section>

      <section className="submit-summary-grid">
        <Card><strong>{score.percent}%</strong><span>提交准备度</span><p className="muted">已就绪 + 草稿折算</p></Card>
        <Card><strong>{score.ready}/{score.total}</strong><span>已就绪</span><p className="muted">可直接进入最终包</p></Card>
        <Card><strong>{score.draft}</strong><span>草稿</span><p className="muted">有方向但还缺证据</p></Card>
        <Card><strong>{score.missing}</strong><span>缺失</span><p className="muted">优先补齐</p></Card>
      </section>

      <Card className="submit-next-card">
        <div className="diagram-head compact-head">
          <div><div className="eyebrow">next-submit-gap</div><h3>下一项最该补：{score.next?.title ?? '全部完成'}</h3></div>
          <span className="badge">{score.percent >= 90 ? '可提交' : '继续补证据'}</span>
        </div>
        <div className="dashboard-readiness-meter"><i style={{ width: `${score.percent}%` }} /></div>
        <p>{score.next ? score.next.required : '所有提交项都已就绪，可以导出清单并进入最终提交。'}</p>
        <div className="form-row">
          {score.next && <Link className="button button-primary" to={score.next.route}>打开关联页面</Link>}
          <Button className="button-ghost" onClick={() => score.next && fillDraft(score.next.id)} disabled={!score.next}>生成证据模板</Button>
          <Button className="button-ghost" onClick={reset}>重置演练</Button>
        </div>
      </Card>

      <section className="submit-layout">
        <Card className="submit-step-list">
          <div className="eyebrow">Submit Order</div>
          {items.map((item, index) => (
            <button key={item.id} className={active.id === item.id ? 'active' : item.status} onClick={() => setActiveId(item.id)}>
              <span>{index + 1}. {item.title}</span>
              <small>{statusLabel[item.status]} · {item.route}</small>
            </button>
          ))}
        </Card>

        <Card className="submit-detail-card">
          <div className="diagram-head compact-head">
            <div><div className="eyebrow">{statusLabel[active.status]} · Evidence Detail</div><h3>{active.title}</h3></div>
            <Link className="button button-ghost" to={active.route}>打开关联页面</Link>
          </div>
          <div className="submit-evidence-box"><strong>验收要求</strong><p>{active.required}</p></div>
          <div className="submit-evidence-box"><strong>推荐证据</strong><p>{active.proof}</p></div>
          <div className="submit-evidence-box submit-linked-evidence">
            <strong>证据库关联</strong>
            {evidenceForSubmit(evidenceItems, active.id).length ? evidenceForSubmit(evidenceItems, active.id).map((evidence) => (
              <p key={evidence.id}><span className="badge">{evidence.status === 'ready' ? '可提交' : evidence.status === 'draft' ? '草稿' : '缺失'}</span> {evidence.title}：{evidence.path || '未填写路径'}</p>
            )) : <p>暂无关联证据。</p>}
            <Link className="inline-link" to="/evidence">打开证据素材库统一补路径</Link>
          </div>
          <div className="submit-status-grid">
            {(['missing', 'draft', 'ready'] as SubmitEvidenceStatus[]).map((status) => (
              <button key={status} className={active.status === status ? 'active' : ''} onClick={() => updateItem(active.id, { status })}>{statusLabel[status]}</button>
            ))}
          </div>
          <label className="field-label">我的证据路径 / 截图 / 日志 / 备注
            <textarea value={active.note} onChange={(event) => updateItem(active.id, { note: event.target.value })} rows={7} placeholder="例如：docs/screenshots/vs-build-success.png；src/MfcToolkitDlg.cpp；logs/serial-2026-xx.txt" />
          </label>
          <div className="form-row">
            <Button className="button-ghost" onClick={() => fillDraft(active.id)}>生成证据模板</Button>
            <Button onClick={() => markReady(active.id)}>标记已就绪</Button>
          </div>
        </Card>
      </section>

      <Card className="submit-export-card">
        <div className="diagram-head compact-head">
          <div><div className="eyebrow">Export Preview</div><h3>提交清单导出</h3></div>
          <Button className="button-ghost" onClick={() => downloadMarkdown('mfc-submit-rehearsal.md', markdown)}>下载 Markdown</Button>
        </div>
        <pre>{markdown}</pre>
      </Card>
    </div>
  );
}
