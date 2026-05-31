import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { TroubleCaseTrainer, TroubleCategoryMatrix } from '../components/troubleshooting/TroubleCaseTrainer';
import { TroubleCategory, troubleCases, troubleCategoryLabels } from '../data/troubleshooting';
import { Card } from '../components/ui/Card';

export function TroubleshootingPage() {
  const [category, setCategory] = useState<TroubleCategory | 'all'>('all');
  const [query, setQuery] = useState('');
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return troubleCases
      .filter((item) => category === 'all' || item.category === category)
      .filter((item) => q ? [item.title, item.scene, item.answer, item.diagnosis, ...item.tags, ...item.symptoms, ...item.evidence].join(' ').toLowerCase().includes(q) : true);
  }, [category, query]);

  return (
    <div>
      <section className="section-head">
        <div>
          <div className="eyebrow">Troubleshooting Lab</div>
          <h2>故障排查训练场</h2>
          <p className="muted">把文档里的串口、TCP、HTTP、MFC、C++、SQLite/INI 知识转成“现场症状 → 证据 → 根因 → 修复步骤”的排错训练。</p>
        </div>
        <span className="badge">浏览器模拟 · 本地 MFC 实战前置训练</span>
      </section>

      <section className="hero trouble-hero">
        <div className="eyebrow">Debug Like Field Engineer</div>
        <h2>先判断根因，再写代码修复</h2>
        <p>不要看到乱码就改编码、看到卡死就重启程序。先看证据：参数、日志、线程、路径、协议帧，再定位最小可验证原因。</p>
        <div className="form-row">
          <Link className="button button-primary" to="/practice">进入本地实战模板</Link>
          <Link className="button button-ghost" to="/labs">回到交互实验室</Link>
        </div>
      </section>

      <TroubleCategoryMatrix active={category} onSelect={setCategory} />

      <Card>
        <div className="search-box trouble-search-box">
          <label>
            <span className="sr-only">搜索故障案例</span>
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="搜索：乱码、CRC、UI 卡死、Content-Length、控件 ID、路径..." aria-label="搜索故障案例" />
          </label>
          <label>
            <span className="sr-only">选择故障分类</span>
            <select value={category} onChange={(e) => setCategory(e.target.value as TroubleCategory | 'all')} aria-label="选择故障分类">
              <option value="all">全部分类</option>
              {Object.entries(troubleCategoryLabels).map(([key, label]) => <option value={key} key={key}>{label}</option>)}
            </select>
          </label>
        </div>
        <p className="muted">当前显示 {filtered.length} 个案例。建议每次先自己判断，再提交诊断查看修复步骤。</p>
      </Card>

      <div className="trouble-case-list">
        {filtered.length === 0 ? (
          <Card className="warning-card"><h3>没有匹配案例</h3><p className="muted">换一个关键词，例如：串口、TCP、HTTP、MFC、线程、INI。</p></Card>
        ) : filtered.map((item) => <TroubleCaseTrainer key={item.id} item={item} />)}
      </div>
    </div>
  );
}
