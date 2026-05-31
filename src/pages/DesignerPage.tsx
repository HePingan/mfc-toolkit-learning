import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { DialogCanvas, ControlInspector, ControlTable, DesignerExportPanel } from '../components/designer/DialogDesigner';
import { Card } from '../components/ui/Card';
import { mfcDialogPresets } from '../data/designer';

export function DesignerPage() {
  const [presetId, setPresetId] = useState(mfcDialogPresets[0].id);
  const preset = mfcDialogPresets.find((item) => item.id === presetId) ?? mfcDialogPresets[0];
  const [selectedId, setSelectedId] = useState(preset.controls[0]?.id);
  const selectedControl = useMemo(() => preset.controls.find((control) => control.id === selectedId), [preset, selectedId]);

  const changePreset = (id: string) => {
    const next = mfcDialogPresets.find((item) => item.id === id) ?? mfcDialogPresets[0];
    setPresetId(id);
    setSelectedId(next.controls[0]?.id);
  };

  return (
    <div>
      <section className="section-head">
        <div>
          <div className="eyebrow">MFC Dialog Layout Designer</div>
          <h2>MFC Dialog 控件布局设计器</h2>
          <p className="muted">用浏览器草图先规划 Dialog 控件、控件 ID、按钮事件和 Message Map，再到 Visual Studio 资源编辑器逐项落地。</p>
        </div>
        <span className="badge">浏览器草图 · 本地 VS 实现</span>
      </section>

      <section className="hero designer-hero">
        <div className="eyebrow">From Skeleton To UI</div>
        <h2>先把控件摆清楚，再写 MFC 事件代码</h2>
        <p>这个页面不生成真实 .rc 文件，也不替代 Visual Studio 资源编辑器；它用于训练初学者理解控件 ID、布局分组、事件函数和消息映射之间的关系。</p>
        <div className="form-row"><Link className="button button-primary" to="/codegen">生成代码骨架</Link><Link className="button button-ghost" to="/integration">进入本地集成向导</Link><Link className="button button-ghost" to="/practice">查看本地实战</Link><Link className="button button-ghost" to="/troubleshooting">排错训练</Link></div>
      </section>

      <Card className="designer-preset-card">
        <div className="diagram-head compact-head"><div><div className="eyebrow">Layout Presets</div><h3>选择布局模板</h3></div><span className="badge">{mfcDialogPresets.length} 套模板</span></div>
        <div className="designer-preset-grid">
          {mfcDialogPresets.map((item) => <button key={item.id} className={item.id === presetId ? 'active' : ''} onClick={() => changePreset(item.id)}><strong>{item.title}</strong><span>{item.description}</span></button>)}
        </div>
      </Card>

      <div className="two-col designer-workbench">
        <DialogCanvas preset={preset} selectedId={selectedId} onSelect={setSelectedId} />
        <ControlInspector control={selectedControl} />
      </div>

      <ControlTable controls={preset.controls} />
      <DesignerExportPanel preset={preset} />
    </div>
  );
}
