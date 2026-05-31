import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { glossary, glossaryCategories, GlossaryCategory } from '../data/glossary';
import { modules } from '../data/modules';

const hotTerms = ['8N1', 'Modbus RTU', '消息映射', 'Socket', '野指针', 'mutex', 'SQLite', 'INI'];

export function GlossaryPage() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<'全部' | GlossaryCategory>('全部');

  const filtered = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    return glossary
      .filter((item) => category === '全部' || item.category === category)
      .filter((item) => {
        if (!keyword) return true;
        const text = [
          item.term,
          item.desc,
          item.category,
          item.moduleId,
          item.pitfall,
          item.example,
          ...(item.aliases ?? []),
        ]
          .join(' ')
          .toLowerCase();
        return text.includes(keyword);
      })
      .sort(
        (a, b) =>
          a.category.localeCompare(b.category, 'zh-CN') || a.term.localeCompare(b.term, 'zh-CN'),
      );
  }, [query, category]);

  const categoryCounts = useMemo(() => {
    return glossary.reduce<Record<string, number>>((acc, item) => {
      acc[item.category] = (acc[item.category] ?? 0) + 1;
      return acc;
    }, {});
  }, []);

  return (
    <div>
      <section className="hero">
        <div className="eyebrow">Glossary</div>
        <h2>术语速查表</h2>
        <p>
          把串口、网络、MFC、C++、数据存储和最终项目中最容易混淆的概念集中整理。先查术语，再回到模块、实验和测验中验证理解。
        </p>
        <div className="search-box glossary-search-box">
          <input
            aria-label="搜索术语"
            autoFocus
            placeholder="搜索术语、别名、常见坑：如 8N1、CRC、粘包、lock_guard..."
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          <select
            aria-label="术语分类"
            value={category}
            onChange={(event) => setCategory(event.target.value as '全部' | GlossaryCategory)}
          >
            {glossaryCategories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>
        <div className="badge-list">
          {hotTerms.map((term) => (
            <button className="chip-button" key={term} onClick={() => setQuery(term)} type="button">
              {term}
            </button>
          ))}
          <button
            className="chip-button"
            onClick={() => {
              setQuery('');
              setCategory('全部');
            }}
            type="button"
          >
            重置
          </button>
        </div>
      </section>

      <section className="stat-grid search-stats">
        <div className="stat-card">
          <strong>{glossary.length}</strong>
          <span>术语总数</span>
          <p>覆盖核心学习路径</p>
        </div>
        <div className="stat-card">
          <strong>{filtered.length}</strong>
          <span>当前匹配</span>
          <p>{query || category !== '全部' ? '已应用筛选条件' : '显示全部术语'}</p>
        </div>
        <div className="stat-card">
          <strong>{glossaryCategories.length - 1}</strong>
          <span>术语分类</span>
          <p>从基础到项目架构</p>
        </div>
      </section>

      <section className="glossary-layout">
        <aside className="card glossary-categories">
          <h3>分类复习</h3>
          {glossaryCategories.map((item) => (
            <button
              className={category === item ? 'active' : ''}
              key={item}
              onClick={() => setCategory(item)}
              type="button"
            >
              <span>{item}</span>
              <b>{item === '全部' ? glossary.length : (categoryCounts[item] ?? 0)}</b>
            </button>
          ))}
        </aside>

        <div className="glossary-grid">
          {filtered.length === 0 ? (
            <article className="card warning-card">
              <h3>没有找到匹配术语</h3>
              <p className="muted">
                建议换成更短的关键词，例如：串口、TCP、MFC、指针、线程、数据库。
              </p>
            </article>
          ) : (
            filtered.map((item) => {
              const module = modules.find((moduleItem) => moduleItem.id === item.moduleId);
              return (
                <article className="card glossary-card" key={item.term}>
                  <div className="glossary-card-head">
                    <div>
                      <span className="badge">{item.category}</span>
                      {module && <span className="badge badge-warning">{module.title}</span>}
                    </div>
                    <Link className="button button-ghost" to={`/modules/${item.moduleId}`}>
                      学习模块
                    </Link>
                  </div>
                  <h3>{item.term}</h3>
                  {item.aliases?.length ? (
                    <div className="muted alias-line">别名：{item.aliases.join(' / ')}</div>
                  ) : null}
                  <p className="lead glossary-desc">{item.desc}</p>
                  {item.example && (
                    <div className="code-block glossary-example">
                      <span>Example</span>
                      {item.example}
                    </div>
                  )}
                  {item.pitfall && (
                    <div className="warning-text">
                      <strong>常见坑：</strong>
                      {item.pitfall}
                    </div>
                  )}
                </article>
              );
            })
          )}
        </div>
      </section>
    </div>
  );
}
