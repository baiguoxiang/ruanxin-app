export interface FinanceRecord {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  description: string;
  date: string;
  timestamp: number;
}

export interface FinanceCategory {
  name: string;
  icon: string;
  keywords: string[];
}

export interface FinanceReport {
  totalIncome: number;
  totalExpense: number;
  balance: number;
  expenseByCategory: Record<string, number>;
  incomeByCategory: Record<string, number>;
  suggestions: string[];
}

export const expenseCategories: FinanceCategory[] = [
  { name: '餐饮', icon: '🍽️', keywords: ['吃饭', '餐', '饭', '菜', '外卖', '餐厅', '早餐', '午餐', '晚餐', '零食', '饮料', '咖啡', '奶茶', '烧烤', '火锅', '小吃', '点心', '面食', '快餐'] },
  { name: '购物', icon: '🛍️', keywords: ['买', '衣服', '鞋', '包', '化妆品', '日用品', '超市', '商场', '淘宝', '京东', '拼多多', '天猫', '苏宁', '唯品会', '优衣库'] },
  { name: '交通', icon: '🚗', keywords: ['打车', '地铁', '公交', '油费', '停车', '滴滴', '高铁', '机票', '火车票', '出租车', '网约车', '共享汽车'] },
  { name: '娱乐', icon: '🎮', keywords: ['电影', '游戏', 'KTV', '旅游', '景点', '门票', '聚会', '酒吧', '剧本杀', '密室逃脱', '演唱会', '展览'] },
  { name: '居住', icon: '🏠', keywords: ['房租', '水电', '物业', '维修', '装修', '家具', '家电', '宽带', '取暖', '燃气'] },
  { name: '医疗', icon: '🏥', keywords: ['医院', '药', '看病', '体检', '牙医', '挂号', '住院', '医保', '保健品', '口罩'] },
  { name: '教育', icon: '📚', keywords: ['书', '课程', '培训', '学费', '学习', '考试', '补习班', '兴趣班', '留学', '考研'] },
  { name: '通讯', icon: '📱', keywords: ['话费', '流量', '宽带', '手机', '电话', '套餐', '充值'] },
  { name: '社交', icon: '👥', keywords: ['红包', '礼物', '请客', '人情', '婚礼', '生日', '聚会'] },
  { name: '其他', icon: '📝', keywords: [] }
];

export const incomeCategories: FinanceCategory[] = [
  { name: '工资', icon: '💼', keywords: ['工资', '薪水', '薪资', '月薪', '年薪', '底薪', '基本工资'] },
  { name: '奖金', icon: '💰', keywords: ['奖金', '提成', '绩效', '年终奖', '季度奖', '全勤奖', '优秀员工奖'] },
  { name: '投资', icon: '📈', keywords: ['股票', '基金', '理财', '利息', '分红', '股息', '国债', '债券', 'ETF', '期货'] },
  { name: '兼职', icon: '💻', keywords: ['兼职', '副业', '外快', '接单', '自由职业', '跑腿', '代驾'] },
  { name: '其他', icon: '🎁', keywords: ['红包', '礼物', '退款', '报销', '礼金', '中奖', '退款', '补偿'] }
];

export const financeSuggestions = [
  { condition: 'highFood', suggestions: [
    '本月餐饮支出较高，建议自己做饭，既健康又省钱！',
    '可以尝试每周规划菜谱，避免不必要的外卖支出。',
    '推荐阅读《好好吃饭，好好生活》，学习健康饮食理念。',
    '设置餐饮预算，每天记录餐饮支出，月底复盘。'
  ]},
  { condition: 'highShopping', suggestions: [
    '购物支出较多，建议设置购物冷静期，避免冲动消费。',
    '学习断舍离，减少不必要的物品购买。',
    '推荐阅读《极简主义》，重新审视消费习惯。',
    '创建购物清单，只购买清单上的物品。'
  ]},
  { condition: 'highEntertainment', suggestions: [
    '娱乐支出较高，可以尝试一些免费的娱乐方式。',
    '推荐阅读《游戏改变世界》，了解游戏化思维。',
    '尝试户外活动，如徒步、公园散步，既省钱又健康。',
    '设置娱乐预算，平衡娱乐和储蓄。'
  ]},
  { condition: 'highTransport', suggestions: [
    '交通支出较高，建议规划出行路线，选择更经济的方式。',
    '可以考虑拼车或公共交通，减少打车费用。',
    '推荐阅读《聪明的投资者》，学习财务规划。',
    '定期保养车辆，避免高额维修费用。'
  ]},
  { condition: 'lowSavings', suggestions: [
    '本月储蓄率较低，建议设置自动储蓄，先存后花。',
    '推荐阅读《富爸爸穷爸爸》，建立正确的财富观念。',
    '尝试52周储蓄挑战，每周存一笔钱。',
    '分析支出，找出可以削减的不必要开支。'
  ]},
  { condition: 'goodBalance', suggestions: [
    '本月收支平衡良好，继续保持！',
    '推荐阅读《小狗钱钱》，学习理财入门知识。',
    '考虑增加投资，让钱为你工作。',
    '建立应急基金，为未来做好准备。'
  ]}
];

export const financeBooks = [
  { name: '富爸爸穷爸爸', author: '罗伯特·清崎', description: '改变财商思维的经典之作' },
  { name: '小狗钱钱', author: '博多·舍费尔', description: '儿童也能看懂的理财入门书' },
  { name: '聪明的投资者', author: '本杰明·格雷厄姆', description: '投资界的圣经' },
  { name: '穷查理宝典', author: '彼得·考夫曼', description: '查理·芒格的智慧箴言' },
  { name: '极简主义', author: '乔舒亚·菲尔茨·米尔本', description: '重新审视消费与生活' },
  { name: '好好赚钱', author: '简七', description: '适合中国人的理财指南' },
  { name: '金钱心理学', author: '摩根·豪泽尔', description: '了解金钱背后的心理' },
  { name: '纳瓦尔宝典', author: '埃里克·乔根森', description: '关于财富与幸福的智慧' }
];

export function categorizeExpense(description: string): string {
  for (const category of expenseCategories) {
    if (category.keywords.some(keyword => description.includes(keyword))) {
      return category.name;
    }
  }
  return '其他';
}

export function categorizeIncome(description: string): string {
  for (const category of incomeCategories) {
    if (category.keywords.some(keyword => description.includes(keyword))) {
      return category.name;
    }
  }
  return '其他';
}

export function parseFinanceInput(input: string): { type: 'income' | 'expense'; amount: number; description: string } | null {
  input = input.trim();
  
  const amountMatch = input.match(/(\d+(?:\.\d{1,2})?)\s*(元|块|钱|¥)?/);
  if (!amountMatch) return null;
  
  const amount = parseFloat(amountMatch[1]);
  if (amount <= 0) return null;
  
  let type: 'income' | 'expense' = 'expense';
  
  const strongIncomeKeywords = ['收入', '赚', '工资', '奖金', '发', '进', '收', '到账', '入账', '回款', '入账', '领', '发放'];
  const strongExpenseKeywords = ['花', '买', '支出', '付', '消费', '用', '花了', '付款', '支付', '扣', '充值', '缴费'];
  
  const hasStrongIncome = strongIncomeKeywords.some(keyword => input.includes(keyword));
  const hasStrongExpense = strongExpenseKeywords.some(keyword => input.includes(keyword));
  
  if (hasStrongIncome && !hasStrongExpense) {
    type = 'income';
  } else if (hasStrongExpense && !hasStrongIncome) {
    type = 'expense';
  } else if (hasStrongIncome && hasStrongExpense) {
    if (input.indexOf('收入') > input.indexOf('支出') || input.indexOf('赚') > input.indexOf('花')) {
      type = 'income';
    } else {
      type = 'expense';
    }
  } else {
    const passiveIncomeKeywords = ['利息', '分红', '股息', '收益', '回报', '奖金', '提成'];
    const passiveExpenseKeywords = ['饭', '餐', '外卖', '零食', '饮料', '衣服', '鞋', '包', '打车', '地铁', '公交'];
    
    if (passiveIncomeKeywords.some(keyword => input.includes(keyword))) {
      type = 'income';
    } else if (passiveExpenseKeywords.some(keyword => input.includes(keyword))) {
      type = 'expense';
    } else {
      type = 'expense';
    }
  }
  
  const description = input.replace(/(\d+(?:\.\d{1,2})?)\s*(元|块|钱|¥)?/g, '').trim();
  
  return { type, amount, description };
}

export function generateFinanceReport(records: FinanceRecord[]): FinanceReport {
  const report: FinanceReport = {
    totalIncome: 0,
    totalExpense: 0,
    balance: 0,
    expenseByCategory: {},
    incomeByCategory: {},
    suggestions: []
  };
  
  records.forEach(record => {
    if (record.type === 'income') {
      report.totalIncome += record.amount;
      report.incomeByCategory[record.category] = (report.incomeByCategory[record.category] || 0) + record.amount;
    } else {
      report.totalExpense += record.amount;
      report.expenseByCategory[record.category] = (report.expenseByCategory[record.category] || 0) + record.amount;
    }
  });
  
  report.balance = report.totalIncome - report.totalExpense;
  
  const maxExpenseCategory = Object.entries(report.expenseByCategory).sort((a, b) => b[1] - a[1])[0];
  const savingsRate = report.totalIncome > 0 ? (report.balance / report.totalIncome) * 100 : 0;
  
  if (maxExpenseCategory) {
    const [categoryName, amount] = maxExpenseCategory;
    if (categoryName === '餐饮' && amount > report.totalExpense * 0.3) {
      report.suggestions.push(...financeSuggestions.find(s => s.condition === 'highFood')!.suggestions);
    } else if (categoryName === '购物' && amount > report.totalExpense * 0.25) {
      report.suggestions.push(...financeSuggestions.find(s => s.condition === 'highShopping')!.suggestions);
    } else if (categoryName === '娱乐' && amount > report.totalExpense * 0.2) {
      report.suggestions.push(...financeSuggestions.find(s => s.condition === 'highEntertainment')!.suggestions);
    } else if (categoryName === '交通' && amount > report.totalExpense * 0.15) {
      report.suggestions.push(...financeSuggestions.find(s => s.condition === 'highTransport')!.suggestions);
    }
  }
  
  if (savingsRate < 10 && report.totalIncome > 0) {
    report.suggestions.push(...financeSuggestions.find(s => s.condition === 'lowSavings')!.suggestions);
  } else if (savingsRate >= 20) {
    report.suggestions.push(...financeSuggestions.find(s => s.condition === 'goodBalance')!.suggestions);
  }
  
  if (report.suggestions.length === 0) {
    report.suggestions.push('保持良好的理财习惯，继续加油！');
  }
  
  return report;
}

export function getRandomFinanceBook(): typeof financeBooks[0] {
  return financeBooks[Math.floor(Math.random() * financeBooks.length)];
}

export function calculateBalance(records: FinanceRecord[]): number {
  return records.reduce((balance, record) => {
    return record.type === 'income' ? balance + record.amount : balance - record.amount;
  }, 0);
}

export function calculateDailyStats(records: FinanceRecord[], date: string): { income: number; expense: number } {
  return records
    .filter(record => record.date === date)
    .reduce((stats, record) => {
      if (record.type === 'income') {
        stats.income += record.amount;
      } else {
        stats.expense += record.amount;
      }
      return stats;
    }, { income: 0, expense: 0 });
}

export interface DailyRecords {
  date: string;
  records: FinanceRecord[];
  income: number;
  expense: number;
}

export function groupRecordsByDate(records: FinanceRecord[]): DailyRecords[] {
  const groups: Record<string, FinanceRecord[]> = {};
  
  records.forEach(record => {
    if (!groups[record.date]) {
      groups[record.date] = [];
    }
    groups[record.date].push(record);
  });
  
  return Object.entries(groups)
    .map(([date, records]) => {
      const income = records.filter(r => r.type === 'income').reduce((sum, r) => sum + r.amount, 0);
      const expense = records.filter(r => r.type === 'expense').reduce((sum, r) => sum + r.amount, 0);
      return {
        date,
        records: records.sort((a, b) => b.timestamp - a.timestamp),
        income,
        expense
      };
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}