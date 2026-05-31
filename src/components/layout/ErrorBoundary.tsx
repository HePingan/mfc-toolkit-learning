import { Component, type ErrorInfo, type ReactNode } from 'react';
import { Link } from 'react-router-dom';

export class ErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean; message: string }
> {
  state = { hasError: false, message: '' };

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, message: error.message };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[ErrorBoundary]', error, info.componentStack);
  }

  render() {
    if (!this.state.hasError) return this.props.children;
    return (
      <main className="content error-page" role="alert">
        <section className="hero">
          <div className="eyebrow">Runtime Error</div>
          <h2>页面加载出错</h2>
          <p>React 运行时出现异常，已阻止白屏。请刷新页面，或回到首页继续学习。</p>
          {this.state.message && <pre className="terminal">{this.state.message}</pre>}
          <div className="form-row">
            <button className="button" onClick={() => window.location.reload()}>
              刷新页面
            </button>
            <Link className="button button-ghost" to="/">
              返回首页
            </Link>
          </div>
        </section>
      </main>
    );
  }
}
