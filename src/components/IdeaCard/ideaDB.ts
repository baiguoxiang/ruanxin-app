export interface Idea {
  id: string;
  content: string;
  category: string;
  timestamp: number;
  date: string;
}

export interface IdeaProject {
  id: string;
  name: string;
  category: string;
  description: string;
  createdAt: number;
  ideas: Idea[];
  analysis?: string;
  steps?: string[];
  resources?: string[];
}

export interface IdeaCategory {
  name: string;
  icon: string;
  keywords: string[];
}

export const ideaCategories: IdeaCategory[] = [
  { name: '创业', icon: '🚀', keywords: ['创业', '生意', '公司', '项目', '商业模式', '企业'] },
  { name: '产品', icon: '💡', keywords: ['产品', 'APP', '软件', '小程序', '网站', '应用'] },
  { name: '内容', icon: '📝', keywords: ['文章', '视频', '直播', '内容', '自媒体', '创作'] },
  { name: '营销', icon: '📣', keywords: ['营销', '推广', '广告', '引流', '活动', '品牌'] },
  { name: '设计', icon: '🎨', keywords: ['设计', 'UI', 'UX', '视觉', '创意设计', '平面'] },
  { name: '技术', icon: '💻', keywords: ['技术', '编程', '开发', '算法', 'AI', '代码'] },
  { name: '生活', icon: '🏠', keywords: ['生活', '家居', '旅行', '美食', '健康', '日常'] },
  { name: '其他', icon: '✨', keywords: [] }
];

export const encouragementMessages = [
  '这个想法太棒了！很有创意！',
  '我很喜欢这个想法，继续加油！',
  '这是一个很有潜力的创意！',
  '你的想象力真丰富！',
  '这个想法很独特，值得深入探索！',
  '太棒了，继续保持！',
  '我相信你一定能实现这个想法！',
  '这个创意很有价值！'
];

export const ideaAnalysisTemplates = {
  startup: [
    '这个创意涉及创业领域，需要考虑商业模式、市场需求和竞争分析。建议先进行市场调研，了解目标用户需求。',
    '创业项目需要明确的目标用户和盈利模式，你的想法很有潜力，但需要考虑资源和团队配置。',
    '这个创业想法很有创新性！建议先制定MVP计划，快速验证市场需求。'
  ],
  product: [
    '产品创意需要考虑用户需求、技术可行性和用户体验。建议先进行用户调研，了解用户痛点。',
    '这个产品想法很实用！需要明确核心功能和差异化优势，打造独特的用户体验。',
    '产品设计需要平衡功能和体验，建议先设计原型，验证用户反馈。'
  ],
  content: [
    '内容创作需要考虑目标受众、内容形式和传播渠道。建议打造独特的内容定位，形成个人品牌。',
    '这个内容创意很有吸引力！持续输出高质量内容是关键，需要制定内容计划。',
    '内容需要有价值和深度，建议结合热点和用户痛点，设计有吸引力的内容。'
  ],
  marketing: [
    '营销创意需要考虑目标人群、传播渠道和转化路径。建议结合热点和用户痛点，设计有吸引力的营销方案。',
    '这个营销想法很有创意！数据分析很重要，需要跟踪效果并优化策略。',
    '营销需要精准定位和创意表达，建议先明确营销目标和转化路径。'
  ],
  design: [
    '设计创意需要考虑美学原则、用户体验和品牌调性。建议多参考优秀案例，提升设计品味。',
    '这个设计想法很有视觉冲击力！设计需要平衡美观和实用，注重细节打磨。',
    '设计需要用户导向，建议先了解用户需求，再进行创意设计。'
  ],
  tech: [
    '技术创意需要考虑技术可行性、实现难度和资源投入。建议先验证技术方案，再进行大规模开发。',
    '这个技术想法很有挑战性！持续学习新技术，保持技术敏感度很重要。',
    '技术实现需要合理规划，建议选择合适的技术栈，降低开发难度。'
  ],
  life: [
    '生活创意需要考虑实用性、可行性和个人兴趣。建议从小事做起，逐步实现和优化。',
    '这个生活创意很温馨！生活创意可以提升生活品质，带来幸福感。',
    '生活创意重在实践，建议先制定详细计划，逐步实施。'
  ],
  general: [
    '这是一个很有想法的创意，值得进一步探索！建议先记录下来，然后逐步细化和完善。',
    '创意的价值在于行动，不要让想法只停留在脑海中。你已经迈出了第一步！',
    '这个想法很有意思！建议继续深入思考，探索更多可能性。'
  ]
};

export const ideaStepTemplates = {
  startup: [
    '进行市场调研，了解目标用户需求',
    '分析竞争对手，找出差异化优势',
    '制定商业模式和盈利计划',
    '组建团队或寻找合作伙伴',
    '制定MVP计划，快速验证',
    '申请相关资质和许可',
    '制定营销策略，获取首批用户'
  ],
  product: [
    '进行用户调研，明确用户痛点',
    '设计产品原型，验证用户体验',
    '评估技术方案，确定技术栈',
    '制定开发计划，分阶段实现',
    '进行内测，收集用户反馈',
    '优化产品，准备上线',
    '制定运营策略，持续迭代'
  ],
  content: [
    '确定内容定位和目标受众',
    '制定内容计划和发布节奏',
    '准备拍摄/写作素材',
    '创作高质量内容',
    '选择合适的传播渠道',
    '与用户互动，收集反馈',
    '分析数据，优化内容策略'
  ],
  marketing: [
    '明确营销目标和转化路径',
    '分析目标人群特征',
    '设计营销创意和文案',
    '选择合适的投放渠道',
    '制作营销物料',
    '监测数据，优化投放',
    '总结经验，迭代策略'
  ],
  design: [
    '收集灵感，建立灵感库',
    '分析设计需求和目标',
    '制定设计方案和风格',
    '进行设计创作',
    '收集反馈，进行优化',
    '输出设计交付物',
    '跟踪设计效果，持续改进'
  ],
  tech: [
    '验证技术方案可行性',
    '选择合适的技术栈',
    '搭建开发环境',
    '编写代码，实现功能',
    '进行测试和调试',
    '部署上线',
    '监控性能，持续优化'
  ],
  life: [
    '明确目标和期望效果',
    '制定详细计划',
    '准备所需材料和工具',
    '逐步实施',
    '记录过程和感受',
    '总结经验，进行优化',
    '分享成果，获得反馈'
  ],
  general: [
    '整理创意，明确核心价值',
    '制定实现计划和时间表',
    '分解任务，逐步完成',
    '记录过程，便于复盘',
    '收集反馈，进行优化',
    '分享成果，获得认可'
  ]
};

export const ideaResources = [
  { category: '创业', resources: ['《精益创业》', '《商业模式画布》', '36氪', '创业邦'] },
  { category: '产品', resources: ['《用户体验要素》', '《启示录》', 'Product Hunt', 'Figma社区'] },
  { category: '内容', resources: ['《爆款文案》', '《从零到一》', '小红书', 'B站创作中心'] },
  { category: '营销', resources: ['《影响力》', '《流量池》', '抖音营销学院', '微信广告平台'] },
  { category: '设计', resources: ['《设计心理学》', 'Dribbble', 'Behance', '站酷'] },
  { category: '技术', resources: ['GitHub', 'Stack Overflow', '掘金', 'CSDN'] },
  { category: '生活', resources: ['《断舍离》', '《怦然心动的人生整理魔法》', '小红书', '抖音生活'] }
];

export function categorizeIdea(content: string): string {
  for (const category of ideaCategories) {
    if (category.keywords.some(keyword => content.includes(keyword))) {
      return category.name;
    }
  }
  return '其他';
}

export function getCategoryType(categoryName: string): keyof typeof ideaAnalysisTemplates {
  const mapping: Record<string, keyof typeof ideaAnalysisTemplates> = {
    '创业': 'startup',
    '产品': 'product',
    '内容': 'content',
    '营销': 'marketing',
    '设计': 'design',
    '技术': 'tech',
    '生活': 'life',
    '其他': 'general'
  };
  return mapping[categoryName] || 'general';
}

export function analyzeIdea(content: string, category: string): { analysis: string; steps: string[]; resources: string[]; encouragement: string } {
  const categoryType = getCategoryType(category);
  
  const analyses = ideaAnalysisTemplates[categoryType];
  const stepsList = ideaStepTemplates[categoryType];
  const resourceData = ideaResources.find(r => r.category === category);
  
  return {
    analysis: analyses[Math.floor(Math.random() * analyses.length)],
    steps: stepsList.slice(0, 5),
    resources: resourceData ? resourceData.resources : [],
    encouragement: encouragementMessages[Math.floor(Math.random() * encouragementMessages.length)]
  };
}

export function getCategoryIcon(category: string): string {
  const cat = ideaCategories.find(c => c.name === category);
  return cat ? cat.icon : '✨';
}