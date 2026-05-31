import { ChangeEvent, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { modules } from '../data/modules';
import { getSearchTypeLabel, searchLearningItems, SearchItemType } from '../data/searchIndex';

const typeFilters: Array<{ value: 'all' | SearchItemType; label: string }> = [
  { value: 'all', label: '全部类型' },
  { value: 'module', label: '课程模块' },
  { value: 'section', label: '章节内容' },
  { value: 'lab', label: '交互实验' },
  { value: 'quiz', label: '测验题' },
  { value: 'concept', label: '核心概念' },
  { value: 'resource', label: '学习资源' },
];

const quickQueries = ['串口', 'Modbus', 'TCP', 'HTTP', '消息映射', '多线程', 'SQLite', 'INI', '野指针', 'CRC'];

export function SearchPage() {
  const [query, setQuery] = useState('');
  const [type, setType] = useState<'all' | SearchItemType>('all');
  const [moduleId, setModuleId] = useState('all');

  const results = useMemo(() => searchLearningItems(query, type, moduleId).slice(0, 80), [query, type, moduleId]);
  const groupedCount = useMemo(() => {
    return results.reduce<Record<string, number>>((acc, item) => {
      const label = getSearchTypeLabel(item.type);
      acc[label] = (acc[label] ?? 0) + 1;
      return acc;
    }, {});
  }, [results]);

  function updateType(event: ChangeEvent<HTMLSelectElement>) {
    setType(event.target.value as 'all' | SearchItemType);
  }

  return (
    <div>
      <section className="hero">
        <div className="eyebrow">Search Index</div>
        <h2>全站学习搜索</h2>
        <p>快速定位模块、章节、实验、测验题、概念和资源。适合复习时直接搜索“串口 / Modbus / 消息映射 / SQLite”等关键词。</p>
        <div className="search-box">
          <input
            aria-label="搜索关键词"
            autoFocus
            placeholder="输入关键词：如 Modbus、8N1、TCP、lock_guard、INI..."
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          <select aria-label="内容类型" value={type} onChange={updateType}>
            {typeFilters.map((filter) => <option key={filter.value} value={filter.value}>{filter.label}</option>)}
          </select>
          <select aria-label="课程模块" value={moduleId} onChange={(event) => setModuleId(event.target.value)}>
            <option value="all">全部模块</option>
            {modules.map((module) => <option key={module.id} value={module.id}>{module.title}</option>)}
          </select>
        </div>
        <div className="badge-list">
          {quickQueries.map((item) => (
            <button className="chip-button" key={item} onClick={() => setQuery(item)} type="button">{item}</button>
          ))}
          <button className="chip-button" onClick={() => { setQuery(''); setType('all'); setModuleId('all'); }} type="button">重置</button>
        </div>
      </section>

      <section className="stat-grid search-stats">
        <div className="stat-card"><strong>{results.length}</strong><span>匹配结果</span><p>{query ? `关键词：${query}` : '未输入时展示推荐索引'}</p></div>
        {Object.entries(groupedCount).slice(0, 3).map(([label, count]) => (
          <div className="stat-card" key={label}><strong>{count}</strong><span>{label}</span><p>可直接跳转学习位置</p></div>
        ))}
      </section>

      <section className="search-results">
        {results.length === 0 ? (
          <div className="card warning-card">
            <h3>没有找到匹配内容</h3>
            <p className="muted">换一个关键词试试：串口、HTTP、MFC、指针、线程、SQLite、INI。</p>
          </div>
        ) : results.map((result) => {
          const module = modules.find((item) => item.id === result.moduleId);
          return (
            <article className="card search-result-card" key={result.id}>
              <div className="search-result-head">
                <div>
                  <span className="badge">{getSearchTypeLabel(result.type)}</span>
                  {module && <span className="badge badge-warning">{module.title}</span>}
                </div>
                <Link className="button button-ghost" to={result.href}>打开</Link>
              </div>
              <h3>{result.title}</h3>
              <p className="muted">{result.summary}</p>
              <div className="badge-list">
                {result.keywords.slice(0, 8).map((keyword) => <span className="badge" key={`${result.id}-${keyword}`}>{keyword}</span>)}
              </div>
            </article>
          );
        })}
      </section>
    </div>
  );
}
