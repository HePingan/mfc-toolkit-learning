import { PropsWithChildren } from 'react';

export function Badge({ children, tone = 'default' }: PropsWithChildren<{ tone?: 'default' | 'success' | 'warning' }>) {
  return <span className={`badge badge-${tone}`}>{children}</span>;
}
