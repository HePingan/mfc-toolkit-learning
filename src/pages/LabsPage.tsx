import { ReactNode, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Tabs } from '../components/ui/Tabs';
import { SerialConfigLab } from '../components/labs/SerialConfigLab';
import { HexAsciiLab } from '../components/labs/HexAsciiLab';
import { ModbusFrameLab } from '../components/labs/ModbusFrameLab';
import { HttpBuilderLab } from '../components/labs/HttpBuilderLab';
import { TcpSimulatorLab } from '../components/labs/TcpSimulatorLab';
import { MfcMessageMapLab } from '../components/labs/MfcMessageMapLab';
import { PointerMemoryLab } from '../components/labs/PointerMemoryLab';
import { StlContainerLab } from '../components/labs/StlContainerLab';
import { ThreadLockLab } from '../components/labs/ThreadLockLab';
import { SqliteCrudLab } from '../components/labs/SqliteCrudLab';
import { IniEditorLab } from '../components/labs/IniEditorLab';
import { Lab, buildLabExportRecord, enrichedLabs, labs } from '../data/labs';
import { modules } from '../data/modules';
import { useProgress } from '../hooks/useProgress';
import { LabMatrixDiagram } from '../components/course/Diagrams';
import { Card } from '../components/ui/Card';

const labViews: Record<string, ReactNode> = {
  'serial-config': <SerialConfigLab />,
  'hex-ascii': <HexAsciiLab />,
  'modbus-frame': <ModbusFrameLab />,
  'http-builder': <HttpBuilderLab />,
  'tcp-simulator': <TcpSimulatorLab />,
  'mfc-message-map': <MfcMessageMapLab />,
  'pointer-memory': <PointerMemoryLab />,
  'stl-container': <StlContainerLab />,
  'thread-lock': <ThreadLockLab />,
  'sqlite-crud': <SqliteCrudLab />,
  'ini-editor': <IniEditorLab />,
};

function LabDetailPanel({ lab, completed }: { lab: Lab; completed: boolean }) {
  const detail = enrichedLabs.find((item) => item.id === lab.id);
  if (!detail) return null;
  const record = buildLabExportRecord(detail, completed);
  const copyRecord = async () => {
    await navigator.clipboard.writeText(record.markdown);
  };
  return (
    <Card className="lab-detail-card">
      <div className="diagram-head compact-head">
        <div>
          <div className="eyebrow">Lab Execution Record</div>
          <h3>实验详情与交付记录</h3>
        </div>
        <button className="button button-ghost" onClick={copyRecord} type="button">
          复制记录
        </button>
      </div>
      <div className="lab-detail-grid">
        <div>
          <strong>执行步骤</strong>
          {detail.steps.map((item, index) => (
            <span key={item}>
              Step {index + 1} · {item}
            </span>
          ))}
        </div>
        <div>
          <strong>验收清单</strong>
          {detail.acceptance.map((item) => (
            <span key={item}>✅ {item}</span>
          ))}
        </div>
        <div>
          <strong>常见错误</strong>
          {detail.commonPitfalls.map((item) => (
            <span key={item}>⚠️ {item}</span>
          ))}
        </div>
      </div>
      <pre className="code-block lab-export-preview">
        <code>{record.markdown}</code>
      </pre>
    </Card>
  );
}

function LocalMfcHint({ lab }: { lab: Lab }) {
  return (
    <Card className="lab-mfc-hint-card">
      <div className="diagram-head compact-head">
        <div>
          <div className="eyebrow">Local MFC Mapping</div>
          <h3>本实验对应的本地 MFC 实现</h3>
        </div>
        <Link className="button button-ghost" to="/practice">
          打开本地实战页
        </Link>
      </div>
      <p className="warning-text">
        浏览器实验只负责理解概念；以下清单用于 Windows + Visual Studio + MFC 项目落地。
      </p>
      <p>{lab.localMfc.goal}</p>
      <div className="lab-mfc-grid">
        <div>
          <strong>建议文件</strong>
          {lab.localMfc.files.map((item) => (
            <code key={item}>{item}</code>
          ))}
        </div>
        <div>
          <strong>控件 ID</strong>
          {lab.localMfc.controls.map((item) => (
            <code key={item}>{item}</code>
          ))}
        </div>
        <div>
          <strong>Message Map</strong>
          {lab.localMfc.messageMap.map((item) => (
            <code key={item}>{item}</code>
          ))}
        </div>
        <div>
          <strong>验收点</strong>
          {lab.localMfc.acceptance.map((item) => (
            <span key={item}>✅ {item}</span>
          ))}
        </div>
      </div>
    </Card>
  );
}

export function LabsPage() {
  const { progress } = useProgress();
  const done = progress.completedLabs.length;
  const [moduleFilter, setModuleFilter] = useState('all');
  const grouped = useMemo(
    () =>
      modules
        .map((module) => ({ module, items: labs.filter((lab) => lab.moduleId === module.id) }))
        .filter((group) => group.items.length > 0),
    [],
  );
  const filteredLabs =
    moduleFilter === 'all' ? labs : labs.filter((lab) => lab.moduleId === moduleFilter);
  const nextLab = labs.find((lab) => !progress.completedLabs.includes(lab.id));

  return (
    <div>
      <section className="section-head">
        <div>
          <div className="eyebrow">Interactive Labs</div>
          <h2>交互实验室</h2>
          <p className="muted">
            所有实验均为浏览器内模拟，用来理解参数、协议、消息映射、内存、线程和配置读写；真实串口/TCP/SQLite
            接入请在 Visual Studio 中实践。
          </p>
        </div>
        <span className="badge">
          已完成 {done}/{labs.length}
        </span>
      </section>

      <section className="hero lab-learning-hero">
        <div className="eyebrow">Simulation → Local Practice</div>
        <h2>每个实验都对应一个本地 MFC 落地清单</h2>
        <p>
          先在浏览器里跑通概念，再查看建议文件、控件 ID、Message Map 和验收点，把实验迁移到 Visual
          Studio 项目中。
        </p>
        <div className="form-row">
          {nextLab ? (
            <span className="badge badge-warning">下一项建议：{nextLab.title}</span>
          ) : (
            <span className="badge badge-success">全部实验已完成</span>
          )}
          <Link className="button button-ghost" to="/codegen">
            生成代码骨架
          </Link>
          <Link className="button button-ghost" to="/integration">
            查看集成向导
          </Link>
          <Link className="button button-ghost" to="/troubleshooting">
            排错训练
          </Link>
        </div>
      </section>

      <div className="lab-module-overview">
        {grouped.map(({ module, items }) => {
          const finished = items.filter((lab) => progress.completedLabs.includes(lab.id)).length;
          const percent = Math.round((finished / items.length) * 100);
          return (
            <button
              className={`lab-module-card ${moduleFilter === module.id ? 'active' : ''}`}
              key={module.id}
              onClick={() => setModuleFilter(module.id)}
              type="button"
            >
              <span>{module.icon}</span>
              <strong>{module.title}</strong>
              <em>
                {finished}/{items.length}
              </em>
              <i>
                <b style={{ width: `${percent}%` }} />
              </i>
            </button>
          );
        })}
        <button
          className={`lab-module-card ${moduleFilter === 'all' ? 'active' : ''}`}
          onClick={() => setModuleFilter('all')}
          type="button"
        >
          <span>🧪</span>
          <strong>全部实验</strong>
          <em>
            {done}/{labs.length}
          </em>
          <i>
            <b style={{ width: `${Math.round((done / labs.length) * 100)}%` }} />
          </i>
        </button>
      </div>

      <div className="lab-status-grid">
        {filteredLabs.map((lab) => (
          <div
            className={`lab-status ${progress.completedLabs.includes(lab.id) ? 'done' : ''}`}
            key={lab.id}
          >
            <strong>
              {progress.completedLabs.includes(lab.id) ? '✓' : '○'} {lab.title}
            </strong>
            <span>{lab.level}</span>
          </div>
        ))}
      </div>
      <LabMatrixDiagram />
      <Tabs
        items={filteredLabs.map((lab) => ({
          id: lab.id,
          label: `${progress.completedLabs.includes(lab.id) ? '✓ ' : ''}${lab.title}`,
          content: (
            <div>
              <div className="lab-intro">
                <span className="badge">{lab.level}</span>
                <h3>{lab.title}</h3>
                <p>{lab.summary}</p>
              </div>
              {labViews[lab.id]}
              <LabDetailPanel lab={lab} completed={progress.completedLabs.includes(lab.id)} />
              <LocalMfcHint lab={lab} />
            </div>
          ),
        }))}
      />
    </div>
  );
}
