export type RouteMeta = { title: string; description: string };

export const routeMeta: Record<string, RouteMeta> = {
  '/': {
    title: '首页 - MFC 通用工具开发训练营',
    description: '从学习路线、交互实验、测验和最终项目进入 MFC 通用工具开发训练。',
  },
  '/roadmap': {
    title: '学习路线 - MFC 通用工具开发训练营',
    description: '按环境、串口、网络、MFC、C++、数据存储到最终项目的顺序学习。',
  },
  '/labs': {
    title: '实验中心 - MFC 通用工具开发训练营',
    description:
      '浏览器内模拟串口参数、HEX/ASCII、Modbus、HTTP、TCP、MFC 消息映射、C++ 内存和线程。',
  },
  '/quiz': {
    title: '测验中心与错题本 - MFC 通用工具开发训练营',
    description: '按模块练习单选、多选、判断、代码判断和场景题，保存成绩与错题。',
  },
  '/capstone': {
    title: '最终项目 - MFC 通用工具开发训练营',
    description: 'MFC 通用调试工具最终项目目标、架构、验收清单与扩展建议。',
  },
  '/resources': {
    title: '资源页 - MFC 通用工具开发训练营',
    description: 'MFC、串口、TCP、HTTP、SQLite、INI 与工程实践资料索引。',
  },
  '/dashboard': {
    title: '学习进度面板 - MFC 通用工具开发训练营',
    description: '查看总进度、模块完成、实验完成、测验成绩、错题、徽章和下一步推荐。',
  },
  '/practice': {
    title: '本地 MFC 实战 - MFC 通用工具开发训练营',
    description: '将浏览器实验迁移到 Windows + Visual Studio + MFC 项目中的本地实践清单。',
  },
  '/codegen': {
    title: 'MFC 代码骨架生成器 - MFC 通用工具开发训练营',
    description: '浏览器生成 MFC 工具项目骨架、控件 ID、Message Map 和 ZIP 交付包。',
  },
  '/designer': {
    title: 'MFC Dialog 设计器 - MFC 通用工具开发训练营',
    description: '规划 MFC Dialog 控件布局、控件 ID 和事件处理函数。',
  },
  '/integration': {
    title: 'MFC 集成向导 - MFC 通用工具开发训练营',
    description: '将生成代码接入 Visual Studio / MFC 项目并排查编译链接问题。',
  },
  '/build-checklist': {
    title: '构建检查清单 - MFC 通用工具开发训练营',
    description: '按 Visual Studio 实操阶段保存 MFC 本地构建和验收进度。',
  },
  '/comics': {
    title: '知识漫画工坊 - MFC 通用工具开发训练营',
    description:
      '用知识漫画 prompt 图解串口、Modbus、MFC 消息映射、线程锁和 SQLite/INI，可接入 Wan2.7Pro 出图。',
  },
  '/diagrams': {
    title: '图解中心 - MFC 通用工具开发训练营',
    description: '集中查看学习路线、模块结构、实验矩阵、执行链路和 Visual Studio 迁移图。',
  },
  '/review': {
    title: '复习训练台 - MFC 通用工具开发训练营',
    description: '把错题、术语、实验复盘和本地实践验收点整理成可翻面的复习卡片。',
  },
  '/planner': {
    title: '学习计划生成器 - MFC 通用工具开发训练营',
    description: '按 7/14/30 天节奏生成课程、实验、测验、复习、本地 MFC 实战与交付计划。',
  },
  '/exam': {
    title: '面试答辩训练 - MFC 通用工具开发训练营',
    description: '把课程模块、实验、本地实战和最终项目验收转成面试/答辩问答与证据记录。',
  },
  '/portfolio': {
    title: '作品集简历素材 - MFC 通用工具开发训练营',
    description:
      '把学习进度、实战模板、Capstone 验收和答辩记录整理成简历、README 和项目作品集素材。',
  },
  '/demo-script': {
    title: '项目演示脚本 - MFC 通用工具开发训练营',
    description: '生成面试、验收、录屏和 README 可用的 MFC 项目演示流程、讲解词与证据清单。',
  },
  '/delivery': {
    title: '项目交付包 - MFC 通用工具开发训练营',
    description: '汇总学习进度、源码目录、本地实战、验收清单、答辩和演示证据，导出项目交付包。',
  },
  '/submit-rehearsal': {
    title: '项目提交演练 - MFC 通用工具开发训练营',
    description:
      '按真实验收顺序检查 README、源码、编译截图、运行截图、通讯日志、演示稿和答辩记录。',
  },
  '/evidence': {
    title: '证据素材库 - MFC 通用工具开发训练营',
    description: '集中管理最终提交需要的截图、日志、源码、Markdown 和配置文件路径。',
  },
  '/search': {
    title: '全站搜索 - MFC 通用工具开发训练营',
    description: '搜索课程、实验、题目、术语和资源。',
  },
  '/glossary': {
    title: '术语速查 - MFC 通用工具开发训练营',
    description: '集中复习串口、网络、MFC、C++、SQLite/INI 和项目架构术语。',
  },
  '/notes': {
    title: '学习笔记 - MFC 通用工具开发训练营',
    description: '使用浏览器 localStorage 记录模块重点、踩坑和实践结论。',
  },
  '/troubleshooting': {
    title: '故障排查训练 - MFC 通用工具开发训练营',
    description: '通过现场症状、证据、根因和修复步骤训练工程排错能力。',
  },
  '/reports': {
    title: '学习报告 - MFC 通用工具开发训练营',
    description: '汇总学习进度、掌握度、错题和 Capstone 交付建议并导出记录。',
  },
};

export function resolveMeta(pathname: string): RouteMeta {
  if (pathname.startsWith('/modules/')) {
    return {
      title: '模块课程页 - MFC 通用工具开发训练营',
      description: '阅读模块目标、核心概念、代码片段、实验入口和本地 MFC 实践建议。',
    };
  }
  return (
    routeMeta[pathname] ?? {
      title: '页面未找到 - MFC 通用工具开发训练营',
      description: '未找到对应页面，请返回首页或学习路线继续学习。',
    }
  );
}
