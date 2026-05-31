import { PropsWithChildren } from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { ProgressPanel } from './ProgressPanel';
import { BottomTabBar } from './BottomTabBar';

export function AppLayout({ children }: PropsWithChildren) {
  return (
    <div className="app-shell">
      <Header />
      <div className="layout-grid">
        <Sidebar />
        <main className="content">{children}</main>
        <ProgressPanel />
      </div>
      <BottomTabBar />
    </div>
  );
}
