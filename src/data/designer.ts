export type MfcControlType =
  | 'Button'
  | 'Edit'
  | 'ComboBox'
  | 'ListBox'
  | 'Static'
  | 'Tab'
  | 'GroupBox'
  | 'CheckBox';

export type MfcDialogControl = {
  id: string;
  type: MfcControlType;
  text: string;
  x: number;
  y: number;
  w: number;
  h: number;
  event?: string;
  note: string;
};

export type MfcDialogPreset = {
  id: string;
  title: string;
  description: string;
  size: { w: number; h: number };
  controls: MfcDialogControl[];
};

export const mfcDialogPresets: MfcDialogPreset[] = [
  {
    id: 'toolkit-basic',
    title: '通用工具主界面',
    description: '适合串口/TCP/HTTP/配置工具的基础 Dialog 布局。',
    size: { w: 720, h: 460 },
    controls: [
      {
        id: 'IDC_TAB_MAIN',
        type: 'Tab',
        text: 'Serial | TCP | HTTP | Config',
        x: 18,
        y: 18,
        w: 450,
        h: 260,
        note: '主功能分页，建议每类通讯一个 Tab。',
      },
      {
        id: 'IDC_GROUP_SERIAL',
        type: 'GroupBox',
        text: '串口参数',
        x: 32,
        y: 52,
        w: 190,
        h: 120,
        note: '放置端口、波特率、打开按钮。',
      },
      {
        id: 'IDC_COMBO_SERIAL_PORT',
        type: 'ComboBox',
        text: 'COM3',
        x: 48,
        y: 82,
        w: 76,
        h: 24,
        note: '串口号选择。',
      },
      {
        id: 'IDC_COMBO_SERIAL_BAUD',
        type: 'ComboBox',
        text: '9600',
        x: 136,
        y: 82,
        w: 70,
        h: 24,
        note: '波特率选择。',
      },
      {
        id: 'IDC_BTN_SERIAL_OPEN',
        type: 'Button',
        text: '打开串口',
        x: 48,
        y: 122,
        w: 76,
        h: 28,
        event: 'OnBnClickedSerialOpen',
        note: '打开/关闭串口按钮。',
      },
      {
        id: 'IDC_BTN_SERIAL_SEND',
        type: 'Button',
        text: '发送',
        x: 136,
        y: 122,
        w: 70,
        h: 28,
        event: 'OnBnClickedSerialSend',
        note: '发送串口数据。',
      },
      {
        id: 'IDC_EDIT_SEND',
        type: 'Edit',
        text: '输入发送内容',
        x: 240,
        y: 64,
        w: 200,
        h: 70,
        note: '发送内容输入区。',
      },
      {
        id: 'IDC_CHECK_HEX',
        type: 'CheckBox',
        text: 'HEX',
        x: 240,
        y: 144,
        w: 60,
        h: 22,
        note: '切换 ASCII/HEX。',
      },
      {
        id: 'IDC_LIST_LOG',
        type: 'ListBox',
        text: '日志输出',
        x: 18,
        y: 300,
        w: 680,
        h: 120,
        note: '统一日志列表。',
      },
      {
        id: 'IDC_STATIC_STATUS',
        type: 'Static',
        text: 'Ready',
        x: 500,
        y: 22,
        w: 190,
        h: 24,
        note: '状态栏。',
      },
      {
        id: 'IDC_BTN_CLEAR_LOG',
        type: 'Button',
        text: '清空日志',
        x: 590,
        y: 252,
        w: 90,
        h: 30,
        event: 'OnBnClickedClearLog',
        note: '清空日志。',
      },
    ],
  },
  {
    id: 'tcp-http-panel',
    title: 'TCP/HTTP 调试面板',
    description: '适合网络通讯测试工具，突出 Host/Port/URL/Body/Response。',
    size: { w: 720, h: 460 },
    controls: [
      {
        id: 'IDC_GROUP_TCP',
        type: 'GroupBox',
        text: 'TCP Client',
        x: 18,
        y: 18,
        w: 320,
        h: 150,
        note: 'TCP 客户端参数区。',
      },
      {
        id: 'IDC_EDIT_TCP_HOST',
        type: 'Edit',
        text: '127.0.0.1',
        x: 38,
        y: 52,
        w: 130,
        h: 24,
        note: 'TCP 目标地址。',
      },
      {
        id: 'IDC_EDIT_TCP_PORT',
        type: 'Edit',
        text: '502',
        x: 178,
        y: 52,
        w: 60,
        h: 24,
        note: 'TCP 端口。',
      },
      {
        id: 'IDC_BTN_TCP_CONNECT',
        type: 'Button',
        text: '连接',
        x: 248,
        y: 50,
        w: 70,
        h: 28,
        event: 'OnBnClickedTcpConnect',
        note: '建立连接。',
      },
      {
        id: 'IDC_EDIT_TCP_SEND',
        type: 'Edit',
        text: '发送数据',
        x: 38,
        y: 92,
        w: 200,
        h: 48,
        note: 'TCP 发送内容。',
      },
      {
        id: 'IDC_BTN_TCP_SEND',
        type: 'Button',
        text: '发送',
        x: 248,
        y: 102,
        w: 70,
        h: 28,
        event: 'OnBnClickedTcpSend',
        note: '发送 TCP 数据。',
      },
      {
        id: 'IDC_GROUP_HTTP',
        type: 'GroupBox',
        text: 'HTTP Client',
        x: 360,
        y: 18,
        w: 340,
        h: 150,
        note: 'HTTP 请求区。',
      },
      {
        id: 'IDC_EDIT_HTTP_URL',
        type: 'Edit',
        text: 'https://example.com/api',
        x: 380,
        y: 52,
        w: 230,
        h: 24,
        note: '请求 URL。',
      },
      {
        id: 'IDC_BTN_HTTP_SEND',
        type: 'Button',
        text: 'POST',
        x: 620,
        y: 50,
        w: 60,
        h: 28,
        event: 'OnBnClickedHttpSend',
        note: '发送 HTTP 请求。',
      },
      {
        id: 'IDC_EDIT_HTTP_BODY',
        type: 'Edit',
        text: '{ }',
        x: 380,
        y: 90,
        w: 300,
        h: 58,
        note: '请求 Body。',
      },
      {
        id: 'IDC_EDIT_RESPONSE',
        type: 'Edit',
        text: 'Response...',
        x: 18,
        y: 190,
        w: 682,
        h: 170,
        note: '响应显示，多行只读。',
      },
      {
        id: 'IDC_LIST_LOG',
        type: 'ListBox',
        text: '网络日志',
        x: 18,
        y: 375,
        w: 682,
        h: 60,
        note: '网络状态日志。',
      },
    ],
  },
];

export function buildDesignerResourceSnippet(preset: MfcDialogPreset): string {
  const lines = preset.controls.map(
    (c) => `// ${c.id} (${c.type}) ${c.text} 位置: x=${c.x}, y=${c.y}, w=${c.w}, h=${c.h}`,
  );
  return [
    `// MFC Dialog 控件布局草图：${preset.title}`,
    `// Dialog size: ${preset.size.w} x ${preset.size.h}`,
    ...lines,
  ].join('\n');
}

export function buildDesignerMessageMap(preset: MfcDialogPreset): string {
  const events = preset.controls
    .filter((c) => c.event)
    .map((c) => `ON_BN_CLICKED(${c.id}, &CMfcToolkitDlg::${c.event})`);
  return `BEGIN_MESSAGE_MAP(CMfcToolkitDlg, CDialogEx)\n${events.map((e) => `  ${e}`).join('\n') || '  // 暂无按钮事件'}\nEND_MESSAGE_MAP()`;
}

export function buildDesignerMarkdown(preset: MfcDialogPreset): string {
  const controls = preset.controls
    .map(
      (c) =>
        `| ${c.id} | ${c.type} | ${c.text} | ${c.x},${c.y},${c.w},${c.h} | ${c.event ?? '-'} | ${c.note} |`,
    )
    .join('\n');
  return `# MFC Dialog 控件布局说明\n\n## ${preset.title}\n\n${preset.description}\n\n## 控件清单\n\n| ID | 类型 | 文本 | 位置 | 事件 | 说明 |\n|---|---|---|---|---|---|\n${controls}\n\n## Message Map\n\n\`\`\`cpp\n${buildDesignerMessageMap(preset)}\n\`\`\`\n\n## 资源草图\n\n\`\`\`cpp\n${buildDesignerResourceSnippet(preset)}\n\`\`\`\n`;
}
