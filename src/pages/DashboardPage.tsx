import { Link } from 'react-router-dom';
import { useMemo, useState } from 'react';
import { modules } from '../data/modules';
import { labs } from '../data/labs';
import { quizzes, getQuestion } from '../data/quizzes';
import { useProgress } from '../hooks/useProgress';
import { masteryScore, ProgressState } from '../utils/progress';
import { Card } from '../components/ui/Card';
import { AchievementsPanel } from '../components/progress/AchievementsPanel';
import { achievementSummary } from '../data/achievements';
import { downloadJson } from '../utils/download';
import { toolNavGroups } from '../config/navigation';

export function DashboardPage() {
  const { progress, overallPercent, resetProgress, importProgress } = useProgress();
  const [importText, setImportText] = useState('');
  const [message, setMessage] = useState('');
  const quizModules = new Set(quizzes.map((q) => q.moduleId));
  const moduleRows = modules.map((m) => ({
    module: m,
    score: masteryScore(m.id, progress),
    labs: labs.filter((lab) => lab.moduleId === m.id),
  }));
  const nextModule = moduleRows.find((row) => row.score < 100)?.module;
  const nextModuleScore = nextModule ? masteryScore(nextModule.id, progress) : 100;
  const weakModules = moduleRows.filter((row) => row.score < 70).slice(0, 3);
  const wrongQuestions = progress.wrongQuestions.map(getQuestion).filter(Boolean);
  const achievements = achievementSummary(progress);
  const todayTasks = [
    nextModule
      ? { to: `/modules/${nextModule.id}`, label: '继续章节', detail: nextModule.title }
      : { to: '/portfolio', label: '整理作品', detail: '模块已完成，沉淀项目材料' },
    wrongQuestions.length
      ? { to: '/review', label: '清理错题', detail: `${wrongQuestions.length} 道错题进入复习卡片` }
      : { to: '/labs', label: '补齐实验', detail: '完成未做实验并标记进度' },
    { to: '/exam', label: '答辩训练', detail: '随机抽未完成题，补回答证据' },
    { to: '/demo-script', label: '演示稿', detail: '补证据缺口并完成一次彩排' },
    { to: '/delivery', label: '交付包', detail: '汇总 README、源码、验收和证据' },
    { to: '/submit-rehearsal', label: '提交演练', detail: '按真实验收顺序检查 8 项材料' },
    { to: '/evidence', label: '证据库', detail: '集中补截图、日志、源码和配置路径' },
  ];
  const finalReadiness = Math.min(
    100,
    Math.round(
      overallPercent * 0.45 +
        (progress.completedLabs.length / Math.max(1, labs.length)) * 25 +
        Math.min(15, achievements.unlockedCount * 2) +
        (progress.wrongQuestions.length === 0 ? 15 : 5),
    ),
  );
  const submitMissingEstimate = Math.max(0, 8 - Math.round(finalReadiness / 12.5));
  const finalReadinessNext =
    finalReadiness >= 85
      ? '进入提交演练并导出最终清单'
      : progress.wrongQuestions.length
        ? '先清错题并补答辩证据'
        : '补齐演示证据和本地验收截图';
  const summary = useMemo(
    () => ({
      exportedAt: new Date().toISOString(),
      overallPercent,
      progress,
    }),
    [overallPercent, progress],
  );

  const handleImport = () => {
    try {
      const parsed = JSON.parse(importText) as { progress?: ProgressState } | ProgressState;
      const next =
        'progress' in parsed && parsed.progress ? parsed.progress : (parsed as ProgressState);
      importProgress(next);
      setMessage('进度导入成功。');
      setImportText('');
    } catch {
      setMessage('导入失败：JSON 格式不正确。');
    }
  };

  return (
    <div>
      <section className="section-head">
        <div>
          <div className="eyebrow">Learning Dashboard</div>
          <h2>学习仪表盘</h2>
          <p className="muted">
            集中查看掌握度、下一步建议、错题和本地进度备份。数据保存在浏览器 localStorage 中。
          </p>
        </div>
        <span className="badge">总体进度 {overallPercent}%</span>
      </section>

      <Card className="android-dashboard-continue-card">
        <div>
          <div className="eyebrow">Android mobile QA v3</div>
          <h3>继续学习</h3>
          {nextModule ? (
            <p>
              下一站：<strong>{nextModule.title}</strong>
              <span>当前掌握 {nextModuleScore}%</span>
            </p>
          ) : (
            <p className="success-text">全部模块已满分，建议整理作品集和演示稿。</p>
          )}
        </div>
        <div className="android-dashboard-progress">
          <span>总进度 {overallPercent}%</span>
          <div className="progress-bar">
            <i style={{ width: `${overallPercent}%` }} />
          </div>
        </div>
        <div className="android-dashboard-actions">
          <Link
            className="button button-primary"
            to={nextModule ? `/modules/${nextModule.id}` : '/portfolio'}
          >
            {nextModule ? '继续学习' : '整理作品'}
          </Link>
          <Link className="button button-ghost" to="/labs">
            去实验
          </Link>
          <Link className="button button-ghost" to={wrongQuestions.length ? '/quiz' : '/review'}>
            {wrongQuestions.length ? '清错题' : '去复习'}
          </Link>
          <Link className="button button-ghost" to="/delivery">
            交付包
          </Link>
          <Link className="button button-ghost" to="/submit-rehearsal">
            提交
          </Link>
          <Link className="button button-ghost" to="/evidence">
            证据库
          </Link>
        </div>
      </Card>

      <Card className="learning-loop-today-card">
        <div className="diagram-head compact-head">
          <div>
            <div className="eyebrow">Learning loop v4 · QA token</div>
            <h3>今日推进闭环</h3>
          </div>
          <span className="badge">学习 → 复习 → 答辩 → 演示</span>
        </div>
        <div className="today-loop-grid">
          {todayTasks.map((task, index) => (
            <Link to={task.to} key={`${task.to}-${index}`}>
              <span>0{index + 1}</span>
              <strong>{task.label}</strong>
              <small>{task.detail}</small>
            </Link>
          ))}
        </div>
      </Card>

      <Card className="dashboard-delivery-readiness-card dashboard-submit-rehearsal-card">
        <div className="diagram-head compact-head">
          <div>
            <div className="eyebrow">android-v6-submit-rehearsal · delivery-readiness-score</div>
            <h3>最终提交准备度</h3>
          </div>
          <span className="badge">
            {finalReadiness}% · 预计缺 {submitMissingEstimate} 项
          </span>
        </div>
        <div className="dashboard-readiness-meter">
          <i style={{ width: `${finalReadiness}%` }} />
        </div>
        <p>下一步：{finalReadinessNext}</p>
        <div className="form-row">
          <Link className="button button-primary" to="/submit-rehearsal">
            开始提交演练
          </Link>
          <Link className="button button-ghost" to="/evidence">
            整理证据库
          </Link>
          <Link className="button button-ghost" to="/delivery">
            打开交付包
          </Link>
          <Link className="button button-ghost" to="/demo-script">
            补演示证据
          </Link>
          <Link className="button button-ghost" to="/exam">
            答辩训练
          </Link>
        </div>
      </Card>

      <section className="dashboard-grid">
        <Card>
          <h3>模块完成</h3>
          <strong className="big-number">
            {progress.completedModules.length}/{modules.length}
          </strong>
          <p className="muted">完成章节讲解后点击“标记本模块完成”。</p>
        </Card>
        <Card>
          <h3>实验完成</h3>
          <strong className="big-number">
            {progress.completedLabs.length}/{labs.length}
          </strong>
          <p className="muted">每个实验组件都有“标记完成”。</p>
        </Card>
        <Card>
          <h3>测验完成</h3>
          <strong className="big-number">
            {Object.keys(progress.quizScores).length}/{quizModules.size}
          </strong>
          <p className="muted">测验成绩会参与掌握度计算。</p>
        </Card>
        <Card>
          <h3>错题数量</h3>
          <strong className="big-number">{progress.wrongQuestions.length}</strong>
          <p className="muted">建议优先清理错题本。</p>
        </Card>
        <Card>
          <h3>成就徽章</h3>
          <strong className="big-number">
            {achievements.unlockedCount}/{achievements.total}
          </strong>
          <p className="muted">完成模块、实验、测验和项目后自动解锁。</p>
        </Card>
      </section>

      <Card className="dashboard-tools-card">
        <h3>全部工具</h3>
        <div className="dashboard-tool-grid">
          {toolNavGroups.map((group) => (
            <div className="dashboard-tool-group" key={group.label}>
              <strong>{group.label}</strong>
              <div className="dashboard-tool-group-links">
                {group.links.map((tool) => (
                  <Link to={tool.to} key={tool.to}>
                    <span>{tool.icon}</span>
                    <b>{tool.label}</b>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <AchievementsPanel progress={progress} />
      </Card>

      <Card>
        <h3>下一步学习建议</h3>
        {nextModule ? (
          <p>
            建议继续学习：
            <Link className="inline-link" to={`/modules/${nextModule.id}`}>
              {nextModule.title}
            </Link>
            。如果该模块已有低分测验，先重做测验；如果实验未完成，先去实验室补齐。
          </p>
        ) : (
          <p className="success-text">
            所有模块掌握度已达满分，可以开始最终项目打包和本地 MFC 实战。
          </p>
        )}
        {weakModules.length > 0 && (
          <div className="badge-list">
            {weakModules.map((row) => (
              <span className="badge badge-warning" key={row.module.id}>
                {row.module.title} · {row.score}%
              </span>
            ))}
          </div>
        )}
        <div className="form-row">
          <Link className="button button-ghost" to="/notes">
            记录本轮学习笔记
          </Link>
          <Link className="button button-ghost" to="/reports">
            生成学习报告
          </Link>
        </div>
      </Card>

      <Card>
        <h3>模块掌握度明细</h3>
        <div className="mastery-list">
          {moduleRows.map(({ module, score, labs: moduleLabs }) => (
            <div className="mastery-row" key={module.id}>
              <div>
                <strong>
                  {module.icon} {module.title}
                </strong>
                <p className="muted">
                  实验 {moduleLabs.filter((lab) => progress.completedLabs.includes(lab.id)).length}/
                  {moduleLabs.length || 0} · 测验 {progress.quizScores[module.id] ?? '未完成'}
                </p>
              </div>
              <div className="mastery-meter">
                <span>{score}%</span>
                <div className="progress-bar">
                  <i style={{ width: `${score}%` }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <h3>错题强化</h3>
        {wrongQuestions.length === 0 ? (
          <p className="success-text">暂无错题。继续保持。</p>
        ) : (
          wrongQuestions.slice(0, 8).map(
            (q) =>
              q && (
                <div className="wrong-item" key={q.id}>
                  <strong>
                    {q.moduleId}：{q.question}
                  </strong>
                  <p>{q.explanation}</p>
                </div>
              ),
          )
        )}
        {wrongQuestions.length > 0 && (
          <Link className="button button-ghost" to="/quiz">
            去测验中心处理错题
          </Link>
        )}
      </Card>

      <Card>
        <h3>进度备份 / 恢复</h3>
        <p className="muted" id="progress-import-help">
          只导入本网站导出的 JSON；导入会合并到浏览器 localStorage，不会连接任何后端服务。
        </p>
        <div className="form-row">
          <button
            className="button"
            type="button"
            onClick={() =>
              downloadJson(
                `mfc-toolkit-progress-${Date.now()}.json`,
                JSON.stringify(summary, null, 2),
              )
            }
          >
            导出进度 JSON
          </button>
          <button
            className="button button-ghost"
            type="button"
            onClick={() => {
              if (confirm('确定要清空所有学习进度吗？')) resetProgress();
            }}
          >
            重置进度
          </button>
        </div>
        <label className="field-label" htmlFor="progress-import-json">
          进度 JSON 文本
        </label>
        <textarea
          id="progress-import-json"
          value={importText}
          onChange={(e) => setImportText(e.target.value)}
          placeholder="粘贴之前导出的 JSON，可恢复学习进度"
          aria-describedby="progress-import-help progress-import-status"
          spellCheck={false}
        />
        <div className="form-row">
          <button className="button button-ghost" type="button" onClick={handleImport}>
            导入进度
          </button>
          {message && (
            <span className="badge" id="progress-import-status" role="status" aria-live="polite">
              {message}
            </span>
          )}
        </div>
      </Card>
    </div>
  );
}
