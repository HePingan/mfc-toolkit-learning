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
      controls: ['IDC_COMBO_PORT', 'IDC_COMBO_BAUD', 'IDC_COMBO_DATABITS', 'IDC_COMBO_PARITY', 'IDC_COMBO_STOPBITS', 'IDC_BTN_OPEN_SERIAL'],
      messageMap: ['ON_BN_CLICKED(IDC_BTN_OPEN_SERIAL, &CMainDlg::OnBnClickedOpenSerial)'],
      acceptance: ['能显示 COM3, 9600, 8N1 这类摘要', '打开前能检查端口和波特率是否为空', '日志能输出完整配置而不是只输出“打开成功”'],
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
      acceptance: ['HEX 字符串必须成对校验', '非法字符要给出提示', '日志同时显示文本视角和字节视角'],
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
      controls: ['IDC_EDIT_SLAVE', 'IDC_EDIT_FUNC', 'IDC_EDIT_ADDR', 'IDC_EDIT_COUNT', 'IDC_BTN_BUILD_MODBUS'],
      messageMap: ['ON_BN_CLICKED(IDC_BTN_BUILD_MODBUS, &CMainDlg::OnBnClickedBuildModbus)'],
      acceptance: ['固定样例 01 03 00 00 00 02 生成 CRC 尾字节 0B C4 或按显示规则解释顺序', '站号和数量越界时禁止发送', '日志能拆解地址、功能码、数据区、CRC'],
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
      controls: ['IDC_COMBO_METHOD', 'IDC_EDIT_URL', 'IDC_EDIT_HEADERS', 'IDC_EDIT_BODY', 'IDC_BTN_HTTP_SEND', 'IDC_EDIT_RESPONSE'],
      messageMap: ['ON_BN_CLICKED(IDC_BTN_HTTP_SEND, &CMainDlg::OnBnClickedHttpSend)'],
      acceptance: ['POST JSON 时自动提示 Content-Type', 'Body 字节数和 Content-Length 一致', '失败时显示 DNS/连接/超时/HTTP 状态码'],
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
      controls: ['IDC_EDIT_IP', 'IDC_EDIT_PORT', 'IDC_BTN_TCP_CONNECT', 'IDC_BTN_TCP_SEND', 'IDC_BTN_SERVER_START', 'IDC_LIST_NET_LOG'],
      messageMap: ['ON_BN_CLICKED(IDC_BTN_TCP_CONNECT, &CMainDlg::OnBnClickedTcpConnect)', 'ON_MESSAGE(WM_NET_LOG, &CMainDlg::OnNetLog)'],
      acceptance: ['connect/recv 不阻塞 UI', '断线和端口占用有明确日志', '能解释一次 recv 不等于一条完整业务消息'],
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
      messageMap: ['ON_BN_CLICKED(IDC_BTN_SEND, &CMainDlg::OnBnClickedSend)', 'ON_WM_TIMER()', 'ON_MESSAGE(WM_APPEND_LOG, &CMainDlg::OnAppendLog)'],
      acceptance: ['点击按钮能命中断点', '控件 ID 与 resource.h、Message Map 一致', '工作线程通过 PostMessage 更新日志'],
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
      messageMap: ['ON_BN_CLICKED(IDC_BTN_START_WORKER, &CMainDlg::OnBnClickedStartWorker)', 'ON_WM_CLOSE()'],
      acceptance: ['delete 后不再访问旧指针', '关闭窗口前先停止线程', '日志对象生命周期长于后台任务或由安全队列管理'],
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
      messageMap: ['ON_BN_CLICKED(IDC_BTN_ADD_DEVICE, &CMainDlg::OnBnClickedAddDevice)', 'ON_BN_CLICKED(IDC_BTN_QUEUE_SEND, &CMainDlg::OnBnClickedQueueSend)'],
      acceptance: ['vector 下标访问前检查范围', 'queue 为空时不能 pop', '多线程访问 queue 时使用互斥锁'],
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
      acceptance: ['共享队列读写都有 lock_guard', '锁内不做耗时 IO', '停止线程时不会死锁或卡住关闭'],
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
      controls: ['IDC_EDIT_DEVICE_NAME', 'IDC_EDIT_DEVICE_PORT', 'IDC_BTN_DB_ADD', 'IDC_BTN_DB_QUERY', 'IDC_LIST_DEVICE'],
      messageMap: ['ON_BN_CLICKED(IDC_BTN_DB_ADD, &CMainDlg::OnBnClickedDbAdd)', 'ON_BN_CLICKED(IDC_BTN_DB_QUERY, &CMainDlg::OnBnClickedDbQuery)'],
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
      controls: ['IDC_BTN_LOAD_CONFIG', 'IDC_BTN_SAVE_CONFIG', 'IDC_COMBO_PORT', 'IDC_EDIT_IP', 'IDC_EDIT_PORT'],
      messageMap: ['ON_BN_CLICKED(IDC_BTN_LOAD_CONFIG, &CMainDlg::OnBnClickedLoadConfig)', 'ON_BN_CLICKED(IDC_BTN_SAVE_CONFIG, &CMainDlg::OnBnClickedSaveConfig)'],
      acceptance: ['日志打印实际 INI 路径', '配置缺失时有默认值', '保存后立即读取验证，重启后参数仍能恢复'],
    },
  },
];
