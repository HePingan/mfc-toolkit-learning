export function LoadingFallback() {
  return (
    <div className="card loading-card" role="status" aria-live="polite">
      <div className="eyebrow">Loading</div>
      <h2>正在加载页面模块…</h2>
      <div className="progress-bar">
        <span style={{ width: '58%' }} />
      </div>
    </div>
  );
}
