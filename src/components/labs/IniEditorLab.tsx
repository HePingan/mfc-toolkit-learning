import { useMemo, useState } from 'react';
import { parseIniDetailed } from '../../utils/ini';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { CopyButton } from '../ui/CopyButton';
import { useProgress } from '../../hooks/useProgress';

const sample = '[Serial]\nPort=COM3\nBaudRate=9600\nParity=None\n\n[TCP]\nIP=127.0.0.1\nPort=9000';

export function IniEditorLab() {
  const [text, setText] = useState(sample);
  const parsed = useMemo(() => parseIniDetailed(text), [text]);
  const jsonText = JSON.stringify(parsed.data, null, 2);
  const { progress, markLab } = useProgress();

  return (
    <Card>
      <h3>INI 编辑器 {progress.completedLabs.includes('ini-editor') && '✅'}</h3>
      <p className="muted">
        浏览器内解析 INI 文本，不读写真实磁盘；本地 MFC 练习时再接入 GetPrivateProfileString
        或自定义配置类。
      </p>
      <div className="two-col">
        <label>
          INI 文本
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            aria-label="INI 文本输入"
          />
        </label>
        <pre className="code-block">
          <code>{jsonText}</code>
        </pre>
      </div>
      {parsed.errors.length > 0 ? (
        <div role="alert">
          {parsed.errors.map((e) => (
            <p className="warning-text" key={e}>
              {e}
            </p>
          ))}
        </div>
      ) : (
        <p className="muted">解析通过：可复制 JSON 或恢复示例继续练习。</p>
      )}
      <div className="form-row">
        <CopyButton text={jsonText} label="复制 JSON" />
        <CopyButton text={text} label="复制 INI" />
        <Button className="button-ghost" type="button" onClick={() => setText(sample)}>
          恢复示例
        </Button>
        <Button type="button" onClick={() => markLab('ini-editor')}>
          标记完成
        </Button>
      </div>
    </Card>
  );
}
