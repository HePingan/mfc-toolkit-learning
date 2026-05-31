import { Link } from 'react-router-dom';
import { ActionRow } from '../components/ui/ActionRow';
import { PageHero } from '../components/ui/PageHero';

export function NotFoundPage() {
  return (
    <PageHero
      className="not-found-page"
      eyebrow="404 / Not Found"
      title="页面不存在"
      description="你访问的课程页面暂时不存在。可以回到学习路线、实验中心或搜索页继续定位内容。"
    >
      <ActionRow>
        <Link className="button button-primary" to="/">
          返回首页
        </Link>
        <Link className="button button-ghost" to="/roadmap">
          学习路线
        </Link>
        <Link className="button button-ghost" to="/search">
          全站搜索
        </Link>
      </ActionRow>
    </PageHero>
  );
}
