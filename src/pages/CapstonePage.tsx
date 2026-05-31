import { Card } from '../components/ui/Card';
import { useProgress } from '../hooks/useProgress';
import { CapstoneArchitectureDiagram } from '../components/course/Diagrams';
import { Link } from 'react-router-dom';
import { capstoneRubric, recommendedProjectFiles } from '../data/practice';

const modules = [
  '串口调试',
  'TCP Client',
  'TCP Server',
  'HTTP 请求测试',
  'SQLite 参数保存',
  'INI 配置读写',
  '日志窗口',
  '多线程任务处理',
];
const required = [
  '创建 MFC Dialog 项目',
  '设计主界面 Tab',
  '实现串口参数配置 UI',
  '实现串口发送/接收逻辑',
  '实现 ASCII/HEX 模式切换',
  '实现 TCP Client 连接与发送',
  '实现 TCP Server 监听与接收',
  '实现 HTTP GET/POST 测试',
  '实现 SQLite 参数保存',
  '实现 INI 配置读取与写入',
  '实现日志窗口',
  '使用线程避免 UI 卡死',
  '对关键错误进行提示',
  '完成基本测试',
];
const bonus = [
  '支持 Modbus RTU',
  '支持历史记录',
  '支持导出日志',
  '支持配置模板',
  '支持界面主题切换',
];
const steps = [
  '创建 MFC 项目与基础 Dialog',
  '设计 Tab 主界面和控件 ID',
  '实现串口模块并加入 ASCII/HEX 切换',
  '实现 TCP Client/Server 收发流程',
  '实现 HTTP GET/POST 请求面板',
  '接入 SQLite/INI 保存参数',
  '加入统一日志、线程和错误提示',
  '按验收清单测试并打包',
];

export function CapstonePage() {
  const { progress, toggleCapstoneCheck } = useProgress();
  const all = [...required, ...bonus];
  const percent = Math.round((progress.capstoneChecks.length / all.length) * 100);
  return (
    <div>
      <section className="section-head">
        <div>
          <div className="eyebrow">Capstone Project</div>
          <h2>最终项目：MFC 通用调试工具</h2>
          <p className="muted">
            把课程中的串口、TCP、HTTP、MFC、C++、SQLite、INI、多线程整合成一个真实可开发的 Windows
            工具。
          </p>
        </div>
        <span className="badge">自评完成度 {percent}%</span>
      </section>
      <Card>
        <h3>项目目标</h3>
        <p>
          完成一个包含串口调试、TCP Client、TCP Server、HTTP 请求测试、SQLite 参数保存、INI
          配置读写、日志窗口和多线程任务处理的 Windows MFC 工具。
        </p>
        <div className="badge-list">
          {modules.map((m) => (
            <span className="badge" key={m}>
              {m}
            </span>
          ))}
        </div>
      </Card>
      <CapstoneArchitectureDiagram />
      <Card>
        <h3>开发步骤</h3>
        <ol className="step-list">
          {steps.map((s, i) => (
            <li key={s}>
              <strong>Step {i + 1}</strong>
              <span>{s}</span>
            </li>
          ))}
        </ol>
      </Card>
      <Card>
        <div className="diagram-head compact-head">
          <div>
            <div className="eyebrow">Local Practice Bridge</div>
            <h3>从网页实验进入本地 MFC 实战</h3>
          </div>
          <Link className="button" to="/practice">
            打开本地实战桥接
          </Link>
        </div>
        <p className="muted">
          根据文档要求，浏览器只做概念模拟；真实串口、Socket、SQLite 和 MFC 控件事件需要在 Windows +
          Visual Studio 中完成。
        </p>
        <div className="file-tree compact-file-tree">
          {recommendedProjectFiles.slice(0, 5).map((file) => (
            <div className="file-row" key={file.path}>
              <code>{file.path}</code>
              <span>{file.purpose}</span>
            </div>
          ))}
        </div>
      </Card>
      <Card>
        <h3>项目 Rubric 评分表</h3>
        <table className="rubric-table">
          <tbody>
            {capstoneRubric.map((row) => (
              <tr key={row.item}>
                <td>
                  <strong>{row.item}</strong>
                  <p className="muted">{row.detail}</p>
                </td>
                <td>{row.score} 分</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
      <Card>
        <h3>验收清单 / 自评打分：{percent}%</h3>
        <div className="progress-bar">
          <span style={{ width: `${percent}%` }} />
        </div>
        <h4>必须完成</h4>
        {required.map((item) => (
          <label className="check-row" key={item}>
            <input
              type="checkbox"
              checked={progress.capstoneChecks.includes(item)}
              onChange={() => toggleCapstoneCheck(item)}
            />{' '}
            {item}
          </label>
        ))}
        <h4>加分项</h4>
        {bonus.map((item) => (
          <label className="check-row" key={item}>
            <input
              type="checkbox"
              checked={progress.capstoneChecks.includes(item)}
              onChange={() => toggleCapstoneCheck(item)}
            />{' '}
            {item}
          </label>
        ))}
      </Card>
    </div>
  );
}
