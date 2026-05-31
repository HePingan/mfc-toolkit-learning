import { Link } from 'react-router-dom';
import { LearningPathDiagram, CapstoneArchitectureDiagram, LabMatrixDiagram, ModuleConceptDiagram, ToolExecutionPipelineDiagram, VisualStudioMigrationDiagram } from '../components/course/Diagrams';
import { Card } from '../components/ui/Card';
import { modules } from '../data/modules';

export function DiagramsPage() {
  return (
    <div>
      <section className="hero diagrams-hero">
        <div className="eyebrow">Visual Knowledge Hub</div>
        <h2>MFC 工具开发图解中心</h2>
        <p>把学习路线、模块知识、实验映射、项目架构、本地迁移和执行链路集中到一页，适合复习、讲解和做项目说明。</p>
        <div className="form-row">
          <Link className="button button-primary" to="/roadmap">回到学习路线</Link>
          <Link className="button button-ghost" to="/practice">本地实战桥接</Link>
          <Link className="button button-ghost" to="/codegen">生成代码骨架</Link>
          <Link className="button button-ghost" to="/reports">导出学习报告</Link>
        </div>
        <div className="badge-list">
          <span className="badge">可视化复盘</span>
          <span className="badge">浏览器内图解</span>
          <span className="badge">Windows + Visual Studio 落地</span>
        </div>
      </section>

      <section className="diagram-hub-grid">
        <Card className="diagram-hub-card">
          <strong>1</strong>
          <span>先看路线</span>
          <p>明确导览、通讯、MFC、C++、存储和综合项目之间的顺序。</p>
        </Card>
        <Card className="diagram-hub-card">
          <strong>2</strong>
          <span>再看结构</span>
          <p>按模块理解概念节点，避免只背 API 而不知道放在哪里。</p>
        </Card>
        <Card className="diagram-hub-card">
          <strong>3</strong>
          <span>最后落地</span>
          <p>把网页实验迁移到 Visual Studio/MFC 本地项目，按清单验收。</p>
        </Card>
      </section>

      <LearningPathDiagram />

      <section className="section-head">
        <div>
          <div className="eyebrow">Module Maps</div>
          <h2>模块知识结构速览</h2>
          <p className="muted">每张图对应一个课程模块，可直接跳回模块页继续学习。</p>
        </div>
      </section>
      <section className="diagram-module-grid">
        {modules.map((module) => (
          <div key={module.id}>
            <ModuleConceptDiagram module={module} />
            <div className="diagram-card-actions">
              <Link className="button button-ghost" to={`/modules/${module.id}`}>学习 {module.title}</Link>
              {module.localPractice?.relatedRoute && <Link className="button button-ghost" to={module.localPractice.relatedRoute}>本地实践</Link>}
            </div>
          </div>
        ))}
      </section>

      <section className="section-head">
        <div>
          <div className="eyebrow">Practice Flow</div>
          <h2>从网页模拟到本地 MFC 的迁移图</h2>
          <p className="muted">强调边界：网页只做模拟、图解和代码模板；真实串口/TCP/SQLite/MFC 编译要回到 Windows + Visual Studio。</p>
        </div>
      </section>
      <VisualStudioMigrationDiagram />
      <ToolExecutionPipelineDiagram />
      <LabMatrixDiagram />
      <CapstoneArchitectureDiagram />

      <Card className="diagram-boundary-card">
        <div className="diagram-head compact-head">
          <div>
            <div className="eyebrow">Boundary</div>
            <h3>图解中心的使用边界</h3>
          </div>
          <span className="badge">Browser Only</span>
        </div>
        <ul>
          <li>本页图解不访问真实串口、TCP Socket、SQLite 文件，也不编译 MFC。</li>
          <li>生成的结构、流程和代码提示用于 Windows + Visual Studio + MFC 本地练习。</li>
          <li>遇到编译/链接/控件 ID 问题，优先进入集成向导和构建清单逐项排查。</li>
        </ul>
        <div className="form-row">
          <Link className="button" to="/integration">打开集成向导</Link>
          <Link className="button button-ghost" to="/build-checklist">打开构建清单</Link>
          <Link className="button button-ghost" to="/troubleshooting">故障排查训练</Link>
        </div>
      </Card>
    </div>
  );
}
