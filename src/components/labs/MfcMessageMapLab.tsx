import { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { useProgress } from '../../hooks/useProgress';

const handlers = { button: 'OnBnClickedButtonSend()', timer: 'OnTimer(UINT_PTR nIDEvent)', key: 'OnKeyDown(UINT nChar, UINT nRepCnt, UINT nFlags)' };
export function MfcMessageMapLab() {
  const [active, setActive] = useState<keyof typeof handlers>('button');
  const { progress, markLab } = useProgress();
  return <Card><h3>MFC 消息映射可视化 {progress.completedLabs.includes('mfc-message-map') && '✅'}</h3><div className="form-row"><Button onClick={() => setActive('button')}>点击按钮</Button><Button onClick={() => setActive('timer')}>定时器</Button><Button onClick={() => setActive('key')}>键盘输入</Button></div><div className="flow"><span>用户/系统产生事件</span><span>Windows 消息</span><span>MFC Message Map 查找</span><span className="active-node">{handlers[active]}</span><span>业务代码执行，UI 日志更新</span></div><pre className="code-block"><code>{'BEGIN_MESSAGE_MAP(CMyDlg, CDialogEx)\n  ON_BN_CLICKED(IDC_BUTTON_SEND, &CMyDlg::OnBnClickedButtonSend)\n  ON_WM_TIMER()\n  ON_WM_KEYDOWN()\nEND_MESSAGE_MAP()'}</code></pre><Button onClick={() => markLab('mfc-message-map')}>标记完成</Button></Card>;
}
