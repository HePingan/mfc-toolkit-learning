import { useState } from 'react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { useProgress } from '../../hooks/useProgress';

export function PointerMemoryLab() {
  const [state, setState] = useState<'empty' | 'new' | 'deleted' | 'null'>('empty');
  const { progress, markLab } = useProgress();
  return <Card><h3>指针内存可视化 {progress.completedLabs.includes('pointer-memory') && '✅'}</h3><div className="form-row"><Button onClick={() => setState('new')}>new Obj()</Button><Button onClick={() => setState('deleted')}>delete p</Button><Button onClick={() => setState('null')}>p = nullptr</Button><Button onClick={() => markLab('pointer-memory')}>标记完成</Button></div><div className={`memory-box ${state}`}><div>栈区：p {state === 'null' ? '= nullptr' : state === 'empty' ? '未定义' : '→ 0x1000'}</div><div>堆区：{state === 'new' ? '[Obj 数据块]' : state === 'deleted' ? '[已释放对象，但 p 仍保存旧地址]' : state === 'null' ? '无引用，避免野指针' : '空'}</div></div></Card>;
}
