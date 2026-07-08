import { getDailySeed, seededRandom, getDailyItems, getDailyContent } from '@/utils/dailyRandom';

const encouragementList = [
  '今天的你，比昨天更接近梦想了一点点。每一个努力的瞬间，都在为未来的惊喜铺路。相信自己，你值得拥有所有美好！',
  '无论今天遇到什么困难，请记住：阳光总在风雨后。你已经做得很好了，给自己一个大大的拥抱吧！',
  '生活就像一盒巧克力，你永远不知道下一颗是什么味道。但无论是什么，都值得你用心去品尝。',
  '每一个不曾起舞的日子，都是对生命的辜负。今天也要元气满满，做最好的自己！',
  '不要害怕失败，因为每一次失败都是成功的前奏。坚持下去，你会看到属于自己的彩虹！',
  '你不是一个人在战斗，身后有家人的支持，朋友的鼓励，还有无数默默关心你的人。加油！',
  '人生没有白走的路，每一步都算数。今天的努力，终将成为明天的礼物。',
  '心若向阳，无畏悲伤。保持一颗积极乐观的心，生活就会充满阳光。',
  '再小的努力，乘以365天，也会变得很强大。坚持就是胜利，你已经很棒了！',
  '生活不会辜负每一个努力的人。今天的汗水，是明天的勋章。继续加油！'
];

const stories = [
  '有一位画家，他画了一幅画，画中是一片沙漠。有人问他："这片沙漠里为什么没有绿洲？"画家笑着说："因为绿洲在每一个看到这幅画的人心里。"生活也是如此，希望不在别处，而在我们自己心中。',
  '一位老人在河边钓鱼，一个小孩走过来问："爷爷，您钓了多久了？"老人说："我钓了整整一天，一条鱼也没有钓到。"小孩说："那您为什么还在这里？"老人笑着说："因为我享受钓鱼的过程，至于结果，那是上天的安排。"',
  '有一只蜗牛，它想要爬到山顶去看日出。别的动物都嘲笑它："你爬得这么慢，等到了山顶太阳早就下山了！"蜗牛没有理会，继续一步一步往上爬。终于有一天，它爬到了山顶，看到了最美的日出。',
  '两个商人在沙漠中迷路了，他们只剩下半瓶水。一个人说："我们只剩下半瓶水了，肯定走不出去了。"另一个人说："我们还有半瓶水，足够我们找到出路！"心态决定命运，积极的心态能带来意想不到的力量。',
  '一位年轻人问大师："我怎样才能获得幸福？"大师说："放下执念，珍惜当下。"年轻人似懂非懂地点点头。多年后，他终于明白：幸福不是追求来的，而是用心感受来的。',
  '有一朵花，它生长在墙角，没有人注意它。但它依然努力地生长，努力地绽放。终于有一天，一位画家路过，被它的美丽深深打动，画下了这幅画。有时候，坚持自我，就是最美的风景。',
  '一位父亲带着儿子去爬山。儿子累得气喘吁吁，问父亲："爸爸，我们为什么要爬山？"父亲说："因为山就在那里。"多年后，儿子终于明白：人生就像爬山，过程也许辛苦，但山顶的风景值得一切。',
  '有一只小鸟，它的翅膀受伤了，无法飞翔。别的鸟儿都离它而去，但它没有放弃。它用爪子一步一步地爬行，终于找到了一个温暖的家。生命的力量，往往在逆境中更加闪耀。'
];

const jokes = [
  '程序员去买包子，老板问："要什么馅的？"程序员说："只要不加葱就行。"老板："好的，一个程序员馅的包子。"程序员："为什么？"老板："因为你们都不加葱（Bug）啊！"',
  '医生对病人说："你的病很严重，只有三个月的时间了。"病人："不！我不能接受！"医生："别担心，我给你推荐一个好医生，他能让你再活三个月。"',
  '小明问妈妈："妈妈，我是从哪里来的？"妈妈温柔地说："你是妈妈从垃圾桶里捡来的。"小明："那我一定是可回收垃圾！"',
  '老师问小明："你知道为什么海水是蓝色的吗？"小明："因为海里有鱼。"老师："为什么有鱼就是蓝色的？"小明："因为鱼会吐泡泡，Blue~Blue~"',
  '老婆问老公："如果有一天我和你妈同时掉进水里，你先救谁？"老公："当然先救你！"老婆感动地问："为什么？"老公："因为我妈会游泳。"',
  '程序员写代码，写了一天终于写完了。测试时发现一个bug，改了一天。第二天发现bug还在，原来是昨天改的是备份文件。',
  '甲："你知道吗？我昨晚梦见自己在吃棉花糖。"乙："然后呢？"甲："然后早上起来发现枕头不见了！"',
  '老板问员工："你觉得你值多少钱？"员工："我觉得我值10万。"老板："那你说说理由。"员工："因为我会coding，会设计，会运营，会做饭，会修电脑...加起来至少值10万。"老板："那我给你5万，剩下的5万你自己出。"',
  '一个人去看医生，医生说："你需要多休息，少工作。"这个人说："我做不到啊，我是个程序员。"医生："那就多吃点水果。"这个人："好的，我去买键盘。"',
  '老师布置作业："请用"如果"造一个句子。"小明写："如果我有超能力，我就把作业变没。"老师批改："想象力丰富，但作业还是要交。"'
];

const news = [
  { category: 'economy', title: '经济简讯', content: '今日股市小幅震荡，市场观望情绪较浓。专家建议投资者保持理性，关注长期价值投资。' },
  { category: 'economy', title: '经济简讯', content: '央行宣布下调存款准备金率0.5个百分点，释放长期资金约1万亿元，助力实体经济发展。' },
  { category: 'economy', title: '经济简讯', content: '全球供应链逐步恢复，国际贸易额稳步增长，出口企业订单量明显回升。' },
  { category: 'economy', title: '经济简讯', content: '消费市场持续回暖，零售数据超预期，线上消费占比进一步提升至30%以上。' },
  { category: 'economy', title: '经济简讯', content: '新能源汽车产业快速发展，上半年销量同比增长超过50%，市场渗透率持续提升。' },
  { category: 'life', title: '生活贴士', content: '夏季高温来袭，建议每天补充足够水分，避免长时间户外活动，注意防暑降温。' },
  { category: 'life', title: '生活贴士', content: '换季时节注意增减衣物，保持室内通风，预防感冒和呼吸道疾病。' },
  { category: 'life', title: '生活贴士', content: '周末可以尝试DIY手工制作，既能放松身心，又能培养兴趣爱好，丰富业余生活。' },
  { category: 'life', title: '生活贴士', content: '家庭收纳整理技巧：分类存放、合理利用空间，让家居环境更加整洁舒适。' },
  { category: 'life', title: '生活贴士', content: '亲子互动时间很重要，每天安排30分钟高质量陪伴，增进家庭成员感情。' },
  { category: 'tech', title: '科技前沿', content: '最新研究显示，量子计算机在特定任务上已展现出超越传统超级计算机的能力。' },
  { category: 'tech', title: '科技前沿', content: '5G商用进程加速，全国5G基站总数突破300万，万物互联时代正在到来。' },
  { category: 'tech', title: '科技前沿', content: '新型半导体材料研发取得突破，有望大幅提升芯片性能，降低制造成本。' },
  { category: 'tech', title: '科技前沿', content: '太空探索持续推进，火星探测任务取得重要进展，人类离星际旅行更近一步。' },
  { category: 'tech', title: '科技前沿', content: '可穿戴设备技术升级，智能手表健康监测功能更精准，助力个人健康管理。' },
  { category: 'ai', title: 'AI动态', content: '人工智能技术持续突破，AI辅助医疗诊断准确率大幅提升，为医疗行业带来新机遇。' },
  { category: 'ai', title: 'AI动态', content: '大语言模型应用场景不断拓展，智能客服、内容创作等领域实现深度赋能。' },
  { category: 'ai', title: 'AI动态', content: 'AI生成式内容监管政策出台，规范行业发展，保护知识产权和用户权益。' },
  { category: 'ai', title: 'AI动态', content: '自动驾驶技术测试范围扩大，多家企业获得商业化运营许可，智慧交通加速落地。' },
  { category: 'ai', title: 'AI动态', content: 'AI教育应用日益普及，个性化学习方案助力提升学习效率和质量。' },
  { category: 'health', title: '健康养生', content: '研究发现，每天保持30分钟有氧运动，有助于提升心肺功能和免疫力，改善睡眠质量。' },
  { category: 'health', title: '健康养生', content: '合理饮食搭配：多吃蔬菜水果，减少高油高糖食物摄入，保持营养均衡。' },
  { category: 'health', title: '健康养生', content: '心理健康不容忽视，学会调节情绪，适当释放压力，保持积极乐观心态。' },
  { category: 'health', title: '健康养生', content: '定期体检很重要，及早发现潜在健康问题，做到预防为主、防治结合。' },
  { category: 'health', title: '健康养生', content: '戒烟限酒，远离不良生活习惯，为身体健康打下坚实基础。' },
  { category: 'business', title: '企业管理', content: '数字化转型成为企业发展新趋势，灵活办公模式逐渐被更多企业采纳。' },
  { category: 'business', title: '企业管理', content: '企业文化建设日益重视，良好的企业氛围有助于提升员工归属感和团队凝聚力。' },
  { category: 'business', title: '企业管理', content: '绿色发展理念深入人心，节能减排成为企业社会责任的重要组成部分。' },
  { category: 'business', title: '企业管理', content: '人才培养体系不断完善，员工培训和职业发展规划助力企业可持续发展。' },
  { category: 'business', title: '企业管理', content: '客户服务质量持续提升，以客户为中心的经营理念推动企业竞争力增强。' },
  { category: 'culture', title: '文化资讯', content: '经典文学作品改编热潮持续，多部名著被搬上银幕，传统文化焕发新活力。' },
  { category: 'culture', title: '文化资讯', content: '非遗文化传承迎来新机遇，年轻一代传承人用创新方式让传统技艺焕发新生。' },
  { category: 'culture', title: '文化资讯', content: '博物馆数字化转型加速，线上展览、虚拟参观等形式让文化触达更多人群。' },
  { category: 'environment', title: '环保动态', content: '垃圾分类政策持续推进，绿色生活理念深入人心，环保意识不断提升。' },
  { category: 'environment', title: '环保动态', content: '新能源产业蓬勃发展，太阳能、风能等清洁能源占比稳步提升。' },
  { category: 'sports', title: '体育新闻', content: '全民健身热潮持续高涨，各类运动赛事精彩纷呈，健康生活理念深入人心。' },
  { category: 'sports', title: '体育新闻', content: '国字号球队积极备战，期待在国际赛场上再创佳绩，为国争光。' },
  { category: 'travel', title: '旅游资讯', content: '旅游市场稳步复苏，周边游、乡村游成为新热点，带动地方经济发展。' },
  { category: 'travel', title: '旅游资讯', content: '文旅融合创新发展，特色旅游产品层出不穷，满足多样化消费需求。' },
  { category: 'education', title: '教育资讯', content: '教育改革持续深化，素质教育理念得到广泛认同，学生全面发展成为目标。' },
  { category: 'education', title: '教育资讯', content: '在线教育蓬勃发展，优质教育资源共享，打破地域限制，促进教育公平。' }
];

const lifeTips = [
  { category: 'kitchen', title: '煮米饭更香的秘诀', content: '煮饭时加入一小勺橄榄油或黄油，米饭会更加香糯可口，粒粒分明。' },
  { category: 'cleaning', title: '去除水垢妙招', content: '用白醋和小苏打混合后倒入水壶，煮沸后静置半小时，水垢会自动脱落，轻松清洁。' },
  { category: 'health', title: '缓解颈椎酸痛', content: '每天做5分钟颈椎操：缓慢左右转头、低头抬头，每个动作保持10秒，有效缓解颈椎疲劳。' },
  { category: 'kitchen', title: '快速解冻肉类', content: '将冻肉放在密封袋中，浸泡在冷水中，15-20分钟即可快速解冻，既安全又保留营养。' },
  { category: 'cleaning', title: '去除衣物污渍', content: '白色衣物发黄可用淘米水浸泡30分钟后正常清洗；血渍用冷水加肥皂搓洗效果更佳。' },
  { category: 'health', title: '改善睡眠质量', content: '睡前1小时远离电子产品，喝一杯温牛奶，保持卧室温度在18-22°C，有助于快速入睡。' },
  { category: 'kitchen', title: '保持蔬菜新鲜', content: '绿叶蔬菜用纸巾包裹后放入保鲜袋，根部朝下冷藏；根茎类蔬菜用报纸包裹后存放阴凉处。' },
  { category: 'cleaning', title: '清洁微波炉', content: '在微波炉中放一碗水加热3分钟，水蒸气会软化油污，用湿布轻松擦拭即可清洁干净。' },
  { category: 'health', title: '保护眼睛健康', content: '每隔1小时远离屏幕5分钟，眺望远方；多吃富含维生素A和叶黄素的食物，如胡萝卜、蓝莓。' },
  { category: 'kitchen', title: '煮面条不粘连', content: '水开后加一小勺盐再下面条，煮好后过一遍冷水，面条会更加劲道爽滑。' },
  { category: 'cleaning', title: '去除冰箱异味', content: '在冰箱中放置柠檬皮、橘子皮或一小碗小苏打，能有效吸附异味，保持冰箱清新。' },
  { category: 'health', title: '缓解压力方法', content: '每天花10分钟进行冥想或深呼吸练习，专注于当下，有助于释放压力，平复情绪。' },
  { category: 'kitchen', title: '煎蛋不粘锅技巧', content: '锅烧热后再倒油，油热后再打鸡蛋，鸡蛋会快速定型，轻松翻面不粘连。' },
  { category: 'cleaning', title: '清洁玻璃窗户', content: '用报纸蘸取肥皂水擦拭玻璃，然后用干报纸抛光，玻璃会光洁透亮，不留水渍。' },
  { category: 'health', title: '增强免疫力', content: '保持规律作息，保证7-8小时睡眠；均衡饮食，适量运动，增强身体抵抗力。' }
];

const emotionalAdviceList = [
  {
    prompt: '最近工作压力很大，总是感觉疲惫不堪，该怎么办？',
    response: '工作压力大是很常见的情况，不要过于焦虑。建议你每天给自己留出30分钟的放松时间，可以听音乐、散步或者做一些深呼吸练习。同时，试着把大任务分解成小目标，一步一步完成，会感觉轻松很多。记得，身体是革命的本钱，照顾好自己最重要。'
  },
  {
    prompt: '总是感到孤独，没有知心朋友，该怎么改变？',
    response: '孤独感是每个人都会经历的情绪，不要因此自责。试着主动去认识新朋友，可以参加一些兴趣小组、社区活动，或者在工作中多与同事交流。真诚待人，总会遇到志同道合的朋友。同时，也要学会享受独处的时光，与自己对话。'
  },
  {
    prompt: '对未来感到迷茫，不知道该往哪个方向努力？',
    response: '迷茫是成长的必经之路，说明你正在思考人生。试着静下心来，问问自己真正喜欢什么、擅长什么。可以先从小事做起，尝试不同的领域，慢慢找到方向。记住，人生没有标准答案，重要的是不断探索和尝试。'
  },
  {
    prompt: '经常失眠，晚上睡不着，白天没精神？',
    response: '失眠确实会影响生活质量。建议你建立规律的作息时间，每天固定上床和起床时间；睡前避免使用电子产品，营造安静舒适的睡眠环境；可以试试听轻音乐或白噪音帮助入睡。如果长期失眠，建议咨询专业医生。'
  },
  {
    prompt: '总是在意别人的看法，活得很累怎么办？',
    response: '太在意别人的看法往往会失去自我。试着关注自己的内心感受，问问自己：这件事对我来说重要吗？我开心吗？每个人都有自己的生活方式，不必强求所有人都喜欢自己。学会接纳自己，爱自己，才能真正快乐。'
  },
  {
    prompt: '和家人关系紧张，经常吵架？',
    response: '家人之间的矛盾很常见，关键是如何沟通。试着站在对方的角度理解问题，用平和的语气表达自己的感受，而不是指责对方。多一些包容和理解，少一些争吵和抱怨。家庭是温暖的港湾，需要用心去经营。'
  },
  {
    prompt: '感觉自己很失败，什么都做不好？',
    response: '每个人都会有低谷期，这并不代表你失败。试着回顾自己的成长历程，你已经克服了很多困难，走到了今天。不要拿自己和别人比较，每个人的节奏不同。给自己一些时间和耐心，相信自己，你一定能找到属于自己的光芒。'
  },
  {
    prompt: '分手后无法释怀，总是想起过去？',
    response: '失恋后的痛苦是正常的，给自己一些时间疗伤。试着转移注意力，做一些喜欢的事情，和朋友多交流。记住，过去的美好值得怀念，但未来更值得期待。相信时间会慢慢抚平伤痛，你会遇到更好的人。'
  }
];

const tasksList = [
  '整理桌面，让工作环境焕然一新',
  '给家人打个电话，分享生活点滴',
  '阅读20分钟，充实心灵',
  '做一顿美味的早餐，开启美好一天',
  '出门散步15分钟，呼吸新鲜空气',
  '写一篇日记，记录心情',
  '整理衣柜，断舍离不需要的衣物',
  '学一道新菜，犒劳自己',
  '看一部喜欢的电影，放松身心',
  '给朋友发一条问候消息',
  '练习冥想10分钟，平静内心',
  '清理手机相册，删除不需要的照片',
  '做一次深度清洁，让家里焕然一新',
  '计划周末的行程，提前安排',
  '学习一个新技能，提升自己'
];

const tipsList = [
  '微笑是最好的化妆品，今天也要保持好心情',
  '遇到困难时，深呼吸三次，问题会变得简单',
  '每天进步一点点，积少成多终会成功',
  '珍惜眼前人，不要等到失去才后悔',
  '学会感恩，生活中的小确幸无处不在',
  '保持好奇心，世界永远充满惊喜',
  '不要害怕失败，每一次尝试都是成长',
  '给自己一些空间，学会独处',
  '用心感受生活，每一天都是礼物',
  '相信直觉，跟随内心的声音',
  '保持善良，世界会以善意回报你',
  '学会放手，有些事情不必强求',
  '保持乐观，困难只是暂时的',
  '爱自己是终身浪漫的开始',
  '享受当下，珍惜每一个瞬间'
];

const weatherConditions = [
  { weather: '晴', temperature: '28°C', tip: '今天天气晴朗，阳光明媚，适合出门散步或运动，记得做好防晒哦！' },
  { weather: '多云', temperature: '26°C', tip: '今天天气多云，气温适宜，适合户外活动，带上一把伞以防突然下雨。' },
  { weather: '阴', temperature: '24°C', tip: '今天天气阴沉，空气湿润，适合待在家里看书、喝茶，享受宁静时光。' },
  { weather: '小雨', temperature: '22°C', tip: '今天有小雨，空气清新，记得带伞，雨后的空气格外清新。' },
  { weather: '大雨', temperature: '20°C', tip: '今天有大雨，建议减少外出，待在家里听听雨声，也是一种享受。' },
  { weather: '雷阵雨', temperature: '25°C', tip: '今天有雷阵雨，注意防范雷电，雷雨天气尽量不要外出。' },
  { weather: '雾', temperature: '23°C', tip: '今天有雾，能见度较低，出行注意安全，开车减速慢行。' },
  { weather: '霾', temperature: '26°C', tip: '今天空气质量较差，建议减少户外活动，做好防护措施。' },
  { weather: '雪', temperature: '-2°C', tip: '今天下雪了，银装素裹的世界很美，注意保暖，小心路滑。' },
  { weather: '大风', temperature: '18°C', tip: '今天风较大，注意防风，外出记得戴帽子围巾。' }
];

const windDirections = ['东风', '南风', '西风', '北风', '东南风', '西南风', '东北风', '西北风'];
const humidityValues = ['45%', '50%', '55%', '60%', '65%', '70%', '75%', '80%'];
const aqiValues = [
  { aqi: '35 优', level: '优' },
  { aqi: '55 良', level: '良' },
  { aqi: '85 轻度污染', level: '轻度污染' },
  { aqi: '120 中度污染', level: '中度污染' }
];

const luckyColors = ['红色', '黄色', '蓝色', '绿色', '紫色', '橙色', '白色', '粉色'];
const luckyNumbers = ['1', '2', '3', '5', '6', '8', '9'];
const zodiacs = ['鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊', '猴', '鸡', '狗', '猪'];

const fortuneOverall = ['good', 'medium', 'bad'];
const fortuneCareer = [
  '今天工作顺利，思路清晰，适合处理重要事务。',
  '工作上可能会遇到一些挑战，但只要坚持就能克服。',
  '今天适合学习新知识，提升自己的专业能力。',
  '团队合作很重要，多与同事沟通交流。',
  '今天运气不错，可能会有意外的工作机会。',
  '工作压力较大，注意劳逸结合。'
];
const fortuneWealth = [
  '财运平稳，不宜进行大额投资，小确幸可能会不期而至。',
  '今天适合理财规划，制定合理的财务目标。',
  '可能会有意外的收入，值得期待。',
  '花钱要谨慎，避免冲动消费。',
  '财运不错，可以考虑一些稳健的投资。',
  '今天财运平平，适合储蓄，不宜冒险。'
];
const fortuneEmotion = [
  '心情愉悦，与人相处和谐，适合表达自己的想法。',
  '今天情绪比较敏感，需要多关注自己的内心感受。',
  '适合与朋友聚会，增进感情。',
  '单身的朋友今天可能会遇到心仪的对象。',
  '恋爱中的朋友感情稳定，甜蜜温馨。',
  '今天适合独处，整理自己的情绪。'
];
const fortuneRelationship = [
  '人际关系良好，朋友间互动频繁，可能会收到意外的问候。',
  '今天适合拓展人脉，多参加社交活动。',
  '与家人的关系更加亲密，适合家庭聚会。',
  '注意沟通方式，避免不必要的误会。',
  '朋友会给你带来帮助和支持。',
  '今天适合安静地陪伴家人，享受温馨时光。'
];
const fortuneAdvice = [
  '保持积极心态，今日适合规划未来，设定新的目标。',
  '今天适合行动，想到什么就去做吧。',
  '学会倾听他人的意见，对你会有帮助。',
  '保持耐心，好事多磨。',
  '今天适合放松，不要给自己太大压力。',
  '相信自己的直觉，做出正确的选择。'
];
const fortuneImprovement = [
  '今日适合佩戴红色饰品，增加贵人运。多与人交流，拓展人脉。',
  '今日适合穿亮色衣服，提升运势。保持微笑，好运自然来。',
  '今日适合喝茶静心，调整心态。多做善事，积累福报。',
  '今日适合阅读学习，充实自己。保持好奇心，探索新领域。',
  '今日适合运动健身，增强体质。健康是最好的财富。',
  '今日适合整理环境，让生活更有序。整洁的环境带来好心情。'
];

export default function () {
  const seed = getDailySeed();
  const random = seededRandom(seed);

  const encouragement = getDailyContent(encouragementList);
  const dailyJokes = getDailyItems(jokes, 3);
  const dailyNews = getDailyItems(news, 5);
  const dailyStories = getDailyItems(stories, 3);
  const dailyLifeTips = getDailyItems(lifeTips, 3);
  const emotionalAdvice = getDailyContent(emotionalAdviceList);
  const dailyTasks = getDailyItems(tasksList, 3);
  const dailyTips = getDailyItems(tipsList, 3);

  const weatherIndex = Math.floor(random() * weatherConditions.length);
  const weather = weatherConditions[weatherIndex];
  const windIndex = Math.floor(random() * windDirections.length);
  const humidityIndex = Math.floor(random() * humidityValues.length);
  const aqiIndex = Math.floor(random() * aqiValues.length);

  const overallIndex = Math.floor(random() * fortuneOverall.length);
  const careerIndex = Math.floor(random() * fortuneCareer.length);
  const wealthIndex = Math.floor(random() * fortuneWealth.length);
  const emotionIndex = Math.floor(random() * fortuneEmotion.length);
  const relationshipIndex = Math.floor(random() * fortuneRelationship.length);
  const adviceIndex = Math.floor(random() * fortuneAdvice.length);
  const improvementIndex = Math.floor(random() * fortuneImprovement.length);

  const luckyColorIndex = Math.floor(random() * luckyColors.length);
  const luckyNumberIndex = Math.floor(random() * luckyNumbers.length);
  const zodiacIndex = Math.floor(random() * zodiacs.length);

  return {
    encouragement,
    jokes: dailyJokes,
    stories: dailyStories,
    news: dailyNews,
    weather: {
      city: '运城',
      temperature: weather.temperature,
      weather: weather.weather,
      wind: `${windDirections[windIndex]}3级`,
      humidity: humidityValues[humidityIndex],
      aqi: aqiValues[aqiIndex].aqi,
      tip: weather.tip
    },
    fortune: {
      overall: fortuneOverall[overallIndex],
      bazi: '乙未年 壬午月',
      zodiac: zodiacs[zodiacIndex],
      luckyColor: luckyColors[luckyColorIndex],
      luckyNumber: luckyNumbers[luckyNumberIndex],
      career: fortuneCareer[careerIndex],
      wealth: fortuneWealth[wealthIndex],
      emotion: fortuneEmotion[emotionIndex],
      relationship: fortuneRelationship[relationshipIndex],
      advice: fortuneAdvice[adviceIndex],
      improvement: fortuneImprovement[improvementIndex]
    },
    suggestions: {
      tasks: dailyTasks,
      tips: dailyTips
    },
    lifeTips: dailyLifeTips,
    emotionalAdvice
  };
}