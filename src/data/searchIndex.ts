import { modules } from './modules';
import { labs } from './labs';
import { quizzes } from './quizzes';
import { resources } from './resources';

export type SearchItemType = 'module' | 'section' | 'lab' | 'quiz' | 'concept' | 'resource';

export type SearchItem = {
  id: string;
  type: SearchItemType;
  title: string;
  summary: string;
  keywords: string[];
  moduleId?: string;
  href: string;
};

const typeWeight: Record<SearchItemType, number> = {
  module: 5,
  section: 4,
  lab: 4,
  quiz: 3,
  concept: 2,
  resource: 2,
};

const typeLabel: Record<SearchItemType, string> = {
  module: '课程模块',
  section: '章节内容',
  lab: '交互实验',
  quiz: '测验题',
  concept: '核心概念',
  resource: '学习资源',
};

function compactKeywords(values: Array<string | undefined>) {
  return values
    .flatMap((value) => (value ?? '').split(/[\s,，、/|]+/))
    .map((value) => value.trim())
    .filter(Boolean);
}

export const searchItems: SearchItem[] = [
  ...modules.flatMap((module) => [
    {
      id: `module-${module.id}`,
      type: 'module' as const,
      title: module.title,
      summary: `${module.subtitle}。${module.description}`,
      keywords: compactKeywords([
        module.title,
        module.subtitle,
        module.description,
        ...module.objectives,
        ...module.concepts,
        ...module.commonMistakes,
      ]),
      moduleId: module.id,
      href: `/modules/${module.id}`,
    },
    ...module.sections.map((section, index) => ({
      id: `section-${module.id}-${index}`,
      type: 'section' as const,
      title: `${module.title}：${section.heading}`,
      summary: `${section.body}${section.bullets?.length ? `｜${section.bullets.join('、')}` : ''}`,
      keywords: compactKeywords([
        module.title,
        section.heading,
        section.body,
        ...(section.bullets ?? []),
        section.code ?? '',
      ]),
      moduleId: module.id,
      href: `/modules/${module.id}`,
    })),
    ...module.concepts.map((concept) => ({
      id: `concept-${module.id}-${concept}`,
      type: 'concept' as const,
      title: concept,
      summary: `出现在「${module.title}」模块。建议结合章节、实验和测验一起学习。`,
      keywords: compactKeywords([concept, module.title, module.subtitle, module.description]),
      moduleId: module.id,
      href: `/modules/${module.id}`,
    })),
  ]),
  ...labs.map((lab) => {
    const module = modules.find((item) => item.id === lab.moduleId);
    return {
      id: `lab-${lab.id}`,
      type: 'lab' as const,
      title: lab.title,
      summary: `${lab.summary}｜关联模块：${module?.title ?? lab.moduleId}`,
      keywords: compactKeywords([
        lab.title,
        lab.summary,
        lab.level,
        module?.title,
        module?.subtitle,
      ]),
      moduleId: lab.moduleId,
      href: '/labs',
    };
  }),
  ...quizzes.map((quiz) => {
    const module = modules.find((item) => item.id === quiz.moduleId);
    return {
      id: `quiz-${quiz.id}`,
      type: 'quiz' as const,
      title: quiz.question,
      summary: `${typeLabel.quiz}｜${module?.title ?? quiz.moduleId}｜难度：${quiz.difficulty}｜解析：${quiz.explanation}`,
      keywords: compactKeywords([
        quiz.question,
        quiz.explanation,
        quiz.type,
        quiz.difficulty,
        quiz.codeSnippet ?? '',
        ...(quiz.options ?? []),
        module?.title,
        module?.subtitle,
      ]),
      moduleId: quiz.moduleId,
      href: `/quiz?module=${quiz.moduleId}`,
    };
  }),
  ...resources.map((resource, index) => ({
    id: `resource-${index}`,
    type: 'resource' as const,
    title: resource.title,
    summary: `${resource.kind}｜${resource.note}`,
    keywords: compactKeywords([resource.title, resource.kind, resource.note]),
    href: '/resources',
  })),
];

export function getSearchTypeLabel(type: SearchItemType) {
  return typeLabel[type];
}

function scoreItem(item: SearchItem, terms: string[]) {
  const title = item.title.toLowerCase();
  const summary = item.summary.toLowerCase();
  const keywordText = item.keywords.join(' ').toLowerCase();
  let score = 0;

  for (const term of terms) {
    if (!term) continue;
    if (title.includes(term)) score += 8;
    if (summary.includes(term)) score += 4;
    if (keywordText.includes(term)) score += 3;
    if (item.type.toLowerCase().includes(term)) score += 1;
  }

  return score + typeWeight[item.type];
}

export function searchLearningItems(
  query: string,
  type: 'all' | SearchItemType = 'all',
  moduleId = 'all',
) {
  const normalized = query.trim().toLowerCase();
  const terms = compactKeywords([normalized]);

  return searchItems
    .filter((item) => type === 'all' || item.type === type)
    .filter((item) => moduleId === 'all' || item.moduleId === moduleId)
    .map((item) => ({ item, score: normalized ? scoreItem(item, terms) : typeWeight[item.type] }))
    .filter(({ score }) => !normalized || score > typeWeight.module)
    .sort((a, b) => b.score - a.score || a.item.title.localeCompare(b.item.title, 'zh-CN'))
    .map(({ item }) => item);
}
