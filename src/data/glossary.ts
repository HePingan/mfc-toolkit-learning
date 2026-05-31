export type GlossaryCategory = '基础概念' | '串口通讯' | '网络通讯' | 'MFC 框架' | 'C++ 核心' | '数据存储' | '项目架构';

export type GlossaryItem = {
  term: string;
  desc: string;
  category: GlossaryCategory;
  moduleId: string;
  aliases?: string[];
  pitfall?: string;
  example?: string;
};

export const glossary: GlossaryItem[] = [
  { term: '上位机', desc: '运行在 PC 上，用于控制、配置、监控下位设备的软件。', category: '基础概念', moduleId: 'overview', aliases: ['PC 工具', '调试工具'], pitfall: '不要只把它理解为界面程序，稳定通讯、日志、配置、异常处理同样重要。', example: 'MFC 通用调试工具就是典型上位机软件。' },
  { term: 'MFC', desc: 'Microsoft Foundation Classes，微软 C++ 桌面应用框架。', category: 'MFC 框架', moduleId: 'mfc', aliases: ['Microsoft Foundation Classes'], pitfall: 'MFC 本地编译需要 Windows + Visual Studio，本网站只做浏览器概念模拟。', example: 'Dialog 项目、按钮事件、消息映射都是 MFC 入门重点。' },
  { term: 'Dialog', desc: 'MFC 中常见的对话框窗口形态，适合做参数配置和调试工具主界面。', category: 'MFC 框架', moduleId: 'mfc', aliases: ['对话框', 'CDialogEx'], pitfall: '不要把所有业务逻辑都堆在 Dialog 按钮事件里，应拆分通讯层和数据层。' },
  { term: '消息映射', desc: 'MFC 将 Windows 消息映射到 C++ 成员函数的机制。', category: 'MFC 框架', moduleId: 'mfc', aliases: ['Message Map', 'ON_BN_CLICKED'], pitfall: '控件 ID、函数签名或消息宏不一致时，点击按钮可能没有任何反应。', example: 'ON_BN_CLICKED(IDC_BUTTON_SEND, &CMyDlg::OnBnClickedButtonSend)' },
  { term: '定时器', desc: 'MFC 可通过 WM_TIMER/SetTimer 周期执行轻量任务，例如刷新状态。', category: 'MFC 框架', moduleId: 'mfc', aliases: ['SetTimer', 'WM_TIMER'], pitfall: '定时器回调不要执行阻塞 IO，窗口销毁时记得 KillTimer。' },
  { term: '8N1', desc: '8 个数据位、None 无校验、1 个停止位，是常见串口格式。', category: '串口通讯', moduleId: 'serial', aliases: ['八位无校验一停止位'], pitfall: '双方数据位、校验位、停止位只要有一项不同，就可能乱码或收不到。', example: 'COM3, 9600, 8N1' },
  { term: 'RS232', desc: '常见串行通讯标准，适合较短距离点对点通讯。', category: '串口通讯', moduleId: 'serial', aliases: ['232'], pitfall: '电平和接线方式与 RS485 不同，不能只看都是串口就混用。' },
  { term: 'RS485', desc: '工业常用差分串行通讯标准，适合较长距离和多节点。', category: '串口通讯', moduleId: 'serial', aliases: ['485'], pitfall: '半双工场景要注意收发方向控制和总线冲突。' },
  { term: 'COM 口', desc: 'Windows 给串口设备分配的端口名，例如 COM1、COM3。', category: '串口通讯', moduleId: 'serial', aliases: ['串口号', 'PortName'], pitfall: '设备管理器中的端口号变化后，程序配置也要同步修改。' },
  { term: '波特率', desc: '串口每秒传输符号数量，常见值有 9600、115200。', category: '串口通讯', moduleId: 'serial', aliases: ['BaudRate'], pitfall: '上下位机波特率不一致是串口乱码的最常见原因之一。' },
  { term: 'ASCII', desc: '从字符角度表示数据，例如 HELLO 是五个字符。', category: '串口通讯', moduleId: 'serial', aliases: ['文本模式'], pitfall: '协议开发时不能只看字符，要知道底层实际发送的字节。', example: 'HELLO -> 48 45 4C 4C 4F' },
  { term: 'HEX', desc: '从字节角度用十六进制表示数据，适合协议帧调试。', category: '串口通讯', moduleId: 'serial', aliases: ['十六进制', '字节模式'], pitfall: 'HEX 字符串必须成对，且只能包含 0-9/A-F。' },
  { term: 'Modbus RTU', desc: '工业设备常用串口协议，帧中包含地址、功能码、数据和 CRC。', category: '串口通讯', moduleId: 'serial', aliases: ['Modbus'], pitfall: 'RTU 帧 CRC 低字节在前，很多初学者会把高低字节顺序写反。', example: '01 03 00 00 00 02 C4 0B' },
  { term: 'CRC16', desc: '循环冗余校验，用于发现通讯数据错误。', category: '串口通讯', moduleId: 'serial', aliases: ['CRC 校验'], pitfall: '算法参数、初值、多项式和字节顺序必须与协议一致。' },
  { term: 'HTTP', desc: '基于请求/响应模型的应用层协议，常用于接口测试。', category: '网络通讯', moduleId: 'network', aliases: ['GET', 'POST'], pitfall: 'HTTP 不是持续字节流，和 TCP Socket 的使用模型不同。' },
  { term: 'Header', desc: 'HTTP 请求头，用于传递 Host、Content-Type、认证信息等元数据。', category: '网络通讯', moduleId: 'network', aliases: ['请求头'], pitfall: 'POST JSON 时忘记 Content-Type: application/json 会导致后端解析失败。' },
  { term: 'JSON', desc: '常用结构化数据格式，适合 HTTP 接口传参和返回结果。', category: '网络通讯', moduleId: 'network', aliases: ['application/json'], pitfall: 'JSON 字符串必须使用双引号，不能带尾随逗号。' },
  { term: 'Socket', desc: '网络通讯端点，TCP Client/Server 通过 Socket 收发字节流。', category: '网络通讯', moduleId: 'network', aliases: ['套接字'], pitfall: 'TCP 是字节流，没有天然消息边界，需要处理粘包/拆包。' },
  { term: 'TCP Client', desc: '主动连接服务器的一端，连接成功后可发送和接收字节流。', category: '网络通讯', moduleId: 'network', aliases: ['客户端'], pitfall: '要处理连接失败、超时、断线重连和关闭释放。' },
  { term: 'TCP Server', desc: '监听指定 IP/Port，等待客户端接入并处理数据。', category: '网络通讯', moduleId: 'network', aliases: ['服务端', '监听'], pitfall: '监听端口可能被占用，防火墙也可能拦截连接。' },
  { term: '粘包/拆包', desc: 'TCP 字节流中一次 recv 不一定对应一次完整业务消息。', category: '网络通讯', moduleId: 'network', aliases: ['半包', 'packet framing'], pitfall: '需要用长度字段、分隔符或固定帧格式来切分消息。' },
  { term: '野指针', desc: '指向已释放或无效内存的指针，继续使用可能导致崩溃。', category: 'C++ 核心', moduleId: 'cpp-core', aliases: ['dangling pointer'], pitfall: 'delete 后指针变量不会自动变成 nullptr。', example: 'delete p; p = nullptr;' },
  { term: '内存泄漏', desc: '动态申请的内存没有释放，长期运行会导致内存占用持续增加。', category: 'C++ 核心', moduleId: 'cpp-core', aliases: ['memory leak'], pitfall: 'new/delete 成对管理困难时，优先考虑智能指针或 RAII。' },
  { term: 'STL', desc: 'C++ 标准模板库，提供 vector、queue、map 等常用容器和算法。', category: 'C++ 核心', moduleId: 'cpp-core', aliases: ['标准模板库'], pitfall: '容器越界访问和迭代器失效是常见错误。' },
  { term: 'vector', desc: '连续内存动态数组，适合随机访问和顺序追加。', category: 'C++ 核心', moduleId: 'cpp-core', aliases: ['动态数组'], pitfall: 'push_back 可能触发扩容，导致旧引用或迭代器失效。' },
  { term: 'queue', desc: '先进先出队列，适合保存待发送消息或待处理任务。', category: 'C++ 核心', moduleId: 'cpp-core', aliases: ['队列'], pitfall: '多线程同时读写 queue 时必须加锁。' },
  { term: '竞态条件', desc: '多个线程访问共享数据且时序不确定，导致结果错误。', category: 'C++ 核心', moduleId: 'cpp-core', aliases: ['race condition'], pitfall: '本地测试偶尔正常不代表没有竞态，问题可能只在压力下出现。' },
  { term: 'mutex', desc: '互斥锁，用于保护多线程共享资源。', category: 'C++ 核心', moduleId: 'cpp-core', aliases: ['互斥量', 'lock'], pitfall: '加锁范围过大影响性能，忘记解锁可能导致死锁。' },
  { term: 'lock_guard', desc: 'C++ RAII 风格锁管理对象，构造时加锁，离开作用域自动解锁。', category: 'C++ 核心', moduleId: 'cpp-core', aliases: ['std::lock_guard'], pitfall: 'lock_guard 生命周期就是锁持有时间，不要误以为只锁一行。' },
  { term: 'SQLite', desc: '轻量级嵌入式数据库，适合保存设备参数、历史记录和日志索引。', category: '数据存储', moduleId: 'storage', aliases: ['嵌入式数据库'], pitfall: '不要直接拼接用户输入生成 SQL，实际项目应使用参数化查询。' },
  { term: 'CRUD', desc: 'Create、Read、Update、Delete，即增删改查基本操作。', category: '数据存储', moduleId: 'storage', aliases: ['增删改查'], pitfall: '删除和修改操作要有明确条件，避免误操作全表。' },
  { term: 'INI', desc: '由 Section 和 Key=Value 构成的轻量配置文件格式。', category: '数据存储', moduleId: 'storage', aliases: ['配置文件'], pitfall: '注意编码、路径、权限和缺省值处理。', example: '[Serial]\nPort=COM3\nBaudRate=9600' },
  { term: '日志窗口', desc: '工具软件用于展示发送、接收、错误、状态变化的可观测区域。', category: '项目架构', moduleId: 'capstone', aliases: ['Log', 'Terminal'], pitfall: '没有日志会导致通讯问题难以定位；日志也要注意线程安全和容量限制。' },
  { term: '配置管理', desc: '保存串口、IP、端口、主题等参数，使工具下次启动可恢复状态。', category: '项目架构', moduleId: 'capstone', aliases: ['参数保存'], pitfall: '配置缺失、路径错误、版本升级兼容都是真实项目常见问题。' },
  { term: 'UI 线程', desc: '负责窗口绘制和用户交互的主线程，必须保持响应。', category: '项目架构', moduleId: 'capstone', aliases: ['主线程'], pitfall: '不要在 UI 线程中执行阻塞串口读取、Socket recv 或长时间循环。' },
  { term: '工作线程', desc: '用于执行耗时通讯、数据处理或后台任务的线程。', category: '项目架构', moduleId: 'capstone', aliases: ['后台线程'], pitfall: '工作线程不能随意直接操作 UI 控件，应使用安全的消息或同步机制。' },
];

export const glossaryCategories: Array<'全部' | GlossaryCategory> = ['全部', '基础概念', '串口通讯', '网络通讯', 'MFC 框架', 'C++ 核心', '数据存储', '项目架构'];
