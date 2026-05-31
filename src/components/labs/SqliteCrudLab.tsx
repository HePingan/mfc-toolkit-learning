import { useState } from 'react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { useProgress } from '../../hooks/useProgress';

type Device = { id: number; name: string; port: string; baudrate: number };
export function SqliteCrudLab() {
  const [rows, setRows] = useState<Device[]>([
    { id: 1, name: '温度采集器', port: 'COM3', baudrate: 9600 },
  ]);
  const [sql, setSql] = useState('SELECT * FROM device;');
  const { progress, markLab } = useProgress();
  const add = () => {
    setRows([...rows, { id: rows.length + 1, name: '新设备', port: 'COM1', baudrate: 115200 }]);
    setSql("INSERT INTO device(name, port, baudrate) VALUES ('新设备', 'COM1', 115200);");
  };
  const update = () => {
    setRows(rows.map((r) => (r.id === 1 ? { ...r, baudrate: 115200 } : r)));
    setSql('UPDATE device SET baudrate=115200 WHERE id=1;');
  };
  const del = () => {
    setRows(rows.slice(0, -1));
    setSql('DELETE FROM device WHERE id=?;');
  };
  return (
    <Card>
      <h3>SQLite CRUD 沙盒 {progress.completedLabs.includes('sqlite-crud') && '✅'}</h3>
      <div className="form-row">
        <Button onClick={add}>新增</Button>
        <Button onClick={() => setSql('SELECT * FROM device;')}>查询</Button>
        <Button onClick={update}>修改</Button>
        <Button onClick={del}>删除</Button>
        <Button onClick={() => markLab('sqlite-crud')}>标记完成</Button>
      </div>
      <table>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id}>
              <td>{r.id}</td>
              <td>{r.name}</td>
              <td>{r.port}</td>
              <td>{r.baudrate}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <pre className="code-block">
        <code>{sql}</code>
      </pre>
    </Card>
  );
}
