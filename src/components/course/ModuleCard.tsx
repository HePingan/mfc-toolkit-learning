import { Link } from 'react-router-dom';
import { CourseModule } from '../../data/modules';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';

export function ModuleCard({ module }: { module: CourseModule }) {
  return (
    <Card className="module-card">
      <div className="module-icon">{module.icon}</div>
      <h3>{module.title}</h3>
      <p>{module.subtitle}</p>
      <p className="muted">
        预计 {module.estimatedMinutes} 分钟 · {module.labs.length} 个实验
      </p>
      <div className="badge-list">
        {module.concepts.slice(0, 6).map((item) => (
          <Badge key={item}>{item}</Badge>
        ))}
      </div>
      <Link className="button" to={`/modules/${module.id}`}>
        开始学习
      </Link>
    </Card>
  );
}
