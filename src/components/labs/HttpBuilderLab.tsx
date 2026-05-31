import { useMemo, useState } from 'react';
import { buildHttpRequest } from '../../utils/http';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { CopyButton } from '../ui/CopyButton';
import { useProgress } from '../../hooks/useProgress';

const sample = {
  method: 'POST',
  url: 'https://example.com/api/device',
  headers: 'Content-Type: application/json',
  body: '{"id":1,"status":"on"}',
};

function getValidationMessage(method: string, url: string, headers: string, body: string) {
  try {
    const parsed = new URL(url);
    if (!['http:', 'https:'].includes(parsed.protocol)) return 'URL 只接受 http/https 协议。';
  } catch {
    return 'URL 格式不正确，请包含 http:// 或 https://。';
  }

  const badHeader = headers.split('\n').find((line) => line.trim() && !line.includes(':'));
  if (badHeader) return `Header 缺少冒号分隔：${badHeader}`;
  if (method === 'GET' && body.trim()) return 'GET 通常不携带 Body；如需提交 JSON，请切换 POST。';
  return '';
}

export function HttpBuilderLab() {
  const [method, setMethod] = useState(sample.method);
  const [url, setUrl] = useState(sample.url);
  const [headers, setHeaders] = useState(sample.headers);
  const [body, setBody] = useState(sample.body);
  const { progress, markLab } = useProgress();
  const requestText = useMemo(
    () => buildHttpRequest(method, url, body, headers),
    [method, url, body, headers],
  );
  const validation = getValidationMessage(method, url, headers, body);

  const resetSample = () => {
    setMethod(sample.method);
    setUrl(sample.url);
    setHeaders(sample.headers);
    setBody(sample.body);
  };

  return (
    <Card>
      <h3>HTTP 请求构造器 {progress.completedLabs.includes('http-builder') && '✅'}</h3>
      <p className="muted">
        仅构造报文并模拟响应，不从浏览器向目标设备发真实 HTTP 请求；本地 MFC 可用 WinHTTP/WinINet
        练习。
      </p>
      <div className="form-row">
        <label>
          Method
          <select
            value={method}
            onChange={(e) => setMethod(e.target.value)}
            aria-label="HTTP Method"
          >
            <option>GET</option>
            <option>POST</option>
          </select>
        </label>
        <label>
          URL
          <input value={url} onChange={(e) => setUrl(e.target.value)} aria-label="请求 URL" />
        </label>
      </div>
      <label>
        Header
        <textarea
          value={headers}
          onChange={(e) => setHeaders(e.target.value)}
          aria-label="HTTP Header 输入"
        />
      </label>
      <label>
        Body
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          aria-label="HTTP Body 输入"
        />
      </label>
      {validation && (
        <p className="warning-text" role="alert">
          {validation}
        </p>
      )}
      <pre className="code-block">
        <code>{requestText}</code>
      </pre>
      <pre className="result">模拟响应：{'{\n  "code": 200,\n  "message": "ok"\n}'}</pre>
      <div className="form-row">
        <CopyButton text={requestText} label="复制请求报文" />
        <Button className="button-ghost" type="button" onClick={resetSample}>
          恢复示例
        </Button>
        <Button type="button" onClick={() => markLab('http-builder')}>
          标记完成
        </Button>
      </div>
    </Card>
  );
}
