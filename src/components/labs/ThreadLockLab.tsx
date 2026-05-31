import { useState } from 'react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Terminal } from '../ui/Terminal';
import { useProgress } from '../../hooks/useProgress';

export function ThreadLockLab() {
  const [locked, setLocked] = useState(false);
  const { progress, markLab } = useProgress();
  const lines = locked
    ? ['Thread A lock -> counter=1', 'Thread B wait', 'Thread B lock -> counter=2', '结果正确：2']
    : [
        'Thread A read counter=0',
        'Thread B read counter=0',
        'Thread A write 1',
        'Thread B write 1',
        '结果错误：1',
      ];
  return (
    <Card>
      <h3>多线程锁模拟器 {progress.completedLabs.includes('thread-lock') && '✅'}</h3>
      <div className="form-row">
        <Button onClick={() => setLocked(!locked)}>
          {locked ? '查看无锁' : '加锁 lock_guard'}
        </Button>
        <Button onClick={() => markLab('thread-lock')}>标记完成</Button>
      </div>
      <Terminal lines={lines} />
    </Card>
  );
}
