export type NativeDependency = {
  moduleId: string;
  title: string;
  headers: string[];
  libs: string[];
  api: string;
  notes: string[];
};

export const nativeDependencies: NativeDependency[] = [
  {
    moduleId: 'serial',
    title: 'SerialManager 串口模块',
    headers: ['windows.h'],
    libs: ['Kernel32 / Win32 API'],
    api: 'CreateFile / SetCommState / SetCommTimeouts / ReadFile / WriteFile / CloseHandle',
    notes: [
      'COM10 及以上端口建议使用 \\\\.\\COM10 格式',
      'ReadFile/WriteFile 可能阻塞，建议放入 WorkerThread',
      '串口参数必须与设备一致：波特率、数据位、校验位、停止位',
    ],
  },
  {
    moduleId: 'tcp-client',
    title: 'TcpClient TCP 客户端',
    headers: ['winsock2.h', 'ws2tcpip.h'],
    libs: ['ws2_32.lib'],
    api: 'WSAStartup / socket / connect / send / recv / shutdown / closesocket',
    notes: [
      'connect/recv 不要直接放 UI 线程',
      '注意 WSAGetLastError 错误码',
      '工程中可使用 #pragma comment(lib, "ws2_32.lib") 或链接器配置',
    ],
  },
  {
    moduleId: 'tcp-server',
    title: 'TcpServer TCP 服务端',
    headers: ['winsock2.h', 'ws2tcpip.h'],
    libs: ['ws2_32.lib'],
    api: 'socket / bind / listen / accept / recv / send / closesocket',
    notes: [
      'accept 循环必须放入工作线程',
      '第一版模板只演示单客户端结构',
      'Stop 时要关闭监听 socket 让阻塞 accept 退出',
    ],
  },
  {
    moduleId: 'http-client',
    title: 'HttpClient HTTP 模块',
    headers: ['windows.h', 'winhttp.h'],
    libs: ['winhttp.lib'],
    api: 'WinHttpOpen / WinHttpCrackUrl / WinHttpConnect / WinHttpOpenRequest / WinHttpSendRequest / WinHttpReadData',
    notes: [
      'HTTPS 请求需要 WINHTTP_FLAG_SECURE',
      'POST JSON 需要 Content-Type: application/json',
      '网络请求建议放入 WorkerThread 并设置超时',
    ],
  },
  {
    moduleId: 'sqlite-store',
    title: 'SqliteStore SQLite CRUD',
    headers: ['sqlite3.h', 'windows.h', 'Shlwapi.h'],
    libs: ['sqlite3.lib', 'Shlwapi.lib'],
    api: 'sqlite3_open16 / sqlite3_prepare_v2 / sqlite3_bind_text / sqlite3_step / sqlite3_finalize / sqlite3_close',
    notes: [
      '需要准备 sqlite3.h、sqlite3.lib、sqlite3.dll 或静态库',
      '数据库默认放在 exe 旁边 data/mfc_toolkit.db',
      '多线程写库要串行化，避免 database is locked',
    ],
  },
  {
    moduleId: 'config-store',
    title: 'ConfigStore / INI 配置',
    headers: ['windows.h', 'Shlwapi.h'],
    libs: ['Shlwapi.lib', 'Kernel32 / Win32 API'],
    api: 'GetPrivateProfileString / WritePrivateProfileString / PathRemoveFileSpec / CreateDirectory',
    notes: [
      '配置目录建议放在 exe 旁边的 config 目录',
      '发布时注意写入权限',
      '路径处理使用 Shlwapi.lib',
    ],
  },
];

export function getNativeDependencies(moduleIds: string[]) {
  return nativeDependencies.filter((dep) => moduleIds.includes(dep.moduleId));
}

export function buildNativeApiNotes(moduleIds: string[]): string {
  const deps = getNativeDependencies(moduleIds);
  const body = deps
    .map(
      (dep) =>
        `## ${dep.title}\n\n- Headers：${dep.headers.join(', ')}\n- Libs：${dep.libs.join(', ')}\n- Native API：${dep.api}\n\n注意：\n${dep.notes.map((note) => `- ${note}`).join('\n')}`,
    )
    .join('\n\n');
  const libLines =
    Array.from(new Set(deps.flatMap((dep) => dep.libs).filter((lib) => lib.endsWith('.lib'))))
      .map((lib) => `#pragma comment(lib, "${lib}")`)
      .join('\n') || '// 当前选择未产生额外 .lib 依赖';
  return `# Native API Dependency\n\n本文件说明所选 MFC 模块需要的 Windows 原生 API、头文件和链接库。\n\n> 浏览器只生成模板；真实串口、TCP、HTTP、SQLite 访问需要在 Windows + Visual Studio + MFC 本地项目中编译运行。\n\n## 常用链接声明\n\n\`\`\`cpp\n${libLines}\n\`\`\`\n\n## 模块依赖\n\n${body || '未选择需要 Native API 的模块。'}\n\n## 通用原则\n\n- 所有可能阻塞的串口、TCP、HTTP 操作建议放入 WorkerThread。\n- 工作线程不要直接操作 MFC 控件，UI 更新应 PostMessage 回主线程。\n- 每接入一个模块就单独编译一次，优先解决第一个错误。\n`;
}
