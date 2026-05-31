import { modules } from './modules';
import { labs } from './labs';
import { quizzes } from './quizzes';
import { ProgressState, calculateOverall } from '../utils/progress';

export type AchievementCategory = '入门' | '模块' | '实验' | '测验' | '项目' | '复习';

export type Achievement = {
  id: string;
  title: string;
  icon: string;
  category: AchievementCategory;
  description: string;
  requirement: string;
  evaluate: (progress: ProgressState) => boolean;
};

const quizModuleIds = Array.from(new Set(quizzes.map((quiz) => quiz.moduleId)));
const highQuizScoreCount = (progress: ProgressState, minScore: number) =>
  Object.values(progress.quizScores).filter((score) => score >= minScore).length;
const completedAllLabsOfModule = (progress: ProgressState, moduleId: string) => {
  const moduleLabs = labs.filter((lab) => lab.moduleId === moduleId);
  return (
    moduleLabs.length > 0 && moduleLabs.every((lab) => progress.completedLabs.includes(lab.id))
  );
};
const capstoneTotal = 19;

export const achievements: Achievement[] = [
  {
    id: 'first-step',
    title: '开营第一步',
    icon: '🧭',
    category: '入门',
    description: '已经开始使用学习站并完成第一个学习动作。',
    requirement: '完成任意模块、实验或测验。',
    evaluate: (progress) =>
      progress.completedModules.length +
        progress.completedLabs.length +
        Object.keys(progress.quizScores).length >
      0,
  },
  {
    id: 'module-collector',
    title: '模块推进者',
    icon: '📚',
    category: '模块',
    description: '已经完成至少 3 个课程模块，开始形成完整知识地图。',
    requirement: '完成 3 个课程模块。',
    evaluate: (progress) => progress.completedModules.length >= 3,
  },
  {
    id: 'course-finisher',
    title: '全栈工具学员',
    icon: '🏁',
    category: '模块',
    description: '完成全部课程模块，具备进入最终项目的知识基础。',
    requirement: `完成全部 ${modules.length} 个模块。`,
    evaluate: (progress) =>
      modules.every((module) => progress.completedModules.includes(module.id)),
  },
  {
    id: 'serial-starter',
    title: '串口入门者',
    icon: '🔌',
    category: '实验',
    description: '掌握 COM、波特率、8N1、ASCII/HEX 与 Modbus 的基础操作。',
    requirement: '完成串口模块全部实验。',
    evaluate: (progress) => completedAllLabsOfModule(progress, 'serial'),
  },
  {
    id: 'network-debugger',
    title: '网络调试员',
    icon: '🌐',
    category: '实验',
    description: '能够区分 HTTP 请求响应和 TCP 持续连接模型。',
    requirement: '完成 HTTP 构造器和 TCP 模拟器。',
    evaluate: (progress) => completedAllLabsOfModule(progress, 'network'),
  },
  {
    id: 'mfc-message-hunter',
    title: 'MFC 消息猎手',
    icon: '🪟',
    category: '实验',
    description: '理解按钮点击如何通过消息映射进入 C++ 成员函数。',
    requirement: '完成 MFC 消息映射实验。',
    evaluate: (progress) => progress.completedLabs.includes('mfc-message-map'),
  },
  {
    id: 'memory-guardian',
    title: '内存安全卫士',
    icon: '🛡️',
    category: '实验',
    description: '完成指针、STL、多线程锁相关实验，理解稳定工具软件的 C++ 基础。',
    requirement: '完成 C++ 核心模块全部实验。',
    evaluate: (progress) => completedAllLabsOfModule(progress, 'cpp-core'),
  },
  {
    id: 'data-steward',
    title: '数据管家',
    icon: '🗄️',
    category: '实验',
    description: '理解 SQLite 保存结构化记录、INI 保存轻量配置的边界。',
    requirement: '完成 SQLite CRUD 和 INI 编辑器实验。',
    evaluate: (progress) => completedAllLabsOfModule(progress, 'storage'),
  },
  {
    id: 'lab-master',
    title: '实验室全通',
    icon: '🧪',
    category: '实验',
    description: '完成全部浏览器内交互实验。',
    requirement: `完成全部 ${labs.length} 个实验。`,
    evaluate: (progress) => labs.every((lab) => progress.completedLabs.includes(lab.id)),
  },
  {
    id: 'quiz-starter',
    title: '测验启动',
    icon: '✅',
    category: '测验',
    description: '已经提交第一个模块测验，开始用题目校验理解。',
    requirement: '完成任意一个模块测验。',
    evaluate: (progress) => Object.keys(progress.quizScores).length >= 1,
  },
  {
    id: 'quiz-high-score',
    title: '高分稳定',
    icon: '🎯',
    category: '测验',
    description: '至少 3 个模块测验达到 80 分以上。',
    requirement: '3 个模块测验成绩 ≥ 80。',
    evaluate: (progress) => highQuizScoreCount(progress, 80) >= 3,
  },
  {
    id: 'quiz-perfect',
    title: '满分模块',
    icon: '💯',
    category: '测验',
    description: '至少一个模块测验达到满分。',
    requirement: '任意模块测验 100 分。',
    evaluate: (progress) => highQuizScoreCount(progress, 100) >= 1,
  },
  {
    id: 'quiz-complete',
    title: '题库巡检员',
    icon: '🧠',
    category: '测验',
    description: '完成全部模块测验，形成全课程知识闭环。',
    requirement: `完成全部 ${quizModuleIds.length} 个模块测验。`,
    evaluate: (progress) =>
      quizModuleIds.every((moduleId) => progress.quizScores[moduleId] !== undefined),
  },
  {
    id: 'wrong-zero',
    title: '错题清零',
    icon: '🧹',
    category: '复习',
    description: '当前错题本为空，说明最近一轮复习状态良好。',
    requirement: '错题本数量为 0，且至少完成一个测验。',
    evaluate: (progress) =>
      Object.keys(progress.quizScores).length > 0 && progress.wrongQuestions.length === 0,
  },
  {
    id: 'capstone-architect',
    title: '项目架构师',
    icon: '🏗️',
    category: '项目',
    description: '最终项目验收清单完成度达到 80%，具备落地完整工具的架构意识。',
    requirement: 'Capstone 验收清单完成 80% 以上。',
    evaluate: (progress) => progress.capstoneChecks.length / capstoneTotal >= 0.8,
  },
  {
    id: 'overall-elite',
    title: '训练营通关',
    icon: '🚀',
    category: '项目',
    description: '总体进度达到 90% 以上，可以进入 Windows + Visual Studio 本地实战。',
    requirement: '总体进度 ≥ 90%。',
    evaluate: (progress) => calculateOverall(progress) >= 90,
  },
];

export function evaluateAchievements(progress: ProgressState) {
  return achievements.map((achievement) => ({
    ...achievement,
    unlocked: achievement.evaluate(progress),
  }));
}

export function achievementSummary(progress: ProgressState) {
  const evaluated = evaluateAchievements(progress);
  const unlocked = evaluated.filter((achievement) => achievement.unlocked);
  return { evaluated, unlocked, total: evaluated.length, unlockedCount: unlocked.length };
}
