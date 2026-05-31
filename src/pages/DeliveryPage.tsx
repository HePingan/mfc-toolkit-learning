import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useProgress } from '../hooks/useProgress';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { modules } from '../data/modules';
import { labs } from '../data/labs';
import { capstoneRubric, practiceTemplates, recommendedProjectFiles, visualStudioChecklist } from '../data/practice';
import { achievementSummary } from '../data/achievements';
import { evidenceSummary, evidenceTemplate, type EvidenceItem } from '../data/evidence';
import { downloadMarkdown } from '../utils/download';
import { storageKeys } from '../data/storageKeys';

type DeliveryState = {
  projectName: string;
  owner: string;
  techStack: string;
  localEvidence: Record<string, string>;
  knownIssues: string;
  nextSteps: string;
};

type EvidenceState = { items: EvidenceItem[] };

const defaultState: DeliveryState = {
  projectName: 'MFC 通用工业通讯调试工具',
  owner: '学习者 / 项目负责人',
  techStack: 'C++17、MFC Dialog、Win32 Serial、WinSock、WinHTTP、SQLite、INI、Visual Studio、Windows',
  localEvidence: {},
  knownIssues: '真实设备、真实串口和现场网络环境需要在 Windows 本地继续补充验证。',
  nextSteps: '扩展协议插件、日志导出、设备配置管理、脚本化测试和安装包。',
};

const deliverySections = [
  { id: 'readme', title: '项目 README', route: '/portfolio', hint: '项目简介、技术栈、功能模块、个人贡献' },
  { id: 'source-tree', title: '源码目录说明', route: '/codegen', hint: '推荐 .h/.cpp、resource.h、配置文件与 docs' },
  { id: 'integration', title: '本地集成记录', route: '/integration', hint: 'Visual Studio 导入、DDX、Message Map、依赖配置' },
  { id: 'acceptance', title: '验收清单', route: '/build-checklist', hint: '串口/TCP/HTTP/SQLite/INI/线程/日志验收证据' },
  { id: 'defense', title: '答辩准备', route: '/exam', hint: '问答记录、证据链接、薄弱点补强' },
  { id: 'demo', title: '演示证据', route: '/demo-script', hint: '演示脚本、截图、运行日志、彩排缺口' },
];

type DeliveryQuality = {
  score: number;
  level: string;
  learningScore: number;
  labScore: number;
  evidenceScore: number;
  acceptanceScore: number;
  presentationScore: number;
};

type DeliveryGap = {
  id: string;
  title: string;
  route: string;
  why: string;
  evidence: string;
  severity: '高' | '中' | '低';
};

const criticalEvidenceGaps: DeliveryGap[] = [
  { id: 'serial-log', title: '串口收发日志截图', route: '/build-checklist', severity: '高', why: '串口是上位机项目最核心的现场通讯能力，没有收发日志会让项目停留在界面展示。', evidence: 'COM 参数截图、ASCII/HEX 发送截图、接收日志、异常提示截图。' },
  { id: 'tcp-log', title: 'TCP 连接/断开截图', route: '/integration', severity: '高', why: 'TCP Client/Server 能证明网络通讯和线程回调链路已经跑通。', evidence: '连接成功、发送接收、断开重连、错误日志四类截图。' },
  { id: 'vs-build', title: 'Visual Studio 编译成功截图', route: '/build-checklist', severity: '高', why: '交付包必须证明代码能在 Windows + Visual Studio + MFC 本地编译运行。', evidence: '生成成功输出、Debug x64 配置、主 Dialog 运行截图。' },
  { id: 'sqlite-ini', title: 'SQLite/INI 参数持久化证据', route: '/practice', severity: '中', why: '工业工具需要保存设备参数和历史记录，持久化证据能体现工程完整性。', evidence: 'app.ini 示例、SQLite 表结构、重启后参数恢复截图。' },
  { id: 'demo-gap', title: '演示稿证据缺口', route: '/demo-script', severity: '中', why: '演示稿如果没有证据路径，面试或验收时很难快速定位素材。', evidence: '每个演示步骤至少填写一条截图、源码路径或运行日志。' },
  { id: 'defense-note', title: '答辩问答记录', route: '/exam', severity: '低', why: '答辩记录能把项目亮点、边界和常见追问提前准备好。', evidence: '随机答辩题回答、证据链接、未掌握问题的补强记录。' },
];

function scoreLevel(score: number) {
  if (score >= 85) return '可提交';
  if (score >= 65) return '需补证据';
  return '仅草稿';
}

function calculateDeliveryQuality(args: { overallPercent: number; completedLabCount: number; completedQuizCount: number; quizModuleCount: number; evidenceCount: number; }) : DeliveryQuality {
  const learningScore = Math.min(20, Math.round(args.overallPercent * 0.2));
  const labScore = Math.min(20, Math.round((args.completedLabCount / Math.max(1, labs.length)) * 20));
  const evidenceScore = Math.min(30, Math.round((args.evidenceCount / deliverySections.length) * 30));
  const acceptanceScore = Math.min(20, Math.round(((args.evidenceCount >= 4 ? 0.55 : args.evidenceCount / 8) + (args.completedLabCount / Math.max(1, labs.length)) * 0.45) * 20));
  const presentationEvidence = ['defense', 'demo'].filter((id) => id in defaultState.localEvidence).length;
  void presentationEvidence;
  const presentationScore = Math.min(10, Math.round((args.completedQuizCount / Math.max(1, args.quizModuleCount)) * 5 + (args.evidenceCount >= 5 ? 5 : args.evidenceCount)));
  const score = Math.min(100, learningScore + labScore + evidenceScore + acceptanceScore + presentationScore);
  return { score, level: scoreLevel(score), learningScore, labScore, evidenceScore, acceptanceScore, presentationScore };
}

function buildGapList(state: DeliveryState, quality: DeliveryQuality): DeliveryGap[] {
  const gaps: DeliveryGap[] = [];
  if (!state.localEvidence.acceptance?.trim()) gaps.push(criticalEvidenceGaps[2]);
  if (!state.localEvidence.integration?.trim()) gaps.push(criticalEvidenceGaps[1]);
  if (!state.localEvidence.demo?.trim()) gaps.push(criticalEvidenceGaps[4]);
  if (!state.localEvidence.defense?.trim()) gaps.push(criticalEvidenceGaps[5]);
  if (!state.localEvidence['source-tree']?.trim()) gaps.push({ ...criticalEvidenceGaps[3], id: 'source-tree-gap', title: '源码目录与关键文件说明', route: '/codegen', evidence: 'MfcToolkitDlg、SerialManager、TcpClient、HttpClient、ConfigStore、Logger、WorkerThread 文件路径说明。' });
  if (quality.score < 85 && !gaps.some((gap) => gap.id === 'serial-log')) gaps.unshift(criticalEvidenceGaps[0]);
  return gaps.slice(0, 5);
}

function sectionEvidence(state: DeliveryState, id: string) {
  return state.localEvidence[id]?.trim() || '（待补充：截图路径、源码路径、运行日志、导出的 Markdown 或本地验收记录）';
}

function buildDeliveryMarkdown(state: DeliveryState, overallPercent: number, unlockedCount: number, totalAchievements: number, quality: DeliveryQuality, gaps: DeliveryGap[]) {
  const completedLabs = labs.filter((lab) => false);
  void completedLabs;
  return `# ${state.projectName} 交付说明

- 负责人：${state.owner}
- 导出时间：${new Date().toLocaleString()}
- 技术栈：${state.techStack}
- 学习平台进度：${overallPercent}%
- 成就徽章：${unlockedCount}/${totalAchievements}
- 交付质量：${quality.score}/100（${quality.level}）

## 交付质量评分

- 学习进度：${quality.learningScore}/20
- 实验完成：${quality.labScore}/20
- 证据完整：${quality.evidenceScore}/30
- 验收覆盖：${quality.acceptanceScore}/20
- 答辩/演示准备：${quality.presentationScore}/10

## 当前缺口

${gaps.length ? gaps.map((gap, index) => `${index + 1}. ${gap.title}（${gap.severity}）\n   - 关联页面：${gap.route}\n   - 为什么重要：${gap.why}\n   - 推荐证据：${gap.evidence}`).join('\n') : '暂无关键缺口，可以进入最终提交检查。'}

## 修复建议

- 优先补齐 Visual Studio 编译成功截图和主 Dialog 运行截图。
- 每个通讯模块至少保留一张参数截图和一段运行日志。
- 演示稿中的每个步骤都写入截图文件名、源码路径或导出文档路径。
- 答辩训练保留问答记录，用于解释项目边界和工程取舍。

## 提交前最终检查

- [ ] README 可独立说明项目目标、技术栈和核心功能。
- [ ] 源码目录能对应 UI、通讯、数据、日志、线程模块。
- [ ] Windows + Visual Studio + MFC 本地运行证据已补齐。
- [ ] 串口/TCP/HTTP/SQLite/INI 至少各有一条验收证据。
- [ ] 演示稿与答辩记录已经导出。

## 1. 项目简介

本项目面向工业上位机/调试工具场景，使用 C++ / MFC Dialog 构建一个通用通讯调试工具。核心目标是把串口、TCP Client/Server、HTTP 请求、SQLite/INI 参数保存、日志、多线程和现场排错流程整合到一个可演示、可维护、可扩展的 Windows 本地工程中。

## 2. 功能模块

${modules.map((module, index) => `${index + 1}. ${module.title}：${module.description}`).join('\n')}

## 3. 推荐源码目录

${recommendedProjectFiles.map((file) => `- \`${file.path}\`：${file.purpose}`).join('\n')}

## 4. Visual Studio / MFC 环境准备

${visualStudioChecklist.map((item) => `- [ ] ${item}`).join('\n')}

## 5. 本地 MFC 实战模板

${practiceTemplates.map((template) => `### ${template.title}\n\n- 阶段：${template.stage}\n- 目标：${template.goal}\n- 关键文件：${template.files.join('、')}\n- 验收点：${template.checks.join('；')}`).join('\n\n')}

## 6. 验收评分清单

${capstoneRubric.map((item) => `- [ ] ${item.item}（${item.score} 分）：${item.detail}`).join('\n')}

## 7. 交付证据索引

${deliverySections.map((section) => `### ${section.title}\n\n- 关联页面：${section.route}\n- 应提供：${section.hint}\n- 我的证据：\n${sectionEvidence(state, section.id)}`).join('\n\n')}

## 8. 答辩与演示准备

- 打开 /exam 完成随机答辩题，记录回答和证据。
- 打开 /demo-script 生成 3/5/10/15 分钟演示稿，并补齐每一步截图、日志、源码路径。
- 演示时说明边界：浏览器页面用于学习、生成和组织材料；真实串口/TCP/SQLite/MFC 运行证明来自 Windows + Visual Studio 本地工程。

## 9. 已知问题

${state.knownIssues || '（未填写）'}

## 10. 后续扩展

${state.nextSteps || '（未填写）'}
`;
}

export function DeliveryPage() {
  const { progress, overallPercent } = useProgress();
  const achievements = achievementSummary(progress);
  const [state, setState] = useLocalStorage<DeliveryState>(storageKeys.deliveryPackage, defaultState);
  const [evidenceState] = useLocalStorage<EvidenceState>(storageKeys.evidenceLibrary, { items: evidenceTemplate });
  const [previewOpen, setPreviewOpen] = useState(false);
  const sharedEvidence = evidenceSummary(evidenceState.items);
  const completedLabCount = progress.completedLabs.length;
  const completedModuleCount = progress.completedModules.length;
  const completedQuizCount = Object.keys(progress.quizScores).length;
  const quizModuleCount = new Set(modules.map((module) => module.quizId)).size;
  const evidenceCount = deliverySections.filter((section) => state.localEvidence[section.id]?.trim()).length;
  const quality = calculateDeliveryQuality({ overallPercent, completedLabCount, completedQuizCount, quizModuleCount, evidenceCount });
  const gaps = buildGapList(state, quality);
  const packageCompleteness = Math.round(((completedModuleCount / modules.length) * 0.25 + (completedLabCount / labs.length) * 0.25 + (completedQuizCount / Math.max(1, quizModuleCount)) * 0.15 + (evidenceCount / deliverySections.length) * 0.35) * 100);
  const markdown = useMemo(() => buildDeliveryMarkdown(state, overallPercent, achievements.unlockedCount, achievements.total, quality, gaps), [state, overallPercent, achievements.unlockedCount, achievements.total, quality, gaps]);

  const updateEvidence = (id: string, value: string) => setState({ ...state, localEvidence: { ...state.localEvidence, [id]: value } });
  const fillEvidenceTodo = (id: string, hint: string) => updateEvidence(id, state.localEvidence[id]?.trim() || `- ${hint}：待补充\n- 截图路径：\n- 源码路径：\n- 运行日志：\n- 导出文件：`);
  const fillFinalTemplates = () => setState({
    ...state,
    localEvidence: {
      ...state.localEvidence,
      readme: state.localEvidence.readme?.trim() || '- README.md：待补充项目目标/技术栈/功能模块/个人贡献\n- 项目截图：\n- 导出作品集：',
      'source-tree': state.localEvidence['source-tree']?.trim() || '- MfcToolkitDlg.h/.cpp：主界面与消息映射\n- SerialManager/TcpClient/HttpClient：通讯模块\n- ConfigStore/Logger/WorkerThread：配置、日志、线程\n- docs/：验收截图与说明',
      integration: state.localEvidence.integration?.trim() || '- Visual Studio 导入截图：\n- DDX/Message Map 绑定截图：\n- 依赖配置截图：\n- 编译输出：',
      acceptance: state.localEvidence.acceptance?.trim() || '- Visual Studio 编译成功截图：\n- 主 Dialog 运行截图：\n- 串口收发日志：\n- TCP/HTTP 请求响应日志：\n- SQLite/INI 参数持久化证据：',
      defense: state.localEvidence.defense?.trim() || '- 答辩记录 Markdown：\n- 关键追问回答：\n- 证据链接/截图路径：',
      demo: state.localEvidence.demo?.trim() || '- 3/5/10 分钟演示稿：\n- 彩排记录：\n- 每步截图/源码路径/运行日志：',
    },
  });

  return (
    <div>
      <section className="hero delivery-hero">
        <div className="eyebrow">delivery-package-v1 · delivery-quality-v2 · Final Project Package</div>
        <h2>项目交付包生成器</h2>
        <p>把学习进度、源码目录、Visual Studio/MFC 实战记录、验收清单、答辩准备和演示证据整理成一份可提交的 Markdown 交付包。</p>
        <div className="form-row">
          <Link className="button button-primary" to="/portfolio">作品集素材</Link>
          <Link className="button button-ghost" to="/demo-script">演示稿</Link>
          <Link className="button button-ghost" to="/exam">答辩训练</Link>
          <Link className="button button-ghost" to="/submit-rehearsal">提交演练</Link>
          <Link className="button button-ghost" to="/evidence">证据素材库</Link>
          <Button className="button-ghost" onClick={() => downloadMarkdown('mfc-project-delivery-package.md', markdown)}>{quality.score >= 85 ? '导出交付包' : '先导出草稿'}</Button>
        </div>
      </section>

      <section className="delivery-summary-grid">
        <Card><strong>{overallPercent}%</strong><span>学习进度</span><p className="muted">来自 Dashboard localStorage</p></Card>
        <Card className="delivery-readiness-score"><strong>{quality.score}</strong><span>交付质量</span><p className="muted">{quality.level} · 100 分制</p></Card>
        <Card><strong>{packageCompleteness}%</strong><span>交付完整度</span><p className="muted">进度 + 证据填写综合估算</p></Card>
        <Card><strong>{completedLabCount}/{labs.length}</strong><span>实验完成</span><p className="muted">用于佐证工程能力</p></Card>
        <Card><strong>{achievements.unlockedCount}/{achievements.total}</strong><span>成就徽章</span><p className="muted">可写入作品集</p></Card>
        <Card><strong>{sharedEvidence.percent}%</strong><span>证据库</span><p className="muted">{sharedEvidence.ready}/{sharedEvidence.total} 可提交</p></Card>
      </section>

      <Card className="delivery-evidence-library-card">
        <div className="diagram-head compact-head">
          <div><div className="eyebrow">android-v7-evidence-library · shared-evidence-index</div><h3>统一证据素材库</h3></div>
          <span className="badge">下一项：{sharedEvidence.next?.title ?? '全部完成'}</span>
        </div>
        <p className="muted">证据库用于集中维护截图、日志、源码、Markdown 和配置路径；交付包只负责汇总，真实运行证明仍来自 Windows + Visual Studio + MFC 本地工程。</p>
        <div className="dashboard-readiness-meter"><i style={{ width: `${sharedEvidence.percent}%` }} /></div>
        <div className="form-row">
          <Link className="button button-primary" to="/evidence">打开证据素材库</Link>
          <Link className="button button-ghost" to="/submit-rehearsal">提交演练</Link>
        </div>
      </Card>

      <Card className="delivery-final-five-card">
        <div className="diagram-head compact-head">
          <div><div className="eyebrow">Android v5 · final-submit-five</div><h3>提交前最后 5 项</h3></div>
          <Button className="button-ghost" onClick={fillFinalTemplates}>一键填充模板</Button>
        </div>
        <div className="delivery-final-five-grid">
          <span>编译截图</span><span>主界面截图</span><span>通讯日志</span><span>README/源码</span><span>演示/答辩</span>
        </div>
        <p className="muted">低于 85 分时优先补这 5 类证据；补完后再下载正式交付包。</p>
        <div className="form-row">
          <Link className="button button-primary" to="/submit-rehearsal">进入真实提交演练</Link>
          <Link className="button button-ghost" to="/build-checklist">补编译证据</Link>
        </div>
      </Card>

      <section className="delivery-quality-panel">
        <Card className="delivery-score-card">
          <div className="diagram-head compact-head">
            <div><div className="eyebrow">delivery-readiness-score</div><h3>交付质量评分</h3></div>
            <span className="badge">{quality.level}</span>
          </div>
          <div className="delivery-score-main"><strong>{quality.score}</strong><span>/ 100</span></div>
          <div className="delivery-score-bars">
            <div><span>学习进度 {quality.learningScore}/20</span><i style={{ width: `${quality.learningScore / 20 * 100}%` }} /></div>
            <div><span>实验完成 {quality.labScore}/20</span><i style={{ width: `${quality.labScore / 20 * 100}%` }} /></div>
            <div><span>证据完整 {quality.evidenceScore}/30</span><i style={{ width: `${quality.evidenceScore / 30 * 100}%` }} /></div>
            <div><span>验收覆盖 {quality.acceptanceScore}/20</span><i style={{ width: `${quality.acceptanceScore / 20 * 100}%` }} /></div>
            <div><span>答辩/演示 {quality.presentationScore}/10</span><i style={{ width: `${quality.presentationScore / 10 * 100}%` }} /></div>
          </div>
        </Card>

        <Card className="delivery-gap-wizard">
          <div className="diagram-head compact-head">
            <div><div className="eyebrow">delivery-gap-wizard</div><h3>缺口修复向导</h3></div>
            <span className="badge">优先补 {gaps.length} 项</span>
          </div>
          {gaps.length ? <div className="delivery-gap-list">
            {gaps.map((gap) => (
              <div className="delivery-gap-item" key={gap.id}>
                <div><strong>{gap.title}</strong><span className="badge badge-warning">{gap.severity}</span></div>
                <p>{gap.why}</p>
                <small>推荐证据：{gap.evidence}</small>
                <Link className="button button-ghost" to={gap.route}>去补证据</Link>
              </div>
            ))}
          </div> : <p className="success-text">暂无关键缺口，可以导出交付包并进行最终提交检查。</p>}
        </Card>
      </section>

      <Card className="delivery-config-card">
        <div className="diagram-head compact-head">
          <div><div className="eyebrow">Package Settings</div><h3>交付包基础信息</h3></div>
          <span className="badge">浏览器本地生成 · 不上传后端</span>
        </div>
        <div className="delivery-form-grid">
          <label>项目名称
            <input value={state.projectName} onChange={(event) => setState({ ...state, projectName: event.target.value })} />
          </label>
          <label>负责人 / 角色
            <input value={state.owner} onChange={(event) => setState({ ...state, owner: event.target.value })} />
          </label>
          <label>技术栈
            <textarea rows={3} value={state.techStack} onChange={(event) => setState({ ...state, techStack: event.target.value })} />
          </label>
        </div>
      </Card>

      <section className="delivery-layout">
        <Card className="delivery-evidence-card">
          <div className="diagram-head compact-head">
            <div><div className="eyebrow">Evidence Index</div><h3>交付证据清单</h3></div>
            <span className="badge">{deliverySections.filter((section) => state.localEvidence[section.id]?.trim()).length}/{deliverySections.length} 已填写</span>
          </div>
          <div className="delivery-section-grid">
            {deliverySections.map((section) => (
              <div className="delivery-section-item" key={section.id}>
                <div className="delivery-section-head">
                  <div><strong>{section.title}</strong><small>{section.hint}</small></div>
                  <Link className="button button-ghost" to={section.route}>打开</Link>
                </div>
                <textarea rows={4} value={state.localEvidence[section.id] ?? ''} onChange={(event) => updateEvidence(section.id, event.target.value)} placeholder="填写截图路径、源码路径、运行日志、导出的 Markdown 或验收记录" />
                <Button className="button-ghost" onClick={() => fillEvidenceTodo(section.id, section.hint)}>生成待办模板</Button>
              </div>
            ))}
          </div>
        </Card>

        <Card className="delivery-readiness-card">
          <div className="eyebrow">Readiness</div>
          <h3>交付前检查</h3>
          <ul className="delivery-check-list">
            <li>README 是否说明项目目标、技术栈和核心模块</li>
            <li>源码目录是否能对应到 Dialog、通讯、存储、日志、线程</li>
            <li>是否有 Windows + Visual Studio + MFC 本地运行证据</li>
            <li>是否补齐串口、TCP、HTTP、SQLite/INI、线程稳定性验收截图</li>
            <li>是否完成答辩随机题和演示稿彩排</li>
          </ul>
          <label className="field-label">已知问题
            <textarea rows={4} value={state.knownIssues} onChange={(event) => setState({ ...state, knownIssues: event.target.value })} />
          </label>
          <label className="field-label">后续扩展
            <textarea rows={4} value={state.nextSteps} onChange={(event) => setState({ ...state, nextSteps: event.target.value })} />
          </label>
        </Card>
      </section>

      <Card className={`delivery-preview-card ${previewOpen ? 'is-open' : 'is-collapsed'}`}>
        <div className="diagram-head compact-head">
          <div><div className="eyebrow">Markdown Preview</div><h3>交付包预览</h3></div>
          <div className="form-row preview-actions">
            <Button className="button-ghost" onClick={() => setPreviewOpen((value) => !value)}>{previewOpen ? '收起预览' : '展开预览'}</Button>
            <Button className="button-ghost" onClick={() => downloadMarkdown('mfc-project-delivery-package.md', markdown)}>下载 Markdown</Button>
          </div>
        </div>
        {previewOpen ? <pre>{markdown}</pre> : <p className="muted">移动端默认收起长 Markdown，避免预览占满屏幕。需要检查内容时再展开。</p>}
      </Card>

      <Card className="delivery-boundary-card">
        <div className="eyebrow">Boundary</div>
        <h3>交付包不是自动运行证明</h3>
        <p>本页面负责组织和导出材料。真实串口、TCP、SQLite、INI、MFC Dialog、编译运行截图和日志仍需要在 Windows + Visual Studio + MFC 本地工程中完成并填入证据区。</p>
      </Card>
    </div>
  );
}
