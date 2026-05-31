import { Link } from 'react-router-dom';
import { CompileErrorCard, CompileErrorSearchPanel, ErrorDiagnosisPanel, IntegrationChecklistPanel, IntegrationExportPanel, IntegrationTimeline, ProjectImportDiagram } from '../components/integration/IntegrationPanels';
import { compileErrorCases, integrationSteps } from '../data/integration';

export function IntegrationPage() {
  return (
    <div>
      <section className="section-head">
        <div>
          <div className="eyebrow">Local Visual Studio Integration</div>
          <h2>MFC 本地项目集成向导</h2>
          <p className="muted">把 ZIP 代码骨架、Dialog 控件布局和 Message Map 一步步放进 Visual Studio MFC 项目，并对照常见编译错误快速修复。v2 已支持错误码搜索、编译输出诊断和持久化集成清单。</p>
        </div>
        <span className="badge">Windows + Visual Studio + MFC</span>
      </section>

      <section className="hero integration-hero">
        <div className="eyebrow">From Browser Package To Local Build</div>
        <h2>目标：先跑通空项目，再逐个接入模块</h2>
        <p>不要一次性复制所有代码后再排错。正确顺序是：创建空 MFC Dialog → 导入骨架文件 → 添加控件 ID → 接入 DDX/Message Map → 每个模块单独编译验证。</p>
        <div className="form-row">
          <Link className="button button-primary" to="/codegen">下载 ZIP 代码包</Link>
          <Link className="button button-ghost" to="/designer">规划 Dialog 控件</Link>
          <Link className="button button-ghost" to="/troubleshooting">排错训练</Link>
          <Link className="button button-ghost" to="/build-checklist">构建清单</Link>
          <Link className="button button-ghost" to="/capstone">Capstone 验收</Link>
        </div>
      </section>

      <ProjectImportDiagram />

      <section className="section-head"><div><div className="eyebrow">Six Steps</div><h2>6 步本地集成流程</h2><p className="muted">每一步都包含操作、验收点和常见坑，适合边看网页边操作 Visual Studio。</p></div></section>
      <IntegrationTimeline steps={integrationSteps} />

      <section className="section-head"><div><div className="eyebrow">Compile Error Quick Fix</div><h2>编译错误速查</h2><p className="muted">优先按错误码定位：编译期看 Cxxxx，链接期看 LNKxxxx，资源脚本看 RCxxxx。</p></div></section>
      <CompileErrorSearchPanel />
      <ErrorDiagnosisPanel />
      <div className="card-grid compile-error-grid">{compileErrorCases.map((item) => <CompileErrorCard item={item} key={item.code} />)}</div>

      <IntegrationChecklistPanel />
      <IntegrationExportPanel />
    </div>
  );
}
