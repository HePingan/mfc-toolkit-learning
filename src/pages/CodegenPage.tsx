import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { buildCodegenPackage, codegenModules } from '../data/codegen';
import { useProgress } from '../hooks/useProgress';
import { getRecommendedCodegenModuleIds } from '../utils/codegenRecommendations';
import { Card } from '../components/ui/Card';
import {
  CodeFilePreview,
  CodegenExportPanel,
  CodegenModeSelector,
  CodegenModuleSelector,
  CodegenStats,
  ControlIdTable,
  DialogWiringPanel,
  MessageMapPreview,
  MiniProjectPackagePanel,
  NativeDependencyPanel,
  ProjectTreePreview,
} from '../components/codegen/CodegenPanels';
import { CodegenMode } from '../data/codegenTemplates';

export function CodegenPage() {
  const { progress } = useProgress();
  const adaptiveRecommendedIds = useMemo(() => getRecommendedCodegenModuleIds(progress), [progress]);
  const [selectedIds, setSelectedIds] = useState(() =>
    codegenModules.filter((module) => module.recommended).map((module) => module.id),
  );
  const [mode, setMode] = useState<CodegenMode>('practical');
  const pkg = useMemo(() => buildCodegenPackage(selectedIds, mode), [selectedIds, mode]);
  const toggle = (id: string) =>
    setSelectedIds((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    );
  const selectAll = () => setSelectedIds(codegenModules.map((module) => module.id));
  const selectRecommended = () =>
    setSelectedIds(
      codegenModules.filter((module) => module.recommended).map((module) => module.id),
    );
  const selectAdaptiveRecommended = () => setSelectedIds(adaptiveRecommendedIds);

  return (
    <div>
      <section className="section-head">
        <div>
          <div className="eyebrow">MFC Code Skeleton Generator</div>
          <h2>MFC 项目代码骨架生成器</h2>
          <p className="muted">
            选择需要的模块，自动生成文件树、控件 ID、Message Map、Dialog
            接线、resource.generated.h、VS 属性页和 Mini Project ZIP 包。v6 已整合完整 MFC Mini
            Project 一键生成包。
          </p>
        </div>
        <span className="badge">浏览器生成 · 本地 Visual Studio 使用</span>
      </section>

      <section className="hero codegen-hero">
        <div className="eyebrow">From Practice To Code</div>
        <h2>把实战任务转换成可复制的 MFC 起步代码</h2>
        <p>
          这里不会编译 MFC，也不会访问真实串口、TCP 或 SQLite；它只负责生成项目起步骨架，方便复制到
          Windows + Visual Studio + MFC 项目中继续开发。Codegen v6 已把模块源码、Dialog
          接线、Resource ID、VS 属性页、构建顺序和最终 Dialog 对照模板整合成 Mini Project 包。
        </p>
        <div className="form-row">
          <Link className="button button-primary" to="/practice">
            查看本地实战任务
          </Link>
          <Link className="button button-ghost" to="/designer">
            规划 Dialog 界面
          </Link>
          <Link className="button button-ghost" to="/integration">
            本地集成向导
          </Link>
          <Link className="button button-ghost" to="/build-checklist">
            构建清单
          </Link>
          <Link className="button button-ghost" to="/capstone">
            对照 Capstone 验收
          </Link>
          <button className="button button-ghost" onClick={selectRecommended}>
            推荐组合
          </button>
          <button className="button button-primary" onClick={selectAdaptiveRecommended}>
            按学习记录推荐
          </button>
          <button className="button button-ghost" onClick={selectAll}>
            全选模块
          </button>
        </div>
      </section>

      <CodegenModeSelector mode={mode} onChange={setMode} />
      <Card className="codegen-recommend-card">
        <div className="diagram-head compact-head">
          <div>
            <div className="eyebrow">Learning-aware Recommendation</div>
            <h3>根据实验 / 错题 / Capstone 推荐模块</h3>
          </div>
          <button className="button button-primary" onClick={selectAdaptiveRecommended}>
            应用推荐
          </button>
        </div>
        <p className="muted">
          系统会综合已完成实验、低分测验模块、历史错题标签和 Capstone 自评项，自动选择最需要生成的 MFC 代码骨架。
        </p>
        <div className="badge-list">
          {adaptiveRecommendedIds.map((id) => {
            const module = codegenModules.find((item) => item.id === id);
            return (
              <span className="badge badge-success" key={id}>
                {module?.title ?? id}
              </span>
            );
          })}
        </div>
      </Card>
      <CodegenModuleSelector modules={codegenModules} selectedIds={selectedIds} onToggle={toggle} />
      <CodegenStats selectedIds={selectedIds} mode={mode} />

      {pkg.files.length === 0 ? (
        <Card className="warning-card">
          <h3>还没有选择模块</h3>
          <p className="muted">至少选择一个模块后，才会生成文件树、控件 ID 和代码骨架。</p>
        </Card>
      ) : (
        <>
          <div className="two-col codegen-overview">
            <ProjectTreePreview files={pkg.files} />
            <ControlIdTable ids={pkg.controls} />
          </div>
          <MessageMapPreview lines={pkg.messageMap} />
          <DialogWiringPanel selectedIds={selectedIds} />
          <MiniProjectPackagePanel selectedIds={selectedIds} mode={mode} />
          <NativeDependencyPanel selectedIds={selectedIds} />
          <CodegenExportPanel selectedIds={selectedIds} mode={mode} />
          <section className="section-head">
            <div>
              <div className="eyebrow">Generated Files</div>
              <h2>代码文件预览</h2>
              <p className="muted">
                每个文件都可以单独复制。真实串口、WinSock、WinHTTP、SQLite API
                请在本地项目中按库版本补全。
              </p>
            </div>
          </section>
          <div className="codegen-files-list">
            {pkg.files.map((file) => (
              <CodeFilePreview file={file} key={file.path} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
