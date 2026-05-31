import { HTMLAttributes, PropsWithChildren, ReactNode } from 'react';

type PageHeroProps = PropsWithChildren<
  HTMLAttributes<HTMLElement> & {
    eyebrow?: ReactNode;
    title: ReactNode;
    description?: ReactNode;
    badge?: ReactNode;
  }
>;

export function PageHero({
  eyebrow,
  title,
  description,
  badge,
  children,
  className = '',
  ...props
}: PageHeroProps) {
  return (
    <section className={`hero ${className}`.trim()} {...props}>
      {eyebrow && <div className="eyebrow">{eyebrow}</div>}
      <h2>{title}</h2>
      {description && <p>{description}</p>}
      {badge && <span className="badge">{badge}</span>}
      {children}
    </section>
  );
}
