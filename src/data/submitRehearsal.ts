export type SubmitEvidenceStatus = 'missing' | 'draft' | 'ready';

export type SubmitEvidenceItem = {
  id: string;
  title: string;
  route: string;
  required: string;
  proof: string;
  status: SubmitEvidenceStatus;
  note: string;
};

export const submitEvidenceTemplate: SubmitEvidenceItem[] = [
  { id: 'readme', title: 'README 项目说明', route: '/portfolio', required: '项目目标、技术栈、模块清单、个人贡献、运行边界', proof: 'README.md、项目截图、作品集导出', status: 'missing', note: '' },
  { id: 'source-tree', title: '源码目录与关键文件', route: '/codegen', required: 'Dialog、通讯、数据、日志、线程模块能对应到 .h/.cpp', proof: '工程目录截图、关键文件路径、代码骨架 ZIP', status: 'missing', note: '' },
  { id: 'vs-build', title: 'Visual Studio 编译截图', route: '/build-checklist', required: 'Windows + Visual Studio + MFC 本地生成成功', proof: 'Debug/Release x64 生成成功输出、主工程配置截图', status: 'missing', note: '' },
  { id: 'main-dialog', title: '主界面运行截图', route: '/designer', required: 'MFC Dialog 主窗口、Tab/按钮/日志区可见', proof: '主 Dialog 运行截图、控件 ID 表、事件绑定截图', status: 'missing', note: '' },
  { id: 'serial-tcp-http', title: '串口 / TCP / HTTP 日志', route: '/integration', required: '核心通讯链路至少各有一条收发或请求响应证据', proof: '串口收发、TCP 连接断开、HTTP GET/POST 响应日志', status: 'missing', note: '' },
  { id: 'sqlite-ini', title: 'SQLite / INI 持久化证据', route: '/practice', required: '参数保存、重启恢复、历史记录或设备表可证明', proof: 'app.ini、SQLite 表结构、重启后参数恢复截图', status: 'missing', note: '' },
  { id: 'demo-script', title: '项目演示稿', route: '/demo-script', required: '3/5/10 分钟演示流程和每步证据路径', proof: 'mfc-demo-script.md、彩排记录、截图列表', status: 'missing', note: '' },
  { id: 'defense-record', title: '答辩训练记录', route: '/exam', required: '能解释技术选型、工程边界、常见追问和验收证据', proof: 'mfc-exam-defense-drills.md、问答记录、未掌握问题补强计划', status: 'missing', note: '' },
];

export function submitReadiness(items: SubmitEvidenceItem[]) {
  const ready = items.filter((item) => item.status === 'ready').length;
  const draft = items.filter((item) => item.status === 'draft').length;
  const missing = items.filter((item) => item.status === 'missing').length;
  const percent = Math.round(((ready + draft * 0.5) / Math.max(1, items.length)) * 100);
  const next = items.find((item) => item.status !== 'ready') ?? items[0];
  return { ready, draft, missing, total: items.length, percent, next };
}

export function exportSubmitMarkdown(items: SubmitEvidenceItem[]) {
  const score = submitReadiness(items);
  return `# MFC 项目提交演练清单\n\n- 导出时间：${new Date().toLocaleString()}\n- 提交准备度：${score.percent}%\n- 已就绪：${score.ready}/${score.total}\n- 草稿：${score.draft}/${score.total}\n- 缺失：${score.missing}/${score.total}\n\n## 提交项\n\n${items.map((item, index) => `### ${index + 1}. ${item.title}\n\n- 状态：${item.status === 'ready' ? '已就绪' : item.status === 'draft' ? '草稿' : '缺失'}\n- 关联页面：${item.route}\n- 验收要求：${item.required}\n- 证据建议：${item.proof}\n- 我的备注：${item.note || '（未填写）'}`).join('\n\n')}\n`;
}
