import { useState } from 'react';
import { buildReadHoldingFrame } from '../../utils/modbus';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { CopyButton } from '../ui/CopyButton';
import { useProgress } from '../../hooks/useProgress';

const sample = { slave: 1, start: 0, count: 2 };

function clampNumber(value: number, min: number, max: number) {
  if (Number.isNaN(value)) return min;
  return Math.min(max, Math.max(min, value));
}

export function ModbusFrameLab() {
  const [slave, setSlave] = useState(sample.slave);
  const [start, setStart] = useState(sample.start);
  const [count, setCount] = useState(sample.count);
  const safeSlave = clampNumber(slave, 1, 247);
  const safeStart = clampNumber(start, 0, 65535);
  const safeCount = clampNumber(count, 1, 125);
  const frame = buildReadHoldingFrame(slave, start, count);
  const { progress, markLab } = useProgress();
  const hasWarning = safeSlave !== slave || safeStart !== start || safeCount !== count;
  const safeFrame = buildReadHoldingFrame(safeSlave, safeStart, safeCount);
  return (
    <Card>
      <h3>Modbus RTU 帧构造器 {progress.completedLabs.includes('modbus-frame') && '✅'}</h3>
      <div className="form-row">
        <label>
          从站
          <input
            type="number"
            min="1"
            max="247"
            value={slave}
            onChange={(e) => setSlave(+e.target.value)}
            aria-label="Modbus 从站地址 1 到 247"
          />
        </label>
        <label>
          起始地址
          <input
            type="number"
            min="0"
            max="65535"
            value={start}
            onChange={(e) => setStart(+e.target.value)}
            aria-label="Modbus 起始寄存器地址"
          />
        </label>
        <label>
          寄存器数量
          <input
            type="number"
            min="1"
            max="125"
            value={count}
            onChange={(e) => setCount(+e.target.value)}
            aria-label="读取寄存器数量 1 到 125"
          />
        </label>
      </div>
      {hasWarning && (
        <p className="warning-text" role="alert">
          输入已按 Modbus RTU 常用范围预览：从站 1-247、地址 0-65535、寄存器数量
          1-125。请修正后再复制到本地 MFC 项目。
        </p>
      )}
      <pre className="result">{hasWarning ? safeFrame : frame}</pre>
      <ul>
        <li>{safeSlave.toString(16).padStart(2, '0').toUpperCase()}：从站地址</li>
        <li>03：读取保持寄存器</li>
        <li>后 4 字节：起始地址和寄存器数量</li>
        <li>末尾 2 字节：CRC16 Modbus，低字节在前</li>
      </ul>
      <div className="form-row">
        <CopyButton text={hasWarning ? safeFrame : frame} label="复制 RTU 帧" />
        <Button
          className="button-ghost"
          type="button"
          onClick={() => {
            setSlave(sample.slave);
            setStart(sample.start);
            setCount(sample.count);
          }}
        >
          恢复示例
        </Button>
        <Button onClick={() => markLab('modbus-frame')}>标记完成</Button>
      </div>
    </Card>
  );
}
