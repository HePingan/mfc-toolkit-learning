export type ChecklistItem = {
  id: string;
  label: string;
  detail: string;
};

export type BuildChecklistStage = {
  id: string;
  title: string;
  goal: string;
  items: ChecklistItem[];
};

export const buildChecklistStages: BuildChecklistStage[] = [
  {
    id: 'project-baseline',
    title: '1. 空项目基线',
    goal: '先确认 Visual Studio 生成的 MFC Dialog 项目能独立编译运行，避免把模板问题和项目创建问题混在一起。',
    items: [
      {
        id: 'baseline-create-dialog',
        label: '创建 Dialog based MFC App',
        detail: '选择 Unicode 字符集，先不要引入任何串口/TCP/SQLite 代码。',
      },
      {
        id: 'baseline-build-debug-x64',
        label: 'Debug x64 编译通过',
        detail: '空项目能 F5 运行并显示默认 Dialog。',
      },
      {
        id: 'baseline-keep-generated-files',
        label: '保留 VS 自动文件',
        detail: '不要覆盖 pch.h、resource.h、xxxDlg.h、xxxDlg.cpp；生成包里的 final 文件只做对照。',
      },
    ],
  },
  {
    id: 'resource-ui',
    title: '2. Resource / UI 控件',
    goal: '先把控件 ID 固定，再接 DDX 和消息映射，减少 C2065、RC2104 和按钮事件失效。',
    items: [
      {
        id: 'ui-copy-resource-ids',
        label: '复制 resource.generated.h 草图',
        detail: '只复制需要的 IDC_* 到 resource.h，并检查是否与现有 ID 冲突。',
      },
      {
        id: 'ui-create-base-controls',
        label: '创建基础控件',
        detail: 'Tab、日志 ListBox、状态 Static、清空日志按钮必须先创建。',
      },
      {
        id: 'ui-create-module-controls',
        label: '创建模块控件',
        detail: '按 /designer 或 ZIP docs/controls.md 创建 Edit、Button、ComboBox、ListBox。',
      },
      {
        id: 'ui-caption-vs-id',
        label: '区分 Caption 与 ID',
        detail: '按钮显示文本可以是中文，但控件 ID 必须与代码一致。',
      },
    ],
  },
  {
    id: 'source-import',
    title: '3. 源码导入顺序',
    goal: '每导入一组模块就编译一次，不要一次性堆满所有功能后再排错。',
    items: [
      {
        id: 'src-add-logger',
        label: '导入 Logger',
        detail: '先让日志窗口能输出 INFO/WARN/ERROR。',
      },
      {
        id: 'src-add-config',
        label: '导入 ConfigStore / app.ini',
        detail: '确认 config 目录可创建，INI 能读写。',
      },
      {
        id: 'src-add-worker',
        label: '导入 WorkerThread',
        detail: '先测试启动/停止，不做真实通信。',
      },
      {
        id: 'src-add-comm',
        label: '再导入通信模块',
        detail: 'Serial、TCP、HTTP 逐个接入；每个模块单独编译。',
      },
      {
        id: 'src-add-sqlite',
        label: '最后导入 SQLite',
        detail: '确认 sqlite3.h/lib/dll 与平台位数一致后再接 CRUD。',
      },
    ],
  },
  {
    id: 'dialog-wiring',
    title: '4. Dialog 接线',
    goal: '把 include、成员变量、DDX、OnInitDialog 和 Message Map 分段合并进真实 xxxDlg 文件。',
    items: [
      {
        id: 'wire-includes-members',
        label: '合并 include 与成员变量',
        detail: 'MfcToolkitDlg.final.h 是对照模板，不建议直接覆盖。',
      },
      {
        id: 'wire-ddx',
        label: '接入 DDX_Control',
        detail: '每个 DDX_Control 对应的控件 ID 必须在 resource.h 中存在。',
      },
      {
        id: 'wire-message-map',
        label: '接入 ON_BN_CLICKED',
        detail: '消息映射、头文件声明、cpp 实现三处函数名必须完全一致。',
      },
      {
        id: 'wire-first-log',
        label: '按钮先只写日志',
        detail: '每个按钮事件第一版先 AppendLog，再逐步补真实逻辑。',
      },
    ],
  },
  {
    id: 'native-deps',
    title: '5. Native 依赖与链接库',
    goal: '在 Visual Studio 属性页中补齐头文件、库目录和 Additional Dependencies。',
    items: [
      {
        id: 'deps-winsock',
        label: 'TCP 链接 ws2_32.lib',
        detail: 'TcpClient/TcpServer 需要 winsock2.h、ws2tcpip.h、ws2_32.lib。',
      },
      {
        id: 'deps-winhttp',
        label: 'HTTP 链接 winhttp.lib',
        detail: 'WinHTTP 请求需要 winhttp.h 和 winhttp.lib。',
      },
      {
        id: 'deps-shlwapi',
        label: '路径处理链接 Shlwapi.lib',
        detail: 'ConfigStore / SQLite 默认路径常用 PathRemoveFileSpec、CreateDirectory。',
      },
      {
        id: 'deps-sqlite',
        label: 'SQLite 三件套',
        detail: 'sqlite3.h、sqlite3.lib、sqlite3.dll/静态库必须和 x86/x64 配置一致。',
      },
    ],
  },
  {
    id: 'runtime-acceptance',
    title: '6. 运行验收',
    goal: '确认事件流、线程退出、资源释放和最终交付材料。',
    items: [
      {
        id: 'run-breakpoints',
        label: '按钮断点可进入',
        detail: '每个 ON_BN_CLICKED 对应函数都能进入断点。',
      },
      {
        id: 'run-no-ui-block',
        label: 'UI 不被阻塞',
        detail: 'connect、recv、ReadFile、WinHTTP、SQLite 大量写入不要直接放 UI 线程。',
      },
      {
        id: 'run-close-clean',
        label: '关闭前释放资源',
        detail: '停止线程、关闭 socket/串口、finalize statement、close database。',
      },
      {
        id: 'run-export-report',
        label: '导出学习报告 / 项目交付包',
        detail: '用 /reports 导出 Markdown/JSON，记录完成项、风险和下一步。',
      },
    ],
  },
];

export const buildChecklistStorageKey = 'mfc-toolkit-build-checklist-v1';

export function allBuildChecklistItems() {
  return buildChecklistStages.flatMap((stage) => stage.items);
}

export function buildChecklistMarkdown(doneIds: string[]): string {
  const done = new Set(doneIds);
  return `# MFC 本地构建检查清单\n\n> 适用范围：Windows + Visual Studio + MFC Dialog 项目。浏览器只保存检查进度，不会访问真实串口、TCP、HTTP 或 SQLite。\n\n${buildChecklistStages.map((stage) => `## ${stage.title}\n\n目标：${stage.goal}\n\n${stage.items.map((item) => `- [${done.has(item.id) ? 'x' : ' '}] ${item.label}：${item.detail}`).join('\n')}`).join('\n\n')}\n`;
}
