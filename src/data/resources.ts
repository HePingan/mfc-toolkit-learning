export type ResourceKind =
  | '官方文档'
  | '工具'
  | '教程'
  | '速查表'
  | '项目模板'
  | '知识漫画'
  | '原始来源';
export type ResourceCategory =
  | '环境搭建'
  | 'MFC'
  | '串口/Modbus'
  | 'HTTP/TCP'
  | 'C++'
  | 'SQLite/INI'
  | '综合项目';

export type ResourceItem = {
  title: string;
  kind: ResourceKind;
  category: ResourceCategory;
  url: string;
  note: string;
  recommendedFor: string[];
};

export const resources: ResourceItem[] = [
  {
    title: '原始内容来源：通用工具',
    kind: '原始来源',
    category: '综合项目',
    url: 'https://blog.1ct7.top/read_12',
    note: '本学习站围绕该清单课程化，公开发布时建议保留来源说明。',
    recommendedFor: ['课程导览', '综合项目'],
  },
  {
    title: 'Visual Studio Installer：C++ 桌面开发工作负载',
    kind: '官方文档',
    category: '环境搭建',
    url: 'https://learn.microsoft.com/zh-cn/cpp/build/vscpp-step-0-installation',
    note: '安装 Visual Studio、MSVC、Windows SDK 和 C++ 桌面开发组件。',
    recommendedFor: ['课程导览', 'MFC'],
  },
  {
    title: 'MFC 桌面应用程序入门',
    kind: '官方文档',
    category: 'MFC',
    url: 'https://learn.microsoft.com/zh-cn/cpp/mfc/mfc-desktop-applications',
    note: '理解 MFC 应用类型、Dialog、Document/View 和基本框架。',
    recommendedFor: ['MFC 框架入门'],
  },
  {
    title: 'MFC 消息映射机制',
    kind: '官方文档',
    category: 'MFC',
    url: 'https://learn.microsoft.com/zh-cn/cpp/mfc/reference/message-maps-mfc',
    note: '学习 BEGIN_MESSAGE_MAP、ON_BN_CLICKED、ON_WM_TIMER 等宏的作用。',
    recommendedFor: ['MFC 框架入门', '综合项目'],
  },
  {
    title: 'MFC Dialog 控件与 DDX 思路',
    kind: '教程',
    category: 'MFC',
    url: '#',
    note: '建议配合本站 /designer 和 /integration 使用，先规划控件 ID，再接线。',
    recommendedFor: ['MFC 框架入门'],
  },
  {
    title: '串口调试助手 / 虚拟串口工具',
    kind: '工具',
    category: '串口/Modbus',
    url: '#',
    note: '本地验证 COM、波特率、校验位、ASCII/HEX 的最快方式。',
    recommendedFor: ['串口通讯基础'],
  },
  {
    title: 'Modbus RTU 帧格式速查',
    kind: '速查表',
    category: '串口/Modbus',
    url: '#',
    note: '重点记住从站地址、功能码、起始地址、寄存器数量和 CRC16 低字节在前。',
    recommendedFor: ['串口通讯基础'],
  },
  {
    title: 'RS232 与 RS485 差异清单',
    kind: '速查表',
    category: '串口/Modbus',
    url: '#',
    note: 'RS485 半双工、总线、终端电阻、方向控制是现场常见坑。',
    recommendedFor: ['串口通讯基础', '故障排查'],
  },
  {
    title: 'Windows 串口通信 API 概念',
    kind: '官方文档',
    category: '串口/Modbus',
    url: 'https://learn.microsoft.com/en-us/windows/win32/devio/communications-resources',
    note: '理解 CreateFile、ReadFile、WriteFile、DCB、COMMTIMEOUTS 等概念。',
    recommendedFor: ['串口通讯基础', '代码生成器'],
  },
  {
    title: 'HTTP 报文结构速查',
    kind: '速查表',
    category: 'HTTP/TCP',
    url: '#',
    note: '请求行、Header、Body、Content-Type 是 HTTP 调试的核心。',
    recommendedFor: ['HTTP 与 TCP/Socket'],
  },
  {
    title: 'WinHTTP 客户端 API',
    kind: '官方文档',
    category: 'HTTP/TCP',
    url: 'https://learn.microsoft.com/en-us/windows/win32/winhttp/about-winhttp',
    note: 'MFC/Win32 本地 HTTP 请求可参考 WinHTTP；网页实验只模拟请求文本。',
    recommendedFor: ['HTTP 与 TCP/Socket', '代码生成器'],
  },
  {
    title: 'Winsock 入门',
    kind: '官方文档',
    category: 'HTTP/TCP',
    url: 'https://learn.microsoft.com/en-us/windows/win32/winsock/getting-started-with-winsock',
    note: 'TCP Client/Server 本地实践需要理解 socket、connect、listen、accept、send、recv。',
    recommendedFor: ['HTTP 与 TCP/Socket', '综合项目'],
  },
  {
    title: 'TCP 粘包/拆包处理思路',
    kind: '教程',
    category: 'HTTP/TCP',
    url: '#',
    note: '建议使用长度头、分隔符或协议帧边界，不要假设一次 recv 就是一条完整消息。',
    recommendedFor: ['HTTP 与 TCP/Socket', '故障排查'],
  },
  {
    title: 'C++ 对象生命周期与 RAII',
    kind: '教程',
    category: 'C++',
    url: 'https://en.cppreference.com/w/cpp/language/raii',
    note: '上位机工具稳定性依赖资源释放、异常安全和生命周期管理。',
    recommendedFor: ['C++ 核心能力'],
  },
  {
    title: 'std::vector 参考',
    kind: '官方文档',
    category: 'C++',
    url: 'https://en.cppreference.com/w/cpp/container/vector',
    note: '连续存储、随机访问、扩容、越界是学习重点。',
    recommendedFor: ['C++ 核心能力'],
  },
  {
    title: 'std::queue 参考',
    kind: '官方文档',
    category: 'C++',
    url: 'https://en.cppreference.com/w/cpp/container/queue',
    note: '适合待发送消息、日志队列等先进先出场景。',
    recommendedFor: ['C++ 核心能力'],
  },
  {
    title: 'std::mutex 与 lock_guard',
    kind: '官方文档',
    category: 'C++',
    url: 'https://en.cppreference.com/w/cpp/thread/mutex',
    note: '理解竞态条件、临界区、锁生命周期和线程退出。',
    recommendedFor: ['C++ 核心能力', '综合项目'],
  },
  {
    title: 'SQLite C/C++ API',
    kind: '官方文档',
    category: 'SQLite/INI',
    url: 'https://www.sqlite.org/cintro.html',
    note: '学习 sqlite3_open、prepare、bind、step、finalize 的基本流程。',
    recommendedFor: ['SQLite 与 INI 文件读写'],
  },
  {
    title: 'SQLite 参数化查询思路',
    kind: '教程',
    category: 'SQLite/INI',
    url: '#',
    note: '真实项目不要直接拼接用户输入，设备名、备注和路径都可能包含特殊字符。',
    recommendedFor: ['SQLite 与 INI 文件读写', '综合项目'],
  },
  {
    title: 'INI 配置文件格式速查',
    kind: '速查表',
    category: 'SQLite/INI',
    url: '#',
    note: 'Section、Key=Value、默认值、编码、路径权限是本章重点。',
    recommendedFor: ['SQLite 与 INI 文件读写'],
  },
  {
    title: '本站：本地 MFC 实战桥接',
    kind: '项目模板',
    category: '综合项目',
    url: '/practice',
    note: '把网页实验转成 Windows + Visual Studio + MFC 实战任务。',
    recommendedFor: ['综合项目', '课程导览'],
  },
  {
    title: '本站：MFC 代码骨架生成器',
    kind: '项目模板',
    category: '综合项目',
    url: '/codegen',
    note: '生成 Serial、TCP、HTTP、SQLite/INI、Logger、Thread 等模板文件。',
    recommendedFor: ['综合项目', '代码生成器'],
  },
  {
    title: '本站：Dialog 控件布局设计器',
    kind: '项目模板',
    category: 'MFC',
    url: '/designer',
    note: '在浏览器中规划控件、控件 ID、按钮事件和 Message Map。',
    recommendedFor: ['MFC 框架入门', '综合项目'],
  },
  {
    title: '本站：本地项目集成向导',
    kind: '教程',
    category: '综合项目',
    url: '/integration',
    note: '按 6 步把生成代码接入 Visual Studio MFC 项目，并处理常见编译错误。',
    recommendedFor: ['综合项目', '故障排查'],
  },
  {
    title: '本站：故障排查训练场',
    kind: '教程',
    category: '综合项目',
    url: '/troubleshooting',
    note: '训练“症状 → 证据 → 根因 → 修复步骤”的现场排错能力。',
    recommendedFor: ['故障排查', '综合项目'],
  },
  {
    title: '本站：MFC 知识漫画工坊',
    kind: '知识漫画',
    category: '综合项目',
    url: '/comics',
    note: '用 baoyu-comic 思路整理串口/Modbus、MFC Message Map、线程锁和 SQLite/INI 的单页漫画 prompt，可接入 Wan2.7Pro 批量出图。',
    recommendedFor: ['课程导览', '综合项目', '故障排查'],
  },
  {
    title: '本站：学习报告与项目交付包',
    kind: '项目模板',
    category: '综合项目',
    url: '/reports',
    note: '汇总学习进度、实验、测验、错题、本地实践和 Capstone 自评。',
    recommendedFor: ['综合项目'],
  },
  {
    title: 'MFC 通用调试工具验收清单',
    kind: '速查表',
    category: '综合项目',
    url: '/capstone',
    note: '对照必做项和加分项，逐项完成最终项目。',
    recommendedFor: ['综合项目'],
  },
  {
    title: '日志窗口设计建议',
    kind: '教程',
    category: '综合项目',
    url: '#',
    note: '建议统一日志格式：时间、模块、级别、消息；所有异常都写入日志。',
    recommendedFor: ['综合项目', 'C++ 核心能力'],
  },
  {
    title: '上位机项目测试清单',
    kind: '速查表',
    category: '综合项目',
    url: '#',
    note: '至少测试启动、错误配置、断线、超时、数据库路径、关闭线程和日志导出。',
    recommendedFor: ['综合项目'],
  },
];

export const recommendedOrder = [
  '课程导览',
  '串口通讯',
  'HTTP/TCP',
  'MFC 框架',
  'C++ 核心',
  'SQLite/INI',
  '综合项目',
];
export const resourceCategories: ResourceCategory[] = [
  '环境搭建',
  'MFC',
  '串口/Modbus',
  'HTTP/TCP',
  'C++',
  'SQLite/INI',
  '综合项目',
];
export const resourceKinds: ResourceKind[] = [
  '官方文档',
  '工具',
  '教程',
  '速查表',
  '项目模板',
  '知识漫画',
  '原始来源',
];
