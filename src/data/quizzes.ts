export type QuizType = 'single' | 'multiple' | 'trueFalse' | 'codeReview' | 'scenario';
export type Difficulty = 'easy' | 'medium' | 'hard';

export type QuizQuestion = {
  id: string;
  moduleId: string;
  type: QuizType;
  difficulty: Difficulty;
  question: string;
  options: string[];
  answer: string | string[];
  explanation: string;
  codeSnippet?: string | null;
};

export const quizzes: QuizQuestion[] = [
  {
    "id": "overview-01",
    "moduleId": "overview",
    "type": "single",
    "difficulty": "medium",
    "question": "本课程最终目标是什么？",
    "options": [
      "背诵 MFC API",
      "完成 MFC 通用调试工具",
      "学习网页动画",
      "替代 Visual Studio"
    ],
    "answer": "完成 MFC 通用调试工具",
    "explanation": "课程目标是把串口、TCP/HTTP、MFC、SQLite/INI 等整合成一个工具。",
    "codeSnippet": null
  },
  {
    "id": "overview-02",
    "moduleId": "overview",
    "type": "trueFalse",
    "difficulty": "hard",
    "question": "网页实验会真实编译 MFC 程序。",
    "options": [
      "正确",
      "错误"
    ],
    "answer": "错误",
    "explanation": "网页只做概念模拟，MFC 编译需要 Windows + Visual Studio。",
    "codeSnippet": null
  },
  {
    "id": "overview-03",
    "moduleId": "overview",
    "type": "multiple",
    "difficulty": "easy",
    "question": "最终工具通常包含哪些层？",
    "options": [
      "UI 层",
      "通讯层",
      "数据层",
      "工具层",
      "游戏层"
    ],
    "answer": [
      "UI 层",
      "通讯层",
      "数据层",
      "工具层"
    ],
    "explanation": "典型工具可拆成 UI、通讯、数据和工具层。",
    "codeSnippet": null
  },
  {
    "id": "overview-04",
    "moduleId": "overview",
    "type": "single",
    "difficulty": "medium",
    "question": "学习路线第一步最适合做什么？",
    "options": [
      "直接写全部代码",
      "理解工具形态和环境",
      "先做打包安装",
      "先接真实设备"
    ],
    "answer": "理解工具形态和环境",
    "explanation": "先建立全局地图可减少后续返工。",
    "codeSnippet": null
  },
  {
    "id": "overview-05",
    "moduleId": "overview",
    "type": "codeReview",
    "difficulty": "hard",
    "question": "下面模块划分是否合理？\nUI -> Communication -> Storage -> Utility",
    "options": [
      "合理",
      "不合理"
    ],
    "answer": "合理",
    "explanation": "这是文档推荐的分层思路。",
    "codeSnippet": "UI -> Communication -> Storage -> Utility"
  },
  {
    "id": "overview-06",
    "moduleId": "overview",
    "type": "scenario",
    "difficulty": "easy",
    "question": "如果你还没安装 MFC 组件，应该先做什么？",
    "options": [
      "继续写串口代码",
      "安装 Visual Studio Windows 桌面/MFC 组件",
      "删除项目",
      "改用手机开发"
    ],
    "answer": "安装 Visual Studio Windows 桌面/MFC 组件",
    "explanation": "MFC 本地实践依赖 VS 的相关组件。",
    "codeSnippet": null
  },
  {
    "id": "overview-07",
    "moduleId": "overview",
    "type": "single",
    "difficulty": "medium",
    "question": "网页实验的定位是？",
    "options": [
      "真实连接所有硬件",
      "帮助理解概念和流程",
      "替代数据库服务",
      "替代 TCP 服务"
    ],
    "answer": "帮助理解概念和流程",
    "explanation": "文档明确要求浏览器内模拟，不真实访问外设。",
    "codeSnippet": null
  },
  {
    "id": "overview-08",
    "moduleId": "overview",
    "type": "trueFalse",
    "difficulty": "hard",
    "question": "日志、配置、异常提示是工具软件基础能力。",
    "options": [
      "正确",
      "错误"
    ],
    "answer": "正确",
    "explanation": "通用调试工具不只是通信，还要可观测、可配置、可维护。",
    "codeSnippet": null
  },
  {
    "id": "serial-01",
    "moduleId": "serial",
    "type": "single",
    "difficulty": "medium",
    "question": "8N1 中的 N 表示什么？",
    "options": [
      "Odd 奇校验",
      "None 无校验",
      "Even 偶校验",
      "1 个停止位"
    ],
    "answer": "None 无校验",
    "explanation": "8N1 表示 8 个数据位、无校验、1 个停止位。",
    "codeSnippet": null
  },
  {
    "id": "serial-02",
    "moduleId": "serial",
    "type": "single",
    "difficulty": "hard",
    "question": "HELLO 对应的 HEX 是？",
    "options": [
      "48 45 4C 4C 4F",
      "68 65 6C 6C 6F",
      "HELLO",
      "00 01 02"
    ],
    "answer": "48 45 4C 4C 4F",
    "explanation": "大写 HELLO 的 ASCII 十六进制为 48 45 4C 4C 4F。",
    "codeSnippet": null
  },
  {
    "id": "serial-03",
    "moduleId": "serial",
    "type": "single",
    "difficulty": "easy",
    "question": "Modbus RTU CRC 通常如何放置？",
    "options": [
      "高字节在前",
      "低字节在前",
      "不需要 CRC",
      "放在帧头"
    ],
    "answer": "低字节在前",
    "explanation": "Modbus RTU 帧尾 CRC16 低字节在前。",
    "codeSnippet": null
  },
  {
    "id": "serial-04",
    "moduleId": "serial",
    "type": "multiple",
    "difficulty": "medium",
    "question": "串口参数通常包括？",
    "options": [
      "COM 口",
      "波特率",
      "数据位",
      "校验位",
      "CSS 颜色"
    ],
    "answer": [
      "COM 口",
      "波特率",
      "数据位",
      "校验位"
    ],
    "explanation": "双方串口参数必须一致。",
    "codeSnippet": null
  },
  {
    "id": "serial-05",
    "moduleId": "serial",
    "type": "trueFalse",
    "difficulty": "hard",
    "question": "ASCII 和 HEX 是同一种显示视角。",
    "options": [
      "正确",
      "错误"
    ],
    "answer": "错误",
    "explanation": "ASCII 是字符视角，HEX 是字节视角。",
    "codeSnippet": null
  },
  {
    "id": "serial-06",
    "moduleId": "serial",
    "type": "codeReview",
    "difficulty": "easy",
    "question": "帧 01 03 00 00 00 02 C4 0B 中 03 是什么？",
    "options": [
      "从站地址",
      "功能码",
      "CRC",
      "停止位"
    ],
    "answer": "功能码",
    "explanation": "03 在 Modbus 中表示读保持寄存器。",
    "codeSnippet": null
  },
  {
    "id": "serial-07",
    "moduleId": "serial",
    "type": "scenario",
    "difficulty": "medium",
    "question": "设备返回乱码，最先检查什么？",
    "options": [
      "网页背景色",
      "波特率/数据位/校验位/停止位",
      "按钮圆角",
      "README"
    ],
    "answer": "波特率/数据位/校验位/停止位",
    "explanation": "参数不一致是串口乱码的常见原因。",
    "codeSnippet": null
  },
  {
    "id": "serial-08",
    "moduleId": "serial",
    "type": "single",
    "difficulty": "hard",
    "question": "RS485 常见特点是？",
    "options": [
      "差分通讯，适合工业现场",
      "只用于网页",
      "没有方向问题",
      "不需要接线"
    ],
    "answer": "差分通讯，适合工业现场",
    "explanation": "RS485 常用于工业现场，半双工场景还要考虑方向控制。",
    "codeSnippet": null
  },
  {
    "id": "network-01",
    "moduleId": "network",
    "type": "single",
    "difficulty": "medium",
    "question": "HTTP POST 的 JSON 通常放在哪里？",
    "options": [
      "URL Host",
      "Header",
      "Body",
      "端口号"
    ],
    "answer": "Body",
    "explanation": "POST 的业务数据通常放请求体。",
    "codeSnippet": null
  },
  {
    "id": "network-02",
    "moduleId": "network",
    "type": "single",
    "difficulty": "hard",
    "question": "Content-Type: application/json 属于？",
    "options": [
      "请求行",
      "Header",
      "Body",
      "Socket 地址"
    ],
    "answer": "Header",
    "explanation": "Content-Type 是请求头。",
    "codeSnippet": null
  },
  {
    "id": "network-03",
    "moduleId": "network",
    "type": "trueFalse",
    "difficulty": "easy",
    "question": "HTTP 和 TCP 是同一层协议。",
    "options": [
      "正确",
      "错误"
    ],
    "answer": "错误",
    "explanation": "HTTP 是应用层协议，TCP 是传输层连接。",
    "codeSnippet": null
  },
  {
    "id": "network-04",
    "moduleId": "network",
    "type": "multiple",
    "difficulty": "medium",
    "question": "TCP Client/Server 基本动作包括？",
    "options": [
      "listen/connect",
      "send",
      "recv",
      "close",
      "CSS hover"
    ],
    "answer": [
      "listen/connect",
      "send",
      "recv",
      "close"
    ],
    "explanation": "TCP 通讯需要连接、发送、接收和关闭。",
    "codeSnippet": null
  },
  {
    "id": "network-05",
    "moduleId": "network",
    "type": "single",
    "difficulty": "hard",
    "question": "TCP 粘包/拆包主要说明什么？",
    "options": [
      "字节流边界问题",
      "数据库权限问题",
      "MFC 控件颜色",
      "INI 格式"
    ],
    "answer": "字节流边界问题",
    "explanation": "TCP 是字节流，应用层需自行处理消息边界。",
    "codeSnippet": null
  },
  {
    "id": "network-06",
    "moduleId": "network",
    "type": "codeReview",
    "difficulty": "easy",
    "question": "GET /api/device HTTP/1.1 是 HTTP 请求的哪部分？",
    "options": [
      "请求行",
      "请求头",
      "请求体",
      "响应体"
    ],
    "answer": "请求行",
    "explanation": "第一行包含 Method、Path 和版本。",
    "codeSnippet": null
  },
  {
    "id": "network-07",
    "moduleId": "network",
    "type": "scenario",
    "difficulty": "medium",
    "question": "服务器无法连接，优先检查？",
    "options": [
      "IP/Port",
      "按钮文案",
      "字体",
      "背景图"
    ],
    "answer": "IP/Port",
    "explanation": "网络通讯常见问题是地址和端口错误。",
    "codeSnippet": null
  },
  {
    "id": "network-08",
    "moduleId": "network",
    "type": "single",
    "difficulty": "hard",
    "question": "JSON 格式错误可能导致？",
    "options": [
      "服务端解析失败",
      "串口自动打开",
      "MFC 自动生成控件",
      "SQLite 自动修复"
    ],
    "answer": "服务端解析失败",
    "explanation": "服务端通常按 Content-Type 和 Body 解析 JSON。",
    "codeSnippet": null
  },
  {
    "id": "mfc-01",
    "moduleId": "mfc",
    "type": "single",
    "difficulty": "medium",
    "question": "按钮点击常用哪个宏绑定？",
    "options": [
      "ON_BN_CLICKED",
      "ON_WM_TIMER",
      "CREATE TABLE",
      "std::mutex"
    ],
    "answer": "ON_BN_CLICKED",
    "explanation": "MFC 按钮点击通知常通过 ON_BN_CLICKED 绑定。",
    "codeSnippet": null
  },
  {
    "id": "mfc-02",
    "moduleId": "mfc",
    "type": "single",
    "difficulty": "hard",
    "question": "BEGIN_MESSAGE_MAP 的作用是？",
    "options": [
      "定义消息映射表",
      "创建数据库",
      "发送 HTTP",
      "解析 INI"
    ],
    "answer": "定义消息映射表",
    "explanation": "它把消息与处理函数关联起来。",
    "codeSnippet": null
  },
  {
    "id": "mfc-03",
    "moduleId": "mfc",
    "type": "trueFalse",
    "difficulty": "easy",
    "question": "可以把耗时通讯循环直接写在按钮事件里。",
    "options": [
      "正确",
      "错误"
    ],
    "answer": "错误",
    "explanation": "这样会阻塞 UI 线程，导致界面卡死。",
    "codeSnippet": null
  },
  {
    "id": "mfc-04",
    "moduleId": "mfc",
    "type": "multiple",
    "difficulty": "medium",
    "question": "MFC 入门应理解哪些内容？",
    "options": [
      "Dialog",
      "控件 ID",
      "消息映射",
      "定时器",
      "Modbus CRC"
    ],
    "answer": [
      "Dialog",
      "控件 ID",
      "消息映射",
      "定时器"
    ],
    "explanation": "这些是 MFC UI 事件处理核心。",
    "codeSnippet": null
  },
  {
    "id": "mfc-05",
    "moduleId": "mfc",
    "type": "single",
    "difficulty": "hard",
    "question": "ON_WM_TIMER 对应哪类消息？",
    "options": [
      "定时器",
      "按钮点击",
      "键盘输入",
      "数据库插入"
    ],
    "answer": "定时器",
    "explanation": "ON_WM_TIMER 处理 WM_TIMER。",
    "codeSnippet": null
  },
  {
    "id": "mfc-06",
    "moduleId": "mfc",
    "type": "codeReview",
    "difficulty": "easy",
    "question": "ON_BN_CLICKED(IDC_BUTTON_SEND, &CMyDlg::OnBnClickedButtonSend) 中 IDC_BUTTON_SEND 是？",
    "options": [
      "控件 ID",
      "数据库名",
      "IP 地址",
      "线程锁"
    ],
    "answer": "控件 ID",
    "explanation": "宏通过控件 ID 绑定按钮事件。",
    "codeSnippet": null
  },
  {
    "id": "mfc-07",
    "moduleId": "mfc",
    "type": "scenario",
    "difficulty": "medium",
    "question": "点击按钮无响应，可能原因是？",
    "options": [
      "消息映射未绑定",
      "SQLite 表太大",
      "HEX 小写",
      "背景太暗"
    ],
    "answer": "消息映射未绑定",
    "explanation": "控件 ID 或消息映射绑定错误会导致事件不进处理函数。",
    "codeSnippet": null
  },
  {
    "id": "mfc-08",
    "moduleId": "mfc",
    "type": "single",
    "difficulty": "hard",
    "question": "MFC 本地实践推荐工具是？",
    "options": [
      "Visual Studio",
      "浏览器控制台",
      "Photoshop",
      "Excel"
    ],
    "answer": "Visual Studio",
    "explanation": "MFC 项目通常在 Windows Visual Studio 中创建和调试。",
    "codeSnippet": null
  },
  {
    "id": "cpp-core-01",
    "moduleId": "cpp-core",
    "type": "single",
    "difficulty": "medium",
    "question": "delete p 后 p 会自动变 nullptr 吗？",
    "options": [
      "会",
      "不会",
      "只在 Debug 会",
      "只在 MFC 会"
    ],
    "answer": "不会",
    "explanation": "delete 释放对象，但指针变量仍保存旧地址。",
    "codeSnippet": null
  },
  {
    "id": "cpp-core-02",
    "moduleId": "cpp-core",
    "type": "single",
    "difficulty": "hard",
    "question": "std::lock_guard 的作用是？",
    "options": [
      "自动加锁/解锁",
      "创建窗口",
      "发送 HTTP",
      "解析 XML"
    ],
    "answer": "自动加锁/解锁",
    "explanation": "lock_guard 利用 RAII 管理 mutex。",
    "codeSnippet": null
  },
  {
    "id": "cpp-core-03",
    "moduleId": "cpp-core",
    "type": "trueFalse",
    "difficulty": "easy",
    "question": "多个线程同时 counter++ 可能产生竞态。",
    "options": [
      "正确",
      "错误"
    ],
    "answer": "正确",
    "explanation": "读改写不是原子操作，可能丢失更新。",
    "codeSnippet": null
  },
  {
    "id": "cpp-core-04",
    "moduleId": "cpp-core",
    "type": "multiple",
    "difficulty": "medium",
    "question": "C++ 核心模块包含？",
    "options": [
      "new/delete",
      "vector",
      "queue",
      "mutex",
      "CSS"
    ],
    "answer": [
      "new/delete",
      "vector",
      "queue",
      "mutex"
    ],
    "explanation": "这些是文档要求掌握的 C++ 核心能力。",
    "codeSnippet": null
  },
  {
    "id": "cpp-core-05",
    "moduleId": "cpp-core",
    "type": "single",
    "difficulty": "hard",
    "question": "queue 的典型语义是？",
    "options": [
      "先进先出",
      "随机访问",
      "键值配置",
      "HTTP 请求头"
    ],
    "answer": "先进先出",
    "explanation": "queue 常用于消息队列。",
    "codeSnippet": null
  },
  {
    "id": "cpp-core-06",
    "moduleId": "cpp-core",
    "type": "codeReview",
    "difficulty": "easy",
    "question": "std::vector<int> v; v[10] = 1; 在未扩容时可能？",
    "options": [
      "越界",
      "自动创建 11 个元素",
      "发送串口",
      "变成 INI"
    ],
    "answer": "越界",
    "explanation": "operator[] 不检查范围，越界是常见错误。",
    "codeSnippet": null
  },
  {
    "id": "cpp-core-07",
    "moduleId": "cpp-core",
    "type": "scenario",
    "difficulty": "medium",
    "question": "多线程共享日志队列应该？",
    "options": [
      "用 mutex 保护",
      "完全不管",
      "每次重启电脑",
      "用 CSS 保护"
    ],
    "answer": "用 mutex 保护",
    "explanation": "共享数据需要同步。",
    "codeSnippet": null
  },
  {
    "id": "cpp-core-08",
    "moduleId": "cpp-core",
    "type": "single",
    "difficulty": "hard",
    "question": "野指针风险来自？",
    "options": [
      "对象释放后继续使用旧地址",
      "按钮颜色太亮",
      "HTTP 方法错误",
      "INI Section 太多"
    ],
    "answer": "对象释放后继续使用旧地址",
    "explanation": "delete 后未置空并继续访问会产生风险。",
    "codeSnippet": null
  },
  {
    "id": "storage-01",
    "moduleId": "storage",
    "type": "single",
    "difficulty": "medium",
    "question": "INI 最适合保存什么？",
    "options": [
      "轻量配置参数",
      "海量视频",
      "复杂索引",
      "线程对象"
    ],
    "answer": "轻量配置参数",
    "explanation": "INI 适合 Port、IP、主题等简单配置。",
    "codeSnippet": null
  },
  {
    "id": "storage-02",
    "moduleId": "storage",
    "type": "single",
    "difficulty": "hard",
    "question": "SQLite 中查询常用语句是？",
    "options": [
      "SELECT",
      "INSERT",
      "UPDATE",
      "DELETE"
    ],
    "answer": "SELECT",
    "explanation": "SELECT 用于查询数据。",
    "codeSnippet": null
  },
  {
    "id": "storage-03",
    "moduleId": "storage",
    "type": "trueFalse",
    "difficulty": "easy",
    "question": "SQL 拼接用户输入完全没有风险。",
    "options": [
      "正确",
      "错误"
    ],
    "answer": "错误",
    "explanation": "拼接可能带来注入和转义问题，实际项目应参数化。",
    "codeSnippet": null
  },
  {
    "id": "storage-04",
    "moduleId": "storage",
    "type": "multiple",
    "difficulty": "medium",
    "question": "CRUD 包含？",
    "options": [
      "Create/Insert",
      "Read/Select",
      "Update",
      "Delete",
      "Compile"
    ],
    "answer": [
      "Create/Insert",
      "Read/Select",
      "Update",
      "Delete"
    ],
    "explanation": "CRUD 即增删改查。",
    "codeSnippet": null
  },
  {
    "id": "storage-05",
    "moduleId": "storage",
    "type": "single",
    "difficulty": "hard",
    "question": "INI Section 写法是？",
    "options": [
      "[Serial]",
      "<Serial>",
      "Serial{}",
      "Serial:"
    ],
    "answer": "[Serial]",
    "explanation": "INI 常用 [Section] 标识分组。",
    "codeSnippet": null
  },
  {
    "id": "storage-06",
    "moduleId": "storage",
    "type": "codeReview",
    "difficulty": "easy",
    "question": "CREATE TABLE device (...) 的作用是？",
    "options": [
      "创建表",
      "删除表",
      "发送 TCP",
      "创建按钮"
    ],
    "answer": "创建表",
    "explanation": "CREATE TABLE 用于建表。",
    "codeSnippet": null
  },
  {
    "id": "storage-07",
    "moduleId": "storage",
    "type": "scenario",
    "difficulty": "medium",
    "question": "程序读不到配置，优先检查？",
    "options": [
      "文件路径和权限",
      "按钮渐变",
      "TCP 粘包",
      "字体大小"
    ],
    "answer": "文件路径和权限",
    "explanation": "路径和权限是配置文件读写常见问题。",
    "codeSnippet": null
  },
  {
    "id": "storage-08",
    "moduleId": "storage",
    "type": "single",
    "difficulty": "hard",
    "question": "大量历史日志更适合？",
    "options": [
      "SQLite",
      "INI",
      "按钮文本",
      "CSS 变量"
    ],
    "answer": "SQLite",
    "explanation": "结构化大量记录适合数据库。",
    "codeSnippet": null
  },
  {
    "id": "capstone-01",
    "moduleId": "capstone",
    "type": "single",
    "difficulty": "medium",
    "question": "最终项目名称是？",
    "options": [
      "MFC 通用调试工具",
      "网页小游戏",
      "图片编辑器",
      "邮件系统"
    ],
    "answer": "MFC 通用调试工具",
    "explanation": "文档定义的 Capstone 是 MFC 通用调试工具。",
    "codeSnippet": null
  },
  {
    "id": "capstone-02",
    "moduleId": "capstone",
    "type": "multiple",
    "difficulty": "hard",
    "question": "最终项目必须功能包括？",
    "options": [
      "串口调试",
      "TCP Client",
      "TCP Server",
      "HTTP 请求测试",
      "SQLite/INI"
    ],
    "answer": [
      "串口调试",
      "TCP Client",
      "TCP Server",
      "HTTP 请求测试",
      "SQLite/INI"
    ],
    "explanation": "这些都是最终项目验收清单中的核心项。",
    "codeSnippet": null
  },
  {
    "id": "capstone-03",
    "moduleId": "capstone",
    "type": "trueFalse",
    "difficulty": "easy",
    "question": "所有业务逻辑都写在按钮事件里是好设计。",
    "options": [
      "正确",
      "错误"
    ],
    "answer": "错误",
    "explanation": "应该拆分模块，避免事件函数臃肿。",
    "codeSnippet": null
  },
  {
    "id": "capstone-04",
    "moduleId": "capstone",
    "type": "single",
    "difficulty": "medium",
    "question": "避免 UI 卡死通常需要？",
    "options": [
      "线程/异步处理通讯任务",
      "更换背景色",
      "减少题目",
      "删除日志"
    ],
    "answer": "线程/异步处理通讯任务",
    "explanation": "耗时通讯要避免阻塞 UI 线程。",
    "codeSnippet": null
  },
  {
    "id": "capstone-05",
    "moduleId": "capstone",
    "type": "single",
    "difficulty": "hard",
    "question": "日志窗口的价值是？",
    "options": [
      "观察收发和错误",
      "装饰页面",
      "替代数据库",
      "替代串口"
    ],
    "answer": "观察收发和错误",
    "explanation": "调试工具必须可观察。",
    "codeSnippet": null
  },
  {
    "id": "capstone-06",
    "moduleId": "capstone",
    "type": "codeReview",
    "difficulty": "easy",
    "question": "用户点击按钮 -> 消息映射 -> 业务模块 -> 通讯/存储 -> UI 日志，这个流程？",
    "options": [
      "合理",
      "不合理"
    ],
    "answer": "合理",
    "explanation": "这是文档推荐的用户操作流程。",
    "codeSnippet": null
  },
  {
    "id": "capstone-07",
    "moduleId": "capstone",
    "type": "scenario",
    "difficulty": "medium",
    "question": "功能能跑但无法复现问题，应补什么？",
    "options": [
      "日志和历史记录",
      "更多颜色",
      "隐藏错误",
      "删除配置"
    ],
    "answer": "日志和历史记录",
    "explanation": "日志与历史能帮助定位问题。",
    "codeSnippet": null
  },
  {
    "id": "capstone-08",
    "moduleId": "capstone",
    "type": "single",
    "difficulty": "hard",
    "question": "加分项不包括？",
    "options": [
      "支持 Modbus RTU",
      "支持导出日志",
      "支持配置模板",
      "真实网页编译 MFC"
    ],
    "answer": "真实网页编译 MFC",
    "explanation": "网页不应真实编译 MFC。",
    "codeSnippet": null
  }

  ,
  { "id": "overview-09", "moduleId": "overview", "type": "single", "difficulty": "easy", "question": "学习网站中 localStorage 主要保存什么？", "options": ["学习进度", "真实串口句柄", "Visual Studio 安装包", "数据库密码"], "answer": "学习进度", "explanation": "localStorage 适合保存模块完成、实验完成、测验成绩和错题等浏览器本地状态。", "codeSnippet": null },
  { "id": "overview-10", "moduleId": "overview", "type": "multiple", "difficulty": "medium", "question": "开始做 MFC 工具前，建议先明确哪些内容？", "options": ["最终工具功能", "模块划分", "开发环境", "每个按钮的颜色", "验收标准"], "answer": ["最终工具功能", "模块划分", "开发环境", "验收标准"], "explanation": "先明确目标、模块、环境和验收标准，能避免一开始就陷入零散 API。", "codeSnippet": null },
  { "id": "overview-11", "moduleId": "overview", "type": "trueFalse", "difficulty": "easy", "question": "课程中的网页实验主要帮助理解概念，不能替代 Windows 下的真实 MFC 编译调试。", "options": ["正确", "错误"], "answer": "正确", "explanation": "浏览器实验是教学模拟，真实 MFC 项目仍需 Visual Studio 和 Windows 环境。", "codeSnippet": null },
  { "id": "overview-12", "moduleId": "overview", "type": "scenario", "difficulty": "medium", "question": "你准备把串口、TCP、HTTP、SQLite 都写进一个按钮事件里，最应该先做什么？", "options": ["继续堆代码", "先拆分 UI、通讯、数据、工具层", "删除日志", "只改界面颜色"], "answer": "先拆分 UI、通讯、数据、工具层", "explanation": "工具软件需要模块化，避免所有逻辑挤在一个事件函数中。", "codeSnippet": null },
  { "id": "serial-09", "moduleId": "serial", "type": "single", "difficulty": "medium", "question": "Modbus RTU 中 CRC16 的字节顺序通常是？", "options": ["高字节在前", "低字节在前", "只发送一个字节", "不需要 CRC"], "answer": "低字节在前", "explanation": "Modbus RTU 帧尾 CRC 通常按低字节、高字节顺序发送。", "codeSnippet": "01 03 00 00 00 02 C4 0B" },
  { "id": "serial-10", "moduleId": "serial", "type": "multiple", "difficulty": "easy", "question": "串口通讯双方必须一致的典型参数包括？", "options": ["波特率", "数据位", "校验位", "停止位", "屏幕分辨率"], "answer": ["波特率", "数据位", "校验位", "停止位"], "explanation": "参数不一致会导致乱码、丢包或完全收不到数据。", "codeSnippet": null },
  { "id": "serial-11", "moduleId": "serial", "type": "codeReview", "difficulty": "medium", "question": "HEX 输入 0A 1 是否是合法完整字节序列？", "options": ["合法", "不合法"], "answer": "不合法", "explanation": "去掉空格后长度为奇数，无法按完整字节解析。", "codeSnippet": "0A 1" },
  { "id": "serial-12", "moduleId": "serial", "type": "scenario", "difficulty": "medium", "question": "收到的数据看起来像乱码，优先检查什么？", "options": ["串口参数和 ASCII/HEX 显示模式", "按钮圆角", "网页标题", "数据库表名"], "answer": "串口参数和 ASCII/HEX 显示模式", "explanation": "乱码常见原因是波特率/校验等参数不一致，或把二进制按文本显示。", "codeSnippet": null },
  { "id": "network-09", "moduleId": "network", "type": "single", "difficulty": "easy", "question": "HTTP POST 发送 JSON 时通常需要设置哪个请求头？", "options": ["Content-Type: application/json", "BaudRate: 9600", "COM: 3", "StopBits: 1"], "answer": "Content-Type: application/json", "explanation": "Content-Type 告诉服务器请求体的数据格式。", "codeSnippet": "POST /api/device HTTP/1.1\nContent-Type: application/json" },
  { "id": "network-10", "moduleId": "network", "type": "multiple", "difficulty": "medium", "question": "TCP 工程实践中常见需要处理的问题有？", "options": ["连接超时", "断线重连", "粘包/拆包", "数据编码", "MFC 资源图标"], "answer": ["连接超时", "断线重连", "粘包/拆包", "数据编码"], "explanation": "TCP 是字节流，真实项目要处理连接状态、边界、编码和异常。", "codeSnippet": null },
  { "id": "network-11", "moduleId": "network", "type": "trueFalse", "difficulty": "medium", "question": "TCP 是面向连接的字节流协议，应用层通常需要自己定义消息边界。", "options": ["正确", "错误"], "answer": "正确", "explanation": "TCP 不保留应用消息边界，因此协议中常用长度字段、分隔符或固定帧长。", "codeSnippet": null },
  { "id": "network-12", "moduleId": "network", "type": "scenario", "difficulty": "hard", "question": "设备要求长连接并持续推送状态，更适合优先考虑哪种通讯模型？", "options": ["TCP Socket", "一次性 HTTP GET", "INI 文件", "CSS 动画"], "answer": "TCP Socket", "explanation": "持续双向通信更接近 TCP 长连接模型；HTTP 更常用于请求/响应。", "codeSnippet": null },
  { "id": "mfc-09", "moduleId": "mfc", "type": "single", "difficulty": "medium", "question": "MFC 中按钮点击通常通过什么机制关联到处理函数？", "options": ["消息映射", "CRC 校验", "SQL 触发器", "浏览器路由"], "answer": "消息映射", "explanation": "MFC 使用消息映射把控件通知和 Windows 消息分发到成员函数。", "codeSnippet": "ON_BN_CLICKED(IDC_BUTTON_SEND, &CMyDlg::OnBnClickedButtonSend)" },
  { "id": "mfc-10", "moduleId": "mfc", "type": "multiple", "difficulty": "medium", "question": "MFC Dialog 工具常见控件包括？", "options": ["Button", "Edit", "ComboBox", "ListBox", "Modbus CRC"], "answer": ["Button", "Edit", "ComboBox", "ListBox"], "explanation": "按钮、编辑框、下拉框、列表框是调试工具常用 UI 控件。", "codeSnippet": null },
  { "id": "mfc-11", "moduleId": "mfc", "type": "codeReview", "difficulty": "hard", "question": "把 while(true) 接收循环直接写在按钮点击函数里是否合理？", "options": ["合理", "不合理"], "answer": "不合理", "explanation": "会阻塞 UI 线程，导致窗口卡死；应使用工作线程或异步机制。", "codeSnippet": "void CMyDlg::OnBnClickedRecv(){ while(true){ Recv(); } }" },
  { "id": "mfc-12", "moduleId": "mfc", "type": "scenario", "difficulty": "medium", "question": "点击按钮没有进入处理函数，优先检查什么？", "options": ["控件 ID 和消息映射绑定", "SQLite 表字段", "HTTP Body", "串口停止位"], "answer": "控件 ID 和消息映射绑定", "explanation": "控件 ID 错误或消息映射未绑定会导致事件函数不触发。", "codeSnippet": null },
  { "id": "cpp-core-09", "moduleId": "cpp-core", "type": "single", "difficulty": "medium", "question": "delete p 后推荐立即做什么？", "options": ["p = nullptr", "继续使用 *p", "再次 delete p", "把 p 当数组排序"], "answer": "p = nullptr", "explanation": "释放堆对象后把指针置空可降低野指针误用风险。", "codeSnippet": "delete p;\np = nullptr;" },
  { "id": "cpp-core-10", "moduleId": "cpp-core", "type": "multiple", "difficulty": "medium", "question": "多线程访问共享数据时，哪些做法更安全？", "options": ["使用 mutex", "使用 lock_guard", "减少共享状态", "不加锁直接++", "把异常吞掉"], "answer": ["使用 mutex", "使用 lock_guard", "减少共享状态"], "explanation": "共享状态需要同步，RAII 锁能减少忘记释放锁的问题。", "codeSnippet": null },
  { "id": "cpp-core-11", "moduleId": "cpp-core", "type": "trueFalse", "difficulty": "easy", "question": "std::queue 适合表达先进先出的待发送消息队列。", "options": ["正确", "错误"], "answer": "正确", "explanation": "queue 的 push/pop/front 适合 FIFO 队列场景。", "codeSnippet": null },
  { "id": "cpp-core-12", "moduleId": "cpp-core", "type": "codeReview", "difficulty": "hard", "question": "下面代码在两个线程中同时执行是否可能产生竞态？", "options": ["可能", "不可能"], "answer": "可能", "explanation": "counter++ 不是原子操作，多个线程同时执行可能丢失更新。", "codeSnippet": "counter++;" },
  { "id": "storage-09", "moduleId": "storage", "type": "single", "difficulty": "easy", "question": "保存少量默认配置如 COM、IP、Port，INI 的基本单位是什么？", "options": ["Section 和 Key=Value", "HTTP Header", "CRC 字节", "线程句柄"], "answer": "Section 和 Key=Value", "explanation": "INI 通过节和键值对保存轻量配置。", "codeSnippet": "[Serial]\nPort=COM3\nBaudRate=9600" },
  { "id": "storage-10", "moduleId": "storage", "type": "multiple", "difficulty": "medium", "question": "SQLite 更适合保存哪些数据？", "options": ["设备表", "历史日志", "参数记录", "查询结果", "按钮 hover 颜色"], "answer": ["设备表", "历史日志", "参数记录", "查询结果"], "explanation": "结构化数据、历史记录和可查询数据适合 SQLite。", "codeSnippet": null },
  { "id": "storage-11", "moduleId": "storage", "type": "codeReview", "difficulty": "hard", "question": "直接拼接用户输入生成 SQL 是否安全？", "options": ["安全", "不安全"], "answer": "不安全", "explanation": "直接拼接可能导致 SQL 注入或特殊字符错误，应使用参数化查询。", "codeSnippet": "sql = \"SELECT * FROM device WHERE name='\" + name + \"'\";" },
  { "id": "storage-12", "moduleId": "storage", "type": "scenario", "difficulty": "medium", "question": "工具重启后需要恢复上次串口和服务器地址，最直接应保存到哪里？", "options": ["INI 或 SQLite", "临时变量", "CPU 寄存器", "网页标题"], "answer": "INI 或 SQLite", "explanation": "持久化配置应写入本地配置文件或数据库。", "codeSnippet": null },
  { "id": "capstone-09", "moduleId": "capstone", "type": "single", "difficulty": "medium", "question": "最终工具中统一日志窗口的主要价值是？", "options": ["定位问题和复现过程", "让界面更花", "替代通讯协议", "减少所有测试"], "answer": "定位问题和复现过程", "explanation": "日志能记录操作、收发、错误和时间，便于调试。", "codeSnippet": null },
  { "id": "capstone-10", "moduleId": "capstone", "type": "multiple", "difficulty": "medium", "question": "最终项目验收应覆盖哪些方面？", "options": ["功能是否可用", "错误提示", "线程不卡 UI", "配置可保存", "只看颜色"], "answer": ["功能是否可用", "错误提示", "线程不卡 UI", "配置可保存"], "explanation": "验收应覆盖功能、稳定性、错误处理、数据持久化和可维护性。", "codeSnippet": null },
  { "id": "capstone-11", "moduleId": "capstone", "type": "trueFalse", "difficulty": "easy", "question": "最终项目可以先完成核心链路，再逐步加入 Modbus、导出日志、主题切换等加分项。", "options": ["正确", "错误"], "answer": "正确", "explanation": "先完成 MVP，再扩展加分项更利于交付和调试。", "codeSnippet": null },
  { "id": "capstone-12", "moduleId": "capstone", "type": "scenario", "difficulty": "hard", "question": "工具现场偶发卡死，最需要重点检查哪个设计？", "options": ["耗时通讯是否放在 UI 线程", "首页 Hero 文案", "题库数量", "图标 emoji"], "answer": "耗时通讯是否放在 UI 线程", "explanation": "现场卡死常与 UI 线程被阻塞、锁竞争或无限等待有关。", "codeSnippet": null }

];

export function getQuizzesByModule(moduleId: string) {
  return quizzes.filter((question) => question.moduleId === moduleId);
}

export function getQuestion(id: string) {
  return quizzes.find((question) => question.id === id);
}

