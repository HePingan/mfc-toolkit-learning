export type TroubleCategory = 'serial' | 'tcp' | 'http' | 'mfc' | 'cpp' | 'storage';

export type TroubleCase = {
  id: string;
  category: TroubleCategory;
  title: string;
  scene: string;
  symptoms: string[];
  evidence: string[];
  options: string[];
  answer: string;
  diagnosis: string;
  fixSteps: string[];
  localPractice: string;
  tags: string[];
};

export const troubleCategoryLabels: Record<TroubleCategory, string> = {
  serial: '串口/Modbus',
  tcp: 'TCP Socket',
  http: 'HTTP 请求',
  mfc: 'MFC 界面',
  cpp: 'C++ 稳定性',
  storage: 'SQLite/INI',
};

export const troubleCases: TroubleCase[] = [
  {
    id: 'serial-garbled-8n1',
    category: 'serial',
    title: '串口收到乱码，但设备确实有返回',
    scene: '上位机打开 COM3 后能收到字节流，但日志窗口显示为乱码或问号。网页串口实验中同样参数显示为 COM3, 9600, 8N1。',
    symptoms: ['接收区持续刷新', 'ASCII 显示不可读', 'HEX 模式能看到固定帧头', '设备手册写着 115200, 8N1'],
    evidence: ['当前 UI 波特率：9600', '设备手册：115200', '接收 HEX：01 03 04 00 64 00 C8 ...', '校验位：None，停止位：1'],
    options: ['波特率不一致', 'SQLite 表缺字段', '按钮没有消息映射', 'HTTP Header 缺 Content-Type'],
    answer: '波特率不一致',
    diagnosis: '串口两端波特率不一致时，物理链路可能仍有电平变化，但按错误速率采样会得到乱码。先统一波特率，再判断 ASCII/HEX 显示方式。',
    fixSteps: ['按设备手册把 UI 波特率改为 115200', '确认数据位/校验位/停止位都是 8N1', '先切到 HEX 模式观察帧头和长度', '再根据协议决定是否转 ASCII 或解析 Modbus'],
    localPractice: '在 SerialManager::Open 前打印完整 SerialConfig，并在参数不一致时阻止打开串口。',
    tags: ['波特率', '8N1', 'HEX', '设备手册'],
  },
  {
    id: 'modbus-crc-byte-order',
    category: 'serial',
    title: 'Modbus RTU 设备无响应',
    scene: '发送读保持寄存器命令后设备没有任何回复，但串口参数确认正确。',
    symptoms: ['串口能打开', '发送日志有数据', '设备无返回', '用第三方工具同地址可读'],
    evidence: ['发送帧：01 03 00 00 00 02 C4 0B', '第三方工具帧尾：0B C4', '从站地址：01', '功能码：03'],
    options: ['CRC 低字节/高字节顺序写反', 'TCP 端口被占用', 'UI 线程死锁', 'INI 编码错误'],
    answer: 'CRC 低字节/高字节顺序写反',
    diagnosis: 'Modbus RTU CRC 计算结果发送时通常低字节在前、高字节在后。帧尾顺序错误时设备会直接丢弃。',
    fixSteps: ['复查 CRC16 计算函数', '发送前把 CRC lo 放在 hi 前面', '用网页 Modbus 帧实验或第三方工具对照', '日志同时打印 PDU 和完整 ADU'],
    localPractice: '在 ModbusFrameBuilder 中把 CRC 追加逻辑单独写单元测试或至少写固定样例自检。',
    tags: ['Modbus', 'CRC16', '字节序'],
  },
  {
    id: 'tcp-ui-freeze',
    category: 'tcp',
    title: '点击连接 TCP 后界面卡死',
    scene: '输入服务器 IP 和端口后点击连接，窗口无法拖动，几秒后系统提示未响应。',
    symptoms: ['按钮点击后界面不刷新', '日志没有及时输出', '断网时更容易复现', '任务管理器显示程序仍占 CPU'],
    evidence: ['connect/recv 写在 OnBnClickedTcpConnect 内', '没有 AfxBeginThread', '没有超时提示', '没有停止按钮'],
    options: ['耗时 Socket 操作阻塞 UI 线程', 'SQL 参数化错误', 'Modbus CRC 错误', 'ComboBox 没初始化'],
    answer: '耗时 Socket 操作阻塞 UI 线程',
    diagnosis: 'MFC 主线程负责消息循环。把 connect/recv 等阻塞调用直接放在按钮事件里，会导致窗口消息无法处理。',
    fixSteps: ['按钮事件只读取参数和启动工作线程', '工作线程内执行 connect/send/recv', '使用 PostMessage 把日志发回 UI 线程', '增加连接超时和停止标志'],
    localPractice: '参考 /practice 的 TCP / HTTP 通讯模板，完成 WorkerThread + WM_NET_LOG 的调用链。',
    tags: ['UI 线程', 'AfxBeginThread', 'PostMessage', 'Socket'],
  },
  {
    id: 'http-post-empty-body',
    category: 'http',
    title: 'HTTP POST 服务端收到空 Body',
    scene: '接口调试页中填写了 JSON Body，服务端日志却显示 body 为空或无法解析。',
    symptoms: ['GET 正常', 'POST 返回 400', '服务端提示 invalid json', '抓包发现 Content-Length 为 0'],
    evidence: ['Header 未设置 Content-Type', '发送函数只拼了请求行和 Header', 'Body 编辑框内容没有参与构造', 'URL 和端口正确'],
    options: ['请求构造时漏掉 Body 或 Content-Length', '串口停止位错误', 'MFC 控件 ID 重复', 'vector 越界'],
    answer: '请求构造时漏掉 Body 或 Content-Length',
    diagnosis: 'POST 需要明确发送 Body，并让 Header 与 Body 一致。Content-Type/Content-Length 与实际发送内容不一致会导致服务端解析失败。',
    fixSteps: ['从 Body 编辑框读取 UTF-8/ANSI 内容', '设置 Content-Type: application/json', '按实际字节数设置 Content-Length', '日志打印完整请求摘要和响应状态码'],
    localPractice: '在 HttpClient::BuildRequest 中把 method、url、headers、body 作为结构体字段，不要散落在按钮事件中。',
    tags: ['HTTP', 'POST', 'Content-Length', 'JSON'],
  },
  {
    id: 'mfc-button-no-response',
    category: 'mfc',
    title: '按钮点击没有任何反应',
    scene: 'Dialog 上新增“发送”按钮后，点击没有日志，也进不了断点。',
    symptoms: ['窗口能启动', '按钮可点击', '断点不命中', '其他旧按钮正常'],
    evidence: ['resource.h 中按钮 ID 后来改过', 'BEGIN_MESSAGE_MAP 仍绑定旧 ID', '函数 OnBnClickedSend 存在', '没有编译错误'],
    options: ['消息映射绑定的控件 ID 不一致', 'CRC 字节序错误', 'TCP 服务端未监听', 'SQLite 没建表'],
    answer: '消息映射绑定的控件 ID 不一致',
    diagnosis: 'MFC 按钮事件依赖控件 ID 与消息映射宏一致。改过资源 ID 后没有同步 message map，会表现为点击无响应。',
    fixSteps: ['检查 resource.h 中 IDC_BTN_SEND 的最终值', '确认 ON_BN_CLICKED 使用同一个 ID', '用类向导重新生成事件函数', '清理并重新构建项目'],
    localPractice: '在 MFC Dialog 主界面骨架任务中固定控件 ID，避免后期频繁改名。',
    tags: ['MFC', 'Message Map', '控件 ID'],
  },
  {
    id: 'cpp-random-crash-close',
    category: 'cpp',
    title: '关闭窗口时偶发崩溃',
    scene: '通讯任务运行中直接关闭工具，偶尔崩溃或弹出访问冲突。',
    symptoms: ['运行一段时间才出现', '关闭窗口更容易复现', '日志最后停在接收线程', '调试器提示 access violation'],
    evidence: ['工作线程持有 Dialog 指针', 'OnClose 中没有停止线程', '线程可能在窗口销毁后 PostMessage', '没有 atomic stop 标志'],
    options: ['窗口销毁后工作线程仍访问 UI 对象', 'HTTP Header 顺序错误', 'INI Section 名太短', '串口 COM 号不存在'],
    answer: '窗口销毁后工作线程仍访问 UI 对象',
    diagnosis: '线程生命周期长于窗口时，旧 Dialog 指针变成悬空指针。关闭窗口前必须通知线程停止并等待或断开 UI 回调。',
    fixSteps: ['增加 std::atomic_bool stop 标志', 'OnClose 中先请求停止线程', '线程退出后再销毁窗口资源', 'PostMessage 数据所有权要明确释放'],
    localPractice: '在 WorkerThread 模板中实现 Start/Stop/IsRunning，并禁止线程直接操作控件。',
    tags: ['线程退出', '悬空指针', 'PostMessage', '生命周期'],
  },
  {
    id: 'sqlite-config-lost',
    category: 'storage',
    title: '重启后配置丢失',
    scene: '用户保存了默认 IP、端口和串口参数，关闭工具再打开全部恢复默认。',
    symptoms: ['点击保存提示成功', '当前窗口内参数可用', '重启后丢失', '数据库文件夹为空'],
    evidence: ['保存路径使用相对路径 ./config/app.ini', '启动目录从 VS 变成打包目录后不同', '没有打印实际保存路径', '没有检查写入返回值'],
    options: ['配置文件相对路径不稳定或写入失败未检查', 'TCP 粘包', '按钮 ID 错误', 'CRC 多项式错误'],
    answer: '配置文件相对路径不稳定或写入失败未检查',
    diagnosis: '配置保存成功不能只看 UI 提示，必须确认写入路径、返回值和异常。打包后工作目录变化会让相对路径指到别处。',
    fixSteps: ['统一配置目录，例如 exe 同级 config 或 AppData', '保存后立即读取验证', '日志打印完整路径', '缺失文件时创建默认配置'],
    localPractice: '在 ConfigStore 中集中处理路径，不要在多个按钮函数里拼接相对路径。',
    tags: ['INI', 'SQLite', '路径', '持久化'],
  },
];

export function scoreTroubleAnswer(caseItem: TroubleCase, selected: string) {
  return selected === caseItem.answer;
}
