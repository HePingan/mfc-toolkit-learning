import { LessonSectionData } from '../../data/modules';
import { CodeBlock } from './CodeBlock';
import { ConceptCard } from './ConceptCard';

export function LessonSection({ section }: { section: LessonSectionData }) {
  return (
    <section className="lesson-section">
      <h2>{section.heading}</h2>
      <p>{section.body}</p>
      {section.bullets && <ConceptCard title="要点" items={section.bullets} />}
      {section.code && <CodeBlock code={section.code} />}
    </section>
  );
}
