export type PracticeStage = '环境准备' | '界面搭建' | '通讯模块' | '数据存储' | '稳定性' | '综合验收';

export type ProjectFile = {
  path: string;
  purpose: string;
};

export type PracticeTemplate = {
  id: string;
  title: string;
  moduleId: string;
  stage: PracticeStage;
  goal: string;
  browserLabIds: string[];
  files: string[];
  projectFiles: ProjectFile[];
  controls: string[];
  steps: string[];
  code: string;
  checks: string[];
  pitfalls: string[];
};

export const visualStudioChecklist = [
  '安装 Visual Studio，并勾选“使用 C++ 的桌面开发”工作负载',
  '在单个组件中确认安装 MFC/ATL 支持',
  '创建 MFC App，应用类型选择 Dialog based',
  '统一项目字符集，建议初学阶段使用 Unicode 并保持 CString 贯穿 UI',
  '先用 Debug x64 调试，确认按钮事件能进断点，再扩展通讯模块',
  '真实串口、Socket、SQLite 均在 Windows 本地项目中实践；网页只做概念模拟',
];

export const recommendedProjectFiles: ProjectFile[] = [
  { path: 'MfcToolkitDlg.h/.cpp', purpose: '主 Dialog、Tab 切换、按钮事件、日志显示和整体调度' },
  { path: 'SerialManager.h/.cpp', purpose: '串口参数、打开/关闭、ASCII/HEX 收发、Modbus 帧入口' },
  { path: 'TcpClient.h/.cpp', purpose: 'TCP Client 连接、发送、接收、断线重连提示' },
  { path: 'TcpServer.h/.cpp', purpose: 'TCP Server 监听、接收客户端、回发消息' },
  { path: 'HttpClient.h/.cpp', purpose: 'GET/POST 请求封装、Header/Body 组装、响应日志' },
  { path: 'ConfigStore.h/.cpp', purpose: 'SQLite 设备参数、历史记录、INI 默认配置读写' },
  { path: 'Logger.h/.cpp', purpose: '统一 INFO/WARN/ERROR 日志格式，后续支持导出' },
  { path: 'WorkerThread.h/.cpp', purpose: '通讯工作线程、停止标志、PostMessage 回 UI 线程' },
];

export const capstoneRubric = [
  { item: 'UI 完整性', score: 15, detail: 'Tab、控件、布局清晰，控件 ID 命名稳定' },
  { item: '串口功能', score: 20, detail: '参数配置、打开关闭、ASCII/HEX、收发日志、错误提示' },
  { item: 'TCP Client/Server', score: 15, detail: '连接、监听、发送、接收、断开和异常处理' },
  { item: 'HTTP 测试', score: 10, detail: 'GET/POST、Header、Body、JSON/XML 显示清晰' },
  { item: 'SQLite/INI', score: 15, detail: '参数持久化、历史记录、默认配置和路径处理' },
  { item: '多线程稳定性', score: 10, detail: '耗时任务不阻塞 UI，线程退出可控' },
  { item: '日志与排错', score: 10, detail: '统一日志、关键错误可见、便于复现问题' },
  { item: '可维护性', score: 5, detail: '模块拆分明确，不把所有逻辑写在按钮事件里' },
];

export const practiceTemplates: PracticeTemplate[] = [
  {
    id: 'mfc-dialog-skeleton',
    title: 'MFC Dialog 主界面骨架',
    moduleId: 'mfc',
    stage: '界面搭建',
    goal: '在 Visual Studio 中创建 Dialog 项目，搭出 Tab、按钮、编辑框、日志框和状态栏。',
    browserLabIds: ['mfc-message-map'],
    files: ['MfcToolkitDlg.h', 'MfcToolkitDlg.cpp', 'resource.h'],
    projectFiles: [
      { path: 'MfcToolkitDlg.h/.cpp', purpose: '主界面和按钮事件' },
      { path: 'resource.h', purpose: '维护控件 ID，避免后续消息映射混乱' },
    ],
    controls: ['Tab Control', 'Button', 'Edit Control', 'ComboBox', 'ListBox 日志窗口', 'Static 状态提示'],
    steps: ['创建 MFC App，选择 Dialog based', '添加 Tab Control、ComboBox、Edit、Button、ListBox', '给关键控件设置稳定 ID', '为“发送”和“清空日志”按钮添加事件函数', '实现 AppendLog，所有模块先统一写日志'],
    code: `BEGIN_MESSAGE_MAP(CMfcToolkitDlg, CDialogEx)
  ON_BN_CLICKED(IDC_BTN_SEND, &CMfcToolkitDlg::OnBnClickedSend)
  ON_BN_CLICKED(IDC_BTN_CLEAR_LOG, &CMfcToolkitDlg::OnBnClickedClearLog)
  ON_WM_TIMER()
END_MESSAGE_MAP()

void CMfcToolkitDlg::AppendLog(const CString& text)
{
  CString line;
  line.Format(_T("[%s] %s"), CTime::GetCurrentTime().Format(_T("%H:%M:%S")), text.GetString());
  m_listLog.AddString(line);
  m_listLog.SetCurSel(m_listLog.GetCount() - 1);
}`,
    checks: ['窗口能启动', '按钮点击能进入断点', '日志 ListBox 能追加文本', '控件 ID 命名清晰', 'UI 逻辑和业务模块开始分离'],
    pitfalls: ['控件 ID 后期频繁改名导致消息映射失效', '所有逻辑堆在 Dialog 按钮函数里', '没有统一日志函数，后续排错困难'],
  },
  {
    id: 'serial-tab-template',
    title: '串口调试 Tab 模板',
    moduleId: 'serial',
    stage: '通讯模块',
    goal: '把网页中的串口参数模拟器落到 MFC UI：COM、波特率、8N1、ASCII/HEX 发送区。',
    browserLabIds: ['serial-config', 'hex-ascii', 'modbus-frame'],
    files: ['SerialManager.h', 'SerialManager.cpp', 'MfcToolkitDlg.cpp'],
    projectFiles: [
      { path: 'SerialManager.h/.cpp', purpose: '串口配置结构、打开关闭、收发入口' },
      { path: 'MfcToolkitDlg.cpp', purpose: '读取 UI 参数并调用 SerialManager' },
    ],
    controls: ['COM ComboBox', 'BaudRate ComboBox', 'Parity ComboBox', 'ASCII/HEX Radio', 'Send Edit', 'Receive/List Log'],
    steps: ['初始化 COM/波特率下拉框', '打开串口前校验参数', '发送前根据 ASCII/HEX 模式转换数据', '接收数据统一写入日志', 'Modbus 先复用帧构造结果，不急着接真实设备'],
    code: `struct SerialConfig {
  CString port = _T("COM3");
  DWORD baudRate = 9600;
  BYTE dataBits = 8;
  BYTE parity = NOPARITY;
  BYTE stopBits = ONESTOPBIT;
};

CString FormatSerialConfig(const SerialConfig& cfg)
{
  CString text;
  text.Format(_T("%s, %lu, 8N1"), cfg.port.GetString(), cfg.baudRate);
  return text;
}

// 示例：按钮事件只读取 UI 和调模块，真实串口 API 按项目库封装
void CMfcToolkitDlg::OnBnClickedSerialOpen()
{
  SerialConfig cfg = ReadSerialConfigFromUi();
  AppendLog(_T("Open serial: ") + FormatSerialConfig(cfg));
}`,
    checks: ['能显示 COM3, 9600, 8N1', 'ASCII/HEX 模式有明确提示', '参数错误时不打开串口', '收发日志包含时间戳', '串口模块和 UI 读取逻辑分开'],
    pitfalls: ['ASCII 和 HEX 混淆', '波特率/校验位不一致导致乱码', 'RS485 半双工方向控制未考虑', '串口读取阻塞 UI 线程'],
  },
  {
    id: 'tcp-http-template',
    title: 'TCP / HTTP 通讯模板',
    moduleId: 'network',
    stage: '通讯模块',
    goal: '把 TCP Client/Server 与 HTTP GET/POST 做成独立模块，避免连接和接收阻塞 UI。',
    browserLabIds: ['tcp-simulator', 'http-builder'],
    files: ['TcpClient.h', 'TcpClient.cpp', 'TcpServer.h', 'TcpServer.cpp', 'HttpClient.h', 'HttpClient.cpp'],
    projectFiles: [
      { path: 'TcpClient.h/.cpp', purpose: 'Client 连接、发送、接收、断开' },
      { path: 'TcpServer.h/.cpp', purpose: 'Server 监听、接收客户端、回发' },
      { path: 'HttpClient.h/.cpp', purpose: 'GET/POST 请求构造和响应处理' },
    ],
    controls: ['IP Edit', 'Port Edit', 'Connect Button', 'Listen Button', 'Method Select', 'Header Edit', 'Body Edit', 'Response Log'],
    steps: ['按钮事件只读取 UI 参数并启动任务', '线程内执行 connect/send/recv 或 HTTP 请求', '通过 PostMessage 通知 UI 更新日志', '退出时设置 stop 标志并释放 socket', 'HTTP 请求失败时显示状态码和错误文本'],
    code: `constexpr UINT WM_NET_LOG = WM_USER + 101;

UINT TcpWorkerProc(LPVOID pParam)
{
  auto* dlg = reinterpret_cast<CMfcToolkitDlg*>(pParam);
  // 伪代码：connect -> send -> recv
  dlg->PostMessage(WM_NET_LOG, 0, reinterpret_cast<LPARAM>(new CString(_T("TCP connected"))));
  return 0;
}

void CMfcToolkitDlg::OnBnClickedTcpConnect()
{
  if (m_tcpThreadRunning) {
    AppendLog(_T("WARN: TCP task already running"));
    return;
  }
  AfxBeginThread(TcpWorkerProc, this);
}`,
    checks: ['连接过程中窗口仍可拖动', '日志通过消息回到 UI 线程', '断线时有错误提示', '重复点击不会启动多个失控线程', 'HTTP Header/Body 显示清晰'],
    pitfalls: ['把 HTTP 和 TCP 层级混为一谈', 'IP/Port 校验缺失', '粘包/拆包没有协议边界', '工作线程直接操作 UI 控件'],
  },
  {
    id: 'cpp-thread-safety-template',
    title: 'C++ 指针 / STL / 多线程安全模板',
    moduleId: 'cpp-core',
    stage: '稳定性',
    goal: '把指针生命周期、消息队列和锁落实到工具软件稳定性设计中。',
    browserLabIds: ['pointer-memory', 'stl-container', 'thread-lock'],
    files: ['WorkerThread.h', 'WorkerThread.cpp', 'Logger.h', 'Logger.cpp'],
    projectFiles: [
      { path: 'WorkerThread.h/.cpp', purpose: '线程启动、停止标志、共享队列保护' },
      { path: 'Logger.h/.cpp', purpose: '线程安全日志入口' },
    ],
    controls: ['Start Task Button', 'Stop Button', 'Status Static', 'Log ListBox'],
    steps: ['用 std::queue 保存待发送消息', '用 std::mutex 保护共享队列和状态', '线程退出前检查 stop 标志', 'new/delete 尽量收敛到少数封装类中', 'UI 更新统一通过消息或主线程函数完成'],
    code: `std::queue<CString> m_sendQueue;
std::mutex m_queueMutex;
std::atomic_bool m_stop { false };

void EnqueueMessage(const CString& msg)
{
  std::lock_guard<std::mutex> lock(m_queueMutex);
  m_sendQueue.push(msg);
}

bool TryDequeueMessage(CString& out)
{
  std::lock_guard<std::mutex> lock(m_queueMutex);
  if (m_sendQueue.empty()) return false;
  out = m_sendQueue.front();
  m_sendQueue.pop();
  return true;
}`,
    checks: ['共享队列读写有锁', '停止按钮能结束任务', '没有重复 delete 或野指针', '日志不会因为多线程同时写而乱序崩溃'],
    pitfalls: ['delete 后继续使用旧指针', 'vector 越界', '线程未停止就关闭窗口', '锁范围过大导致界面假死'],
  },
  {
    id: 'sqlite-ini-template',
    title: 'SQLite + INI 参数保存模板',
    moduleId: 'storage',
    stage: '数据存储',
    goal: '保存设备参数、默认串口/IP 和历史记录，工具重启后可以恢复状态。',
    browserLabIds: ['sqlite-crud', 'ini-editor'],
    files: ['ConfigStore.h', 'ConfigStore.cpp', 'app.ini'],
    projectFiles: [
      { path: 'ConfigStore.h/.cpp', purpose: '封装 SQLite CRUD 与 INI 读写' },
      { path: 'app.ini', purpose: '保存默认串口、IP、端口、主题等轻量配置' },
    ],
    controls: ['Save Config Button', 'Load Config Button', 'Device Table/List', 'Default Port/IP Inputs'],
    steps: ['INI 保存轻量默认值', 'SQLite 保存结构化设备表', '启动时加载配置', '修改参数后显式保存并写日志', 'SQL 使用参数化思路，避免直接拼接用户输入'],
    code: `[Serial]
Port=COM3
BaudRate=9600
Mode=HEX

[Network]
Host=192.168.1.10
Port=502

CREATE TABLE IF NOT EXISTS device (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  protocol TEXT NOT NULL,
  address TEXT NOT NULL
);`,
    checks: ['重启后参数仍存在', '数据库文件路径明确', 'SQL 不直接拼接用户输入', '缺失配置时使用默认值', '保存和读取都有日志'],
    pitfalls: ['数据库相对路径随工作目录变化', 'INI 编码不一致', '配置项缺失没有默认值', 'SQL 字符串拼接风险'],
  },
  {
    id: 'capstone-integration-template',
    title: '最终项目集成与验收模板',
    moduleId: 'capstone',
    stage: '综合验收',
    goal: '把串口、TCP、HTTP、SQLite/INI、日志、多线程整合成可验收的 MFC 通用调试工具。',
    browserLabIds: [],
    files: ['MfcToolkitDlg.cpp', 'SerialManager.cpp', 'TcpClient.cpp', 'TcpServer.cpp', 'HttpClient.cpp', 'ConfigStore.cpp', 'Logger.cpp'],
    projectFiles: recommendedProjectFiles,
    controls: ['Serial Tab', 'TCP Client Tab', 'TCP Server Tab', 'HTTP Tab', 'Config Tab', 'Log Panel', 'Status Bar'],
    steps: ['先跑通 UI 和日志', '逐个接入串口/TCP/HTTP 模块', '再接 SQLite/INI 保存参数', '最后加入线程停止、错误提示和基本打包测试', '按 Capstone Rubric 自评打分'],
    code: `// 推荐调用链：按钮事件 -> 参数校验 -> 业务模块 -> 日志/状态更新
void CMfcToolkitDlg::OnBnClickedSend()
{
  auto task = BuildTaskFromCurrentTab();
  if (!task.IsValid()) {
    AppendLog(LogLevel::Warn, _T("参数不完整，已取消发送"));
    return;
  }
  DispatchTaskToWorker(task);
}`,
    checks: ['必做清单全部完成', '通讯任务不会卡死 UI', '错误提示清楚', '配置可保存并恢复', '模块文件职责明确', '能向他人演示完整收发/保存流程'],
    pitfalls: ['一开始就追求所有功能导致失控', '没有统一错误处理', '线程退出和窗口关闭冲突', '项目打包时漏带数据库/配置文件'],
  },
];
