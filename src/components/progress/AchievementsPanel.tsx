import { achievementSummary } from '../../data/achievements';
import { ProgressState } from '../../utils/progress';

export type AchievementsPanelProps = {
  progress: ProgressState;
  compact?: boolean;
};

export function AchievementsPanel({ progress, compact = false }: AchievementsPanelProps) {
  const { evaluated, unlockedCount, total } = achievementSummary(progress);
  const visible = compact ? evaluated.filter((achievement) => achievement.unlocked).slice(0, 4) : evaluated;
  const percent = Math.round((unlockedCount / total) * 100);

  return (
    <section className={compact ? 'achievements-panel compact' : 'achievements-panel'}>
      <div className="achievement-summary">
        <div>
          <div className="eyebrow">Achievements</div>
          <h3>成就徽章</h3>
          <p className="muted">根据模块、实验、测验、错题和最终项目进度自动解锁。</p>
        </div>
        <div className="achievement-score">
          <strong>{unlockedCount}/{total}</strong>
          <span>已解锁</span>
        </div>
      </div>
      <div className="progress-bar achievement-progress"><span style={{ width: `${percent}%` }} /></div>

      {visible.length === 0 ? (
        <p className="muted">还没有解锁徽章。先完成一个模块、实验或测验即可获得第一枚徽章。</p>
      ) : (
        <div className={compact ? 'achievement-list compact-list' : 'achievement-list'}>
          {visible.map((achievement) => (
            <article className={achievement.unlocked ? 'achievement-card unlocked' : 'achievement-card locked'} key={achievement.id}>
              <div className="achievement-icon">{achievement.icon}</div>
              <div>
                <div className="achievement-title-row">
                  <strong>{achievement.title}</strong>
                  <span className={achievement.unlocked ? 'badge badge-success' : 'badge'}>{achievement.unlocked ? '已解锁' : achievement.category}</span>
                </div>
                <p>{achievement.description}</p>
                {!achievement.unlocked && <p className="muted">解锁条件：{achievement.requirement}</p>}
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
