import { modules } from '../data/modules';
import { labs } from '../data/labs';
import { quizzes, getQuestion } from '../data/quizzes';
import { practiceTemplates, capstoneRubric } from '../data/practice';
import { achievementSummary } from '../data/achievements';
import { calculateOverall, masteryScore, ProgressState, unique } from './progress';

export type ReportModuleRow = {
  id: string;
  title: string;
  completed: boolean;
  labDone: number;
  labTotal: number;
  quizScore?: number;
  mastery: number;
  recommendation: string;
};

export type LearningReport = {
  generatedAt: string;
  overallPercent: number;
  moduleRows: ReportModuleRow[];
  completedModules: string[];
  completedLabs: string[];
  quizScores: Record<string, number>;
  wrongQuestions: { id: string; moduleId: string; question: string; explanation: string }[];
  completedPracticeTasks: string[];
  capstoneChecks: string[];
  capstonePercent: number;
  practicePercent: number;
  achievementUnlocked: number;
  achievementTotal: number;
  recommendations: string[];
};

const capstoneTotal = 19;

export function buildLearningReport(progress: ProgressState): LearningReport {
  const moduleRows = modules.map((module) => {
    const moduleLabs = labs.filter((lab) => lab.moduleId === module.id);
    const labDone = moduleLabs.filter((lab) => progress.completedLabs.includes(lab.id)).length;
    const quizScore = progress.quizScores[module.id];
    const mastery = masteryScore(module.id, progress);
    let recommendation = '继续保持，可进入下一个模块。';
    if (!progress.completedModules.includes(module.id))
      recommendation = '先完成本章讲解，并点击标记模块完成。';
    else if (moduleLabs.length && labDone < moduleLabs.length)
      recommendation = '补齐本章交互实验，再进入测验或实战。';
    else if (quizScore === undefined) recommendation = '完成本章测验，形成学习闭环。';
    else if (quizScore < 80) recommendation = '测验低于 80 分，建议重做测验并复盘错题。';
    else if (mastery < 90) recommendation = '掌握度接近达标，建议结合故障排查案例复盘。';
    return {
      id: module.id,
      title: module.title,
      completed: progress.completedModules.includes(module.id),
      labDone,
      labTotal: moduleLabs.length,
      quizScore,
      mastery,
      recommendation,
    };
  });

  const quizModuleIds = unique(quizzes.map((quiz) => quiz.moduleId));
  const completedPracticeTasks = progress.completedPracticeTasks ?? [];
  const wrongQuestions = progress.wrongQuestions
    .map(getQuestion)
    .filter(Boolean)
    .map((q) => ({
      id: q!.id,
      moduleId: q!.moduleId,
      question: q!.question,
      explanation: q!.explanation,
    }));
  const achievement = achievementSummary(progress);
  const recommendations: string[] = [];
  const weakRows = moduleRows.filter((row) => row.mastery < 70).slice(0, 3);

  if (progress.completedModules.length < modules.length)
    recommendations.push(
      `继续完成课程模块：${modules.find((m) => !progress.completedModules.includes(m.id))?.title ?? '未完成模块'}。`,
    );
  if (progress.completedLabs.length < labs.length)
    recommendations.push('补齐未完成的浏览器交互实验，尤其是串口、TCP/HTTP、线程和存储相关实验。');
  if (quizModuleIds.some((id) => progress.quizScores[id] === undefined))
    recommendations.push('完成所有模块测验，报告会同步显示各模块成绩。');
  if (wrongQuestions.length > 0)
    recommendations.push(`当前有 ${wrongQuestions.length} 道错题，建议先进入测验中心清理错题。`);
  if (completedPracticeTasks.length < practiceTemplates.length)
    recommendations.push(
      '继续完成 /practice 中的本地 MFC 实战模板，把网页模拟迁移到 Visual Studio。',
    );
  if (progress.capstoneChecks.length / capstoneTotal < 0.8)
    recommendations.push(
      'Capstone 自评未达到 80%，建议优先补齐 UI、通讯、存储、日志和线程相关验收项。',
    );
  weakRows.forEach((row) =>
    recommendations.push(
      `薄弱模块：${row.title} 当前掌握度 ${row.mastery}%，建议按“实验 → 测验 → 排错案例”顺序复习。`,
    ),
  );
  if (recommendations.length === 0)
    recommendations.push(
      '当前学习闭环状态良好，可以开始整理 Windows + Visual Studio 本地项目代码并准备打包演示。',
    );

  return {
    generatedAt: new Date().toISOString(),
    overallPercent: calculateOverall(progress),
    moduleRows,
    completedModules: progress.completedModules,
    completedLabs: progress.completedLabs,
    quizScores: progress.quizScores,
    wrongQuestions,
    completedPracticeTasks,
    capstoneChecks: progress.capstoneChecks,
    capstonePercent: Math.round((progress.capstoneChecks.length / capstoneTotal) * 100),
    practicePercent: Math.round((completedPracticeTasks.length / practiceTemplates.length) * 100),
    achievementUnlocked: achievement.unlockedCount,
    achievementTotal: achievement.total,
    recommendations,
  };
}

export function reportToMarkdown(report: LearningReport) {
  const quizLines =
    Object.entries(report.quizScores)
      .map(([id, score]) => `- ${modules.find((m) => m.id === id)?.title ?? id}：${score} 分`)
      .join('\n') || '- 暂无测验成绩';
  const moduleLines = report.moduleRows
    .map(
      (row) =>
        `- ${row.completed ? '✅' : '⭕'} ${row.title}：掌握度 ${row.mastery}%｜实验 ${row.labDone}/${row.labTotal}｜测验 ${row.quizScore ?? '未完成'}｜建议：${row.recommendation}`,
    )
    .join('\n');
  const labLines = modules
    .map((module) => {
      const moduleLabs = labs.filter((lab) => lab.moduleId === module.id);
      if (!moduleLabs.length) return '';
      return `### ${module.title}\n${moduleLabs.map((lab) => `- ${report.completedLabs.includes(lab.id) ? '✅' : '⭕'} ${lab.title}`).join('\n')}`;
    })
    .filter(Boolean)
    .join('\n\n');
  const practiceLines = practiceTemplates
    .map(
      (task) => `- ${report.completedPracticeTasks.includes(task.id) ? '✅' : '⭕'} ${task.title}`,
    )
    .join('\n');
  const capstoneLines =
    report.capstoneChecks.map((item) => `- ✅ ${item}`).join('\n') || '- 暂无已勾选项目';
  const wrongLines =
    report.wrongQuestions
      .map((q) => `- ${q.moduleId}：${q.question}\n  - 解析：${q.explanation}`)
      .join('\n') || '- 暂无错题';
  const rubricLines = capstoneRubric
    .map((row) => `- ${row.item}（${row.score} 分）：${row.detail}`)
    .join('\n');
  return `# MFC 通用工具开发训练营学习报告\n\n生成时间：${report.generatedAt}\n\n## 总体概览\n\n- 总体进度：${report.overallPercent}%\n- 已完成模块：${report.completedModules.length}/${modules.length}\n- 已完成实验：${report.completedLabs.length}/${labs.length}\n- 完成测验：${Object.keys(report.quizScores).length}/${unique(quizzes.map((q) => q.moduleId)).length}\n- 错题数量：${report.wrongQuestions.length}\n- 本地 MFC 实战任务：${report.completedPracticeTasks.length}/${practiceTemplates.length}\n- Capstone 自评：${report.capstonePercent}%\n- 成就徽章：${report.achievementUnlocked}/${report.achievementTotal}\n\n## 下一步建议\n\n${report.recommendations.map((item, index) => `${index + 1}. ${item}`).join('\n')}\n\n## 模块掌握度\n\n${moduleLines}\n\n## 实验完成清单\n\n${labLines}\n\n## 测验成绩\n\n${quizLines}\n\n## 错题复盘\n\n${wrongLines}\n\n## 本地 MFC 实战任务\n\n${practiceLines}\n\n## Capstone 已完成清单\n\n${capstoneLines}\n\n## Capstone Rubric\n\n${rubricLines}\n`;
}
