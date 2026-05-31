import { useMemo, useState } from 'react';
import { asciiToHex, hexToAscii } from '../../utils/hex';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { CopyButton } from '../ui/CopyButton';
import { useProgress } from '../../hooks/useProgress';

const sampleAscii = 'HELLO';

export function HexAsciiLab() {
  const [ascii, setAscii] = useState(sampleAscii);
  const [hex, setHex] = useState(asciiToHex(sampleAscii));
  const converted = useMemo(() => hexToAscii(hex), [hex]);
  const error = converted.startsWith('HEX 长度必须') || converted.includes('非法') ? converted : '';
  const { progress, markLab } = useProgress();

  const resetSample = () => {
    setAscii(sampleAscii);
    setHex(asciiToHex(sampleAscii));
  };

  return (
    <Card>
      <h3>ASCII / HEX 转换器 {progress.completedLabs.includes('hex-ascii') && '✅'}</h3>
      <p className="muted">浏览器内模拟编码转换，不访问真实串口；可用于检查 MFC 串口收发前的 HEX 文本格式。</p>
      <div className="two-col">
        <label>
          ASCII 文本
          <textarea
            value={ascii}
            aria-label="ASCII 文本输入"
            onChange={(e) => {
              setAscii(e.target.value);
              setHex(asciiToHex(e.target.value));
            }}
          />
        </label>
        <label>
          HEX 字节（空格分隔）
          <textarea
            value={hex}
            aria-label="HEX 字节输入"
            onChange={(e) => {
              setHex(e.target.value);
              const next = hexToAscii(e.target.value);
              if (!next.startsWith('HEX 长度必须') && !next.includes('非法')) setAscii(next);
            }}
          />
        </label>
      </div>
      {error && <p className="warning-text" role="alert">{error}</p>}
      {!error && <pre className="result">当前 ASCII：{ascii || '（空）'}\n当前 HEX：{hex || '（空）'}</pre>}
      <div className="form-row">
        <CopyButton text={hex} label="复制 HEX" />
        <CopyButton text={ascii} label="复制 ASCII" />
        <Button className="button-ghost" type="button" onClick={resetSample}>恢复示例</Button>
        <Button type="button" onClick={() => markLab('hex-ascii')}>标记完成</Button>
      </div>
    </Card>
  );
}
