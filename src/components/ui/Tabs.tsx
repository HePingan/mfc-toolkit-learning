import { ReactNode, useState } from 'react';

export type TabItem = { id: string; label: string; content: ReactNode };

export function Tabs({ items }: { items: TabItem[] }) {
  const [active, setActive] = useState(items[0]?.id);
  return (
    <div>
      <div className="tabs">{items.map((item) => <button key={item.id} className={active === item.id ? 'active' : ''} onClick={() => setActive(item.id)}>{item.label}</button>)}</div>
      <div className="tab-panel">{items.find((item) => item.id === active)?.content}</div>
    </div>
  );
}
