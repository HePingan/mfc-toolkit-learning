export type IntegrationStep = {
  id: string;
  title: string;
  goal: string;
  actions: string[];
  verify: string[];
  commonPitfalls: string[];
};

export type CompileErrorCase = {
  code: string;
  title: string;
  symptom: string;
  causes: string[];
  fixes: string[];
  prevent: string;
  related: string;
};

export const integrationSteps: IntegrationStep[] = [
  {
    id: 'create-project',
    title: '创建 MFC Dialog 项目',
    goal: '先得到一个能空跑的 Dialog 窗口，避免一开始就混入外部代码。',
    actions: ['Visual Studio → 创建新项目 → MFC App', '应用程序类型选择 Dialog based', '字符集建议使用 Unicode', '先不添加串口/TCP/SQLite 代码，直接 F5 运行空窗口'],
    verify: ['能看到空 Dialog 窗口', '项目中存在 pch.h、resource.h、xxxDlg.h、xxxDlg.cpp', 'Debug x64 配置能正常编译'],
    commonPitfalls: ['误选 Console 或 Empty Project', '误选 Document/View 导致结构和教程不一致', '还没验证空项目就直接复制大量文件'],
  },
  {
    id: 'import-zip',
    title: '导入 ZIP 代码骨架',
    goal: '把 /codegen 下载的 MfcToolkitSkeleton.zip 解压到本地项目旁边。',
    actions: ['从 /codegen 选择模块并下载 ZIP 项目包', '解压后先阅读 README.md 和 docs/integration-steps.md', '把需要的 .h/.cpp/.ini 复制到 MFC 项目目录'],
    verify: ['文件已进入项目目录', 'README、controls.md、message-map.md 可打开', '没有直接覆盖 Visual Studio 自动生成的 pch.h/resource.h'],
    commonPitfalls: ['只解压不复制', '覆盖自动生成的 Dialog 文件导致工程损坏', '中文路径或空格路径导致外部库配置困难'],
  },
  {
    id: 'add-files',
    title: '添加 .h/.cpp 到项目',
    goal: '让 Visual Studio 真正参与编译这些文件，而不是只存在于文件夹中。',
    actions: ['在解决方案资源管理器右键项目 → Add → Existing Item', '选择复制进去的 .h/.cpp 文件', '确认 .cpp 出现在 Source Files，.h 出现在 Header Files'],
    verify: ['重新编译时 .cpp 会参与编译', 'LNK2019 不再因为 .cpp 未加入项目出现', '文件能在 VS 中打开并设置断点'],
    commonPitfalls: ['只复制文件到目录但没 Add Existing Item', '.cpp 被排除生成', 'Debug/Release 配置下文件包含状态不同'],
  },
  {
    id: 'create-controls',
    title: '创建 Dialog 控件并设置 ID',
    goal: '按 /designer 的布局草图创建 Button/Edit/ListBox/ComboBox/Tab 等控件。',
    actions: ['打开资源视图中的 Dialog', '按 /designer 规划拖放控件', '逐个设置控件 ID，例如 IDC_BTN_SERIAL_OPEN', '按钮 Caption 和 ID 分开设置，ID 以 IDC_ 开头'],
    verify: ['resource.h 中出现对应 IDC_*', '控件 ID 与 docs/controls.md 一致', '运行后控件显示位置基本合理'],
    commonPitfalls: ['只改显示文本没改控件 ID', '控件 ID 与代码中拼写不一致', '复制控件后 ID 重复'],
  },
  {
    id: 'wire-ddx-message-map',
    title: '接入 DDX_Control 与 Message Map',
    goal: '把资源控件绑定到成员变量，并把按钮点击映射到事件函数。',
    actions: ['在 xxxDlg.h 声明 CListBox/CButton/CEdit 等成员变量', '在 DoDataExchange 中添加 DDX_Control', '在 BEGIN_MESSAGE_MAP 中添加 ON_BN_CLICKED', '实现 OnBnClickedXxx 函数体'],
    verify: ['点击按钮能进入断点', '控件变量调用不会崩溃', 'Message Map 函数签名与声明一致'],
    commonPitfalls: ['只写 Message Map 没实现函数', '事件函数声明在 private 但签名不对', 'DDX_Control 使用了不存在的 ID'],
  },
  {
    id: 'compile-debug',
    title: '编译运行与断点验证',
    goal: '每接入一个模块就编译一次，用断点确认事件流，不要一次性堆完所有功能。',
    actions: ['先编译 Logger/Dialog', '再接入 Serial/TCP/HTTP/Config/WorkerThread', '每个按钮事件先 AppendLog，再补真实逻辑', '遇到错误先看错误码，再对照下方速查卡'],
    verify: ['无编译错误和链接错误', '按钮事件能进断点', '关闭窗口不会卡死或崩溃', '日志窗口能显示关键状态'],
    commonPitfalls: ['在 UI 线程里阻塞 connect/read', '线程未停止就关闭窗口', 'Debug 能过但 Release 缺库或宏配置不同'],
  },
];

export const compileErrorCases: CompileErrorCase[] = [
  { code: 'C1083', title: '无法打开包含文件 pch.h', symptom: '编译提示 Cannot open include file: pch.h。', causes: ['文件没有放在 MFC 项目目录', '项目预编译头设置与代码不一致', '复制的 .cpp 第一行没有 include "pch.h"'], fixes: ['确认 .cpp 位于项目目录并已加入项目', 'MFC 默认项目保持 #include "pch.h" 在第一行', '不要把代码放到完全不同的 Console 工程里编译'], prevent: '所有生成的 .cpp 保持 pch.h 作为第一 include。', related: '/codegen' },
  { code: 'C2065', title: '未声明的标识符 IDC_BTN_xxx', symptom: '控件 ID 在代码中存在，但 resource.h 没有定义。', causes: ['没有在资源编辑器创建控件', '只改了 Caption 没改 ID', 'ID 拼写不一致'], fixes: ['打开 Dialog 资源并设置正确控件 ID', '检查 resource.h 是否有对应 #define', '重新生成后再编译'], prevent: '先用 /designer 导出控件 ID 表，再逐项创建。', related: '/designer' },
  { code: 'C3861', title: '找不到标识符 OnBnClickedXxx', symptom: 'Message Map 引用了事件函数但编译找不到。', causes: ['xxxDlg.h 没声明函数', 'xxxDlg.cpp 没实现函数', '函数名拼写不一致'], fixes: ['在头文件声明 afx_msg void OnBnClickedXxx();', '在 cpp 中实现同名函数', '确保 ON_BN_CLICKED 中函数名完全一致'], prevent: '从 /designer 或 /codegen 复制 Message Map 后同步声明/实现。', related: '/designer' },
  { code: 'C2664', title: 'CString / std::string 类型不匹配', symptom: '调用函数时 CString、char*、std::string 转换失败。', causes: ['Unicode 项目中直接传 char*', '没有使用 CT2A/CA2T 或 CString 构造', '函数接口类型不统一'], fixes: ['统一内部接口优先使用 CString', '网络字节发送处显式转换编码', '不要混用 ANSI/Unicode 假设'], prevent: '项目创建时统一 Unicode，并在模块边界集中转换。', related: '/modules/cpp-core' },
  { code: 'LNK2019', title: '无法解析的外部符号', symptom: '声明存在但链接找不到实现。', causes: ['.cpp 没加入项目', '声明和实现签名不同', '只写了头文件没有实现'], fixes: ['Add Existing Item 加入对应 .cpp', '检查命名空间、const、参数类型是否一致', '清理后重新生成'], prevent: '每新增一个 .h 都确认对应 .cpp 参与编译。', related: '/integration' },
  { code: 'LNK2001', title: '未解析外部符号', symptom: '外部库或静态成员找不到定义。', causes: ['只声明 static 成员没定义', '缺少库依赖', 'Debug/Release 库路径不同'], fixes: ['给 static 成员添加 cpp 定义', '在 Linker Input 添加依赖库', '检查所有配置和平台的库路径'], prevent: '先不接外部库，基础骨架跑通后再逐个加库。', related: '/troubleshooting' },
  { code: 'RC2104', title: '资源脚本关键字或 ID 错误', symptom: '资源编译失败，提示 undefined keyword or key name。', causes: ['手改 .rc 出错', 'resource.h 中 ID 丢失', '控件 ID 包含非法字符'], fixes: ['优先用 VS 资源编辑器修改控件', '恢复 resource.h 中的 IDC_* 定义', '避免手写复杂 .rc'], prevent: '用 /designer 做规划，但真实资源创建交给 VS。', related: '/designer' },
  { code: 'UI 卡死', title: 'connect/read 阻塞主线程', symptom: '点击连接或读取后窗口无响应。', causes: ['在按钮事件中直接阻塞 connect/read', '没有工作线程', '没有超时或取消机制'], fixes: ['把耗时通讯放入 WorkerThread', '按钮事件只负责启动任务和更新状态', '关闭窗口前发送停止标志'], prevent: '网络和串口读循环不要直接写在 UI 事件里。', related: '/troubleshooting' },
];

export const integrationChecklist = ['空 MFC Dialog 项目能运行', 'ZIP 代码骨架已解压并阅读 README', '.h/.cpp 已 Add Existing Item 加入项目', '控件 ID 与 /designer 导出表一致', 'DDX_Control 能绑定关键控件', 'Message Map 能进入按钮断点', 'Logger 能输出日志', '串口/TCP/HTTP 模块逐个接入并单独编译', '关闭窗口前线程可退出', '最终对照 Capstone 清单验收'];

export function buildIntegrationMarkdown(): string {
  const steps = integrationSteps.map((s, i) => `## Step ${i + 1}. ${s.title}\n\n目标：${s.goal}\n\n### 操作\n${s.actions.map((a) => `- ${a}`).join('\n')}\n\n### 验收\n${s.verify.map((v) => `- ${v}`).join('\n')}\n\n### 常见坑\n${s.commonPitfalls.map((p) => `- ${p}`).join('\n')}`).join('\n\n');
  const errors = compileErrorCases.map((e) => `## ${e.code}：${e.title}\n\n现象：${e.symptom}\n\n原因：\n${e.causes.map((c) => `- ${c}`).join('\n')}\n\n修复：\n${e.fixes.map((f) => `- ${f}`).join('\n')}\n\n预防：${e.prevent}`).join('\n\n');
  return `# MFC 本地项目集成向导\n\n## 集成流程\n\n${steps}\n\n## 编译错误速查\n\n${errors}\n\n## 集成检查清单\n\n${integrationChecklist.map((i) => `- [ ] ${i}`).join('\n')}\n`;
}
