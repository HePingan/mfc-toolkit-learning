import { HTMLAttributes, ReactNode } from 'react';

type MetricCardProps = HTMLAttributes<HTMLDivElement> & {
  value: ReactNode;
  label: ReactNode;
  description?: ReactNode;
};

export function MetricCard({
  value,
  label,
  description,
  className = '',
  ...props
}: MetricCardProps) {
  return (
    <div className={`stat-card ${className}`.trim()} {...props}>
      <strong>{value}</strong>
      <span>{label}</span>
      {description && <p>{description}</p>}
    </div>
  );
}
