import { useState } from 'react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Terminal } from '../ui/Terminal';
import { CopyButton } from '../ui/CopyButton';
import { useProgress } from '../../hooks/useProgress';

const sample = { ip: '127.0.0.1', port: '9000', msg: 'hello' };

export function TcpSimulatorLab() {
  const [ip, setIp] = useState(sample.ip);
  const [port, setPort] = useState(sample.port);
  const [msg, setMsg] = useState(sample.msg);
  const [connected, setConnected] = useState(false);
  const [client, setClient] = useState<string[]>([]);
  const [server, setServer] = useState<string[]>([]);
  const [warning, setWarning] = useState('');
  const { progress, markLab } = useProgress();
  const transcript = [`# Browser-only TCP simulation`, ...client, ...server].join('\n');
  const connect = () => {
    const portNumber = Number(port);
    if (!ip.trim() || !Number.isInteger(portNumber) || portNumber < 1 || portNumber > 65535) {
      setWarning('请输入主机/IP，并使用 1-65535 之间的端口号。本实验不建立真实 TCP 连接。');
      return;
    }
    setWarning('');
    setConnected(true);
    setClient([`[Client] connect ${ip}:${port}`]);
    setServer(['[Server] client connected']);
  };
  const send = () => {
    if (!connected) {
      setWarning('请先点击 Connect 建立模拟会话。');
      return;
    }
    if (!msg.trim()) {
      setWarning('发送内容不能为空。');
      return;
    }
    setWarning('');
    setClient((x) => [...x, `[Client] send: ${msg}`, '[Client] recv: world']);
    setServer((x) => [...x, `[Server] recv: ${msg}`, '[Server] send: world']);
  };
  const disconnect = () => {
    setWarning('');
    setConnected(false);
    setClient((x) => [...x, '[Client] disconnect']);
    setServer((x) => [...x, '[Server] client closed']);
  };
  const reset = () => {
    setIp(sample.ip);
    setPort(sample.port);
    setMsg(sample.msg);
    setConnected(false);
    setClient([]);
    setServer([]);
    setWarning('');
  };
  return (
    <Card>
      <h3>TCP Client/Server 模拟器 {progress.completedLabs.includes('tcp-simulator') && '✅'}</h3>
      <div className="form-row">
        <label>
          主机/IP
          <input
            value={ip}
            onChange={(e) => setIp(e.target.value)}
            aria-label="模拟 TCP 主机或 IP"
          />
        </label>
        <label>
          端口
          <input
            value={port}
            onChange={(e) => setPort(e.target.value)}
            inputMode="numeric"
            aria-label="模拟 TCP 端口"
          />
        </label>
        <label>
          消息
          <input value={msg} onChange={(e) => setMsg(e.target.value)} aria-label="模拟发送消息" />
        </label>
      </div>
      {warning && (
        <p className="warning-text" role="alert">
          {warning}
        </p>
      )}
      <div className="form-row">
        <Button onClick={connect}>Connect</Button>
        <Button onClick={send}>Send</Button>
        <Button onClick={disconnect}>Disconnect</Button>
        <CopyButton text={transcript} label="复制日志" />
        <Button className="button-ghost" type="button" onClick={reset}>
          恢复示例
        </Button>
        <Button onClick={() => markLab('tcp-simulator')}>标记完成</Button>
      </div>
      <div className="two-col">
        <Terminal lines={client} />
        <Terminal lines={server} />
      </div>
      <p className="muted">
        说明：这是前端模拟，不进行真实网络连接；本地 WinSock 练习请在 Windows + Visual Studio + MFC
        中完成。
      </p>
    </Card>
  );
}
