import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <section className="hero not-found-page">
      <div className="eyebrow">404 / Not Found</div>
      <h2>页面不存在</h2>
      <p>你访问的课程页面暂时不存在。可以回到学习路线、实验中心或搜索页继续定位内容。</p>
      <div className="form-row">
        <Link className="button button-primary" to="/">返回首页</Link>
        <Link className="button button-ghost" to="/roadmap">学习路线</Link>
        <Link className="button button-ghost" to="/search">全站搜索</Link>
      </div>
    </section>
  );
}
