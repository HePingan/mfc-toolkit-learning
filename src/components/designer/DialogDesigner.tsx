import {
  MfcDialogControl,
  MfcDialogPreset,
  buildDesignerMarkdown,
  buildDesignerMessageMap,
  buildDesignerResourceSnippet,
} from '../../data/designer';
import { downloadMarkdown } from '../../utils/download';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { CodeBlock } from '../course/CodeBlock';

function controlClass(type: MfcDialogControl['type']) {
  return `designer-control designer-${type.toLowerCase()}`;
}

export function DialogCanvas({
  preset,
  selectedId,
  onSelect,
}: {
  preset: MfcDialogPreset;
  selectedId?: string;
  onSelect: (id: string) => void;
}) {
  return (
    <Card className="designer-canvas-card">
      <div className="diagram-head compact-head">
        <div>
          <div className="eyebrow">Dialog Canvas</div>
          <h3>{preset.title}</h3>
        </div>
        <span className="badge">
          {preset.size.w} × {preset.size.h}
        </span>
      </div>
      <div className="designer-canvas" style={{ aspectRatio: `${preset.size.w}/${preset.size.h}` }}>
        {preset.controls.map((control) => (
          <button
            type="button"
            key={control.id}
            className={`${controlClass(control.type)} ${selectedId === control.id ? 'active' : ''}`}
            style={{
              left: `${(control.x / preset.size.w) * 100}%`,
              top: `${(control.y / preset.size.h) * 100}%`,
              width: `${(control.w / preset.size.w) * 100}%`,
              height: `${(control.h / preset.size.h) * 100}%`,
            }}
            onClick={() => onSelect(control.id)}
            title={`${control.id}：${control.note}`}
          >
            <span>{control.text}</span>
            <small>{control.id}</small>
          </button>
        ))}
      </div>
      <p className="muted">
        这是浏览器内布局草图，用于理解控件 ID、控件分组和事件入口；真实拖拽与资源编辑仍在 Visual
        Studio 资源编辑器完成。
      </p>
    </Card>
  );
}

export function ControlInspector({ control }: { control?: MfcDialogControl }) {
  if (!control)
    return (
      <Card>
        <h3>选择一个控件</h3>
        <p className="muted">点击画布上的控件，查看 ID、类型、事件函数和本地开发注意事项。</p>
      </Card>
    );
  return (
    <Card className="designer-inspector">
      <div className="eyebrow">Control Inspector</div>
      <h3>{control.id}</h3>
      <dl>
        <dt>类型</dt>
        <dd>{control.type}</dd>
        <dt>显示文本</dt>
        <dd>{control.text}</dd>
        <dt>位置</dt>
        <dd>
          x={control.x}, y={control.y}, w={control.w}, h={control.h}
        </dd>
        <dt>事件函数</dt>
        <dd>{control.event ?? '无按钮事件'}</dd>
        <dt>说明</dt>
        <dd>{control.note}</dd>
      </dl>
    </Card>
  );
}

export function ControlTable({ controls }: { controls: MfcDialogControl[] }) {
  return (
    <Card>
      <div className="eyebrow">Control List</div>
      <h3>控件 ID 与事件清单</h3>
      <div className="responsive-table">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>类型</th>
              <th>文本</th>
              <th>事件</th>
              <th>说明</th>
            </tr>
          </thead>
          <tbody>
            {controls.map((c) => (
              <tr key={c.id}>
                <td>
                  <code>{c.id}</code>
                </td>
                <td>{c.type}</td>
                <td>{c.text}</td>
                <td>
                  <code>{c.event ?? '-'}</code>
                </td>
                <td>{c.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

export function DesignerExportPanel({ preset }: { preset: MfcDialogPreset }) {
  const markdown = buildDesignerMarkdown(preset);
  const download = () => downloadMarkdown(`mfc-dialog-layout-${preset.id}.md`, markdown);
  const copy = async () => navigator.clipboard?.writeText(markdown);
  return (
    <Card className="designer-export-card">
      <div className="diagram-head compact-head">
        <div>
          <div className="eyebrow">Export Layout</div>
          <h3>导出控件布局说明</h3>
        </div>
        <span className="badge">Markdown</span>
      </div>
      <p className="muted">
        导出内容包含控件 ID 表、Message Map 示例和资源布局草图，方便对照 Visual Studio
        资源编辑器逐项创建控件。
      </p>
      <div className="form-row">
        <Button onClick={download}>下载布局说明</Button>
        <Button className="button-ghost" onClick={copy}>
          复制布局说明
        </Button>
      </div>
      <CodeBlock code={buildDesignerMessageMap(preset)} language="cpp" />
      <CodeBlock code={buildDesignerResourceSnippet(preset)} language="cpp" />
    </Card>
  );
}
