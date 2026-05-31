export type LessonSectionData = {
  heading: string;
  body: string;
  bullets?: string[];
  code?: string;
};

export type CourseModule = {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  estimatedMinutes: number;
  objectives: string[];
  concepts: string[];
  sections: LessonSectionData[];
  labs: string[];
  quizId: string;
  projectTask: string;
  commonMistakes: string[];
  resources: string[];
  chapterSummary?: string;
  localPractice?: {
    title: string;
    steps: string[];
    acceptance: string[];
    relatedRoute?: string;
  };
  nextActions?: string[];
};

export const modules: CourseModule[] = [
  {
    id: 'overview',
    title: '课程导览与开发环境',
    subtitle: '理解最终工具形态，准备 Visual Studio、C++ 与 MFC 环境',
    description: '先建立全局地图：你最终不是只学语法，而是要做一个面向设备通讯、参数配置、日志调试的 MFC 通用工具。',
    icon: '🧭',
    estimatedMinutes: 45,
    labs: [],
    quizId: 'overview',
    objectives: ['了解课程最终要完成的 MFC 通用调试工具', '理解 UI 层、通讯层、数据层、工具层如何配合', '明确 Windows + Visual Studio + MFC 的本地实践环境'],
    concepts: ['上位机工具', 'MFC Dialog', 'Visual Studio', '模块化', '前端模拟与本地实践边界'],
    commonMistakes: ['把网页实验误解为真实 MFC 编译环境', '一开始就写所有功能，缺少模块拆分', '忽略日志、配置、异常提示等工具软件基础能力'],
    projectTask: '画出你的 MFC 通用工具草图：顶部 Tab、左侧参数、右侧日志、底部状态栏。',
    resources: ['Visual Studio 安装 MFC 组件', 'Windows 桌面开发工作负载', 'MFC Dialog 项目模板'],

    chapterSummary: '本章先把学习目标、工具边界和本地环境说清楚。网页负责模拟和引导，真正的 MFC 编译、控件拖拽、串口和 Socket 调试都要回到 Windows + Visual Studio。',
    localPractice: {
      title: '准备 Windows + Visual Studio + MFC 开发环境',
      steps: ['安装 Visual Studio，勾选“使用 C++ 的桌面开发”工作负载', '在单个组件中确认已安装 MFC/ATL 支持', '创建一个 MFC Dialog 测试项目并运行空窗口', '记录项目字符集、平台工具集和输出目录'],
      acceptance: ['能成功运行空的 MFC Dialog 程序', '能找到资源视图、类向导、控件属性和消息映射入口', '知道网页实验只是模拟，不替代本地编译'],
      relatedRoute: '/practice'
    },
    nextActions: ['进入学习路线页确认 7 个模块顺序', '打开本地实战桥接页准备 Visual Studio 清单', '完成导览测验后再进入串口通讯基础'],
    sections: [

      { heading: '环境准备检查清单', body: '本地实践前先确认 Visual Studio 已安装 C++ 桌面开发和 MFC/ATL 组件。新建 MFC App 时建议先选择 Dialog based，跑通空窗口后再逐步加控件。', bullets: ['确认能打开资源视图和类向导', '确认 Debug/Release 与 x86/x64 配置', '先跑通空项目，再接入通讯模块'] },
      { heading: '学习边界', body: '浏览器页面适合做概念模拟、流程演练和代码模板生成；真实串口、WinSock、WinHTTP、SQLite C API 需要在 Windows 本地工程中验证。不要把网页模拟结果当成硬件连通证明。' },      { heading: '为什么要先看全局', body: '工业通信工具往往不是单点知识，而是串口、TCP、HTTP、数据保存、线程和 UI 事件共同工作的结果。先理解最终形态，后面的每个知识点才知道用在哪里。', bullets: ['串口用于设备近距离通讯', 'TCP/HTTP 用于网络通讯', 'SQLite/INI 用于保存参数和历史', '多线程用于避免界面卡死'] },
      { heading: '本课程的实践方式', body: '网页中所有实验均为浏览器内模拟，帮助理解概念；真正的 MFC 编译、串口、Socket 和 SQLite SDK 接入需要在 Windows + Visual Studio 中完成。', code: '// 示例：最终项目模块划分\nUI Layer -> Communication Layer -> Storage Layer -> Utility Layer' },
    ],
  },
  {
    id: 'serial',
    title: '串口通讯基础',
    subtitle: 'RS232/RS485、COM、波特率、8N1、ASCII/HEX、Modbus',
    description: '串口是上位机与工控设备通讯的常见入口。本章重点是把参数说清楚，把数据格式分清楚，把 Modbus 帧看明白。',
    icon: '🔌',
    estimatedMinutes: 120,
    labs: ['serial-config', 'hex-ascii', 'modbus-frame'],
    quizId: 'serial',
    objectives: ['能解释 COM、波特率、数据位、校验位、停止位', '能区分 ASCII 文本和 HEX 字节', '能构造读取保持寄存器的 Modbus RTU 示例帧'],
    concepts: ['RS232', 'RS485', 'COM', 'BaudRate', '8N1', 'ASCII', 'HEX', 'Modbus RTU', 'CRC16'],
    commonMistakes: ['COM 口选错', '波特率不一致', '校验位不一致', 'ASCII 和 HEX 混淆', 'RS485 半双工方向控制处理不当'],
    projectTask: '设计串口调试 Tab：参数选择、打开/关闭串口、发送区、接收日志、ASCII/HEX 切换。',
    resources: ['Modbus RTU 帧格式速查', '串口调试助手使用方法', 'RS232 与 RS485 区别'],

    chapterSummary: '串口学习的关键是参数一致、字节视角和协议边界。先用网页实验理解 COM、8N1、ASCII/HEX 和 Modbus 帧，再在本地 MFC 中实现打开串口、发送、接收和日志显示。',
    localPractice: {
      title: '实现串口调试 Tab 的第一版',
      steps: ['在 Dialog 中放置 COM、BaudRate、DataBits、Parity、StopBits 下拉框', '添加打开/关闭串口、发送、清空日志按钮', '设计接收日志 ListBox 或多行 Edit', '先用串口调试助手或虚拟串口验证参数一致性', '把 ASCII/HEX 切换和 Modbus 示例帧作为发送区模式'],
      acceptance: ['界面能清楚显示 COM3, 9600, 8N1 这类配置', '能说明乱码时优先排查波特率、校验位、ASCII/HEX', '能生成带 CRC16 的 Modbus RTU 示例帧'],
      relatedRoute: '/codegen'
    },
    nextActions: ['完成串口参数模拟器', '完成 ASCII/HEX 转换器', '尝试用代码生成器生成 SerialManager 模板'],
    sections: [

      { heading: '本地排查顺序', body: '串口收不到数据时不要急着改代码，先按物理连接、COM 口、波特率、数据位、校验位、停止位、ASCII/HEX 模式、协议 CRC 的顺序排查。', bullets: ['先用串口调试助手验证设备可通信', '再接入 MFC 串口类', '最后检查日志和线程接收逻辑'] },
      { heading: 'RS232 与 RS485 实战差异', body: 'RS232 常见于点对点连接，RS485 常见于总线和半双工场景。RS485 方向控制、终端电阻、从站地址和轮询间隔都会影响现场稳定性。' },      { heading: '串口参数怎么读', body: 'COM3, 9600, 8N1 表示端口 COM3、波特率 9600、8 个数据位、无校验、1 个停止位。双方参数只要有一项不一致，就可能乱码或完全收不到。', bullets: ['COM：系统分配的串口名', 'BaudRate：每秒符号速率', 'Parity：奇偶校验', 'StopBits：停止位长度'] },
      { heading: 'ASCII 与 HEX', body: 'ASCII 是字符视角，HEX 是字节视角。发送 HELLO 的 HEX 字节是 48 45 4C 4C 4F。做协议时通常要按字节理解数据。', code: '// 示例：HELLO 的字节\n48 45 4C 4C 4F' },
      { heading: 'Modbus RTU 帧', body: '常见读保持寄存器帧由从站地址、功能码、起始地址、寄存器数量和 CRC16 组成。注意 CRC 在 RTU 帧中低字节在前。', code: '// 示例：01 03 00 00 00 02 C4 0B\n01=从站地址, 03=读保持寄存器, 0000=起始地址, 0002=数量, C40B=CRC' },
    ],
  },
  {
    id: 'network',
    title: 'HTTP 与 TCP/Socket',
    subtitle: 'GET/POST、Header、Body、JSON/XML、Socket Client/Server',
    description: 'HTTP 更像请求/响应，TCP Socket 更像持续连接的数据通道。上位机工具经常需要同时支持这两类通讯。',
    icon: '🌐',
    estimatedMinutes: 135,
    labs: ['http-builder', 'tcp-simulator'],
    quizId: 'network',
    objectives: ['能读懂 HTTP 原始请求结构', '能说明 GET/POST、Header、Body 的分工', '能理解 TCP Client/Server 的连接、发送、接收、关闭流程'],
    concepts: ['HTTP', 'GET', 'POST', 'Header', 'Body', 'JSON', 'XML', 'Socket', 'IP', 'Port', '粘包/拆包'],
    commonMistakes: ['IP/Port 写错', 'JSON 格式错误', 'Content-Type 缺失', '把 HTTP 和 TCP 层级混为一谈', '没有处理连接关闭和异常'],
    projectTask: '实现 TCP Client 与 Server 两个 Tab 的 UI 草图，并设计 HTTP 请求测试面板。',
    resources: ['HTTP 报文结构', 'Socket Client/Server 基础', 'JSON 与 XML 数据格式'],

    chapterSummary: 'HTTP 是请求/响应模型，TCP Socket 是持续连接的字节流模型。网页中只模拟报文和日志，本地项目中要重点处理超时、断线、粘包/拆包和线程更新 UI。',
    localPractice: {
      title: '设计 TCP Client/Server 与 HTTP 测试面板',
      steps: ['为 TCP Client 设计 IP、Port、Connect、Send、Disconnect 控件', '为 TCP Server 设计 Listen Port、Start、Stop 和客户端日志', '为 HTTP 面板设计 Method、URL、Header、Body 和响应显示区', '把网络收发放到工作线程，避免阻塞 UI', '用日志统一记录 connect/send/recv/error'],
      acceptance: ['能区分 HTTP 请求文本和 TCP 字节流日志', '能解释粘包/拆包为什么不能靠一次 recv 判断完整消息', '能说明网络异常要有超时、断线和错误提示'],
      relatedRoute: '/integration'
    },
    nextActions: ['完成 HTTP 请求构造器', '完成 TCP Client/Server 模拟器', '到故障排查训练场练习连接失败案例'],
    sections: [

      { heading: '粘包/拆包意识', body: 'TCP 是字节流，不保证一次 send 对应一次 recv。工程中应设计消息边界，例如固定长度头、分隔符、长度字段或应用层协议。', code: '// 示例：长度头思路\n[4 bytes length][payload bytes]\nrecv 后按 length 拼完整消息' },
      { heading: '线程与超时', body: '网络连接、接收和 HTTP 请求都可能阻塞。MFC 中应把这些操作放到工作线程，并为连接、读取、请求设置超时和错误日志。' },      { heading: 'HTTP 请求结构', body: 'HTTP 请求由请求行、请求头和请求体组成。GET 常把查询参数放 URL；POST 常把 JSON/XML 放 Body，并用 Content-Type 告诉服务器格式。', code: 'POST /api/device HTTP/1.1\nHost: example.com\nContent-Type: application/json\n\n{"id":1,"status":"on"}' },
      { heading: 'TCP 通讯流程', body: 'TCP 是面向连接的字节流。Client 连接 Server 后发送数据，Server 接收并回发。实际工程里还要考虑粘包/拆包、超时、断线重连。', bullets: ['Server listen', 'Client connect', 'send / recv', 'close / reconnect'] },
    ],
  },
  {
    id: 'mfc',
    title: 'MFC 框架入门',
    subtitle: 'Dialog、控件、按钮事件、消息映射、定时器、键盘输入',
    description: 'MFC 的关键不是背 API，而是理解 Windows 消息如何经过消息映射进入你的 C++ 成员函数。',
    icon: '🪟',
    estimatedMinutes: 150,
    labs: ['mfc-message-map'],
    quizId: 'mfc',
    objectives: ['能创建 MFC Dialog 项目', '理解控件 ID、事件处理函数和消息映射', '知道 UI 线程不能被耗时通讯阻塞'],
    concepts: ['Dialog', 'Control ID', 'ON_BN_CLICKED', 'ON_WM_TIMER', 'ON_WM_KEYDOWN', '消息映射', 'UI 线程'],
    commonMistakes: ['控件 ID 混乱', '消息映射函数未绑定', '在按钮事件里执行长时间阻塞操作', '定时器未关闭', '字符集 CString/std::string 转换混乱'],
    projectTask: '创建 Dialog 页面：按钮、编辑框、列表框，并为“发送”按钮绑定处理函数。',
    resources: ['MFC Dialog 应用创建', '消息映射机制', 'CString 字符集问题'],

    chapterSummary: 'MFC 的学习重点是控件 ID、DDX 绑定、Message Map 和事件处理函数之间的关系。先理解按钮点击如何进入 OnBnClicked，再学习不要在 UI 线程里做耗时通讯。',
    localPractice: {
      title: '创建 Dialog 控件与 Message Map 接线',
      steps: ['在资源编辑器中放置 Button、Edit、ComboBox、ListBox、Tab Control', '给关键控件命名 IDC_BTN_SEND、IDC_EDIT_TX、IDC_LIST_LOG 等清晰 ID', '用类向导绑定按钮点击、定时器、键盘或窗口消息', '在 OnInitDialog 中初始化下拉框和默认参数', '把耗时操作改为调用工作线程或模块类'],
      acceptance: ['能从控件 ID 找到对应 Handler', '能读懂 BEGIN_MESSAGE_MAP 中的 ON_BN_CLICKED/ON_WM_TIMER', '按钮事件里不直接写长时间阻塞循环'],
      relatedRoute: '/designer'
    },
    nextActions: ['完成 MFC 消息映射可视化实验', '打开 Dialog 控件布局设计器规划主界面', '进入本地集成向导学习 DDX 和 Message Map 接线'],
    sections: [

      { heading: 'DDX 与控件变量', body: 'DDX 负责把控件和成员变量关联起来。初学者常见问题是控件 ID 改了但变量或消息映射没同步，导致按钮不触发或数据更新失败。', bullets: ['控件 ID 命名要稳定', '用类向导生成 Handler', '修改资源后重新检查 Message Map'] },
      { heading: '安全更新 UI', body: '工作线程不要直接随意操作 UI 控件。实际工程中可通过 PostMessage、自定义消息或线程安全队列把日志交给 UI 线程刷新。' },      { heading: '按钮点击发生了什么', body: '用户点击按钮后，Windows 产生通知消息，MFC 通过消息映射表找到对应处理函数，例如 OnBnClickedButtonSend。', code: 'BEGIN_MESSAGE_MAP(CMyDlg, CDialogEx)\n  ON_BN_CLICKED(IDC_BUTTON_SEND, &CMyDlg::OnBnClickedButtonSend)\n  ON_WM_TIMER()\n  ON_WM_KEYDOWN()\nEND_MESSAGE_MAP()' },
      { heading: 'UI 线程要保持响应', body: '串口读取、Socket 接收、HTTP 请求都可能耗时。不要把耗时循环直接写在按钮事件中，应该用工作线程或异步机制，并通过安全方式更新 UI。' },
    ],
  },
  {
    id: 'cpp-core',
    title: 'C++ 核心能力',
    subtitle: '类、new/delete、继承封装多态、STL、多线程、锁、指针',
    description: 'MFC 工具最终是 C++ 程序。对象生命周期、容器、线程同步和指针安全决定了工具能不能稳定运行。',
    icon: '⚙️',
    estimatedMinutes: 180,
    labs: ['pointer-memory', 'stl-container', 'thread-lock'],
    quizId: 'cpp-core',
    objectives: ['理解栈区指针与堆区对象关系', '掌握 vector、queue 的典型用途', '理解竞态条件和 mutex 的作用'],
    concepts: ['class', 'new/delete', '继承', '封装', '多态', 'vector', 'queue', 'thread', 'mutex', 'lock_guard', '野指针'],
    commonMistakes: ['内存泄漏', '野指针', '重复 delete', 'vector 越界', '多线程竞态', '忘记加锁'],
    projectTask: '用 queue 保存待发送消息，用 mutex 保护共享日志队列。',
    resources: ['C++ 对象生命周期', 'STL 容器速查', 'std::mutex 与 lock_guard'],

    chapterSummary: 'C++ 核心能力决定工具稳定性。MFC 项目中最容易出问题的是对象生命周期、线程退出、共享日志队列、指针悬空和容器越界。',
    localPractice: {
      title: '实现 Logger/WorkerThread 的安全骨架',
      steps: ['用类封装日志追加，避免各按钮直接操作 UI 日志', '用 queue 保存待处理消息，用 mutex 保护共享队列', '给工作线程设计 Start/Stop/Join 生命周期', '把 new/delete 示例逐步替换为 RAII 或智能指针思路', '为 vector/queue 操作增加边界检查和日志'],
      acceptance: ['能解释 delete 后指针不会自动变 nullptr', '能说明竞态条件为什么会导致 counter++ 结果错误', '线程退出时不会留下后台循环或野指针访问'],
      relatedRoute: '/practice'
    },
    nextActions: ['完成指针内存可视化', '完成 STL 容器动画和线程锁模拟器', '用代码生成器查看 Logger/WorkerThread 模板'],
    sections: [

      { heading: 'RAII 思维', body: '真实项目中尽量让对象生命周期由类和作用域管理，少写裸 new/delete。文件句柄、线程、数据库连接、Socket 都应有明确创建和释放位置。', bullets: ['构造时初始化资源', '析构时释放资源', '异常或提前返回也不泄漏'] },
      { heading: '线程退出比线程创建更重要', body: '工作线程必须能收到停止信号、跳出循环、释放资源并 join。很多上位机卡死问题不是不会创建线程，而是退出流程混乱。' },      { heading: '指针与堆内存', body: 'Obj* p = new Obj() 会在堆区创建对象，p 在栈上保存地址。delete p 只释放堆对象，不会自动把 p 变成 nullptr。', code: 'Obj* p = new Obj();\ndelete p;\np = nullptr; // 示例：避免继续使用旧地址' },
      { heading: '容器与线程', body: 'vector 适合连续存储和随机访问，queue 适合先进先出的消息队列。多线程同时读写共享数据时，需要 mutex 等同步手段。', code: 'std::mutex mtx;\nstd::lock_guard<std::mutex> lock(mtx);\ncounter++;' },
    ],
  },
  {
    id: 'storage',
    title: 'SQLite 与 INI 文件读写',
    subtitle: 'SQLite 表、CRUD、参数保存、INI 本地配置',
    description: '工具软件必须能记住配置和历史。INI 适合轻量参数，SQLite 适合结构化记录。',
    icon: '🗄️',
    estimatedMinutes: 120,
    labs: ['sqlite-crud', 'ini-editor'],
    quizId: 'storage',
    objectives: ['能设计 device 参数表', '能说明 CRUD 的 SQL 语句', '能读懂 INI 的 Section 和 Key=Value'],
    concepts: ['SQLite', 'CREATE TABLE', 'INSERT', 'SELECT', 'UPDATE', 'DELETE', 'INI Section', '编码', '文件权限'],
    commonMistakes: ['SQL 字符串拼接风险', '数据库路径错误', '配置项缺失', '编码问题', '文件读写权限不足'],
    projectTask: '为设备参数设计 SQLite 表，并把默认串口/IP 配置保存到 INI。',
    resources: ['SQLite C/C++ API', 'INI 配置文件格式', '参数化查询'],

    chapterSummary: 'INI 适合保存轻量配置，SQLite 适合保存设备表、历史日志和参数记录。实际项目要特别注意路径、编码、权限和 SQL 参数化。',
    localPractice: {
      title: '完成配置保存与设备表 CRUD',
      steps: ['设计 App.ini 保存默认串口、IP、Port、主题等轻量配置', '设计 SQLite device 表保存设备名称、通讯类型和参数', '新增、查询、修改、删除都写入统一日志', '避免直接拼接用户输入 SQL，使用参数化思路', '处理数据库文件路径不存在、无权限和中文编码问题'],
      acceptance: ['能说明 INI 和 SQLite 分别适合保存什么', '能写出 device 表的 CREATE/INSERT/SELECT 示例', '能列出数据库路径错误和配置项缺失的排查步骤'],
      relatedRoute: '/codegen'
    },
    nextActions: ['完成 SQLite CRUD 沙盒', '完成 INI 编辑器', '生成 ConfigStore/SQLite 模板并阅读依赖说明'],
    sections: [

      { heading: '路径与权限', body: '数据库和 INI 文件不要随意写到程序安装目录。实际部署时应考虑 AppData、程序工作目录、管理员权限、中文路径和相对路径变化。' },
      { heading: '参数化查询意识', body: '学习阶段可以先看 SQL 字符串，但真实项目不要把用户输入直接拼进 SQL。设备名、备注、路径等字段都可能包含引号或特殊字符。', code: '// 示例思想：不要拼接用户输入\nINSERT INTO device(name, port) VALUES (?, ?);' },      { heading: 'SQLite 保存结构化数据', body: '设备配置、历史日志、参数记录适合用 SQLite。学习阶段先理解表结构与 CRUD，实际项目中要注意参数化查询。', code: 'CREATE TABLE device (\n  id INTEGER PRIMARY KEY,\n  name TEXT,\n  port TEXT,\n  baudrate INTEGER\n);' },
      { heading: 'INI 保存轻量配置', body: 'INI 由 Section 和 Key=Value 组成，适合保存默认端口、IP、主题、窗口状态等简单配置。' },
    ],
  },
  {
    id: 'capstone',
    title: '综合项目实战',
    subtitle: '把 MFC、串口、TCP、HTTP、SQLite、INI、多线程整合成工具',
    description: '最后用一个《MFC 通用调试工具》把所有模块串起来，形成能落地的项目路线和验收清单。',
    icon: '🚀',
    estimatedMinutes: 240,
    labs: [],
    quizId: 'capstone',
    objectives: ['能拆分 UI、通讯、数据、工具四层', '能按步骤开发完整 MFC 工具', '能用验收清单自评项目完成度'],
    concepts: ['架构分层', '日志窗口', '配置管理', '线程管理', '错误提示', '打包测试'],
    commonMistakes: ['所有逻辑写在按钮事件里', '通讯阻塞 UI', '没有统一日志', '配置和历史数据混乱', '缺少验收标准'],
    projectTask: '按 Capstone 页的 14 项必做清单完成自评，并补充你的加分项。',
    resources: ['MFC 通用调试工具验收标准', '模块化架构图', '测试与打包清单'],

    chapterSummary: '综合项目不是把代码堆在一个 Dialog 类里，而是把 UI、通讯、数据、日志、线程和错误处理拆成可维护模块，再按验收清单逐项完成。',
    localPractice: {
      title: '按验收清单完成 MFC 通用调试工具',
      steps: ['先完成空 Dialog 和 Tab 主界面', '按 Serial、TCP Client、TCP Server、HTTP、Storage、Logger 顺序逐个接入', '每接入一个模块就编译、运行、记录问题', '用统一日志和错误提示串联所有模块', '最后按 Capstone 必做项和加分项自评'],
      acceptance: ['必做 14 项至少完成 10 项以上', '能导出或整理项目说明、控件 ID、Message Map 和测试记录', '遇到编译错误能先通过集成向导和故障排查页定位'],
      relatedRoute: '/reports'
    },
    nextActions: ['打开 Capstone 页勾选验收项', '导出学习报告和项目交付包', '用集成向导处理 Visual Studio 编译问题'],
    sections: [

      { heading: '模块化交付方式', body: '最终项目建议按模块提交：先 UI 骨架，再 Serial，再 TCP/HTTP，再 Storage，再 Logger/Thread。每个模块都要有独立验收和回滚点。' },
      { heading: '测试与打包', body: '打包前至少检查空配置启动、错误 COM 口提示、网络连接失败提示、数据库路径错误提示、日志导出或复制、关闭程序时线程退出。' },      { heading: '最终工具模块', body: '最终工具至少包含串口调试、TCP Client、TCP Server、HTTP 请求测试、SQLite 参数保存、INI 配置读写、日志窗口和多线程任务处理。' },
      { heading: '推荐开发顺序', body: '先 UI，再单个通讯模块，再数据保存，再日志线程，最后统一测试和打包。不要一开始就把所有逻辑混在一个按钮事件里。' },
    ],
  },
];

export function getModule(id?: string) {
  return modules.find((module) => module.id === id) ?? modules[0];
}

export function getNextModule(id: string) {
  const index = modules.findIndex((module) => module.id === id);
  return index >= 0 ? modules[index + 1] : undefined;
}
