export type LabExportRecord = {
  status: 'pending' | 'completed';
  markdown: string;
};

export type LabDetail = {
  steps: string[];
  acceptance: string[];
  commonPitfalls: string[];
  exportRecord: LabExportRecord;
};

export type Lab = {
  id: string;
  title: string;
  moduleId: string;
  summary: string;
  level: 'MVP' | '完整版';
  localMfc: {
    goal: string;
    files: string[];
    controls: string[];
    messageMap: string[];
    acceptance: string[];
  };
};

export type EnrichedLab = Lab & LabDetail;

export const labs: Lab[] = [
  {
    id: 'serial-config',
    title: '串口参数模拟器',
    moduleId: 'serial',
    summary: '选择 COM、波特率、数据位、校验位、停止位并解释 8N1。',
    level: 'MVP',
    localMfc: {
      goal: '在 MFC Dialog 中完成串口参数区域，打开串口前能汇总并校验配置。',
      files: ['SerialConfig.h/.cpp', 'MainDlg.cpp', 'resource.h'],
      controls: [
        'IDC_COMBO_PORT',
        'IDC_COMBO_BAUD',
        'IDC_COMBO_DATABITS',
        'IDC_COMBO_PARITY',
        'IDC_COMBO_STOPBITS',
        'IDC_BTN_OPEN_SERIAL',
      ],
      messageMap: ['ON_BN_CLICKED(IDC_BTN_OPEN_SERIAL, &CMainDlg::OnBnClickedOpenSerial)'],
      acceptance: [
        '能显示 COM3, 9600, 8N1 这类摘要',
        '打开前能检查端口和波特率是否为空',
        '日志能输出完整配置而不是只输出“打开成功”',
      ],
    },
  },
  {
    id: 'hex-ascii',
    title: 'ASCII / HEX 转换器',
    moduleId: 'serial',
    summary: 'HELLO 与 48 45 4C 4C 4F 双向转换。',
    level: 'MVP',
    localMfc: {
      goal: '在发送区增加 ASCII/HEX 模式切换，发送前把文本转换为真实字节数组。',
      files: ['HexUtils.h/.cpp', 'SerialManager.cpp', 'MainDlg.cpp'],
      controls: ['IDC_EDIT_TX', 'IDC_RADIO_ASCII', 'IDC_RADIO_HEX', 'IDC_BTN_SEND', 'IDC_LIST_LOG'],
      messageMap: ['ON_BN_CLICKED(IDC_BTN_SEND, &CMainDlg::OnBnClickedSend)'],
      acceptance: [
        'HEX 字符串必须成对校验',
        '非法字符要给出提示',
        '日志同时显示文本视角和字节视角',
      ],
    },
  },
  {
    id: 'modbus-frame',
    title: 'Modbus RTU 帧构造器',
    moduleId: 'serial',
    summary: '生成 01 03 00 00 00 02 C4 0B 这类读保持寄存器帧。',
    level: '完整版',
    localMfc: {
      goal: '封装 ModbusFrameBuilder，按站号、功能码、起始地址、数量生成 RTU 帧并追加 CRC16。',
      files: ['ModbusFrameBuilder.h/.cpp', 'Crc16.h/.cpp', 'SerialManager.cpp'],
      controls: [
        'IDC_EDIT_SLAVE',
        'IDC_EDIT_FUNC',
        'IDC_EDIT_ADDR',
        'IDC_EDIT_COUNT',
        'IDC_BTN_BUILD_MODBUS',
      ],
      messageMap: ['ON_BN_CLICKED(IDC_BTN_BUILD_MODBUS, &CMainDlg::OnBnClickedBuildModbus)'],
      acceptance: [
        '固定样例 01 03 00 00 00 02 生成 CRC 尾字节 0B C4 或按显示规则解释顺序',
        '站号和数量越界时禁止发送',
        '日志能拆解地址、功能码、数据区、CRC',
      ],
    },
  },
  {
    id: 'http-builder',
    title: 'HTTP 请求构造器',
    moduleId: 'network',
    summary: '实时生成 GET/POST 原始 HTTP 报文和模拟响应。',
    level: 'MVP',
    localMfc: {
      goal: '在 HTTP Tab 中读取 Method、URL、Header、Body，构造请求并显示状态码和响应体。',
      files: ['HttpClient.h/.cpp', 'HttpRequest.h', 'MainDlg.cpp'],
      controls: [
        'IDC_COMBO_METHOD',
        'IDC_EDIT_URL',
        'IDC_EDIT_HEADERS',
        'IDC_EDIT_BODY',
        'IDC_BTN_HTTP_SEND',
        'IDC_EDIT_RESPONSE',
      ],
      messageMap: ['ON_BN_CLICKED(IDC_BTN_HTTP_SEND, &CMainDlg::OnBnClickedHttpSend)'],
      acceptance: [
        'POST JSON 时自动提示 Content-Type',
        'Body 字节数和 Content-Length 一致',
        '失败时显示 DNS/连接/超时/HTTP 状态码',
      ],
    },
  },
  {
    id: 'tcp-simulator',
    title: 'TCP Client/Server 模拟器',
    moduleId: 'network',
    summary: '用日志模拟 connect、send、recv、reply。',
    level: '完整版',
    localMfc: {
      goal: '实现 TCP Client 与 Server 的基础连接、发送、接收、断开，并把收发日志交给 UI 线程显示。',
      files: ['TcpClient.h/.cpp', 'TcpServer.h/.cpp', 'WorkerThread.h/.cpp', 'MainDlg.cpp'],
      controls: [
        'IDC_EDIT_IP',
        'IDC_EDIT_PORT',
        'IDC_BTN_TCP_CONNECT',
        'IDC_BTN_TCP_SEND',
        'IDC_BTN_SERVER_START',
        'IDC_LIST_NET_LOG',
      ],
      messageMap: [
        'ON_BN_CLICKED(IDC_BTN_TCP_CONNECT, &CMainDlg::OnBnClickedTcpConnect)',
        'ON_MESSAGE(WM_NET_LOG, &CMainDlg::OnNetLog)',
      ],
      acceptance: [
        'connect/recv 不阻塞 UI',
        '断线和端口占用有明确日志',
        '能解释一次 recv 不等于一条完整业务消息',
      ],
    },
  },
  {
    id: 'mfc-message-map',
    title: 'MFC 消息映射可视化',
    moduleId: 'mfc',
    summary: '点击按钮到 OnBnClickedButtonSend 的流程。',
    level: '完整版',
    localMfc: {
      goal: '用类向导绑定按钮、定时器、自定义消息，形成清晰的消息映射表。',
      files: ['MainDlg.h/.cpp', 'resource.h', 'MainDlg.rc'],
      controls: ['IDC_BTN_SEND', 'IDC_BTN_CLEAR', 'IDC_EDIT_TX', 'IDC_LIST_LOG'],
      messageMap: [
        'ON_BN_CLICKED(IDC_BTN_SEND, &CMainDlg::OnBnClickedSend)',
        'ON_WM_TIMER()',
        'ON_MESSAGE(WM_APPEND_LOG, &CMainDlg::OnAppendLog)',
      ],
      acceptance: [
        '点击按钮能命中断点',
        '控件 ID 与 resource.h、Message Map 一致',
        '工作线程通过 PostMessage 更新日志',
      ],
    },
  },
  {
    id: 'pointer-memory',
    title: '指针内存可视化',
    moduleId: 'cpp-core',
    summary: 'new、delete、nullptr 三步理解野指针。',
    level: 'MVP',
    localMfc: {
      goal: '梳理工程中动态对象的所有权，避免 Dialog 销毁后后台线程继续访问悬空指针。',
      files: ['WorkerThread.h/.cpp', 'Logger.h/.cpp', 'MainDlg.cpp'],
      controls: ['IDC_BTN_START_WORKER', 'IDC_BTN_STOP_WORKER', 'IDC_LIST_LOG'],
      messageMap: [
        'ON_BN_CLICKED(IDC_BTN_START_WORKER, &CMainDlg::OnBnClickedStartWorker)',
        'ON_WM_CLOSE()',
      ],
      acceptance: [
        'delete 后不再访问旧指针',
        '关闭窗口前先停止线程',
        '日志对象生命周期长于后台任务或由安全队列管理',
      ],
    },
  },
  {
    id: 'stl-container',
    title: 'STL 容器动画',
    moduleId: 'cpp-core',
    summary: 'vector push_back 与 queue push/pop。',
    level: '完整版',
    localMfc: {
      goal: '用 vector 保存设备列表，用 queue 保存待发送消息或待写日志任务。',
      files: ['DeviceModel.h', 'MessageQueue.h/.cpp', 'MainDlg.cpp'],
      controls: ['IDC_LIST_DEVICE', 'IDC_BTN_ADD_DEVICE', 'IDC_BTN_QUEUE_SEND', 'IDC_LIST_LOG'],
      messageMap: [
        'ON_BN_CLICKED(IDC_BTN_ADD_DEVICE, &CMainDlg::OnBnClickedAddDevice)',
        'ON_BN_CLICKED(IDC_BTN_QUEUE_SEND, &CMainDlg::OnBnClickedQueueSend)',
      ],
      acceptance: [
        'vector 下标访问前检查范围',
        'queue 为空时不能 pop',
        '多线程访问 queue 时使用互斥锁',
      ],
    },
  },
  {
    id: 'thread-lock',
    title: '多线程锁模拟器',
    moduleId: 'cpp-core',
    summary: '对比无锁和 lock_guard 的计数器结果。',
    level: '完整版',
    localMfc: {
      goal: '把日志队列、接收缓存、停止标志等共享数据放入明确的锁保护范围。',
      files: ['ThreadSafeQueue.h', 'WorkerThread.h/.cpp', 'Logger.h/.cpp'],
      controls: ['IDC_BTN_START_WORKER', 'IDC_BTN_STOP_WORKER', 'IDC_LIST_LOG'],
      messageMap: ['ON_MESSAGE(WM_APPEND_LOG, &CMainDlg::OnAppendLog)', 'ON_WM_CLOSE()'],
      acceptance: [
        '共享队列读写都有 lock_guard',
        '锁内不做耗时 IO',
        '停止线程时不会死锁或卡住关闭',
      ],
    },
  },
  {
    id: 'sqlite-crud',
    title: 'SQLite CRUD 沙盒',
    moduleId: 'storage',
    summary: '模拟 device 表的新增、查询、修改、删除。',
    level: '完整版',
    localMfc: {
      goal: '封装 DeviceRepository，完成设备表创建、新增、查询、修改、删除。',
      files: ['DeviceRepository.h/.cpp', 'sqlite3.h/sqlite3.lib', 'MainDlg.cpp'],
      controls: [
        'IDC_EDIT_DEVICE_NAME',
        'IDC_EDIT_DEVICE_PORT',
        'IDC_BTN_DB_ADD',
        'IDC_BTN_DB_QUERY',
        'IDC_LIST_DEVICE',
      ],
      messageMap: [
        'ON_BN_CLICKED(IDC_BTN_DB_ADD, &CMainDlg::OnBnClickedDbAdd)',
        'ON_BN_CLICKED(IDC_BTN_DB_QUERY, &CMainDlg::OnBnClickedDbQuery)',
      ],
      acceptance: ['启动时自动建表', 'SQL 执行失败显示错误信息', '用户输入不直接拼接到 SQL 字符串'],
    },
  },
  {
    id: 'ini-editor',
    title: 'INI 编辑器',
    moduleId: 'storage',
    summary: 'INI 文本解析成 JSON 配置对象。',
    level: '完整版',
    localMfc: {
      goal: '封装 ConfigStore，保存和读取默认串口、IP、Port、窗口选项等轻量配置。',
      files: ['ConfigStore.h/.cpp', 'App.ini', 'MainDlg.cpp'],
      controls: [
        'IDC_BTN_LOAD_CONFIG',
        'IDC_BTN_SAVE_CONFIG',
        'IDC_COMBO_PORT',
        'IDC_EDIT_IP',
        'IDC_EDIT_PORT',
      ],
      messageMap: [
        'ON_BN_CLICKED(IDC_BTN_LOAD_CONFIG, &CMainDlg::OnBnClickedLoadConfig)',
        'ON_BN_CLICKED(IDC_BTN_SAVE_CONFIG, &CMainDlg::OnBnClickedSaveConfig)',
      ],
      acceptance: [
        '日志打印实际 INI 路径',
        '配置缺失时有默认值',
        '保存后立即读取验证，重启后参数仍能恢复',
      ],
    },
  },
];

const modulePitfalls: Record<string, string[]> = {
  serial: ['参数只显示不校验，导致真实设备乱码', 'ASCII/HEX 边界没处理，奇数字节或非法字符仍允许发送', '只记录“成功/失败”，没有记录端口、波特率和原始帧'],
  network: ['在 UI 线程直接 connect/recv，现场表现为窗口卡死', '把一次 recv 当成完整业务包，忽略粘包/半包', '错误日志只写“连接失败”，没有区分 DNS、超时、端口占用和状态码'],
  mfc: ['控件 ID、DDX 变量和 Message Map 名称不一致', '工作线程直接操作控件而不是 PostMessage 回 UI 线程', '没有在 OnInitDialog 初始化默认状态和日志入口'],
  'cpp-core': ['对象所有权不清晰，窗口关闭后线程继续访问悬空指针', '共享队列无锁或锁内执行耗时 IO', '容器访问前不检查空队列、下标范围或生命周期'],
  storage: ['配置缺失时没有默认值，首次启动直接失败', 'SQL 字符串直接拼接用户输入', '保存后不做回读验证，现场无法确认写入路径和内容'],
};

const moduleSteps: Record<string, string[]> = {
  serial: ['确认浏览器模拟输入/输出关系', '列出本地 MFC 控件 ID 与默认值', '封装参数/帧构造类并接入按钮事件', '补充日志、校验和错误提示', '按固定样例和异常输入做验收'],
  network: ['确认请求/连接的字段模型', '拆分 UI 输入、网络执行和日志输出', '把耗时连接/收发放到工作线程', '补齐超时、断线和协议错误提示', '用本机服务或模拟响应验收'],
  mfc: ['建立 Dialog 控件清单', '用类向导或手写绑定 DDX 与 Message Map', '把按钮/定时器/自定义消息串成流程', '用断点验证事件入口', '补齐线程回 UI 的消息路径'],
  'cpp-core': ['画出对象生命周期和共享数据边界', '先实现最小数据结构演示', '增加空值、越界和并发保护', '把日志输出统一到线程安全入口', '用关闭窗口、重复启动等场景验收'],
  storage: ['确定配置/表结构和默认值', '封装读写 Repository/Store 类', '把 UI 字段映射为结构体', '增加失败日志、路径提示和回读验证', '用重启恢复和非法输入验收'],
};

function markdownList(items: string[]) {
  return items.map((item) => `- ${item}`).join('\n');
}

export function buildLabExportRecord(lab: Lab | EnrichedLab, completed = false): LabExportRecord {
  const status = completed ? 'completed' : 'pending';
  return {
    status,
    markdown: `# ${lab.title}\n\n状态：${status}\n等级：${lab.level}\n模块：${lab.moduleId}\n\n## 实验摘要\n${lab.summary}\n\n## 本地 MFC 目标\n${lab.localMfc.goal}\n\n## 本地 MFC 文件\n${markdownList(lab.localMfc.files)}\n\n## 控件 ID\n${markdownList(lab.localMfc.controls)}\n\n## Message Map\n${markdownList(lab.localMfc.messageMap)}\n\n## 验收点\n${markdownList(lab.localMfc.acceptance)}\n`,
  };
}

export function enrichLabDetails(lab: Lab): EnrichedLab {
  const moduleSpecificSteps = moduleSteps[lab.moduleId] ?? [
    '理解浏览器模拟目标',
    '列出本地 MFC 文件和控件',
    '实现最小可运行路径',
    '补充日志和异常提示',
  ];
  const moduleSpecificPitfalls = modulePitfalls[lab.moduleId] ?? [
    '只完成界面，没有验收真实流程',
    '错误提示过于笼统，无法定位现场问题',
    '缺少可复制的交付记录',
  ];
  return {
    ...lab,
    steps: [...moduleSpecificSteps, `对照 ${lab.localMfc.files[0]} 等文件完成代码迁移`],
    acceptance: lab.localMfc.acceptance,
    commonPitfalls: moduleSpecificPitfalls,
    exportRecord: buildLabExportRecord(lab, false),
  };
}

export const enrichedLabs: EnrichedLab[] = labs.map(enrichLabDetails);

