import { Card } from '../ui/Card';

export function QuizCard({ title, count, score }: { title: string; count: number; score?: number }) {
  return <Card><h3>{title}</h3><p>{count} 道题，包含答案解析和错题记录。</p><p className="muted">历史成绩：{score ?? '未完成'}</p></Card>;
}
