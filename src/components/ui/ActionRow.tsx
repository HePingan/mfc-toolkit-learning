import { HTMLAttributes, PropsWithChildren } from 'react';

export function ActionRow({
  children,
  className = '',
  ...props
}: PropsWithChildren<HTMLAttributes<HTMLDivElement>>) {
  return (
    <div className={`form-row action-row ${className}`.trim()} {...props}>
      {children}
    </div>
  );
}
