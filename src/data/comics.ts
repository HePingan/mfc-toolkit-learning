export type ComicPromptStatus = 'prompt-ready' | 'image-ready';

export type ComicPrompt = {
  id: string;
  title: string;
  theme: string;
  audience: string;
  ratio: '3:4' | '16:9' | '1:1';
  preset: string;
  status: ComicPromptStatus;
  learningGoal: string;
  storyboard: string[];
  prompt: string;
  routeHint: string;
};

export const comicPrompts: ComicPrompt[] = [
  {
    id: 'serial-modbus-frame',
    title: '串口与 Modbus：一帧数据的旅行',
    theme: '串口参数、HEX/ASCII、Modbus RTU 帧、CRC 低字节在前',
    audience: '刚开始做上位机/MFC 工具的学习者',
    ratio: '3:4',
    preset: 'ohmsha manga + neutral',
    status: 'prompt-ready',
    learningGoal: '让学习者理解“串口配置只是通道，协议帧才是业务语义”，并记住 Modbus RTU 的关键字段。',
    storyboard: [
      '封面：工程师站在 MFC 调试工具界面前，COM、Baud、HEX、Modbus 帧像流程线一样连接到工业设备。',
      '第 1 格：COM 口、波特率、数据位、校验位、停止位组成“通道门禁”，参数不一致时门禁变红。',
      '第 2 格：ASCII 与 HEX 两个视图并排，强调文本可读性与二进制协议表达的区别。',
      '第 3 格：Modbus RTU 帧拆成从站地址、功能码、起始地址、数量、CRC，CRC 低字节在前用醒目标识。',
      '第 4 格：现场故障卡片：乱码、无响应、CRC 错误，对应检查参数、接线、方向控制和帧边界。',
    ],
    prompt: '单页中文知识漫画，欧姆社工程漫画风，深色工业控制实验室背景，清晰分镜但不要真实品牌。主题：串口与 Modbus：一帧数据的旅行。画面包含一名年轻工程师和一个拟人化数据帧角色，数据帧从 MFC 调试工具界面出发，经过 COM 参数门禁、ASCII/HEX 双视图、Modbus RTU 字段拆解区，最终到达 PLC/传感器设备。需要在画面中用中文标签标出：COM口、波特率、数据位、校验位、停止位、ASCII、HEX、从站地址、功能码、起始地址、寄存器数量、CRC低字节在前。右下角加“排错三问：参数一致吗？帧边界对吗？CRC 对吗？”。文字尽量短、清晰、可读。科技蓝紫配色，适合学习网站卡片展示。',
    routeHint: '/labs?topic=modbus-frame',
  },
  {
    id: 'mfc-message-map',
    title: 'MFC 消息映射：按钮点击去了哪里',
    theme: 'Dialog 控件 ID、DDX、Message Map、事件处理函数',
    audience: '能打开 Visual Studio 但不熟悉 MFC 机制的初学者',
    ratio: '3:4',
    preset: 'ohmsha manga + neutral',
    status: 'prompt-ready',
    learningGoal: '把“资源控件 → 控件 ID → Message Map → OnBnClicked 处理函数 → 成员变量/DDX”的链路视觉化。',
    storyboard: [
      '封面：一个按钮控件像门铃，点击后消息小球进入 MFC Dialog。',
      '第 1 格：资源编辑器中按钮拥有 IDC_BTN_CONNECT，旁边提示 ID 必须稳定。',
      '第 2 格：BEGIN_MESSAGE_MAP 像路由表，把 ON_BN_CLICKED 指向处理函数。',
      '第 3 格：DoDataExchange/DDX 把界面控件和成员变量连接起来。',
      '第 4 格：处理函数更新日志窗口、调用 Serial/TCP 模块，并提示 UI 线程不要被阻塞。',
    ],
    prompt: '单页中文知识漫画，欧姆社工程漫画风，主题：MFC 消息映射：按钮点击去了哪里。画面是一个 MFC Dialog 控件城市：按钮 IDC_BTN_CONNECT 被点击后，一个“WM_COMMAND/BN_CLICKED”消息小球沿着发光线路进入 BEGIN_MESSAGE_MAP 路由表，再到 OnBnClickedConnect() 处理函数，旁边 DoDataExchange/DDX 把 Edit/List 控件和成员变量连接。加入中文短标签：控件ID、Message Map、ON_BN_CLICKED、处理函数、DDX、成员变量、日志窗口。最后用警示牌提示：耗时通信放工作线程，不要卡住 UI。风格清晰、工程感、深蓝背景、青色线条、少量紫色高光，文字可读。',
    routeHint: '/designer',
  },
  {
    id: 'thread-lock-lifetime',
    title: '线程与锁：别让 UI 卡死',
    theme: '工作线程、消息队列、mutex/lock_guard、生命周期与安全退出',
    audience: '准备把串口/TCP 读写放进真实 MFC 项目的学习者',
    ratio: '3:4',
    preset: 'concept-story manga + warm',
    status: 'prompt-ready',
    learningGoal: '说明 UI 线程只负责交互，通信/解析/保存应进入工作线程，并用锁和退出标志保护共享数据。',
    storyboard: [
      '封面：UI 线程像前台接待，工作线程像后台工人，任务通过队列传递。',
      '第 1 格：错误做法：UI 按钮直接 while 读串口，界面冻结变灰。',
      '第 2 格：正确做法：Start 按钮启动 Worker，Worker 读写设备并把日志投递给 UI。',
      '第 3 格：共享队列外有 mutex 和 lock_guard 守门，避免两个线程同时修改。',
      '第 4 格：关闭窗口前设置 stop flag、等待线程退出、释放句柄。',
    ],
    prompt: '单页中文知识漫画，概念故事漫画风，主题：线程与锁：别让 UI 卡死。画面用“前台 UI 线程”和“后台 Worker 线程”两个角色解释 MFC 工具程序：错误区域显示 UI 按钮直接长时间循环读串口导致界面冻结；正确区域显示按钮只发出开始命令，Worker 线程处理串口/TCP 收发，日志通过队列回到 UI。队列旁边有 mutex/lock_guard 守门员，窗口关闭处有 stop flag、join/WaitForSingleObject、CloseHandle。中文标签：UI线程、工作线程、消息队列、mutex、lock_guard、stop flag、安全退出。深色工程背景，温暖但专业，文字简短清楚。',
    routeHint: '/modules/cpp-core',
  },
  {
    id: 'sqlite-ini-config',
    title: 'SQLite 与 INI：配置和历史记录各归其位',
    theme: 'INI 保存轻量配置，SQLite 保存结构化历史，路径和参数化查询',
    audience: '需要给 MFC 调试工具加配置保存和历史记录的新手',
    ratio: '3:4',
    preset: 'ligne-claire + neutral',
    status: 'prompt-ready',
    learningGoal: '区分 INI 与 SQLite 的职责边界，提醒路径权限、编码和 SQL 参数绑定风险。',
    storyboard: [
      '封面：工具箱分成 INI 抽屉和 SQLite 仓库。',
      '第 1 格：INI 抽屉保存端口号、波特率、窗口大小、上次路径。',
      '第 2 格：SQLite 仓库保存设备表、收发历史、错误日志、项目记录。',
      '第 3 格：错误示例：把用户输入直接拼接 SQL，警报响起。',
      '第 4 格：正确示例：prepare/bind/step/finalize 流程与可写目录检查。',
    ],
    prompt: '单页中文知识漫画，清晰 ligne-claire 工程插画风，主题：SQLite 与 INI：配置和历史记录各归其位。画面左侧是轻量 INI 配置抽屉，标签包括端口号、波特率、窗口大小、上次路径；右侧是 SQLite 数据仓库，标签包括设备表、收发历史、错误日志、项目记录。中间有一条原则横幅：小配置用 INI，结构化历史用 SQLite。下方分镜展示错误做法“拼接 SQL 字符串”被警告牌拦住，正确做法是 prepare → bind → step → finalize，并检查 AppData/可写目录。深蓝背景，青绿色高亮，文字简短可读。',
    routeHint: '/modules/storage',
  },
];

export const comicPromptCategories = ['串口/Modbus', 'MFC', 'C++线程', 'SQLite/INI'] as const;
