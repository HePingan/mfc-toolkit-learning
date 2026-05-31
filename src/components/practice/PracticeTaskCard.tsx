import { Link } from 'react-router-dom';
import { PracticeTemplate } from '../../data/practice';
import { labs } from '../../data/labs';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { CodeBlock } from '../course/CodeBlock';

type PracticeTaskCardProps = {
  template: PracticeTemplate;
  completed: boolean;
  onToggle: () => void;
};

export function PracticeTaskCard({ template, completed, onToggle }: PracticeTaskCardProps) {
  const relatedLabs = labs.filter((lab) => template.browserLabIds.includes(lab.id));
  return (
    <Card className={`practice-task-card ${completed ? 'done' : ''}`}>
      <div className="practice-task-head">
        <div>
          <div className="eyebrow">{template.stage}</div>
          <h3>{template.title}</h3>
        </div>
        <span className={`badge ${completed ? 'badge-success' : ''}`}>
          {completed ? '已完成' : '待实践'}
        </span>
      </div>
      <p>{template.goal}</p>
      {relatedLabs.length > 0 && (
        <div className="badge-list">
          {relatedLabs.map((lab) => (
            <Link className="badge linked-badge" to="/labs" key={lab.id}>
              浏览器实验：{lab.title}
            </Link>
          ))}
        </div>
      )}
      <div className="practice-mini-grid">
        <div>
          <strong>建议控件</strong>
          <ul>
            {template.controls.slice(0, 5).map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <div>
          <strong>关键验收</strong>
          <ul>
            {template.checks.slice(0, 5).map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
      <div className="form-row action-row">
        <Button onClick={onToggle}>{completed ? '取消完成' : '标记本地任务完成'}</Button>
      </div>
    </Card>
  );
}

export function ProjectFileTree({ files }: { files: { path: string; purpose: string }[] }) {
  return (
    <Card>
      <div className="diagram-head compact-head">
        <div>
          <div className="eyebrow">Project Skeleton</div>
          <h3>MFC 项目推荐文件结构</h3>
        </div>
        <span className="badge">Windows / Visual Studio</span>
      </div>
      <div className="file-tree">
        <div className="file-root">MfcToolkit/</div>
        {files.map((file) => (
          <div className="file-row" key={file.path}>
            <code>├── {file.path}</code>
            <span>{file.purpose}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}

export function LocalPracticeChecklist({ title, items }: { title: string; items: string[] }) {
  return (
    <Card>
      <h3>{title}</h3>
      <div className="local-check-list">
        {items.map((item) => (
          <label key={item}>
            <input type="checkbox" /> {item}
          </label>
        ))}
      </div>
      <p className="muted">本清单用于本地 Visual Studio 操作前自查，不会影响课程总进度。</p>
    </Card>
  );
}

export function MfcProjectSkeleton({ template }: { template: PracticeTemplate }) {
  return (
    <Card>
      <div className="diagram-head compact-head">
        <div>
          <div className="eyebrow">Code Skeleton</div>
          <h3>代码骨架 / 配置片段</h3>
        </div>
        <span className="badge">示例，需按实际项目调整</span>
      </div>
      <CodeBlock
        code={template.code}
        language={template.id.includes('sqlite') ? 'ini/sql' : 'cpp'}
      />
      <div className="warning-text">
        注意：这里是学习骨架。真实串口、Socket、SQLite SDK 的 API 需要根据你在 Windows
        项目里选用的库和控件 ID 调整。
      </div>
    </Card>
  );
}
