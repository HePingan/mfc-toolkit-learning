import { buildDialogWiring } from './dialogWiring';
import { getNativeDependencies } from './nativeDeps';

const has = (ids: string[], id: string) => ids.includes(id);

type ResourceItem = { name: string; value: number; module: string };

function resourceItems(ids: string[]): ResourceItem[] {
  const items: ResourceItem[] = [
    { name: 'IDC_TAB_MAIN', value: 1001, module: 'base' },
    { name: 'IDC_LIST_LOG', value: 1002, module: 'base' },
    { name: 'IDC_STATIC_STATUS', value: 1003, module: 'base' },
    { name: 'IDC_BTN_CLEAR_LOG', value: 1004, module: 'base' },
  ];
  if (has(ids, 'serial'))
    items.push(
      { name: 'IDC_CMB_SERIAL_PORT', value: 1101, module: 'serial' },
      { name: 'IDC_EDT_SERIAL_SEND', value: 1102, module: 'serial' },
      { name: 'IDC_BTN_SERIAL_OPEN', value: 1103, module: 'serial' },
      { name: 'IDC_BTN_SERIAL_SEND', value: 1104, module: 'serial' },
    );
  if (has(ids, 'tcp-client'))
    items.push(
      { name: 'IDC_EDT_TCP_HOST', value: 1201, module: 'tcp-client' },
      { name: 'IDC_EDT_TCP_PORT', value: 1202, module: 'tcp-client' },
      { name: 'IDC_BTN_TCP_CONNECT', value: 1203, module: 'tcp-client' },
      { name: 'IDC_BTN_TCP_SEND', value: 1204, module: 'tcp-client' },
      { name: 'IDC_EDT_TCP_SEND', value: 1205, module: 'tcp-client' },
    );
  if (has(ids, 'tcp-server'))
    items.push(
      { name: 'IDC_EDIT_SERVER_PORT', value: 1251, module: 'tcp-server' },
      { name: 'IDC_BTN_SERVER_LISTEN', value: 1252, module: 'tcp-server' },
      { name: 'IDC_BTN_SERVER_STOP', value: 1253, module: 'tcp-server' },
    );
  if (has(ids, 'http-client'))
    items.push(
      { name: 'IDC_EDT_HTTP_URL', value: 1301, module: 'http-client' },
      { name: 'IDC_EDT_HTTP_BODY', value: 1302, module: 'http-client' },
      { name: 'IDC_BTN_HTTP_GET', value: 1303, module: 'http-client' },
      { name: 'IDC_BTN_HTTP_POST', value: 1304, module: 'http-client' },
      { name: 'IDC_COMBO_HTTP_METHOD', value: 1305, module: 'http-client' },
    );
  if (has(ids, 'sqlite-store'))
    items.push(
      { name: 'IDC_LIST_SQLITE_ROWS', value: 1401, module: 'sqlite-store' },
      { name: 'IDC_EDT_SQLITE_PAYLOAD', value: 1402, module: 'sqlite-store' },
      { name: 'IDC_BTN_SQLITE_OPEN', value: 1403, module: 'sqlite-store' },
      { name: 'IDC_BTN_SQLITE_INSERT', value: 1404, module: 'sqlite-store' },
      { name: 'IDC_BTN_SQLITE_QUERY', value: 1405, module: 'sqlite-store' },
    );
  if (has(ids, 'config-store'))
    items.push(
      { name: 'IDC_BTN_CONFIG_SAVE', value: 1501, module: 'config-store' },
      { name: 'IDC_BTN_CONFIG_LOAD', value: 1502, module: 'config-store' },
      { name: 'IDC_LIST_DEVICE', value: 1503, module: 'config-store' },
    );
  if (has(ids, 'worker-thread'))
    items.push(
      { name: 'IDC_BTN_TASK_START', value: 1601, module: 'worker-thread' },
      { name: 'IDC_BTN_TASK_STOP', value: 1602, module: 'worker-thread' },
    );
  return items;
}

export function buildResourceHeader(ids: string[]): string {
  const rows = resourceItems(ids)
    .map((item) => `#define ${item.name.padEnd(28)} ${item.value}`)
    .join('\n');
  return `// resource.generated.h\n// Codegen v6 生成的控件 ID 草图：复制到 resource.h 前先确认没有与现有资源 ID 冲突。\n#pragma once\n\n${rows}\n`;
}

function libs(ids: string[]): string[] {
  return Array.from(
    new Set(
      getNativeDependencies(ids)
        .flatMap((dep) => dep.libs)
        .filter((lib) => lib.endsWith('.lib')),
    ),
  );
}

export function buildVisualStudioPropertyPages(ids: string[]): string {
  const libLines =
    libs(ids)
      .map((lib) => `- ${lib}`)
      .join('\n') || '- 当前选择未产生额外 .lib';
  return `# Visual Studio Property Pages\n\nCodegen v6 Mini Project 属性页设置建议。\n\n## C/C++ -> General\n\nAdditional Include Directories：\n\n- $(ProjectDir)\n- $(ProjectDir)third_party\\sqlite\\include（如使用 SQLite）\n\n## Linker -> General\n\nAdditional Library Directories：\n\n- $(ProjectDir)third_party\\sqlite\\lib（如使用 SQLite）\n\n## Linker -> Input\n\nAdditional Dependencies：\n\n${libLines}\n\n## 两种链接方式\n\n1. 在属性页添加 Additional Dependencies，适合初学者集中查看。\n2. 在 .cpp 中使用 #pragma comment(lib, "xxx.lib")，适合模板自包含。\n\n建议：第一轮学习时保留属性页配置，遇到 LNK2019 先检查这里。\n`;
}

export function buildBuildOrderChecklist(ids: string[]): string {
  const steps = [
    '空 MFC Dialog 项目能运行',
    '复制 resource.generated.h 中需要的 ID，确认 resource.h 无冲突',
    '创建主界面控件：Tab、日志 ListBox、状态 Static、清空按钮',
    ...(has(ids, 'logger') ? ['导入 Logger，日志窗口可输出 INFO/WARN/ERROR'] : []),
    ...(has(ids, 'config-store') ? ['导入 ConfigStore，能读写 app.ini'] : []),
    ...(has(ids, 'worker-thread') ? ['导入 WorkerThread，启动/停止不崩溃'] : []),
    ...(has(ids, 'serial') ? ['导入 SerialManager，只编译不连接真实设备，确认串口错误提示'] : []),
    ...(has(ids, 'tcp-client') || has(ids, 'tcp-server') ? ['接入 TCP 模块，确认 ws2_32.lib'] : []),
    ...(has(ids, 'http-client') ? ['接入 HttpClient，确认 winhttp.lib'] : []),
    ...(has(ids, 'sqlite-store')
      ? ['接入 SqliteStore，确认 sqlite3.h/lib/dll，能创建 data/mfc_toolkit.db']
      : []),
    '把 MfcToolkitDlg.final.h/.cpp 作为对照，不要直接覆盖项目原文件',
    '关闭窗口前停止线程、关闭 socket、关闭串口和数据库',
  ];
  return `# Build Order Checklist\n\n${steps.map((step, index) => `- [ ] ${index + 1}. ${step}`).join('\n')}\n`;
}

export function buildMiniProjectBlueprint(ids: string[]): string {
  const libText = libs(ids).join(', ') || '无额外 .lib';
  return `# Mini Project Blueprint\n\nCodegen v6 完整 MFC Mini Project 一键生成包。\n\n## 项目目标\n\n在 Windows + Visual Studio + MFC Dialog 项目中，组合所选模块，形成一个“通用调试工具”起步工程：界面控件、消息映射、模块类、配置、日志、线程、通信和 SQLite 数据记录可逐步接入。\n\n## 推荐目录结构\n\n\`\`\`txt\nMfcToolkit/\n├── *.h / *.cpp              # 模块源码\n├── MfcToolkitDlg.final.h    # Dialog 最终结构对照\n├── MfcToolkitDlg.final.cpp  # Dialog 最终结构对照\n├── resource.generated.h     # 控件 ID 草图\n├── app.ini                  # 配置模板\n├── data/                    # SQLite 数据库运行时目录\n└── docs/                    # 接入和验收文档\n\`\`\`\n\n## 文件导入顺序\n\n1. 先创建空 MFC Dialog based 项目。\n2. 导入 Logger / ConfigStore / WorkerThread 这类基础模块。\n3. 再导入 Serial / TCP / HTTP / SQLite 这类外部依赖模块。\n4. 对照 docs/dialog-wiring.md 分段接入 Dialog。\n5. 每导入一个模块立即编译一次。\n\n## 控件创建顺序\n\n1. 创建主 Tab、日志 ListBox、状态 Static。\n2. 根据 resource.generated.h 创建所选模块的 Edit / Button / ComboBox / ListBox。\n3. 控件 ID 创建完后再添加 Message Map。\n\n## 需要关注的链接库\n\n${libText}\n\n## 每步验收点\n\n- 编译错误优先解决第一个，不要从中间错误开始改。\n- 运行后先点 ClearLog，再测配置、线程、通信和 SQLite。\n- UI 线程不做阻塞通信；耗时任务放 WorkerThread。\n`;
}

export function buildFinalDialogHeader(ids: string[]): string {
  const wiring = buildDialogWiring(ids);
  return `// MfcToolkitDlg.final.h\n// 对照模板：不要直接覆盖 Visual Studio 生成的 Dialog 头文件。\n#pragma once\n#include "resource.h"\n${wiring.includes
    .split('\n')
    .filter((line) => line.startsWith('#include') && !line.includes('MfcToolkitDlg.h'))
    .join(
      '\n',
    )}\n\nclass CMfcToolkitDlg : public CDialogEx\n{\npublic:\n  CMfcToolkitDlg(CWnd* pParent = nullptr);\n\n#ifdef AFX_DESIGN_TIME\n  enum { IDD = IDD_MFCTOOLKIT_DIALOG };\n#endif\n\nprotected:\n  virtual void DoDataExchange(CDataExchange* pDX);\n  virtual BOOL OnInitDialog();\n  DECLARE_MESSAGE_MAP()\n\n${wiring.members}\n};\n`;
}

export function buildFinalDialogCpp(ids: string[], messageMapLines: string[]): string {
  const wiring = buildDialogWiring(ids);
  const messageMap =
    messageMapLines.map((line) => `  ${line}`).join('\n') || '  // TODO: 添加按钮事件映射';
  return `// MfcToolkitDlg.final.cpp\n// 对照模板：把片段合并到你的 MfcToolkitDlg.cpp，而不是直接覆盖。\n#include "pch.h"\n${wiring.includes}\n\nBEGIN_MESSAGE_MAP(CMfcToolkitDlg, CDialogEx)\n${messageMap}\nEND_MESSAGE_MAP()\n\n${wiring.ddx}\n\n${wiring.init}\n\n${wiring.handlers}\n`;
}

export function buildMiniProjectSummary(ids: string[]) {
  return {
    resourceCount: resourceItems(ids).length,
    libs: libs(ids),
    docs: [
      'docs/mini-project-blueprint.md',
      'docs/visual-studio-property-pages.md',
      'docs/build-order-checklist.md',
      'resource.generated.h',
      'MfcToolkitDlg.final.h',
      'MfcToolkitDlg.final.cpp',
    ],
  };
}
