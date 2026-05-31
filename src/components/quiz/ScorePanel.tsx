export function ScorePanel({
  score,
  total,
  correct,
}: {
  score: number;
  total: number;
  correct: number;
}) {
  return (
    <div className="score-panel">
      <strong>{score} 分</strong>
      <span>
        答对 {correct} / {total}
      </span>
    </div>
  );
}
