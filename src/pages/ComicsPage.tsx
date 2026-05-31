import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { comicPrompts } from '../data/comics';

const allThemes = '全部主题';

function copyText(text: string) {
  void navigator.clipboard?.writeText(text);
}

export function ComicsPage() {
  const [query, setQuery] = useState('');
  const [theme, setTheme] = useState(allThemes);
  const themes = useMemo(
    () => [
      allThemes,
      ...Array.from(new Set(comicPrompts.map((item) => item.theme.split('、')[0]))),
    ],
    [],
  );

  const filtered = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    return comicPrompts.filter((item) => {
      const matchTheme = theme === allThemes || item.theme.startsWith(theme);
      const haystack =
        `${item.title} ${item.theme} ${item.learningGoal} ${item.prompt} ${item.storyboard.join(' ')}`.toLowerCase();
      return matchTheme && (!keyword || haystack.includes(keyword));
    });
  }, [query, theme]);

  return (
    <div>
      <section className="hero comics-hero">
        <div className="eyebrow">Knowledge Comics / Wan2.7-Pro Ready</div>
        <h2>MFC 知识漫画工坊</h2>
        <p>
          先把关键知识点沉淀成可复用漫画 prompt：串口/Modbus、MFC
          消息映射、线程锁、SQLite/INI。后续如果 Wan2.7Pro
          或其它生图接口可用，可直接批量生成图片并替换占位卡片。
        </p>
        <div className="form-row">
          <Link className="button button-primary" to="/resources">
            返回资源中心
          </Link>
          <Link className="button button-ghost" to="/labs">
            配合实验学习
          </Link>
          <Link className="button button-ghost" to="/codegen">
            生成本地代码骨架
          </Link>
        </div>
        <div className="comic-flow" aria-label="知识漫画生产流程">
          {['知识点拆解', '四格分镜', 'Prompt 固化', 'Wan2.7Pro 出图', '接入课程页'].map(
            (step, index) => (
              <span key={step}>
                <b>{index + 1}</b>
                {step}
              </span>
            ),
          )}
        </div>
      </section>

      <Card className="comic-filter-card">
        <div className="search-box comic-search-box">
          <input
            aria-label="搜索漫画 prompt"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="搜索：Modbus、Message Map、线程、SQLite..."
          />
          <select
            aria-label="漫画主题"
            value={theme}
            onChange={(event) => setTheme(event.target.value)}
          >
            {themes.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </div>
        <p className="muted">
          当前显示 {filtered.length}/{comicPrompts.length} 个
          prompt。所有内容均为浏览器静态数据，不依赖后端。
        </p>
      </Card>

      <div className="comic-grid">
        {filtered.map((item) => (
          <Card className="comic-card" key={item.id}>
            <div className="comic-preview" aria-label={`${item.title} 漫画占位预览`}>
              <div className="comic-preview-title">{item.title}</div>
              <div className="comic-preview-panels">
                {item.storyboard.slice(0, 4).map((panel, index) => (
                  <span key={panel}>
                    {index + 1}
                    <small>{panel.replace(/^第 \d 格：|^封面：/, '').slice(0, 18)}</small>
                  </span>
                ))}
              </div>
            </div>
            <div className="comic-card-head">
              <span className="badge">{item.ratio}</span>
              <span className="badge linked-badge">{item.preset}</span>
              <span className="badge badge-warning">Prompt Ready</span>
            </div>
            <h3>{item.title}</h3>
            <p>{item.learningGoal}</p>
            <div className="badge-list">
              <span className="badge">{item.theme}</span>
              <span className="badge">{item.audience}</span>
            </div>
            <details className="comic-storyboard">
              <summary>查看分镜</summary>
              <ol>
                {item.storyboard.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ol>
            </details>
            <details className="comic-prompt-box">
              <summary>查看 / 复制出图 Prompt</summary>
              <pre className="code-block">
                <code>{item.prompt}</code>
              </pre>
            </details>
            <div className="form-row">
              <button className="button" type="button" onClick={() => copyText(item.prompt)}>
                复制 Prompt
              </button>
              <Link className="button button-ghost" to={item.routeHint}>
                去相关学习点
              </Link>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
