import { useState } from 'react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { useProgress } from '../../hooks/useProgress';

export function StlContainerLab() {
  const [items, setItems] = useState<number[]>([]);
  const { progress, markLab } = useProgress();
  return (
    <Card>
      <h3>STL 容器动画 {progress.completedLabs.includes('stl-container') && '✅'}</h3>
      <div className="form-row">
        <Button onClick={() => setItems([...items, (items.length + 1) * 10])}>
          vector.push_back
        </Button>
        <Button onClick={() => setItems(items.slice(1))}>queue.pop</Button>
        <Button onClick={() => markLab('stl-container')}>标记完成</Button>
      </div>
      <div className="vector-view">
        {items.map((n, i) => (
          <span key={`${n}-${i}`}>[{n}]</span>
        ))}
      </div>
      <p className="muted">vector 展示连续元素；queue.pop 表示先进先出移除队首。</p>
    </Card>
  );
}
