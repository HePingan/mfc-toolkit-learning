export type EvidenceStatus = 'missing' | 'draft' | 'ready';
export type EvidenceType = '截图' | '日志' | '源码' | 'Markdown' | '配置文件' | '其他';

export type EvidenceItem = {
  id: string;
  title: string;
  type: EvidenceType;
  module: string;
  path: string;
  note: string;
  status: EvidenceStatus;
  linkedSubmitIds: string[];
};

export const evidenceTypes: Array<'全部' | EvidenceType> = ['全部', '截图', '日志', '源码', 'Markdown', '配置文件', '其他'];

export const evidenceTemplate: EvidenceItem[] = [
  { id: 'readme-md', title: 'README.md 项目说明', type: 'Markdown', module: '交付', path: '', note: '项目目标、技术栈、功能模块、个人贡献、边界说明。', status: 'missing', linkedSubmitIds: ['readme'] },
  { id: 'source-tree-shot', title: '源码目录截图', type: '截图', module: '源码', path: '', note: 'MfcToolkitDlg、SerialManager、TcpClient、HttpClient、ConfigStore、Logger、WorkerThread。', status: 'missing', linkedSubmitIds: ['source-tree'] },
  { id: 'vs-build-success', title: 'Visual Studio 编译成功截图', type: '截图', module: '构建', path: '', note: 'Debug/Release x64 生成成功输出。', status: 'missing', linkedSubmitIds: ['vs-build'] },
  { id: 'main-dialog-run', title: '主 Dialog 运行截图', type: '截图', module: 'MFC UI', path: '', note: '主窗口、Tab、参数区、发送区、日志区。', status: 'missing', linkedSubmitIds: ['main-dialog'] },
  { id: 'serial-log', title: '串口收发日志', type: '日志', module: '串口', path: '', note: 'COM 参数、ASCII/HEX 发送、接收日志、异常提示。', status: 'missing', linkedSubmitIds: ['serial-tcp-http'] },
  { id: 'tcp-log', title: 'TCP 连接/断开日志', type: '日志', module: 'TCP', path: '', note: '连接成功、发送接收、断开重连、错误日志。', status: 'missing', linkedSubmitIds: ['serial-tcp-http'] },
  { id: 'http-log', title: 'HTTP 请求响应日志', type: '日志', module: 'HTTP', path: '', note: 'GET/POST、Header、Body、状态码、响应内容。', status: 'missing', linkedSubmitIds: ['serial-tcp-http'] },
  { id: 'sqlite-table', title: 'SQLite 表结构截图', type: '截图', module: 'SQLite/INI', path: '', note: '设备表、历史记录表、查询结果。', status: 'missing', linkedSubmitIds: ['sqlite-ini'] },
  { id: 'ini-config', title: 'app.ini 配置文件', type: '配置文件', module: 'SQLite/INI', path: '', note: '串口号、IP、端口、默认参数保存。', status: 'missing', linkedSubmitIds: ['sqlite-ini'] },
  { id: 'demo-script-md', title: '演示稿 Markdown', type: 'Markdown', module: '演示', path: '', note: '3/5/10 分钟讲解稿和彩排记录。', status: 'missing', linkedSubmitIds: ['demo-script'] },
  { id: 'defense-record-md', title: '答辩训练记录', type: 'Markdown', module: '答辩', path: '', note: '问答记录、证据链接、未掌握问题补强。', status: 'missing', linkedSubmitIds: ['defense-record'] },
];

export function normalizeEvidence(items: EvidenceItem[]) {
  return evidenceTemplate.map((template) => ({ ...template, ...(items.find((item) => item.id === template.id) ?? {}) }));
}

export function evidenceSummary(items: EvidenceItem[]) {
  const normalized = normalizeEvidence(items);
  const ready = normalized.filter((item) => item.status === 'ready').length;
  const draft = normalized.filter((item) => item.status === 'draft').length;
  const missing = normalized.filter((item) => item.status === 'missing').length;
  const percent = Math.round(((ready + draft * 0.5) / Math.max(1, normalized.length)) * 100);
  const next = normalized.find((item) => item.status !== 'ready') ?? normalized[0];
  return { items: normalized, ready, draft, missing, total: normalized.length, percent, next };
}

export function evidenceForSubmit(items: EvidenceItem[], submitId: string) {
  return normalizeEvidence(items).filter((item) => item.linkedSubmitIds.includes(submitId));
}

export function exportEvidenceMarkdown(items: EvidenceItem[]) {
  const summary = evidenceSummary(items);
  return `# MFC 项目证据素材索引\n\n- 导出时间：${new Date().toLocaleString()}\n- 证据完整度：${summary.percent}%\n- 可提交：${summary.ready}/${summary.total}\n- 草稿：${summary.draft}/${summary.total}\n- 缺失：${summary.missing}/${summary.total}\n\n## 证据列表\n\n${summary.items.map((item, index) => `### ${index + 1}. ${item.title}\n\n- 类型：${item.type}\n- 模块：${item.module}\n- 状态：${item.status === 'ready' ? '可提交' : item.status === 'draft' ? '草稿' : '缺失'}\n- 关联提交项：${item.linkedSubmitIds.join('、')}\n- 文件路径/说明：${item.path || '（未填写）'}\n- 备注：${item.note || '（未填写）'}`).join('\n\n')}\n`;
}
