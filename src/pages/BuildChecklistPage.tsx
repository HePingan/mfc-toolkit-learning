import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { buildChecklistMarkdown, buildChecklistStages, buildChecklistStorageKey, allBuildChecklistItems } from '../data/buildChecklist';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { downloadMarkdown } from '../utils/download';

export function BuildChecklistPage() {
  const [doneIds, setDoneIds] = useLocalStorage<string[]>(buildChecklistStorageKey, []);
  const doneSet = new Set(doneIds);
  const allItems = allBuildChecklistItems();
  const percent = Math.round((doneIds.length / allItems.length) * 100);
  const markdown = buildChecklistMarkdown(doneIds);

  const toggle = (id: string) => {
    setDoneIds(doneSet.has(id) ? doneIds.filter((item) => item !== id) : [...doneIds, id]);
  };
  const markStage = (ids: string[]) => setDoneIds(Array.from(new Set([...doneIds, ...ids])));
  const reset = () => setDoneIds([]);
  const copy = async () => navigator.clipboard?.writeText(markdown);
  const exportMarkdown = () => downloadMarkdown(`mfc-build-checklist-${Date.now()}.md`, markdown);

  return (
    <div>
      <section className="section-head">
        <div>
          <div className="eyebrow">Local Build Checklist</div>
          <h2>MFC 本地构建检查清单</h2>
          <p className="muted">把 /codegen ZIP、/designer 控件布局和 /integration 集成向导串成一个可勾选流程，适合边操作 Visual Studio 边核对。</p>
        </div>
        <span className="badge">完成 {doneIds.length}/{allItems.length}</span>
      </section>

      <section className="hero build-check-hero">
        <div className="eyebrow">Browser Checklist · Visual Studio Practice</div>
        <h2>从空 MFC Dialog 到可交付工具，按顺序打勾</h2>
        <p>这里不编译 MFC，也不访问真实串口、TCP、HTTP 或 SQLite；它只负责保存本地实践检查进度，并生成 Markdown 交付清单。</p>
        <div className="build-check-progress">
          <strong>{percent}%</strong>
          <div className="progress-bar"><span style={{ width: `${percent}%` }} /></div>
        </div>
        <div className="form-row">
          <Link className="button button-primary" to="/codegen">生成/下载 ZIP</Link>
          <Link className="button button-ghost" to="/designer">规划控件 ID</Link>
          <Link className="button button-ghost" to="/integration">查看集成向导</Link>
          <Link className="button button-ghost" to="/troubleshooting">编译/运行排错</Link>
        </div>
      </section>

      <div className="build-stage-grid">
        {buildChecklistStages.map((stage) => {
          const stageDone = stage.items.filter((item) => doneSet.has(item.id)).length;
          const stagePercent = Math.round((stageDone / stage.items.length) * 100);
          return (
            <Card className="build-stage-card" key={stage.id}>
              <div className="diagram-head compact-head">
                <div><div className="eyebrow">{stage.id}</div><h3>{stage.title}</h3></div>
                <span className={stageDone === stage.items.length ? 'badge badge-success' : 'badge'}>{stageDone}/{stage.items.length}</span>
              </div>
              <p className="muted">{stage.goal}</p>
              <div className="progress-bar build-stage-meter"><span style={{ width: `${stagePercent}%` }} /></div>
              <div className="build-check-list">
                {stage.items.map((item) => (
                  <label className={doneSet.has(item.id) ? 'checked' : ''} key={item.id}>
                    <input type="checkbox" checked={doneSet.has(item.id)} onChange={() => toggle(item.id)} />
                    <span><strong>{item.label}</strong><em>{item.detail}</em></span>
                  </label>
                ))}
              </div>
              <div className="form-row">
                <Button className="button-ghost" onClick={() => markStage(stage.items.map((item) => item.id))}>本阶段全完成</Button>
              </div>
            </Card>
          );
        })}
      </div>

      <Card className="build-export-card">
        <div className="diagram-head compact-head">
          <div><div className="eyebrow">Export</div><h3>导出构建检查记录</h3></div>
          <span className="badge">Markdown</span>
        </div>
        <p className="muted">可复制给老师、同学或作为项目交付附件。导出内容包含每个阶段的已完成/未完成状态。</p>
        <div className="form-row">
          <Button onClick={exportMarkdown}>导出 Markdown</Button>
          <Button className="button-ghost" onClick={copy}>复制 Markdown</Button>
          <Button className="button-ghost" onClick={reset}>重置检查清单</Button>
        </div>
      </Card>
    </div>
  );
}
