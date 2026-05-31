import { CodegenFile, CodegenModule, buildCodegenPackage, buildCodegenZipManifest, codegenPackageToMarkdown } from '../../data/codegen';
import { buildDialogWiring } from '../../data/dialogWiring';
import { buildMiniProjectSummary, buildResourceHeader } from '../../data/miniProject';
import { getNativeDependencies } from '../../data/nativeDeps';
import { CodegenMode, codegenModes } from '../../data/codegenTemplates';
import { downloadZipManifest } from '../../utils/zip';
import { downloadMarkdown } from '../../utils/download';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { CodeBlock } from '../course/CodeBlock';

type SelectorProps = {
  modules: CodegenModule[];
  selectedIds: string[];
  onToggle: (id: string) => void;
};

export function CodegenModeSelector({ mode, onChange }: { mode: CodegenMode; onChange: (mode: CodegenMode) => void }) {
  return (
    <Card className="codegen-mode-card">
      <div className="diagram-head compact-head"><div><div className="eyebrow">Codegen v6 Mode</div><h3>选择代码复杂度</h3></div><span className="badge">Mini Project 一键包</span></div>
      <div className="codegen-mode-grid">
        {codegenModes.map((item) => (
          <button className={mode === item.id ? 'active' : ''} key={item.id} onClick={() => onChange(item.id)} type="button">
            <strong>{item.title}</strong>
            <span>{item.description}</span>
          </button>
        ))}
      </div>
      <p className="muted">v6 将模块代码、Dialog 接线、resource.generated.h、VS 属性页、构建顺序和最终 Dialog 对照模板整合为完整 Mini Project ZIP 包。</p>
    </Card>
  );
}

export function CodegenModuleSelector({ modules, selectedIds, onToggle }: SelectorProps) {
  return (
    <Card className="codegen-selector-card">
      <div className="diagram-head compact-head"><div><div className="eyebrow">Module Selector</div><h3>选择要生成的 MFC 模块</h3></div><span className="badge">{selectedIds.length}/{modules.length}</span></div>
      <div className="codegen-module-grid">
        {modules.map((module) => <label className={selectedIds.includes(module.id) ? 'active' : ''} key={module.id}><input type="checkbox" checked={selectedIds.includes(module.id)} onChange={() => onToggle(module.id)} /><strong>{module.title}</strong><span>{module.description}</span>{module.recommended && <em>推荐默认启用</em>}</label>)}
      </div>
    </Card>
  );
}

export function ProjectTreePreview({ files }: { files: CodegenFile[] }) {
  return <Card><div className="eyebrow">Project Tree</div><h3>推荐项目文件树</h3><div className="file-tree"><div className="file-root">MfcToolkit/</div>{files.map((file) => <div className="file-row" key={file.path}><code>├── {file.path}</code><span>{file.language.toUpperCase()} 骨架文件</span></div>)}</div></Card>;
}

export function ControlIdTable({ ids }: { ids: string[] }) {
  return <Card><div className="eyebrow">Control IDs</div><h3>控件 ID 命名建议</h3><div className="codegen-id-grid">{ids.map((id) => <code key={id}>{id}</code>)}</div><p className="muted">建议先固定控件 ID，再生成消息映射，避免后续按钮事件失效。</p></Card>;
}

export function MessageMapPreview({ lines }: { lines: string[] }) {
  const code = `BEGIN_MESSAGE_MAP(CMfcToolkitDlg, CDialogEx)\n${lines.map((line) => `  ${line}`).join('\n') || '  // 暂无消息映射'}\nEND_MESSAGE_MAP()`;
  return <Card><div className="eyebrow">Message Map</div><h3>MFC 消息映射示例</h3><CodeBlock code={code} language="cpp" /></Card>;
}

export function CodeFilePreview({ file }: { file: CodegenFile }) {
  const copy = async () => navigator.clipboard?.writeText(file.content);
  return <Card className="codegen-file-card"><div className="diagram-head compact-head"><div><div className="eyebrow">{file.language}</div><h3>{file.path}</h3></div><Button className="button-ghost" onClick={copy}>复制代码</Button></div><CodeBlock code={file.content} language={file.language} /></Card>;
}

export function DialogWiringPanel({ selectedIds }: { selectedIds: string[] }) {
  const wiring = buildDialogWiring(selectedIds);
  const copy = async () => navigator.clipboard?.writeText(wiring.markdown);
  return (
    <Card className="dialog-wiring-card">
      <div className="diagram-head compact-head"><div><div className="eyebrow">Dialog Wiring Preview</div><h3>Dialog 事件函数自动拼接</h3></div><Button className="button-ghost" onClick={copy}>复制接线说明</Button></div>
      <p className="muted">根据所选模块生成 CMfcToolkitDlg 的 include、private 成员、DDX_Control、OnInitDialog 和按钮事件函数。复制到本地 Visual Studio MFC 项目后按实际控件 ID 微调。</p>
      <div className="dialog-wiring-grid">
        <div><strong>Includes</strong><CodeBlock code={wiring.includes} language="cpp" /></div>
        <div><strong>Members</strong><CodeBlock code={wiring.members} language="cpp" /></div>
        <div><strong>DDX</strong><CodeBlock code={wiring.ddx} language="cpp" /></div>
        <div><strong>Init</strong><CodeBlock code={wiring.init} language="cpp" /></div>
      </div>
      <div className="dialog-handler-preview"><strong>Handlers</strong><CodeBlock code={wiring.handlers} language="cpp" /></div>
    </Card>
  );
}

export function NativeDependencyPanel({ selectedIds }: { selectedIds: string[] }) {
  const deps = getNativeDependencies(selectedIds);
  if (deps.length === 0) return null;
  const libs = Array.from(new Set(deps.flatMap((dep) => dep.libs)));
  return (
    <Card className="native-deps-card">
      <div className="diagram-head compact-head"><div><div className="eyebrow">Native API Dependency</div><h3>Windows 原生 API / 链接库依赖</h3></div><span className="badge">Codegen v3</span></div>
      <p className="muted">根据当前选择的模块，提前确认 Visual Studio 需要的头文件、链接库和阻塞调用边界。</p>
      <div className="badge-list">{libs.map((lib) => <span className="badge badge-warning" key={lib}>{lib}</span>)}</div>
      <div className="native-deps-grid">
        {deps.map((dep) => <div className="native-dep-item" key={dep.moduleId}><strong>{dep.title}</strong><span>Headers：{dep.headers.join(', ')}</span><span>API：{dep.api}</span><ul>{dep.notes.map((note) => <li key={note}>{note}</li>)}</ul></div>)}
      </div>
    </Card>
  );
}

export function MiniProjectPackagePanel({ selectedIds, mode }: { selectedIds: string[]; mode: CodegenMode }) {
  const pkg = buildCodegenPackage(selectedIds, mode);
  const summary = buildMiniProjectSummary(selectedIds);
  const resourceHeader = buildResourceHeader(selectedIds);
  const copyResource = async () => navigator.clipboard?.writeText(resourceHeader);
  return (
    <Card className="mini-project-card">
      <div className="diagram-head compact-head"><div><div className="eyebrow">Mini Project Package</div><h3>完整 MFC Mini Project 一键生成包</h3></div><span className="badge">Codegen v6</span></div>
      <p className="muted">把模块源码、Dialog 接线、资源 ID、VS 属性页、构建顺序和最终 Dialog 对照模板打成一个可下载 ZIP，用于 Windows + Visual Studio + MFC 本地实践。</p>
      <div className="mini-project-grid">
        <div><strong>{pkg.selected.length}</strong><span>已选模块</span></div>
        <div><strong>{pkg.files.length}</strong><span>源码/配置文件</span></div>
        <div><strong>{summary.resourceCount}</strong><span>Resource ID</span></div>
        <div><strong>{summary.docs.length}</strong><span>Mini Project 文档</span></div>
      </div>
      <div className="badge-list">{summary.libs.length ? summary.libs.map((lib) => <span className="badge badge-warning" key={lib}>{lib}</span>) : <span className="badge">无额外 .lib</span>}</div>
      <div className="mini-doc-list">{summary.docs.map((doc) => <code key={doc}>{doc}</code>)}</div>
      <div className="dialog-handler-preview"><strong>resource.generated.h 预览</strong><CodeBlock code={resourceHeader} language="cpp" /></div>
      <div className="form-row"><Button className="button-ghost" onClick={copyResource}>复制 Resource ID 草图</Button></div>
    </Card>
  );
}

export function CodegenExportPanel({ selectedIds, mode }: { selectedIds: string[]; mode: CodegenMode }) {
  const markdown = codegenPackageToMarkdown(selectedIds, mode);
  const manifest = buildCodegenZipManifest(selectedIds, mode);
  const download = () => downloadMarkdown(`mfc-toolkit-code-skeleton-${Date.now()}.md`, markdown);
  const copy = async () => navigator.clipboard?.writeText(markdown);
  const downloadZip = async () => downloadZipManifest(manifest, `MfcToolkitSkeleton-${Date.now()}.zip`);
  return <Card className="codegen-export-card"><div className="diagram-head compact-head"><div><div className="eyebrow">Export Mini Project</div><h3>导出 Markdown / ZIP Mini Project 包</h3></div><span className="badge">{manifest.rootName}.zip</span></div><p className="muted">ZIP 项目包包含 README、源码模块、Dialog 接线、resource.generated.h、VS 属性页、构建顺序、最终 Dialog 对照模板和验收文档。它用于复制进本地 Visual Studio MFC Dialog 项目，不是完整 .sln 工程。</p><div className="zip-manifest-summary"><div><strong>{manifest.files.length}</strong><span>ZIP 文件数</span></div><div><strong>13</strong><span>说明/接线/项目文档</span></div><div><strong>{buildCodegenPackage(selectedIds, mode).files.length}</strong><span>代码文件</span></div></div><div className="form-row"><Button onClick={downloadZip}>下载 ZIP Mini Project 包</Button><Button className="button-ghost" onClick={download}>导出 Markdown</Button><Button className="button-ghost" onClick={copy}>复制完整代码包</Button></div></Card>;
}

export function CodegenStats({ selectedIds, mode }: { selectedIds: string[]; mode: CodegenMode }) {
  const pkg = buildCodegenPackage(selectedIds, mode);
  return <section className="stat-grid codegen-stats"><div className="stat-card"><strong>{pkg.selected.length}</strong><span>已选模块</span><p>可组合生成项目骨架</p></div><div className="stat-card"><strong>{pkg.files.length}</strong><span>代码文件</span><p>.h/.cpp/.ini 示例</p></div><div className="stat-card"><strong>{pkg.controls.length}</strong><span>控件 ID</span><p>MFC Dialog 命名建议</p></div><div className="stat-card"><strong>{pkg.messageMap.length}</strong><span>消息映射</span><p>按钮事件入口</p></div></section>;
}
