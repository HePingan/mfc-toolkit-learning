import { HTMLAttributes, PropsWithChildren, ReactNode } from 'react';

type SectionHeadProps = PropsWithChildren<
  HTMLAttributes<HTMLElement> & {
    eyebrow?: ReactNode;
    title: ReactNode;
    description?: ReactNode;
    aside?: ReactNode;
  }
>;

export function SectionHead({
  eyebrow,
  title,
  description,
  aside,
  children,
  className = '',
  ...props
}: SectionHeadProps) {
  return (
    <section className={`section-head ${className}`.trim()} {...props}>
      <div>
        {eyebrow && <div className="eyebrow">{eyebrow}</div>}
        <h2>{title}</h2>
        {description && <p className="muted">{description}</p>}
        {children}
      </div>
      {aside}
    </section>
  );
}
