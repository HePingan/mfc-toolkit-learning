import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { modules } from '../data/modules';
import { labs } from '../data/labs';
import { quizzes, QuizQuestion } from '../data/quizzes';
import { glossary } from '../data/glossary';
import { useProgress } from '../hooks/useProgress';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { masteryScore } from '../utils/progress';
import { downloadMarkdown } from '../utils/download';
import { storageKeys } from '../data/storageKeys';

type ReviewState = {
  masteredIds: string[];
  postponedIds: string[];
  reviewedAt: Record<string, string>;
};

type ReviewStatusFilter = 'all' | 'todo' | 'postponed';

type FlashCard = {
  id: string;
  moduleId: string;
  moduleTitle: string;
  front: string;
  back: string;
  source: '错题' | '术语' | '实验' | '模块';
  difficulty: '基础' | '进阶' | '易错';
  route: string;
};

function quizToCard(question: QuizQuestion): FlashCard {
  const module = modules.find((item) => item.id === question.moduleId) ?? modules[0];
  return {
    id: `quiz-${question.id}`,
    moduleId: module.id,
    moduleTitle: module.title,
    front: question.question,
    back: `答案：${Array.isArray(question.answer) ? question.answer.join('、') : question.answer}\n\n解析：${question.explanation}`,
    source: '错题',
    difficulty: question.difficulty === 'hard' ? '易错' : question.difficulty === 'medium' ? '进阶' : '基础',
    route: '/quiz',
  };
}

function buildFlashCards(wrongIds: string[]): FlashCard[] {
  const wrongCards = wrongIds
    .map((id) => quizzes.find((question) => question.id === id))
    .filter((question): question is QuizQuestion => Boolean(question))
    .map(quizToCard);

  const glossaryCards: FlashCard[] = glossary.slice(0, 24).map((item) => ({
    id: `glossary-${item.term}`,
    moduleId: item.moduleId,
    moduleTitle: modules.find((module) => module.id === item.moduleId)?.title ?? item.category,
    front: `解释术语：${item.term}`,
    back: `${item.desc}\n\n容易踩坑：${item.pitfall ?? '先理解概念，再回到实验和本地工程验证。'}${item.example ? `\n示例：${item.example}` : ''}`,
    source: '术语',
    difficulty: '基础',
    route: `/modules/${item.moduleId}`,
  }));

  const labCards: FlashCard[] = labs.map((lab) => {
    const module = modules.find((item) => item.id === lab.moduleId) ?? modules[0];
    return {
      id: `lab-${lab.id}`,
      moduleId: module.id,
      moduleTitle: module.title,
      front: `实验复盘：${lab.title} 要证明什么？`,
      back: `${lab.summary}\n\n本地 MFC 落地：${lab.localMfc?.goal ?? '先在浏览器理解概念，再到 Visual Studio 中实现。'}`,
      source: '实验',
      difficulty: lab.level === '完整版' ? '进阶' : '基础',
      route: '/labs',
    };
  });

  const moduleCards: FlashCard[] = modules.map((module) => ({
    id: `module-${module.id}`,
    moduleId: module.id,
    moduleTitle: module.title,
    front: `${module.title} 的本地实践验收点是什么？`,
    back: `${module.chapterSummary ?? module.description}\n\n验收：${module.localPractice?.acceptance.join('；') ?? module.projectTask}`,
    source: '模块',
    difficulty: module.id === 'capstone' ? '易错' : '进阶',
    route: `/modules/${module.id}`,
  }));

  const dedup = new Map<string, FlashCard>();
  [...wrongCards, ...glossaryCards, ...labCards, ...moduleCards].forEach((card) => dedup.set(card.id, card));
  return Array.from(dedup.values());
}

function formatReviewMarkdown(cards: FlashCard[], state: ReviewState) {
  return `# MFC 训练营复习卡片\n\n${cards.map((card, index) => {
    const status = state.masteredIds.includes(card.id) ? '已掌握' : state.postponedIds.includes(card.id) ? '稍后复习' : '待复习';
    return `## ${index + 1}. ${card.front}\n\n- 模块：${card.moduleTitle}\n- 来源：${card.source}\n- 难度：${card.difficulty}\n- 状态：${status}\n- 最近复习：${state.reviewedAt[card.id] ?? '未记录'}\n\n${card.back}`;
  }).join('\n\n')}`;
}

export function ReviewPage() {
  const { progress, removeWrongQuestion } = useProgress();
  const [reviewState, setReviewState] = useLocalStorage<ReviewState>(storageKeys.review, { masteredIds: [], postponedIds: [], reviewedAt: {} });
  const [moduleFilter, setModuleFilter] = useState('all');
  const [sourceFilter, setSourceFilter] = useState<'all' | FlashCard['source']>('all');
  const [statusFilter, setStatusFilter] = useState<ReviewStatusFilter>('all');
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);

  const allCards = useMemo(() => buildFlashCards(progress.wrongQuestions), [progress.wrongQuestions]);
  const weakModuleIds = modules
    .map((module) => ({ id: module.id, score: masteryScore(module.id, progress) }))
    .filter((row) => row.score < 70)
    .map((row) => row.id);

  const cards = allCards.filter((card) => {
    const moduleOk = moduleFilter === 'all' ? true : moduleFilter === 'weak' ? weakModuleIds.includes(card.moduleId) : card.moduleId === moduleFilter;
    const sourceOk = sourceFilter === 'all' || card.source === sourceFilter;
    const statusOk = statusFilter === 'all'
      ? true
      : statusFilter === 'postponed'
        ? reviewState.postponedIds.includes(card.id)
        : !reviewState.masteredIds.includes(card.id);
    return moduleOk && sourceOk && statusOk;
  });

  const current = cards[index % Math.max(cards.length, 1)];
  const masteredCount = reviewState.masteredIds.filter((id) => allCards.some((card) => card.id === id)).length;
  const postponedCount = reviewState.postponedIds.filter((id) => allCards.some((card) => card.id === id)).length;
  const today = new Date().toISOString().slice(0, 10);
  const todayReviewedCount = Object.values(reviewState.reviewedAt).filter((date) => date.startsWith(today)).length;
  const weakRows = modules.map((module) => ({ module, score: masteryScore(module.id, progress) })).filter((row) => row.score < 70);

  const next = () => {
    setRevealed(false);
    setIndex((value) => (cards.length ? (value + 1) % cards.length : 0));
  };

  const markMastered = () => {
    if (!current) return;
    setReviewState({
      masteredIds: reviewState.masteredIds.includes(current.id) ? reviewState.masteredIds : [...reviewState.masteredIds, current.id],
      postponedIds: reviewState.postponedIds.filter((id) => id !== current.id),
      reviewedAt: { ...reviewState.reviewedAt, [current.id]: new Date().toISOString() },
    });
    if (current.id.startsWith('quiz-')) removeWrongQuestion(current.id.replace('quiz-', ''));
    next();
  };

  const postponeCurrent = () => {
    if (!current) return;
    setReviewState({
      ...reviewState,
      postponedIds: reviewState.postponedIds.includes(current.id) ? reviewState.postponedIds : [...reviewState.postponedIds, current.id],
      reviewedAt: { ...reviewState.reviewedAt, [current.id]: new Date().toISOString() },
    });
    next();
  };

  const exportCards = () => downloadMarkdown('mfc-review-flashcards.md', formatReviewMarkdown(cards, reviewState));

  return (
    <div>
      <section className="hero review-hero">
        <div className="eyebrow">Spaced Review · Flashcards</div>
        <h2>复习训练台</h2>
        <p>把错题、术语、实验复盘和本地实践验收点做成卡片。先回忆答案，再翻面核对，用于考前复习和项目交付前查漏补缺。</p>
        <div className="form-row">
          <Link className="button button-primary" to="/quiz">回到测验中心</Link>
          <Link className="button button-ghost" to="/glossary">术语速查</Link>
          <Link className="button button-ghost" to="/labs">实验复盘</Link>
          <Link className="button button-ghost" to="/reports">学习报告</Link>
        </div>
      </section>

      <section className="review-stats-grid">
        <Card><strong>{cards.length}</strong><span>当前卡片</span><p className="muted">随筛选条件动态变化</p></Card>
        <Card><strong>{progress.wrongQuestions.length}</strong><span>错题卡</span><p className="muted">掌握后可从错题本移除</p></Card>
        <Card><strong>{weakRows.length}</strong><span>薄弱模块</span><p className="muted">掌握度低于 70%</p></Card>
        <Card><strong>{masteredCount}</strong><span>已掌握</span><p className="muted">保存在 localStorage</p></Card>
        <Card><strong>{postponedCount}</strong><span>稍后复习</span><p className="muted">复习状态刷新不丢</p></Card>
        <Card><strong>{todayReviewedCount}</strong><span>今日复习</span><p className="muted">reviewedAt 记录</p></Card>
      </section>

      <Card className="review-filter-card">
        <div className="diagram-head compact-head">
          <div><div className="eyebrow">Review Scope</div><h3>选择复习范围</h3></div>
          <Button className="button-ghost" onClick={exportCards}>导出当前卡片</Button>
        </div>
        <div className="review-filter-grid">
          <label>模块
            <select value={moduleFilter} onChange={(event) => { setModuleFilter(event.target.value); setIndex(0); setRevealed(false); }}>
              <option value="all">全部模块</option>
              <option value="weak">只看薄弱模块</option>
              {modules.map((module) => <option value={module.id} key={module.id}>{module.title}</option>)}
            </select>
          </label>
          <label>来源
            <select value={sourceFilter} onChange={(event) => { setSourceFilter(event.target.value as typeof sourceFilter); setIndex(0); setRevealed(false); }}>
              <option value="all">全部来源</option>
              <option value="错题">错题</option>
              <option value="术语">术语</option>
              <option value="实验">实验</option>
              <option value="模块">模块</option>
            </select>
          </label>
          <label>状态
            <select value={statusFilter} onChange={(event) => { setStatusFilter(event.target.value as ReviewStatusFilter); setIndex(0); setRevealed(false); }}>
              <option value="all">全部状态</option>
              <option value="todo">未掌握</option>
              <option value="postponed">稍后复习</option>
            </select>
          </label>
        </div>
        {weakRows.length > 0 && <div className="badge-list">{weakRows.map((row) => <span className="badge badge-warning" key={row.module.id}>{row.module.title} · {row.score}%</span>)}</div>}
      </Card>

      {current ? (
        <Card className={`flashcard ${revealed ? 'revealed' : ''}`}>
          <div className="diagram-head compact-head">
            <div>
              <div className="eyebrow">Card {cards.indexOf(current) + 1} / {cards.length}</div>
              <h3>{current.front}</h3>
            </div>
            <div className="badge-list"><span className="badge">{current.source}</span><span className="badge">{current.moduleTitle}</span><span className="badge">{current.difficulty}</span></div>
          </div>
          <div className="flashcard-body">
            {!revealed ? <p className="muted">先在脑中或纸上回答，再点击“翻面看答案”。</p> : <pre>{current.back}</pre>}
          </div>
          <div className="form-row">
            <Button onClick={() => setRevealed((value) => !value)}>{revealed ? '收起答案' : '翻面看答案'}</Button>
            <Button className="button-ghost" onClick={next}>下一张</Button>
            <Button className="button-ghost" onClick={postponeCurrent}>稍后复习</Button>
            <Button className="button-ghost" onClick={markMastered}>已掌握</Button>
            <Link className="button button-ghost" to={current.route}>回到来源页面</Link>
          </div>
        </Card>
      ) : (
        <Card><p className="success-text">当前筛选下没有卡片。可以切换到全部模块或全部来源。</p></Card>
      )}

      <section className="review-list-grid">
        {cards.slice(0, 18).map((card) => (
          <Card className={reviewState.masteredIds.includes(card.id) ? 'review-mini-card mastered' : reviewState.postponedIds.includes(card.id) ? 'review-mini-card postponed' : 'review-mini-card'} key={card.id}>
            <div className="badge-list"><span className="badge">{card.source}</span><span className="badge">{card.moduleTitle}</span></div>
            <strong>{card.front}</strong>
            <p className="muted">{card.back.split('\n')[0]}</p>
          </Card>
        ))}
      </section>
    </div>
  );
}
