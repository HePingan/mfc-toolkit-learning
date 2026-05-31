import { useState } from 'react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { useProgress } from '../../hooks/useProgress';

export function SerialConfigLab() {
  const [com, setCom] = useState('COM3');
  const [baud, setBaud] = useState('9600');
  const [dataBits, setDataBits] = useState('8');
  const [parity, setParity] = useState('N');
  const [stopBits, setStopBits] = useState('1');
  const { progress, markLab } = useProgress();
  const done = progress.completedLabs.includes('serial-config');
  return <Card><h3>串口参数模拟器 {done && '✅'}</h3><div className="form-row"><select value={com} onChange={(e) => setCom(e.target.value)}><option>COM1</option><option>COM2</option><option>COM3</option><option>COM4</option></select><select value={baud} onChange={(e) => setBaud(e.target.value)}><option>9600</option><option>19200</option><option>38400</option><option>115200</option></select><select value={dataBits} onChange={(e) => setDataBits(e.target.value)}><option>7</option><option>8</option></select><select value={parity} onChange={(e) => setParity(e.target.value)}><option value="N">None</option><option value="O">Odd</option><option value="E">Even</option></select><select value={stopBits} onChange={(e) => setStopBits(e.target.value)}><option>1</option><option>1.5</option><option>2</option></select></div><p className="result">当前配置：{com}, {baud}, {dataBits}{parity}{stopBits}</p><p className="muted">{dataBits}{parity}{stopBits} = {dataBits} 个数据位，{parity === 'N' ? '无校验' : parity === 'O' ? '奇校验' : '偶校验'}，{stopBits} 个停止位。</p><Button onClick={() => markLab('serial-config')}>标记完成</Button></Card>;
}
