import { Link } from 'react-router-dom';
import { CourseModule, modules } from '../../data/modules';
import { labs } from '../../data/labs';
import { Card } from '../ui/Card';

type NodeTone = 'cyan' | 'purple' | 'green' | 'amber' | 'rose';

const toneByIndex: NodeTone[] = ['cyan', 'purple', 'green', 'amber', 'rose'];

function DiagramNode({
  title,
  caption,
  tone = 'cyan',
}: {
  title: string;
  caption?: string;
  tone?: NodeTone;
}) {
  return (
    <div className={`diagram-node tone-${tone}`}>
      <strong>{title}</strong>
      {caption && <span>{caption}</span>}
    </div>
  );
}

function Arrow() {
  return (
    <span className="diagram-arrow" aria-hidden="true">
      →
    </span>
  );
}

export function LearningPathDiagram() {
  const steps = [
    { title: '导览', caption: '看清最终工具' },
    { title: '串口', caption: '参数 / HEX / Modbus' },
    { title: '网络', caption: 'HTTP / TCP' },
    { title: 'MFC', caption: '控件 / 消息映射' },
    { title: 'C++', caption: '指针 / STL / 线程' },
    { title: '存储', caption: 'SQLite / INI' },
    { title: '综合项目', caption: '通用调试工具' },
  ];

  return (
    <Card className="diagram-card">
      <div className="diagram-head">
        <div>
          <div className="eyebrow">Visual Map</div>
          <h3>从零到 MFC 通用调试工具的学习闭环</h3>
        </div>
        <span className="badge">文档第十八步 · 图解化</span>
      </div>
      <div className="path-diagram" aria-label="学习路径图">
        {steps.map((step, index) => (
          <div className="path-step" key={step.title}>
            <DiagramNode
              title={`${index + 1}. ${step.title}`}
              caption={step.caption}
              tone={toneByIndex[index % toneByIndex.length]}
            />
            {index < steps.length - 1 && <Arrow />}
          </div>
        ))}
      </div>
      <p className="muted">
        建议顺序：先理解全局，再分模块做浏览器模拟实验，最后回到 Windows + Visual Studio 完成真实
        MFC 项目。
      </p>
    </Card>
  );
}

const moduleVisuals: Record<string, { center: string; nodes: string[]; caption: string }> = {
  overview: {
    center: 'MFC 通用工具',
    nodes: ['UI 层', '通讯层', '数据层', '工具层'],
    caption: '先看目标形态，再拆解模块边界。',
  },
  serial: {
    center: '串口收发',
    nodes: ['COM 口', '波特率 8N1', 'ASCII / HEX', 'Modbus CRC'],
    caption: '双方参数一致 + 按字节理解协议，是串口调试的核心。',
  },
  network: {
    center: '网络通讯',
    nodes: ['HTTP 请求行', 'Header / Body', 'TCP 连接', '粘包/拆包'],
    caption: 'HTTP 是请求响应模型；TCP 是持续连接的字节流。',
  },
  mfc: {
    center: 'MFC 消息映射',
    nodes: ['控件 ID', 'Windows 消息', 'Message Map', '处理函数'],
    caption: '按钮、定时器、键盘输入最终都会进入对应 C++ 成员函数。',
  },
  'cpp-core': {
    center: 'C++ 稳定性',
    nodes: ['对象生命周期', 'STL 容器', '线程同步', '指针安全'],
    caption: '内存、容器和锁决定工具能不能长期稳定运行。',
  },
  storage: {
    center: '配置与历史',
    nodes: ['INI 轻配置', 'SQLite 表', 'CRUD', '参数化'],
    caption: '工具软件必须记住参数、历史记录和用户习惯。',
  },
  capstone: {
    center: '综合项目',
    nodes: ['串口 Tab', 'TCP/HTTP Tab', '数据保存', '日志线程'],
    caption: '把分散知识整合成可验收、可打包、可维护的 Windows 工具。',
  },
};

export function ModuleConceptDiagram({ module }: { module: CourseModule }) {
  const visual = moduleVisuals[module.id] ?? moduleVisuals.overview;
  return (
    <Card className="diagram-card">
      <div className="diagram-head compact-head">
        <div>
          <div className="eyebrow">Concept Diagram</div>
          <h3>
            {module.icon} {module.title} 知识结构图
          </h3>
        </div>
        <span className="badge">{module.estimatedMinutes} 分钟</span>
      </div>
      <div className="radial-diagram" aria-label={`${module.title} 知识结构图`}>
        <div className="radial-center">
          <strong>{visual.center}</strong>
          <span>{module.subtitle}</span>
        </div>
        {visual.nodes.map((node, index) => (
          <DiagramNode
            key={node}
            title={node}
            caption={module.concepts[index]}
            tone={toneByIndex[index % toneByIndex.length]}
          />
        ))}
      </div>
      <p className="muted">{visual.caption}</p>
    </Card>
  );
}

export function LabMatrixDiagram() {
  const grouped = modules
    .map((module) => ({ module, labs: labs.filter((lab) => lab.moduleId === module.id) }))
    .filter((item) => item.labs.length > 0);

  return (
    <Card className="diagram-card">
      <div className="diagram-head">
        <div>
          <div className="eyebrow">Lab Matrix</div>
          <h3>实验与知识点对应图</h3>
        </div>
        <span className="badge">{labs.length} 个实验</span>
      </div>
      <div className="lab-matrix-diagram" aria-label="实验矩阵图">
        {grouped.map(({ module }, index) => (
          <div className="lab-column" key={module.id}>
            <Link
              to={`/modules/${module.id}`}
              className={`lab-column-head tone-${toneByIndex[index % toneByIndex.length]}`}
            >
              {module.icon} {module.title}
            </Link>
            {labs
              .filter((lab) => lab.moduleId === module.id)
              .map((lab) => (
                <div className="lab-chip" key={lab.id}>
                  <strong>{lab.title}</strong>
                  <span>
                    {lab.level} · {lab.summary}
                  </span>
                </div>
              ))}
          </div>
        ))}
      </div>
    </Card>
  );
}

export function CapstoneArchitectureDiagram() {
  const layers = [
    { title: 'UI 层', caption: 'Dialog / Tabs / Controls', tone: 'cyan' as NodeTone },
    { title: '通讯层', caption: 'Serial / TCP / HTTP', tone: 'purple' as NodeTone },
    { title: '数据层', caption: 'SQLite / INI', tone: 'green' as NodeTone },
    { title: '工具层', caption: 'Logger / Thread / Config', tone: 'amber' as NodeTone },
  ];

  return (
    <Card className="diagram-card">
      <div className="diagram-head">
        <div>
          <div className="eyebrow">Architecture</div>
          <h3>项目架构图</h3>
        </div>
        <span className="badge">最终项目</span>
      </div>
      <div className="capstone-architecture" aria-label="MFC 通用调试工具架构图">
        <div className="architecture-layers">
          {layers.map((layer, index) => (
            <div className="architecture-step" key={layer.title}>
              <DiagramNode title={layer.title} caption={layer.caption} tone={layer.tone} />
              {index < layers.length - 1 && <Arrow />}
            </div>
          ))}
        </div>
        <div className="architecture-pipeline">
          <span>用户点击按钮</span>
          <Arrow />
          <span>MFC 消息映射</span>
          <Arrow />
          <span>业务模块</span>
          <Arrow />
          <span>通讯/存储</span>
          <Arrow />
          <span>UI 日志显示</span>
        </div>
      </div>
    </Card>
  );
}

export function VisualStudioMigrationDiagram() {
  const steps = [
    { title: '浏览器实验', caption: '理解参数、协议帧、消息映射、线程和存储边界' },
    { title: '代码骨架', caption: '生成 .h/.cpp、控件 ID、Message Map 和依赖说明' },
    { title: 'Dialog 规划', caption: '用设计器确认控件分组、ID 命名和按钮事件入口' },
    { title: '本地集成', caption: '复制到 Windows + Visual Studio + MFC Dialog 项目' },
    { title: '构建验收', caption: '按编译错误、运行日志和 Capstone 清单逐项验证' },
  ];

  return (
    <Card className="diagram-card migration-diagram-card">
      <div className="diagram-head">
        <div>
          <div className="eyebrow">Browser → Visual Studio</div>
          <h3>网页模拟到本地 MFC 项目的迁移路径</h3>
        </div>
        <span className="badge">Practice Bridge</span>
      </div>
      <div className="migration-flow" aria-label="网页实验迁移到本地 Visual Studio 的流程图">
        {steps.map((step, index) => (
          <div className="migration-step" key={step.title}>
            <DiagramNode
              title={`${index + 1}. ${step.title}`}
              caption={step.caption}
              tone={toneByIndex[index % toneByIndex.length]}
            />
            {index < steps.length - 1 && <Arrow />}
          </div>
        ))}
      </div>
      <p className="warning-text">
        边界提醒：网页只提供模拟、图解和模板；真实串口、Socket、SQLite 与 MFC 编译必须在 Windows +
        Visual Studio 本地完成。
      </p>
    </Card>
  );
}

export function ToolExecutionPipelineDiagram() {
  const lanes = [
    {
      title: '输入事件',
      items: ['按钮点击', '定时器', '串口回调', 'Socket 接收'],
      tone: 'cyan' as NodeTone,
    },
    {
      title: '调度层',
      items: ['Message Map', 'PostMessage', '任务队列', '错误分发'],
      tone: 'purple' as NodeTone,
    },
    {
      title: '业务模块',
      items: ['SerialManager', 'TcpClient', 'HttpClient', 'ConfigStore'],
      tone: 'green' as NodeTone,
    },
    {
      title: '状态输出',
      items: ['日志窗口', '状态栏', 'SQLite 历史', 'INI 配置'],
      tone: 'amber' as NodeTone,
    },
  ];

  return (
    <Card className="diagram-card pipeline-diagram-card">
      <div className="diagram-head">
        <div>
          <div className="eyebrow">Runtime Pipeline</div>
          <h3>MFC 工具运行时执行链路</h3>
        </div>
        <span className="badge">UI 不阻塞</span>
      </div>
      <div className="pipeline-lanes" aria-label="MFC 工具运行时执行链路图">
        {lanes.map((lane, index) => (
          <div className={`pipeline-lane tone-${lane.tone}`} key={lane.title}>
            <strong>{lane.title}</strong>
            {lane.items.map((item) => (
              <span key={item}>{item}</span>
            ))}
            {index < lanes.length - 1 && <i aria-hidden="true">→</i>}
          </div>
        ))}
      </div>
      <p className="muted">
        核心原则：耗时通讯和数据库操作不要直接堵在按钮事件中，应该进入工作线程/队列，再用安全方式把结果送回
        UI 日志。
      </p>
    </Card>
  );
}
