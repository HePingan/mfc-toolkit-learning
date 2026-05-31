import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { buildIntegrationMarkdown, CompileErrorCase, IntegrationStep, compileErrorCases, integrationChecklist } from '../../data/integration';
import { downloadMarkdown } from '../../utils/download';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { storageKeys } from '../../data/storageKeys';

const quickErrorQueries = ['C1083', 'C2065', 'C3861', 'C2664', 'LNK2019', 'LNK2001', 'RC2104', 'UI 卡死'];

export function ProjectImportDiagram() {
  const nodes = ['下载 ZIP', '创建 MFC Dialog', 'Add Existing Item', '创建控件 ID', '接入 Message Map', '编译断点验证'];
  return <Card className="integration-diagram-card"><div className="eyebrow">Project Import Flow</div><h3>网页到 Visual Studio 的集成流</h3><div className="integration-flow">{nodes.map((node, index) => <div className="integration-flow-node" key={node}><strong>{index + 1}</strong><span>{node}</span></div>)}</div></Card>;
}

export function IntegrationTimeline({ steps }: { steps: IntegrationStep[] }) {
  return <div className="integration-timeline">{steps.map((step, index) => <Card className="integration-step-card" key={step.id}><div className="step-index">Step {index + 1}</div><h3>{step.title}</h3><p className="muted">{step.goal}</p><div className="three-col mini-list-grid"><div><h4>操作</h4><ul>{step.actions.map((item) => <li key={item}>{item}</li>)}</ul></div><div><h4>验收</h4><ul>{step.verify.map((item) => <li key={item}>{item}</li>)}</ul></div><div><h4>常见坑</h4><ul>{step.commonPitfalls.map((item) => <li key={item}>{item}</li>)}</ul></div></div></Card>)}</div>;
}

export function CompileErrorCard({ item }: { item: CompileErrorCase }) {
  return <Card className="compile-error-card"><div className="diagram-head compact-head"><div><div className="eyebrow">{item.code}</div><h3>{item.title}</h3></div><Link className="badge" to={item.related}>相关页面</Link></div><p className="warning-text">{item.symptom}</p><div className="two-col"><div><h4>高频原因</h4><ul>{item.causes.map((cause) => <li key={cause}>{cause}</li>)}</ul></div><div><h4>修复步骤</h4><ul>{item.fixes.map((fix) => <li key={fix}>{fix}</li>)}</ul></div></div><p className="muted"><strong>预防：</strong>{item.prevent}</p></Card>;
}

export function CompileErrorSearchPanel() {
  const [query, setQuery] = useState('');
  const normalized = query.trim().toLowerCase();
  const results = useMemo(() => {
    if (!normalized) return compileErrorCases;
    return compileErrorCases.filter((item) => [
      item.code,
      item.title,
      item.symptom,
      item.prevent,
      item.related,
      ...item.causes,
      ...item.fixes,
    ].join(' ').toLowerCase().includes(normalized));
  }, [normalized]);
  return (
    <Card className="integration-error-search-card">
      <div className="diagram-head compact-head">
        <div>
          <div className="eyebrow">Compile Error Search</div>
          <h3>错误码搜索与快速定位</h3>
        </div>
        <span className="badge">Integration v2</span>
      </div>
      <p className="muted">把 Visual Studio 输出窗口里的错误码或关键词贴进来，例如 <code>C2065</code>、<code>IDC_</code>、<code>LNK2019</code>、<code>pch.h</code>、<code>UI 卡死</code>。</p>
      <div className="search-box integration-error-search-box">
        <input aria-label="搜索编译错误" placeholder="输入错误码或症状关键词..." value={query} onChange={(event) => setQuery(event.target.value)} />
        <Button className="button-ghost" onClick={() => setQuery('')} type="button">清空</Button>
      </div>
      <div className="badge-list">
        {quickErrorQueries.map((item) => <button className="chip-button" key={item} onClick={() => setQuery(item)} type="button">{item}</button>)}
      </div>
      <div className="integration-search-results">
        {results.map((item) => <CompileErrorCard item={item} key={`search-${item.code}`} />)}
        {results.length === 0 && <p className="warning-text">没有匹配到错误卡。建议先复制错误码，例如 C1083、C2065、LNK2019，或搜索 pch.h、IDC、Message Map。</p>}
      </div>
    </Card>
  );
}

export function ErrorDiagnosisPanel() {
  const [rawError, setRawError] = useState('');
  const matches = useMemo(() => {
    const lower = rawError.toLowerCase();
    if (!lower.trim()) return [];
    return compileErrorCases.filter((item) => lower.includes(item.code.toLowerCase()) || item.causes.some((cause) => lower.includes(cause.slice(0, 8).toLowerCase())) || item.title.toLowerCase().split(/[ /]+/).some((word) => word.length > 2 && lower.includes(word)));
  }, [rawError]);
  return (
    <Card className="integration-diagnosis-card">
      <div className="diagram-head compact-head">
        <div>
          <div className="eyebrow">Diagnostic Helper</div>
          <h3>编译输出诊断助手</h3>
        </div>
        <span className="badge badge-warning">浏览器本地分析</span>
      </div>
      <textarea className="integration-error-textarea" placeholder="粘贴 Visual Studio Error List / Output 里的几行错误信息，例如：error C2065: 'IDC_BTN_SERIAL_OPEN': undeclared identifier" value={rawError} onChange={(event) => setRawError(event.target.value)} />
      <div className="diagnosis-result">
        {matches.length === 0 ? (
          <p className="muted">粘贴错误信息后，这里会自动匹配错误卡。建议先保留错误码、文件名、行号和完整英文提示。</p>
        ) : (
          <>
            <p className="success-text">已匹配 {matches.length} 个可能原因，建议按顺序排查：</p>
            {matches.map((item) => (
              <div className="diagnosis-match" key={`diag-${item.code}`}>
                <strong>{item.code}：{item.title}</strong>
                <ol>{item.fixes.map((fix) => <li key={fix}>{fix}</li>)}</ol>
                <Link className="inline-link" to={item.related}>打开相关页面</Link>
              </div>
            ))}
          </>
        )}
      </div>
    </Card>
  );
}

export function IntegrationChecklistPanel() {
  const [checked, setChecked] = useLocalStorage<string[]>(storageKeys.localIntegrationChecklist, []);
  const doneCount = checked.length;
  const percent = Math.round((doneCount / integrationChecklist.length) * 100);
  const toggle = (item: string) => setChecked(checked.includes(item) ? checked.filter((current) => current !== item) : [...checked, item]);
  return (
    <Card className="integration-checklist-card">
      <div className="diagram-head compact-head">
        <div><div className="eyebrow">Persistent Final Checklist</div><h3>集成完成检查清单</h3></div>
        <span className="badge badge-success">{doneCount}/{integrationChecklist.length} · {percent}%</span>
      </div>
      <div className="progress-bar integration-check-progress"><span style={{ width: `${percent}%` }} /></div>
      <div className="check-grid">{integrationChecklist.map((item) => <label className={checked.includes(item) ? 'checked' : ''} key={item}><input checked={checked.includes(item)} onChange={() => toggle(item)} type="checkbox" /> <span>{item}</span></label>)}</div>
      <div className="form-row">
        <Button className="button-ghost" onClick={() => setChecked([])} type="button">重置清单</Button>
        <Button className="button-ghost" onClick={() => setChecked(integrationChecklist)} type="button">全部标记完成</Button>
      </div>
      <p className="muted">清单已保存到 localStorage，刷新页面不会丢失；适合边操作 Visual Studio 边逐项打勾。</p>
    </Card>
  );
}

export function IntegrationExportPanel() {
  const markdown = buildIntegrationMarkdown();
  const download = () => downloadMarkdown(`mfc-local-integration-guide-${Date.now()}.md`, markdown);
  const copy = async () => navigator.clipboard?.writeText(markdown);
  return <Card className="integration-export-card"><div className="diagram-head compact-head"><div><div className="eyebrow">Export Guide</div><h3>导出本地集成说明</h3></div><span className="badge">Markdown</span></div><p className="muted">把 6 步集成流程、编译错误速查和最终检查清单导出，方便在 Windows + Visual Studio 旁边打开对照。</p><div className="form-row"><Button onClick={download}>下载集成说明</Button><Button className="button-ghost" onClick={copy}>复制说明</Button></div></Card>;
}
