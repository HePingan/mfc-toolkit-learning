import { CodegenMode, applyCodegenMode, buildCodegenModeNotes } from './codegenTemplates';
import { buildDialogWiring } from './dialogWiring';
import { buildBuildOrderChecklist, buildFinalDialogCpp, buildFinalDialogHeader, buildMiniProjectBlueprint, buildResourceHeader, buildVisualStudioPropertyPages } from './miniProject';
import { buildNativeApiNotes } from './nativeDeps';

export type CodegenFile = {
  path: string;
  language: 'cpp' | 'ini' | 'md';
  content: string;
};

export type CodegenModule = {
  id: string;
  title: string;
  description: string;
  recommended: boolean;
  controls: string[];
  messageMap: string[];
  files: CodegenFile[];
};

export const codegenModules: CodegenModule[] = [
  {
    id: 'dialog',
    title: 'MFC Dialog 主窗口',
    description: '主界面、控件变量、日志入口和消息映射起点。',
    recommended: true,
    controls: ['IDC_TAB_MAIN', 'IDC_LIST_LOG', 'IDC_BTN_CLEAR_LOG', 'IDC_STATIC_STATUS'],
    messageMap: ['ON_BN_CLICKED(IDC_BTN_CLEAR_LOG, &CMfcToolkitDlg::OnBnClickedClearLog)', 'ON_WM_CLOSE()'],
    files: [
      { path: 'MfcToolkitDlg.h', language: 'cpp', content: `#pragma once
#include <afxwin.h>
#include <afxcmn.h>

class CMfcToolkitDlg : public CDialogEx
{
public:
  CMfcToolkitDlg(CWnd* pParent = nullptr);

enum { IDD = IDD_MFCTOOLKIT_DIALOG };

protected:
  virtual void DoDataExchange(CDataExchange* pDX);
  virtual BOOL OnInitDialog();
  DECLARE_MESSAGE_MAP()

private:
  CTabCtrl m_tabMain;
  CListBox m_listLog;
  CStatic m_staticStatus;

  void AppendLog(const CString& level, const CString& text);
  void SetStatusText(const CString& text);

public:
  afx_msg void OnBnClickedClearLog();
  afx_msg void OnClose();
};` },
      { path: 'MfcToolkitDlg.cpp', language: 'cpp', content: `#include "pch.h"
#include "MfcToolkit.h"
#include "MfcToolkitDlg.h"

BEGIN_MESSAGE_MAP(CMfcToolkitDlg, CDialogEx)
  ON_BN_CLICKED(IDC_BTN_CLEAR_LOG, &CMfcToolkitDlg::OnBnClickedClearLog)
  ON_WM_CLOSE()
END_MESSAGE_MAP()

CMfcToolkitDlg::CMfcToolkitDlg(CWnd* pParent)
  : CDialogEx(IDD_MFCTOOLKIT_DIALOG, pParent)
{
}

void CMfcToolkitDlg::DoDataExchange(CDataExchange* pDX)
{
  CDialogEx::DoDataExchange(pDX);
  DDX_Control(pDX, IDC_TAB_MAIN, m_tabMain);
  DDX_Control(pDX, IDC_LIST_LOG, m_listLog);
  DDX_Control(pDX, IDC_STATIC_STATUS, m_staticStatus);
}

BOOL CMfcToolkitDlg::OnInitDialog()
{
  CDialogEx::OnInitDialog();
  m_tabMain.InsertItem(0, _T("Serial"));
  m_tabMain.InsertItem(1, _T("TCP"));
  m_tabMain.InsertItem(2, _T("HTTP"));
  m_tabMain.InsertItem(3, _T("Config"));
  AppendLog(_T("INFO"), _T("MFC Toolkit started"));
  return TRUE;
}

void CMfcToolkitDlg::AppendLog(const CString& level, const CString& text)
{
  CString line;
  line.Format(_T("[%s][%s] %s"), CTime::GetCurrentTime().Format(_T("%H:%M:%S")), level.GetString(), text.GetString());
  m_listLog.AddString(line);
  m_listLog.SetCurSel(m_listLog.GetCount() - 1);
}

void CMfcToolkitDlg::SetStatusText(const CString& text)
{
  m_staticStatus.SetWindowText(text);
}

void CMfcToolkitDlg::OnBnClickedClearLog()
{
  m_listLog.ResetContent();
  SetStatusText(_T("Log cleared"));
}

void CMfcToolkitDlg::OnClose()
{
  AppendLog(_T("INFO"), _T("Closing application"));
  CDialogEx::OnClose();
}` },
    ],
  },
  {
    id: 'logger',
    title: 'Logger 日志模块',
    description: '统一日志格式，避免每个按钮事件里散落输出逻辑。',
    recommended: true,
    controls: ['IDC_LIST_LOG'],
    messageMap: [],
    files: [
      { path: 'Logger.h', language: 'cpp', content: `#pragma once
#include <afxstr.h>

enum class LogLevel { Info, Warn, Error };

class Logger
{
public:
  static CString Format(LogLevel level, const CString& text);
  static CString LevelText(LogLevel level);
};` },
      { path: 'Logger.cpp', language: 'cpp', content: `#include "pch.h"
#include "Logger.h"

CString Logger::LevelText(LogLevel level)
{
  switch (level) {
  case LogLevel::Warn: return _T("WARN");
  case LogLevel::Error: return _T("ERROR");
  default: return _T("INFO");
  }
}

CString Logger::Format(LogLevel level, const CString& text)
{
  CString line;
  line.Format(_T("[%s][%s] %s"), CTime::GetCurrentTime().Format(_T("%H:%M:%S")), LevelText(level).GetString(), text.GetString());
  return line;
}` },
    ],
  },
  {
    id: 'serial',
    title: 'SerialManager 串口模块',
    description: '串口参数、打开关闭、ASCII/HEX 发送入口。真实串口 API 在本地 Visual Studio 中补全。',
    recommended: false,
    controls: ['IDC_COMBO_SERIAL_PORT', 'IDC_COMBO_SERIAL_BAUD', 'IDC_COMBO_SERIAL_PARITY', 'IDC_BTN_SERIAL_OPEN', 'IDC_BTN_SERIAL_SEND', 'IDC_EDIT_SERIAL_SEND'],
    messageMap: ['ON_BN_CLICKED(IDC_BTN_SERIAL_OPEN, &CMfcToolkitDlg::OnBnClickedSerialOpen)', 'ON_BN_CLICKED(IDC_BTN_SERIAL_SEND, &CMfcToolkitDlg::OnBnClickedSerialSend)'],
    files: [
      { path: 'SerialManager.h', language: 'cpp', content: `#pragma once
#include <afxstr.h>

struct SerialConfig
{
  CString port = _T("COM3");
  DWORD baudRate = 9600;
  BYTE dataBits = 8;
  BYTE parity = NOPARITY;
  BYTE stopBits = ONESTOPBIT;
};

class SerialManager
{
public:
  bool Open(const SerialConfig& config, CString& error);
  void Close();
  bool IsOpen() const;
  bool SendAscii(const CString& text, CString& error);
  bool SendHex(const CString& hexText, CString& error);

private:
  bool m_opened = false;
  SerialConfig m_config;
};` },
      { path: 'SerialManager.cpp', language: 'cpp', content: `#include "pch.h"
#include "SerialManager.h"

bool SerialManager::Open(const SerialConfig& config, CString& error)
{
  if (config.port.IsEmpty()) {
    error = _T("Port is empty");
    return false;
  }
  m_config = config;
  // TODO: 在本地项目中用 CreateFile/SetCommState 或第三方串口库打开真实串口。
  m_opened = true;
  return true;
}

void SerialManager::Close()
{
  // TODO: 关闭真实串口句柄。
  m_opened = false;
}

bool SerialManager::IsOpen() const
{
  return m_opened;
}

bool SerialManager::SendAscii(const CString& text, CString& error)
{
  if (!m_opened) { error = _T("Serial not open"); return false; }
  if (text.IsEmpty()) { error = _T("Send text is empty"); return false; }
  // TODO: CString 转字节后 WriteFile。
  return true;
}

bool SerialManager::SendHex(const CString& hexText, CString& error)
{
  if (!m_opened) { error = _T("Serial not open"); return false; }
  // TODO: 校验 HEX 格式并转 bytes。
  return true;
}` },
    ],
  },
  {
    id: 'tcp-client',
    title: 'TcpClient TCP 客户端',
    description: '连接、发送、接收和断线提示；建议放入工作线程。',
    recommended: false,
    controls: ['IDC_EDIT_TCP_HOST', 'IDC_EDIT_TCP_PORT', 'IDC_BTN_TCP_CONNECT', 'IDC_BTN_TCP_SEND', 'IDC_EDIT_TCP_SEND'],
    messageMap: ['ON_BN_CLICKED(IDC_BTN_TCP_CONNECT, &CMfcToolkitDlg::OnBnClickedTcpConnect)', 'ON_BN_CLICKED(IDC_BTN_TCP_SEND, &CMfcToolkitDlg::OnBnClickedTcpSend)'],
    files: [
      { path: 'TcpClient.h', language: 'cpp', content: `#pragma once
#include <afxstr.h>

class TcpClient
{
public:
  bool Connect(const CString& host, int port, CString& error);
  bool SendText(const CString& text, CString& error);
  void Disconnect();
  bool IsConnected() const;
private:
  bool m_connected = false;
};` },
      { path: 'TcpClient.cpp', language: 'cpp', content: `#include "pch.h"
#include "TcpClient.h"

bool TcpClient::Connect(const CString& host, int port, CString& error)
{
  if (host.IsEmpty() || port <= 0) { error = _T("Invalid host or port"); return false; }
  // TODO: WSAStartup/socket/connect，建议在线程中执行避免 UI 卡死。
  m_connected = true;
  return true;
}

bool TcpClient::SendText(const CString& text, CString& error)
{
  if (!m_connected) { error = _T("TCP not connected"); return false; }
  if (text.IsEmpty()) { error = _T("Message is empty"); return false; }
  // TODO: send bytes；处理返回值和错误码。
  return true;
}

void TcpClient::Disconnect()
{
  // TODO: closesocket。
  m_connected = false;
}

bool TcpClient::IsConnected() const { return m_connected; }` },
    ],
  },
  {
    id: 'tcp-server',
    title: 'TcpServer TCP 服务端',
    description: '监听端口、接收客户端、回发消息。',
    recommended: false,
    controls: ['IDC_EDIT_SERVER_PORT', 'IDC_BTN_SERVER_LISTEN', 'IDC_BTN_SERVER_STOP'],
    messageMap: ['ON_BN_CLICKED(IDC_BTN_SERVER_LISTEN, &CMfcToolkitDlg::OnBnClickedServerListen)', 'ON_BN_CLICKED(IDC_BTN_SERVER_STOP, &CMfcToolkitDlg::OnBnClickedServerStop)'],
    files: [
      { path: 'TcpServer.h', language: 'cpp', content: `#pragma once
#include <afxstr.h>

class TcpServer
{
public:
  bool Start(int port, CString& error);
  void Stop();
  bool IsListening() const;
private:
  bool m_listening = false;
};` },
      { path: 'TcpServer.cpp', language: 'cpp', content: `#include "pch.h"
#include "TcpServer.h"

bool TcpServer::Start(int port, CString& error)
{
  if (port <= 0 || port > 65535) { error = _T("Invalid server port"); return false; }
  // TODO: socket/bind/listen/accept，accept 循环必须放到工作线程。
  m_listening = true;
  return true;
}

void TcpServer::Stop()
{
  // TODO: 设置停止标志并关闭监听 socket。
  m_listening = false;
}

bool TcpServer::IsListening() const { return m_listening; }` },
    ],
  },
  {
    id: 'http-client',
    title: 'HttpClient HTTP 模块',
    description: 'GET/POST 请求骨架，重点处理 Header、Body、状态码和日志。',
    recommended: false,
    controls: ['IDC_COMBO_HTTP_METHOD', 'IDC_EDIT_HTTP_URL', 'IDC_EDIT_HTTP_HEADERS', 'IDC_EDIT_HTTP_BODY', 'IDC_BTN_HTTP_SEND'],
    messageMap: ['ON_BN_CLICKED(IDC_BTN_HTTP_SEND, &CMfcToolkitDlg::OnBnClickedHttpSend)'],
    files: [
      { path: 'HttpClient.h', language: 'cpp', content: `#pragma once
#include <afxstr.h>

struct HttpRequest
{
  CString method = _T("GET");
  CString url;
  CString headers;
  CString body;
};

struct HttpResponse
{
  int statusCode = 0;
  CString body;
  CString error;
};

class HttpClient
{
public:
  HttpResponse Send(const HttpRequest& request);
};` },
      { path: 'HttpClient.cpp', language: 'cpp', content: `#include "pch.h"
#include "HttpClient.h"

HttpResponse HttpClient::Send(const HttpRequest& request)
{
  HttpResponse response;
  if (request.url.IsEmpty()) {
    response.error = _T("URL is empty");
    return response;
  }
  // TODO: 使用 WinHTTP/WinINet/cpr 等库实现真实请求。
  // POST 时务必按实际 Body 字节数设置 Content-Length。
  response.statusCode = 200;
  response.body = _T("{\\\"ok\\\":true}");
  return response;
}` },
    ],
  },

  {
    id: 'sqlite-store',
    title: 'SqliteStore SQLite CRUD',
    description: '设备、历史记录和参数表的 sqlite3 CRUD 封装模板。',
    recommended: false,
    controls: ['IDC_BTN_SQLITE_OPEN', 'IDC_BTN_SQLITE_QUERY', 'IDC_BTN_SQLITE_INSERT', 'IDC_LIST_SQLITE_ROWS'],
    messageMap: ['ON_BN_CLICKED(IDC_BTN_SQLITE_OPEN, &CMfcToolkitDlg::OnBnClickedSqliteOpen)', 'ON_BN_CLICKED(IDC_BTN_SQLITE_QUERY, &CMfcToolkitDlg::OnBnClickedSqliteQuery)', 'ON_BN_CLICKED(IDC_BTN_SQLITE_INSERT, &CMfcToolkitDlg::OnBnClickedSqliteInsert)'],
    files: [
      { path: 'SqliteStore.h', language: 'cpp', content: `#pragma once
#include <afxstr.h>

class SqliteStore
{
public:
  bool Open(const CString& dbPath, CString& error);
  void Close();
  bool InitSchema(CString& error);
  bool InsertHistory(const CString& channel, const CString& payload, CString& error);
  bool QueryHistory(CStringArray& rows, CString& error);
};` },
      { path: 'SqliteStore.cpp', language: 'cpp', content: `#include "pch.h"
#include "SqliteStore.h"

bool SqliteStore::Open(const CString& dbPath, CString& error)
{
  if (dbPath.IsEmpty()) { error = _T("SQLite db path is empty"); return false; }
  // TODO: sqlite3_open16(dbPath, &m_db)。
  return true;
}

void SqliteStore::Close()
{
  // TODO: sqlite3_close(m_db)。
}

bool SqliteStore::InitSchema(CString& error)
{
  // TODO: CREATE TABLE IF NOT EXISTS history(id INTEGER PRIMARY KEY, channel TEXT, payload TEXT, created_at TEXT)。
  return true;
}

bool SqliteStore::InsertHistory(const CString& channel, const CString& payload, CString& error)
{
  // TODO: sqlite3_prepare_v2 + sqlite3_bind_text16 + sqlite3_step。
  return true;
}

bool SqliteStore::QueryHistory(CStringArray& rows, CString& error)
{
  rows.RemoveAll();
  rows.Add(_T("1 | serial | example payload"));
  // TODO: sqlite3_prepare_v2 + sqlite3_step + sqlite3_column_text16。
  return true;
}` },
    ],
  },
  {
    id: 'config-store',
    title: 'ConfigStore SQLite/INI 配置',
    description: '集中处理配置路径、默认参数和历史记录保存。',
    recommended: false,
    controls: ['IDC_BTN_CONFIG_SAVE', 'IDC_BTN_CONFIG_LOAD', 'IDC_LIST_DEVICE'],
    messageMap: ['ON_BN_CLICKED(IDC_BTN_CONFIG_SAVE, &CMfcToolkitDlg::OnBnClickedConfigSave)', 'ON_BN_CLICKED(IDC_BTN_CONFIG_LOAD, &CMfcToolkitDlg::OnBnClickedConfigLoad)'],
    files: [
      { path: 'ConfigStore.h', language: 'cpp', content: `#pragma once
#include <afxstr.h>

struct AppConfig
{
  CString serialPort = _T("COM3");
  int baudRate = 9600;
  CString host = _T("192.168.1.10");
  int port = 502;
};

class ConfigStore
{
public:
  CString GetConfigPath() const;
  bool Load(AppConfig& config, CString& error);
  bool Save(const AppConfig& config, CString& error);
};` },
      { path: 'ConfigStore.cpp', language: 'cpp', content: `#include "pch.h"
#include "ConfigStore.h"

CString ConfigStore::GetConfigPath() const
{
  TCHAR path[MAX_PATH] = { 0 };
  GetModuleFileName(nullptr, path, MAX_PATH);
  CString exePath(path);
  int pos = exePath.ReverseFind(_T('\\'));
  return exePath.Left(pos + 1) + _T("config\\app.ini");
}

bool ConfigStore::Load(AppConfig& config, CString& error)
{
  CString path = GetConfigPath();
  config.serialPort = _T("COM3");
  config.baudRate = 9600;
  // TODO: GetPrivateProfileString / GetPrivateProfileInt 读取 INI。
  return true;
}

bool ConfigStore::Save(const AppConfig& config, CString& error)
{
  CString path = GetConfigPath();
  // TODO: 确保 config 目录存在，并用 WritePrivateProfileString 保存。
  return true;
}` },
      { path: 'app.ini', language: 'ini', content: `[Serial]
Port=COM3
BaudRate=9600
Mode=HEX

[Network]
Host=192.168.1.10
Port=502

[UI]
Theme=Dark
` },
    ],
  },
  {
    id: 'worker-thread',
    title: 'WorkerThread 多线程任务',
    description: '耗时通讯不阻塞 UI，关闭窗口前可控退出。',
    recommended: true,
    controls: ['IDC_BTN_TASK_START', 'IDC_BTN_TASK_STOP', 'IDC_STATIC_STATUS'],
    messageMap: ['ON_BN_CLICKED(IDC_BTN_TASK_START, &CMfcToolkitDlg::OnBnClickedTaskStart)', 'ON_BN_CLICKED(IDC_BTN_TASK_STOP, &CMfcToolkitDlg::OnBnClickedTaskStop)'],
    files: [
      { path: 'WorkerThread.h', language: 'cpp', content: `#pragma once
#include <atomic>
#include <functional>

class WorkerThread
{
public:
  using Task = std::function<void(std::atomic_bool& stop)>;
  bool Start(Task task);
  void Stop();
  bool IsRunning() const;
private:
  CWinThread* m_thread = nullptr;
  std::atomic_bool m_stop { false };
};` },
      { path: 'WorkerThread.cpp', language: 'cpp', content: `#include "pch.h"
#include "WorkerThread.h"

struct WorkerContext
{
  WorkerThread::Task task;
  std::atomic_bool* stop = nullptr;
};

static UINT WorkerProc(LPVOID pParam)
{
  std::unique_ptr<WorkerContext> ctx(reinterpret_cast<WorkerContext*>(pParam));
  if (ctx->task && ctx->stop) ctx->task(*ctx->stop);
  return 0;
}

bool WorkerThread::Start(Task task)
{
  if (m_thread) return false;
  m_stop = false;
  auto* ctx = new WorkerContext{ task, &m_stop };
  m_thread = AfxBeginThread(WorkerProc, ctx);
  return m_thread != nullptr;
}

void WorkerThread::Stop()
{
  m_stop = true;
  // TODO: 必要时等待线程退出，并避免在 UI 线程长时间阻塞。
  m_thread = nullptr;
}

bool WorkerThread::IsRunning() const { return m_thread != nullptr; }` },
    ],
  },
];

export function getSelectedCodegenModules(ids: string[]) {
  return codegenModules.filter((module) => ids.includes(module.id));
}

export function buildCodegenPackage(ids: string[], mode: CodegenMode = 'basic') {
  const selected = getSelectedCodegenModules(ids);
  const files = selected.flatMap((module) => applyCodegenMode(module.id, module.files, mode));
  const controls = Array.from(new Set(selected.flatMap((module) => module.controls)));
  const messageMap = Array.from(new Set(selected.flatMap((module) => module.messageMap)));
  return { selected, files, controls, messageMap };
}

export function codegenPackageToMarkdown(ids: string[], mode: CodegenMode = 'basic') {
  const pkg = buildCodegenPackage(ids, mode);
  const tree = pkg.files.map((file) => `- ${file.path}`).join('\n');
  const controls = pkg.controls.map((id) => `- ${id}`).join('\n') || '- 暂无控件 ID';
  const messageMap = pkg.messageMap.map((line) => `  ${line}`).join('\n') || '  // 暂无消息映射';
  const files = pkg.files.map((file) => `## ${file.path}\n\n\`\`\`${file.language}\n${file.content}\n\`\`\``).join('\n\n');
  return `# MFC 通用工具代码骨架\n\n> 说明：本代码包用于 Windows + Visual Studio + MFC 本地项目起步，浏览器不编译、不访问真实串口/TCP/SQLite。\n> 代码模式：${buildCodegenModeNotes(mode)}\n\n## 已选择模块\n\n${pkg.selected.map((module) => `- ${module.title}`).join('\n')}\n\n## 文件树\n\n${tree}\n\n## 控件 ID 建议\n\n${controls}\n\n## Message Map 示例\n\n\`\`\`cpp\nBEGIN_MESSAGE_MAP(CMfcToolkitDlg, CDialogEx)\n${messageMap}\nEND_MESSAGE_MAP()\n\`\`\`\n\n${files}\n`;
}

export type CodegenZipManifest = {
  rootName: string;
  files: { path: string; content: string }[];
};

export function buildCodegenZipManifest(ids: string[], mode: CodegenMode = 'basic'): CodegenZipManifest {
  const pkg = buildCodegenPackage(ids, mode);
  const moduleList = pkg.selected.map((module) => `- ${module.title}：${module.description}`).join('\n') || '- 未选择模块';
  const controls = pkg.controls.map((id) => `- ${id}`).join('\n') || '- 暂无控件 ID';
  const messageMapLines = pkg.messageMap.map((line) => `  ${line}`).join('\n') || '  // 暂无消息映射';
  const fileTree = pkg.files.map((file) => `- ${file.path}`).join('\n') || '- 暂无代码文件';
  const acceptance = [
    '窗口能启动并显示主 Dialog',
    '日志窗口能追加 INFO/WARN/ERROR 文本',
    '按钮事件能进入断点，控件 ID 与 Message Map 一致',
    '串口参数校验清晰，未打开串口时禁止发送',
    'TCP/HTTP 耗时操作不会阻塞 UI',
    '配置保存路径可见，保存后可读取验证',
    '关闭窗口前线程能收到停止信号并退出',
    '每接入一个模块都能单独编译和运行一次',
  ].map((item) => `- [ ] ${item}`).join('\n');

  const dialogWiring = buildDialogWiring(ids);
  const miniProjectFiles = [
    { path: 'docs/mini-project-blueprint.md', content: buildMiniProjectBlueprint(ids) },
    { path: 'docs/visual-studio-property-pages.md', content: buildVisualStudioPropertyPages(ids) },
    { path: 'docs/build-order-checklist.md', content: buildBuildOrderChecklist(ids) },
    { path: 'resource.generated.h', content: buildResourceHeader(ids) },
    { path: 'MfcToolkitDlg.final.h', content: buildFinalDialogHeader(ids) },
    { path: 'MfcToolkitDlg.final.cpp', content: buildFinalDialogCpp(ids, pkg.messageMap) },
  ];

  const docs = [
    {
      path: 'README.md',
      content: `# MFC Toolkit Skeleton\n\n这是从“MFC 通用工具开发训练营”生成的本地项目代码骨架包。\n\n代码模式：${buildCodegenModeNotes(mode)}\n\n> 说明：本包用于 Windows + Visual Studio + MFC Dialog 项目起步。它不是完整 .sln/.vcxproj 工程；请先创建 MFC Dialog based 项目，再复制这些文件。\n\n## 已选择模块\n\n${moduleList}\n\n## 文件树\n\n${fileTree}\n\n## 快速使用\n\n1. 在 Visual Studio 创建 MFC App，应用类型选择 Dialog based。\n2. 将本包根目录下的 .h/.cpp/.ini 文件复制到项目目录。\n3. 在资源编辑器中添加控件，并按 docs/controls.md 设置控件 ID。\n4. 在 Dialog 类中按 docs/message-map.md 接入消息映射。\n5. 按 docs/integration-steps.md 逐步编译和测试。\n6. 对照 docs/acceptance-checklist.md 做最终验收。\n7. 如选择串口/TCP/HTTP/INI 模块，先阅读 docs/native-api-notes.md 并确认链接库。\n8. 阅读 docs/dialog-wiring.md，把 Dialog include、成员变量、DDX、OnInitDialog 和按钮事件片段接入 CMfcToolkitDlg。\n9. 阅读 docs/mini-project-blueprint.md、resource.generated.h 和 MfcToolkitDlg.final.*，按完整 Mini Project 顺序接入。\n\n## Native API 常用链接声明\n\n\`\`\`cpp\n#pragma comment(lib, "ws2_32.lib")\n#pragma comment(lib, "winhttp.lib")\n#pragma comment(lib, "sqlite3.lib")\n#pragma comment(lib, "Shlwapi.lib")\n\`\`\`\n`,
    },
    { path: 'docs/controls.md', content: `# 控件 ID 清单\n\n${controls}\n\n建议：控件 ID 一旦用于消息映射，不要频繁改名；改名后必须同步 resource.h、DoDataExchange 和 BEGIN_MESSAGE_MAP。\n` },
    { path: 'docs/message-map.md', content: `# Message Map 示例\n\n\`\`\`cpp\nBEGIN_MESSAGE_MAP(CMfcToolkitDlg, CDialogEx)\n${messageMapLines}\nEND_MESSAGE_MAP()\n\`\`\`\n` },
    { path: 'docs/integration-steps.md', content: `# 接入步骤\n\n1. 创建 MFC Dialog 项目，确认 Debug x64 能运行空窗口。\n2. 先接入 Logger 和 Dialog 基础文件，确保日志窗口可输出。\n3. 添加资源控件：Tab、ListBox、Button、Edit、ComboBox、Static。\n4. 按 docs/controls.md 设置控件 ID。\n5. 按 docs/message-map.md 添加按钮事件。\n6. 每新增一个模块就单独编译一次，不要一次性接入全部模块。\n7. 串口、WinSock、WinHTTP、SQLite 的真实 API 请根据本地库版本补全 TODO。\n8. 关闭窗口前先停止工作线程，再释放 UI/通讯资源。\n` },
    { path: 'docs/acceptance-checklist.md', content: `# 验收清单\n\n${acceptance}\n` },
    { path: 'docs/native-api-notes.md', content: buildNativeApiNotes(ids) },
    { path: 'docs/dialog-wiring.md', content: dialogWiring.markdown },
    { path: 'MfcToolkitDlg.includes.h', content: dialogWiring.includes },
    { path: 'MfcToolkitDlg.members.h', content: dialogWiring.members },
    { path: 'MfcToolkitDlg.ddx.cpp', content: dialogWiring.ddx },
    { path: 'MfcToolkitDlg.init.cpp', content: dialogWiring.init },
    { path: 'MfcToolkitDlg.handlers.cpp', content: dialogWiring.handlers },
    ...miniProjectFiles,
  ];

  return {
    rootName: mode === 'basic' ? 'MfcToolkitSkeleton' : `MfcToolkitSkeleton-${mode}`, 
    files: [...docs, ...pkg.files.map((file) => ({ path: file.path, content: file.content }))],
  };
}

