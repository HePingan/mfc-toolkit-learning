import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { resourceCategories, resourceKinds, resources } from '../data/resources';
import { glossary } from '../data/glossary';
import { Card } from '../components/ui/Card';

const allCategory = '全部分类';
const allKind = '全部类型';

export function ResourcesPage() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState(allCategory);
  const [kind, setKind] = useState(allKind);

  const filtered = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    return resources.filter((item) => {
      const matchCategory = category === allCategory || item.category === category;
      const matchKind = kind === allKind || item.kind === kind;
      const haystack =
        `${item.title} ${item.note} ${item.category} ${item.kind} ${item.recommendedFor.join(' ')}`.toLowerCase();
      const matchQuery = !keyword || haystack.includes(keyword);
      return matchCategory && matchKind && matchQuery;
    });
  }, [category, kind, query]);

  const original = resources.find((item) => item.kind === '原始来源');
  const topGlossary = glossary.slice(0, 10);

  return (
    <div>
      <section className="section-head">
        <div>
          <div className="eyebrow">Resource Center</div>
          <h2>资源中心</h2>
          <p className="muted">
            按环境、MFC、串口/Modbus、HTTP/TCP、C++、SQLite/INI
            和综合项目整理学习链接、工具、速查表和本站实践入口。
          </p>
        </div>
        <span className="badge">
          {filtered.length}/{resources.length} 条资源
        </span>
      </section>

      <section className="hero resource-hero">
        <div className="eyebrow">Recommended Path</div>
        <h2>按“先理解 → 再模拟 → 后本地实战”的顺序学习</h2>
        <p>
          先用课程页和实验页把概念跑通，再用代码生成器、Dialog 设计器和集成向导把内容落到 Windows +
          Visual Studio + MFC 项目中。
        </p>
        <div className="resource-order-flow">
          {[
            '课程导览',
            '串口通讯',
            'HTTP/TCP',
            'MFC 框架',
            'C++ 核心',
            'SQLite/INI',
            '综合项目',
          ].map((item, index) => (
            <span key={item}>
              {index + 1}. {item}
            </span>
          ))}
        </div>
        <div className="form-row">
          <Link className="button button-primary" to="/roadmap">
            查看学习路线
          </Link>
          <Link className="button button-ghost" to="/practice">
            本地实战桥接
          </Link>
          <Link className="button button-ghost" to="/glossary">
            打开完整术语表
          </Link>
        </div>
      </section>

      <Card className="resource-filter-card">
        <div className="search-box resource-search-box">
          <label>
            <span className="sr-only">搜索资源</span>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="搜索：MFC、Modbus、SQLite、粘包、Visual Studio..."
              aria-label="搜索资源"
            />
          </label>
          <label>
            <span className="sr-only">资源分类</span>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              aria-label="资源分类"
            >
              <option>{allCategory}</option>
              {resourceCategories.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>
          <label>
            <span className="sr-only">资源类型</span>
            <select value={kind} onChange={(e) => setKind(e.target.value)} aria-label="资源类型">
              <option>{allKind}</option>
              {resourceKinds.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>
        </div>
        <div className="badge-list resource-category-chips">
          <button
            className={`chip-button ${category === allCategory ? 'active' : ''}`}
            onClick={() => setCategory(allCategory)}
          >
            {allCategory}
          </button>
          {resourceCategories.map((item) => (
            <button
              className={`chip-button ${category === item ? 'active' : ''}`}
              key={item}
              onClick={() => setCategory(item)}
            >
              {item}
            </button>
          ))}
        </div>
      </Card>

      {original && (
        <Card className="source-card">
          <div className="diagram-head compact-head">
            <div>
              <div className="eyebrow">Source</div>
              <h3>课程初始知识清单来源</h3>
            </div>
            <a className="button button-ghost" href={original.url} target="_blank" rel="noreferrer">
              打开原文
            </a>
          </div>
          <p>{original.note}</p>
          <p className="muted">
            如果公开发布或继续扩写课程内容，建议在页脚或资源页保留来源链接和改编说明。
          </p>
        </Card>
      )}

      <section className="section-head">
        <div>
          <div className="eyebrow">Filtered Resources</div>
          <h2>资源列表</h2>
        </div>
      </section>
      {filtered.length === 0 ? (
        <Card className="warning-card">
          <h3>没有匹配资源</h3>
          <p className="muted">换一个关键词，或选择“全部分类 / 全部类型”。</p>
        </Card>
      ) : (
        <div className="resource-grid">
          {filtered.map((item) => (
            <Card key={`${item.category}-${item.title}`} className="resource-card">
              <div className="resource-card-head">
                <span className="badge">{item.category}</span>
                <span className="badge linked-badge">{item.kind}</span>
              </div>
              <h3>{item.title}</h3>
              <p>{item.note}</p>
              <div className="badge-list">
                {item.recommendedFor.map((tag) => (
                  <span className="badge" key={tag}>
                    {tag}
                  </span>
                ))}
              </div>
              {item.url === '#' ? (
                <span className="muted">建议：结合本站章节和本地工具练习</span>
              ) : item.url.startsWith('/') ? (
                <Link className="button button-ghost" to={item.url}>
                  打开本站页面
                </Link>
              ) : (
                <a className="button button-ghost" href={item.url} target="_blank" rel="noreferrer">
                  打开外部链接
                </a>
              )}
            </Card>
          ))}
        </div>
      )}

      <section className="section-head">
        <div>
          <div className="eyebrow">Glossary Preview</div>
          <h2>常用术语速览</h2>
          <p className="muted">完整术语表已独立放在 `/glossary`，这里保留高频词入口。</p>
        </div>
        <Link className="button button-ghost" to="/glossary">
          查看完整术语表
        </Link>
      </section>
      <div className="resource-glossary-grid">
        {topGlossary.map((item) => (
          <Card key={item.term} className="resource-glossary-card">
            <strong>{item.term}</strong>
            <p>{item.desc}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
