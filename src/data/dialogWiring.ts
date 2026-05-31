export type DialogWiringBundle = {
  includes: string;
  members: string;
  ddx: string;
  init: string;
  handlers: string;
  markdown: string;
};

const has = (ids: string[], id: string) => ids.includes(id);

function buildIncludes(ids: string[]): string {
  const lines = ['#include "MfcToolkitDlg.h"'];
  if (has(ids, 'logger')) lines.push('#include "Logger.h"');
  if (has(ids, 'config-store')) lines.push('#include "ConfigStore.h"');
  if (has(ids, 'serial')) lines.push('#include "SerialManager.h"');
  if (has(ids, 'tcp-client')) lines.push('#include "TcpClient.h"');
  if (has(ids, 'tcp-server')) lines.push('#include "TcpServer.h"');
  if (has(ids, 'http-client')) lines.push('#include "HttpClient.h"');
  if (has(ids, 'sqlite-store')) lines.push('#include "SqliteStore.h"');
  if (has(ids, 'worker-thread')) lines.push('#include "WorkerThread.h"');
  return `// MfcToolkitDlg.includes.h\n// 放到 MfcToolkitDlg.cpp 顶部。\n${Array.from(new Set(lines)).join('\n')}`;
}

function buildMembers(ids: string[]): string {
  const ui = [
    'CTabCtrl m_tabMain;',
    'CListBox m_listLog;',
    'CStatic m_staticStatus;',
  ];
  if (has(ids, 'serial')) ui.push('CComboBox m_cmbSerialPort;', 'CEdit m_edtSerialSend;');
  if (has(ids, 'tcp-client')) ui.push('CEdit m_edtTcpHost;', 'CEdit m_edtTcpPort;', 'CEdit m_edtTcpSend;');
  if (has(ids, 'http-client')) ui.push('CEdit m_edtHttpUrl;', 'CEdit m_edtHttpBody;');
  if (has(ids, 'sqlite-store')) ui.push('CListBox m_lstSqliteRows;', 'CEdit m_edtSqlitePayload;');

  const modules: string[] = [];
  if (has(ids, 'logger')) modules.push('Logger m_logger;');
  if (has(ids, 'config-store')) modules.push('ConfigStore m_configStore;', 'AppConfig m_config;');
  if (has(ids, 'serial')) modules.push('SerialManager m_serial;');
  if (has(ids, 'tcp-client')) modules.push('TcpClient m_tcpClient;');
  if (has(ids, 'tcp-server')) modules.push('TcpServer m_tcpServer;');
  if (has(ids, 'http-client')) modules.push('HttpClient m_httpClient;');
  if (has(ids, 'sqlite-store')) modules.push('SqliteStore m_sqliteStore;');
  if (has(ids, 'worker-thread')) modules.push('WorkerThread m_worker;');

  const handlers = [
    'afx_msg void OnBnClickedClearLog();',
    ...(has(ids, 'serial') ? ['afx_msg void OnBnClickedSerialOpen();', 'afx_msg void OnBnClickedSerialSend();'] : []),
    ...(has(ids, 'tcp-client') ? ['afx_msg void OnBnClickedTcpConnect();', 'afx_msg void OnBnClickedTcpSend();'] : []),
    ...(has(ids, 'tcp-server') ? ['afx_msg void OnBnClickedTcpServerStart();'] : []),
    ...(has(ids, 'http-client') ? ['afx_msg void OnBnClickedHttpGet();', 'afx_msg void OnBnClickedHttpPost();'] : []),
    ...(has(ids, 'sqlite-store') ? ['afx_msg void OnBnClickedSqliteOpen();', 'afx_msg void OnBnClickedSqliteInsert();', 'afx_msg void OnBnClickedSqliteQuery();'] : []),
    ...(has(ids, 'config-store') ? ['afx_msg void OnBnClickedConfigLoad();', 'afx_msg void OnBnClickedConfigSave();'] : []),
    ...(has(ids, 'worker-thread') ? ['afx_msg void OnBnClickedTaskStart();', 'afx_msg void OnBnClickedTaskStop();'] : []),
  ];

  return `// MfcToolkitDlg.members.h\n// 放到 CMfcToolkitDlg 类 private/public 区域，按实际控件删减。\n\nprivate:\n  ${ui.join('\n  ')}\n\n  // Utility modules\n  ${modules.join('\n  ') || '// 未选择模块类'}\n\npublic:\n  ${handlers.join('\n  ')}`;
}

function buildDdx(ids: string[]): string {
  const lines = [
    'DDX_Control(pDX, IDC_TAB_MAIN, m_tabMain);',
    'DDX_Control(pDX, IDC_LIST_LOG, m_listLog);',
    'DDX_Control(pDX, IDC_STATIC_STATUS, m_staticStatus);',
  ];
  if (has(ids, 'serial')) lines.push('DDX_Control(pDX, IDC_CMB_SERIAL_PORT, m_cmbSerialPort);', 'DDX_Control(pDX, IDC_EDT_SERIAL_SEND, m_edtSerialSend);');
  if (has(ids, 'tcp-client')) lines.push('DDX_Control(pDX, IDC_EDT_TCP_HOST, m_edtTcpHost);', 'DDX_Control(pDX, IDC_EDT_TCP_PORT, m_edtTcpPort);', 'DDX_Control(pDX, IDC_EDT_TCP_SEND, m_edtTcpSend);');
  if (has(ids, 'http-client')) lines.push('DDX_Control(pDX, IDC_EDT_HTTP_URL, m_edtHttpUrl);', 'DDX_Control(pDX, IDC_EDT_HTTP_BODY, m_edtHttpBody);');
  if (has(ids, 'sqlite-store')) lines.push('DDX_Control(pDX, IDC_LIST_SQLITE_ROWS, m_lstSqliteRows);', 'DDX_Control(pDX, IDC_EDT_SQLITE_PAYLOAD, m_edtSqlitePayload);');
  return `// MfcToolkitDlg.ddx.cpp\nvoid CMfcToolkitDlg::DoDataExchange(CDataExchange* pDX)\n{\n  CDialogEx::DoDataExchange(pDX);\n  ${lines.join('\n  ')}\n}`;
}

function buildInit(ids: string[]): string {
  const lines = ['CDialogEx::OnInitDialog();'];
  if (has(ids, 'logger')) {
    lines.push(`m_logger.SetCallback([this](LogLevel, const CString& line) {\n    m_listLog.AddString(line);\n    m_listLog.SetCurSel(m_listLog.GetCount() - 1);\n  });`);
  }
  if (has(ids, 'config-store')) {
    lines.push(`CString error;\n  if (m_configStore.Load(m_config, error)) {\n    ${has(ids, 'logger') ? 'm_logger.Info(_T("配置加载成功"));' : 'AppendLog(_T("INFO"), _T("配置加载成功"));'}\n  }`);
  }
  if (has(ids, 'serial')) {
    lines.push('m_cmbSerialPort.AddString(_T("COM1"));\n  m_cmbSerialPort.AddString(_T("COM2"));\n  m_cmbSerialPort.AddString(_T("COM3"));\n  m_cmbSerialPort.SetWindowText(m_config.serialPort);');
  }
  if (has(ids, 'sqlite-store')) {
    lines.push(`CString sqliteError;\n  if (m_sqliteStore.Open(m_sqliteStore.DefaultDbPath(), sqliteError)) {\n    ${has(ids, 'logger') ? 'm_logger.Info(_T("SQLite 数据库已打开"));' : 'AppendLog(_T("INFO"), _T("SQLite 数据库已打开"));'}\n  } else {\n    ${has(ids, 'logger') ? 'm_logger.Error(sqliteError);' : 'AppendLog(_T("ERROR"), sqliteError);'}\n  }`);
  }
  return `// MfcToolkitDlg.init.cpp\nBOOL CMfcToolkitDlg::OnInitDialog()\n{\n  ${lines.join('\n  ')}\n  return TRUE;\n}`;
}

function logLine(ids: string[], level: 'Info' | 'Error', expr: string) {
  return has(ids, 'logger') ? `m_logger.${level}(${expr});` : `AppendLog(_T("${level.toUpperCase()}"), ${expr});`;
}

function buildHandlers(ids: string[]): string {
  const parts: string[] = [];
  parts.push(`void CMfcToolkitDlg::OnBnClickedClearLog()\n{\n  m_listLog.ResetContent();\n}`);
  if (has(ids, 'serial')) {
    parts.push(`void CMfcToolkitDlg::OnBnClickedSerialOpen()\n{\n  SerialConfig config;\n  config.port = m_config.serialPort;\n  config.baudRate = m_config.baudRate;\n  CString error;\n  if (m_serial.Open(config, error)) {\n    ${logLine(ids, 'Info', '_T("串口打开成功")')}\n  } else {\n    ${logLine(ids, 'Error', 'error')}\n  }\n}\n\nvoid CMfcToolkitDlg::OnBnClickedSerialSend()\n{\n  CString text;\n  m_edtSerialSend.GetWindowText(text);\n  CString error;\n  if (!m_serial.WriteText(text, error)) {\n    ${logLine(ids, 'Error', 'error')}\n  }\n}`);
  }
  if (has(ids, 'tcp-client')) {
    parts.push(`void CMfcToolkitDlg::OnBnClickedTcpConnect()\n{\n  CString error;\n  if (m_tcpClient.Connect(m_config.tcpHost, m_config.tcpPort, error)) {\n    ${logLine(ids, 'Info', '_T("TCP 连接成功")')}\n  } else {\n    ${logLine(ids, 'Error', 'error')}\n  }\n}\n\nvoid CMfcToolkitDlg::OnBnClickedTcpSend()\n{\n  CString text;\n  m_edtTcpSend.GetWindowText(text);\n  CString error;\n  if (!m_tcpClient.SendText(text, error)) {\n    ${logLine(ids, 'Error', 'error')}\n  }\n}`);
  }
  if (has(ids, 'tcp-server')) {
    parts.push(`void CMfcToolkitDlg::OnBnClickedTcpServerStart()\n{\n  CString error;\n  if (m_tcpServer.Start(m_config.tcpPort, error)) {\n    ${logLine(ids, 'Info', '_T("TCP 服务端已监听")')}\n  } else {\n    ${logLine(ids, 'Error', 'error')}\n  }\n}`);
  }
  if (has(ids, 'http-client')) {
    parts.push(`void CMfcToolkitDlg::OnBnClickedHttpGet()\n{\n  HttpResponse response = m_httpClient.Get(m_config.httpUrl);\n  if (response.error.IsEmpty()) {\n    ${logLine(ids, 'Info', 'response.body')}\n  } else {\n    ${logLine(ids, 'Error', 'response.error')}\n  }\n}\n\nvoid CMfcToolkitDlg::OnBnClickedHttpPost()\n{\n  CString body;\n  m_edtHttpBody.GetWindowText(body);\n  HttpResponse response = m_httpClient.PostJson(m_config.httpUrl, body);\n  if (response.error.IsEmpty()) {\n    ${logLine(ids, 'Info', 'response.body')}\n  } else {\n    ${logLine(ids, 'Error', 'response.error')}\n  }\n}`);
  }
  if (has(ids, 'sqlite-store')) {
    parts.push(`void CMfcToolkitDlg::OnBnClickedSqliteOpen()\n{\n  CString error;\n  if (m_sqliteStore.Open(m_sqliteStore.DefaultDbPath(), error)) {\n    ${logLine(ids, 'Info', '_T("SQLite 数据库打开成功")')}\n  } else {\n    ${logLine(ids, 'Error', 'error')}\n  }\n}\n\nvoid CMfcToolkitDlg::OnBnClickedSqliteInsert()\n{\n  CString payload;\n  m_edtSqlitePayload.GetWindowText(payload);\n  CString error;\n  if (m_sqliteStore.InsertHistory(_T("manual"), payload, error)) {\n    ${logLine(ids, 'Info', '_T("SQLite 历史记录已写入")')}\n  } else {\n    ${logLine(ids, 'Error', 'error')}\n  }\n}\n\nvoid CMfcToolkitDlg::OnBnClickedSqliteQuery()\n{\n  std::vector<HistoryRow> rows;\n  CString error;\n  m_lstSqliteRows.ResetContent();\n  if (m_sqliteStore.QueryHistory(rows, 50, error)) {\n    for (const auto& row : rows) {\n      CString line;\n      line.Format(_T("%d | %s | %s | %s"), row.id, row.channel.GetString(), row.payload.GetString(), row.createdAt.GetString());\n      m_lstSqliteRows.AddString(line);\n    }\n  } else {\n    ${logLine(ids, 'Error', 'error')}\n  }\n}`);
  }
  if (has(ids, 'config-store')) {
    parts.push(`void CMfcToolkitDlg::OnBnClickedConfigLoad()\n{\n  CString error;\n  if (m_configStore.Load(m_config, error)) {\n    ${logLine(ids, 'Info', '_T("配置加载成功")')}\n  } else {\n    ${logLine(ids, 'Error', 'error')}\n  }\n}\n\nvoid CMfcToolkitDlg::OnBnClickedConfigSave()\n{\n  CString error;\n  if (m_configStore.Save(m_config, error)) {\n    ${logLine(ids, 'Info', '_T("配置保存成功")')}\n  } else {\n    ${logLine(ids, 'Error', 'error')}\n  }\n}`);
  }
  if (has(ids, 'worker-thread')) {
    parts.push(`void CMfcToolkitDlg::OnBnClickedTaskStart()\n{\n  if (m_worker.Start([this](std::atomic_bool& stopFlag) {\n    while (!stopFlag) {\n      // TODO: 在这里轮询串口/TCP/HTTP；不要直接操作 MFC 控件。\n      Sleep(200);\n    }\n  })) {\n    ${logLine(ids, 'Info', '_T("工作线程已启动")')}\n  }\n}\n\nvoid CMfcToolkitDlg::OnBnClickedTaskStop()\n{\n  m_worker.Stop(3000);\n  ${logLine(ids, 'Info', '_T("工作线程已停止")')}\n}`);
  }
  return `// MfcToolkitDlg.handlers.cpp\n// 按钮事件示例：复制到 CMfcToolkitDlg.cpp 后，按实际控件和线程策略调整。\n${parts.join('\n\n')}`;
}

export function buildDialogWiring(ids: string[]): DialogWiringBundle {
  const includes = buildIncludes(ids);
  const members = buildMembers(ids);
  const ddx = buildDdx(ids);
  const init = buildInit(ids);
  const handlers = buildHandlers(ids);
  const markdown = `# Dialog Wiring Preview\n\nCodegen v5 SQLite CRUD + Dialog 事件函数自动拼接。以下片段用于把模块类接到 MFC Dialog 控件、Message Map 和按钮事件中。\n\n> 注意：阻塞串口/TCP/HTTP 操作不要直接放 UI 线程；需要 WorkerThread 或 PostMessage 回主线程。\n\n## Includes\n\n\`\`\`cpp\n${includes}\n\`\`\`\n\n## Members\n\n\`\`\`cpp\n${members}\n\`\`\`\n\n## DoDataExchange\n\n\`\`\`cpp\n${ddx}\n\`\`\`\n\n## OnInitDialog\n\n\`\`\`cpp\n${init}\n\`\`\`\n\n## Handlers\n\n\`\`\`cpp\n${handlers}\n\`\`\`\n`;
  return { includes, members, ddx, init, handlers, markdown };
}
