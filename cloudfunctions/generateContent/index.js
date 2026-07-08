const cloud = require('wx-server-sdk');
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });

const encouragements = [
  '今天的你，比昨天更接近梦想了一点点。每一个努力的瞬间，都在为未来的惊喜铺路。相信自己，你值得拥有所有美好！',
  '生活不会因为你是女孩就对你温柔，但你可以因为是自己而温柔对待生活。愿你眼中有光，心中有爱！',
  '不要着急，最好的总会在最不经意的时候出现。你需要做的就是：怀揣希望去努力，静待美好的出现。',
  '每一天都是新的开始，昨天的遗憾今天弥补，今天的努力明天收获。加油，你是最棒的！',
  '人生没有白走的路，每一步都算数。那些看似不起眼的坚持，终将成为你最坚实的力量。',
  '你不需要很厉害才开始，但你需要开始才会很厉害。今天也是充满希望的一天，勇敢去尝试吧！',
  '愿你眼里有星辰，心中有山海，从此以梦为马，不负韶华。每一天都要好好爱自己！',
  '生活原本沉闷，但跑起来就有风。保持热爱，奔赴山海，你一定会遇见更好的自己。'
];

const jokes = [
  '程序员去买包子，老板问："要什么馅的？"程序员说："只要不加葱就行。"老板："好的，一个程序员馅的包子。"程序员："为什么？"老板："因为你们都不加葱（Bug）啊！"',
  '医生对病人说："你的病很严重，只有三个月的时间了。"病人："不！我不能接受！"医生："别担心，我给你推荐一个好医生，他能让你再活三个月。"',
  '小明问妈妈："妈妈，我是从哪里来的？"妈妈温柔地说："你是妈妈从垃圾桶里捡来的。"小明："那我一定是可回收垃圾！"',
  '有一天，数学书和语文书吵架了。数学书说："我比你重要，因为我有很多数字。"语文书说："我比你重要，因为我有很多故事。"英语书路过说："你们吵什么，我才是最重要的，因为我是国际语言！"',
  '一位科学家发明了一种可以让人回到过去的机器。他决定先试试，于是回到了10年前。结果他发现，10年前的自己正在发明同样的机器。'
];

const stories = [
  '有一位画家，他画了一幅画，画中是一片沙漠。有人问他："这片沙漠里为什么没有绿洲？"画家笑着说："因为绿洲在每一个看到这幅画的人心里。"生活也是如此，希望不在别处，而在我们自己心中。',
  '一位老人在河边钓鱼，一个小孩走过来问："爷爷，您钓了多久了？"老人说："我钓了整整一天，一条鱼也没有钓到。"小孩说："那您为什么还在这里？"老人笑着说："因为我享受钓鱼的过程，至于结果，那是上天的安排。"',
  '有一只蜗牛，它想要爬到山顶去看日出。别的动物都嘲笑它："你爬得这么慢，等到了山顶太阳早就下山了！"蜗牛没有理会，继续一步一步往上爬。终于有一天，它爬到了山顶，看到了最美的日出。',
  '一个小男孩在沙滩上堆城堡，海浪一次次把他的城堡冲垮。他没有气馁，继续堆。一位老人走过来问："你不觉得累吗？"小男孩说："我在练习盖城堡，总有一天我会盖一个海浪冲不垮的城堡！"',
  '一位农夫在田里劳作，突然发现一颗种子发芽了。他小心翼翼地呵护着这棵幼苗。有人问他："这是什么种子？"农夫说："我不知道，但我知道只要用心浇灌，它一定会长成一棵大树。"',
  '有一个年轻人，他想要成为一名作家，但他写的文章总是被退稿。他很沮丧，想要放弃。这时他的老师告诉他："每一次退稿都是在告诉你，你离成功又近了一步。"年轻人听了老师的话，继续坚持写作，最终成为了一名著名的作家。',
  '一位母亲带着她的孩子去公园玩耍。孩子不小心摔倒了，膝盖磕破了皮，疼得哇哇大哭。母亲没有马上扶他起来，而是温柔地说："宝贝，自己站起来。妈妈相信你可以的。"孩子擦干眼泪，自己站了起来。母亲笑着说："你看，你比自己想象的更坚强！"',
  '有一位登山者，他想要攀登一座很高的山峰。在攀登的过程中，他遇到了很多困难和危险，但他始终没有放弃。终于，他登上了山顶，看到了美丽的风景。他感慨地说："原来最美的风景，总是在最难到达的地方。"',
  '一个小女孩在花园里种花，她种了很多漂亮的花。但有一朵花总是不开，她很着急。她的奶奶告诉她："每朵花都有自己的花期，不要着急，耐心等待，它一定会开的。"小女孩听了奶奶的话，耐心地等待着。终于有一天，那朵花绽放了，比其他任何一朵花都要美丽。',
  '有一位音乐家，他演奏的曲子总是没有人欣赏。他很失落，觉得自己的才华被埋没了。但他没有放弃，继续坚持练习。有一天，一位著名的音乐大师听到了他的演奏，非常欣赏他的才华，于是收他为徒。从此，他的音乐之路变得越来越宽广。',
  '一位父亲带着他的儿子去海边游泳。儿子很害怕，不敢下水。父亲说："别怕，爸爸在旁边保护你。"儿子还是不敢。父亲说："你看，海浪虽然看起来很大，但只要你勇敢地面对它，它就会成为你最好的朋友。"儿子鼓起勇气，走进了海里。他发现，原来大海并没有想象中那么可怕。',
  '有一个商人，他做生意总是失败。他很沮丧，想要放弃。这时他的朋友告诉他："失败并不可怕，可怕的是你失去了重新开始的勇气。"商人听了朋友的话，重新振作起来，继续努力。最终，他的生意越做越好，成为了一名成功的商人。'
];

const newsList = [
  {
    category: 'economy',
    title: '经济简讯',
    content: '今日股市小幅震荡，市场观望情绪较浓。专家建议投资者保持理性，关注长期价值投资。'
  },
  {
    category: 'economy',
    title: '经济简讯',
    content: '央行宣布下调存款准备金率0.5个百分点，释放长期资金约1万亿元，助力实体经济发展。'
  },
  {
    category: 'economy',
    title: '经济简讯',
    content: '全球供应链逐步恢复，国际贸易额稳步增长，出口企业订单量明显回升。'
  },
  {
    category: 'economy',
    title: '经济简讯',
    content: '消费市场持续回暖，零售数据超预期，线上消费占比进一步提升至30%以上。'
  },
  {
    category: 'economy',
    title: '经济简讯',
    content: '新能源汽车产业快速发展，上半年销量同比增长超过50%，市场渗透率持续提升。'
  },
  {
    category: 'life',
    title: '生活贴士',
    content: '夏季高温来袭，建议每天补充足够水分，避免长时间户外活动，注意防暑降温。'
  },
  {
    category: 'life',
    title: '生活贴士',
    content: '换季时节注意增减衣物，保持室内通风，预防感冒和呼吸道疾病。'
  },
  {
    category: 'life',
    title: '生活贴士',
    content: '周末可以尝试DIY手工制作，既能放松身心，又能培养兴趣爱好，丰富业余生活。'
  },
  {
    category: 'life',
    title: '生活贴士',
    content: '家庭收纳整理技巧：分类存放、合理利用空间，让家居环境更加整洁舒适。'
  },
  {
    category: 'life',
    title: '生活贴士',
    content: '亲子互动时间很重要，每天安排30分钟高质量陪伴，增进家庭成员感情。'
  },
  {
    category: 'tech',
    title: '科技前沿',
    content: '最新研究显示，量子计算机在特定任务上已展现出超越传统超级计算机的能力。'
  },
  {
    category: 'tech',
    title: '科技前沿',
    content: '5G商用进程加速，全国5G基站总数突破300万，万物互联时代正在到来。'
  },
  {
    category: 'tech',
    title: '科技前沿',
    content: '新型半导体材料研发取得突破，有望大幅提升芯片性能，降低制造成本。'
  },
  {
    category: 'tech',
    title: '科技前沿',
    content: '太空探索持续推进，火星探测任务取得重要进展，人类离星际旅行更近一步。'
  },
  {
    category: 'tech',
    title: '科技前沿',
    content: '可穿戴设备技术升级，智能手表健康监测功能更精准，助力个人健康管理。'
  },
  {
    category: 'ai',
    title: 'AI动态',
    content: '人工智能技术持续突破，AI辅助医疗诊断准确率大幅提升，为医疗行业带来新机遇。'
  },
  {
    category: 'ai',
    title: 'AI动态',
    content: '大语言模型应用场景不断拓展，智能客服、内容创作等领域实现深度赋能。'
  },
  {
    category: 'ai',
    title: 'AI动态',
    content: 'AI生成式内容监管政策出台，规范行业发展，保护知识产权和用户权益。'
  },
  {
    category: 'ai',
    title: 'AI动态',
    content: '自动驾驶技术测试范围扩大，多家企业获得商业化运营许可，智慧交通加速落地。'
  },
  {
    category: 'ai',
    title: 'AI动态',
    content: 'AI教育应用日益普及，个性化学习方案助力提升学习效率和质量。'
  },
  {
    category: 'health',
    title: '健康养生',
    content: '研究发现，每天保持30分钟有氧运动，有助于提升心肺功能和免疫力，改善睡眠质量。'
  },
  {
    category: 'health',
    title: '健康养生',
    content: '合理饮食搭配：多吃蔬菜水果，减少高油高糖食物摄入，保持营养均衡。'
  },
  {
    category: 'health',
    title: '健康养生',
    content: '心理健康不容忽视，学会调节情绪，适当释放压力，保持积极乐观心态。'
  },
  {
    category: 'health',
    title: '健康养生',
    content: '定期体检很重要，及早发现潜在健康问题，做到预防为主、防治结合。'
  },
  {
    category: 'health',
    title: '健康养生',
    content: '戒烟限酒，远离不良生活习惯，为身体健康打下坚实基础。'
  },
  {
    category: 'business',
    title: '企业管理',
    content: '数字化转型成为企业发展新趋势，灵活办公模式逐渐被更多企业采纳。'
  },
  {
    category: 'business',
    title: '企业管理',
    content: '企业文化建设日益重视，良好的企业氛围有助于提升员工归属感和团队凝聚力。'
  },
  {
    category: 'business',
    title: '企业管理',
    content: '绿色发展理念深入人心，节能减排成为企业社会责任的重要组成部分。'
  },
  {
    category: 'business',
    title: '企业管理',
    content: '人才培养体系不断完善，员工培训和职业发展规划助力企业可持续发展。'
  },
  {
    category: 'business',
    title: '企业管理',
    content: '客户服务质量持续提升，以客户为中心的经营理念推动企业竞争力增强。'
  }
];

const weatherList = [
  { city: '北京', temperature: '26°C', weather: '多云', wind: '东南风3级', humidity: '65%', aqi: '45 优', tip: '今天天气舒适，适合出门散步或运动，记得做好防晒哦！' },
  { city: '上海', temperature: '28°C', weather: '晴', wind: '东北风2级', humidity: '70%', aqi: '52 良', tip: '阳光明媚的一天，心情也会跟着变好，好好享受吧！' },
  { city: '广州', temperature: '32°C', weather: '阵雨', wind: '西南风4级', humidity: '85%', aqi: '60 良', tip: '出门记得带伞，雨后空气清新，也是一种美好的体验！' },
  { city: '深圳', temperature: '30°C', weather: '阴天', wind: '南风3级', humidity: '80%', aqi: '48 优', tip: '阴天适合在家看书或看电影，给自己一个放松的午后。' },
  { city: '杭州', temperature: '24°C', weather: '小雨', wind: '西北风2级', humidity: '75%', aqi: '35 优', tip: '细雨绵绵，适合品茶听雨，感受生活的宁静美好。' }
];

const luckyColors = ['红色', '黄色', '蓝色', '绿色', '白色', '紫色', '金色', '银色'];
const luckyNumbers = ['1', '2', '3', '5', '6', '8', '9'];

const fortuneTemplates = [
  { 
    overall: 'great', 
    career: '今日工作运势极佳，思路清晰，贵人相助，适合开展新项目或重要决策。',
    wealth: '财运亨通，正财偏财皆旺，可能有意外收入或投资回报，把握良机。',
    emotion: '心情愉悦，充满活力，魅力四射，社交场合如鱼得水。',
    relationship: '人际关系和谐，朋友聚会或约会顺利，单身者有望遇到心仪对象。',
    advice: '今日吉星高照，适合做出重要决定或开启新计划，事半功倍。',
    improvement: '今日适合佩戴{{luckyColor}}饰品，增加贵人运。多与人交流，拓展人脉。'
  },
  { 
    overall: 'good', 
    career: '工作效率高，团队协作顺畅，会得到同事和领导的认可。',
    wealth: '财运平稳，小财不断，不宜进行大额投资，积少成多也是一种智慧。',
    emotion: '心情平静祥和，与人相处融洽，适合表达内心想法。',
    relationship: '人际关系良好，朋友间互动频繁，可能收到意外的问候或惊喜。',
    advice: '保持积极心态，今日适合规划未来，设定新目标，稳扎稳打。',
    improvement: '今日幸运数字{{luckyNumber}}，遇到问题时可默念此数字，增强信心。'
  },
  { 
    overall: 'normal', 
    career: '工作按部就班，没有太大起伏，适合巩固现有成果，查漏补缺。',
    wealth: '财运一般，建议保守理财，避免冲动消费，量入为出。',
    emotion: '情绪稳定，适合静下心来思考，反思过去，规划未来。',
    relationship: '人际关系平淡，适合独处或与知己好友深度交流。',
    advice: '今日宜静不宜动，适合学习充电，提升自我，厚积薄发。',
    improvement: '今日适合穿着{{luckyColor}}衣物，提升气场。多读书，丰富内心世界。'
  },
  { 
    overall: 'caution', 
    career: '工作上可能遇到小挫折，需要耐心处理，不要急躁，稳中求进。',
    wealth: '财运不佳，不宜进行任何投资，注意财务安全，守财为主。',
    emotion: '情绪波动较大，需要学会调节，保持内心平静，避免冲动。',
    relationship: '人际关系需要注意，避免与人发生争执，保持低调谦和。',
    advice: '今日宜谨言慎行，多倾听少表达，做好本职工作即可，不宜强求。',
    improvement: '今日避免{{luckyColor}}相反颜色，保持低调。多做冥想，平复心境。'
  }
];

const suggestionsList = [
  { tasks: ['整理桌面，让工作环境焕然一新', '给家人打个电话，分享生活点滴', '阅读20分钟，充实心灵'], tips: ['微笑是最好的化妆品，今天也要保持好心情', '遇到困难时，深呼吸三次，问题会变得简单', '每天进步一点点，积少成多终会成功'] },
  { tasks: ['早起散步15分钟，感受清晨的美好', '喝一杯温水，唤醒身体', '写下今天的三个小目标'], tips: ['人生短暂，要学会珍惜每一天', '善待自己，也是一种能力', '保持好奇心，生活处处有惊喜'] },
  { tasks: ['做一顿美味的早餐', '整理衣柜，断舍离', '听一首喜欢的音乐'], tips: ['生活需要仪式感，给自己一点小确幸', '放下过去，才能拥抱未来', '相信直觉，它会指引你前进的方向'] },
  { tasks: ['给朋友发一条问候消息', '学习一个新技能（15分钟）', '做一次深呼吸练习'], tips: ['感恩身边的每一个人', '成长比成功更重要', '内心的平静是最好的礼物'] }
];

const lifeTips = [
  { category: 'kitchen', title: '煮米饭更香的秘诀', content: '煮饭时加入一小勺橄榄油或黄油，米饭会更加香糯可口，粒粒分明。' },
  { category: 'kitchen', title: '快速解冻肉类', content: '将冻肉放在两个铝盆之间，铝的导热性好，可以大大加快解冻速度，比室温解冻快3倍。' },
  { category: 'kitchen', title: '去除大蒜味', content: '切完大蒜后，用不锈钢餐具擦拭双手，或者用牙膏洗手，可以有效去除手上的大蒜味。' },
  { category: 'cleaning', title: '去除水垢妙招', content: '用白醋和小苏打混合后倒入水壶，煮沸后静置半小时，水垢会自动脱落，轻松清洁。' },
  { category: 'cleaning', title: '清洗纱窗', content: '将纱窗取下，放在浴缸里，用海绵蘸取肥皂水擦拭，再用清水冲洗，纱窗会焕然一新。' },
  { category: 'cleaning', title: '去除衣物油渍', content: '在油渍处涂抹牙膏，轻轻搓洗后静置10分钟，再用洗衣液清洗，油渍轻松去除。' },
  { category: 'beauty', title: '快速消肿', content: '早上起床眼睛浮肿，用冷藏过的勺子或茶包敷眼，10分钟后浮肿明显消退。' },
  { category: 'beauty', title: '头发护理', content: '洗头后用毛巾按压吸干水分，不要用力揉搓，吹风机调至低温档，减少头发损伤。' },
  { category: 'beauty', title: '嘴唇保湿', content: '睡前涂抹厚一点的唇膏，第二天嘴唇会变得水润饱满，告别干燥脱皮。' },
  { category: 'health', title: '缓解颈椎酸痛', content: '每天做5分钟颈椎操：缓慢左右转头、低头抬头，每个动作保持10秒，有效缓解颈椎疲劳。' },
  { category: 'health', title: '快速入睡', content: '睡前喝一杯温牛奶，或者听10分钟舒缓的音乐，让身心放松，更容易入睡。' },
  { category: 'health', title: '办公室护眼', content: '每隔一小时，离开电脑屏幕，眺望远方5分钟，或者做眼保健操，保护视力。' },
  { category: 'finance', title: '存钱小技巧', content: '发工资后，先存起20%，剩下的再用于日常开销，养成强制储蓄的习惯。' },
  { category: 'finance', title: '购物省钱', content: '购物前先列清单，避免冲动消费。关注商品价格走势，在促销活动时购买更划算。' },
  { category: 'study', title: '高效记忆', content: '学习新知识后，当天晚上睡前回顾一遍，第二天早上再复习一次，记忆效果翻倍。' },
  { category: 'study', title: '时间管理', content: '用番茄工作法：专注工作25分钟，休息5分钟，提高工作效率，避免拖延。' }
];

const emotionalPrompts = [
  { prompt: '最近工作压力很大，总是感觉疲惫不堪，该怎么办？', response: '工作压力大是很常见的情况，不要过于焦虑。建议你每天给自己留出30分钟的放松时间，可以听音乐、散步或者做一些深呼吸练习。同时，试着把大任务分解成小目标，一步一步完成，会感觉轻松很多。记得，身体是革命的本钱，照顾好自己最重要。' },
  { prompt: '和男朋友吵架了，感觉很难过，不知道该怎么处理？', response: '情侣之间吵架是难免的，关键是如何沟通和解决问题。建议你先冷静下来，想想吵架的原因是什么，是误会还是真的有分歧。找个合适的时机，心平气和地和他聊聊你的感受，也听听他的想法。记住，沟通是解决问题的桥梁，相互理解和包容才能让感情更长久。' },
  { prompt: '感觉自己很迷茫，不知道未来该怎么走？', response: '迷茫是成长过程中的正常阶段，每个人都会经历。建议你先停下来，想一想自己喜欢什么、擅长什么，以及想要成为什么样的人。可以从小事做起，尝试新的事物，慢慢探索。记住，人生没有标准答案，重要的是找到适合自己的道路，勇敢地走下去。' },
  { prompt: '总是在意别人的看法，活得很累怎么办？', response: '过于在意别人的看法会让自己很累，其实每个人都有自己的生活，没有人会一直关注你。建议你试着关注自己的内心感受，做自己认为对的事情。记住，你不可能让所有人都满意，最重要的是做真实的自己，爱自己。' },
  { prompt: '分手后很难走出来，每天都很痛苦？', response: '分手确实会让人感到痛苦，这是正常的情绪反应。给自己一些时间和空间去疗伤，可以和朋友倾诉，或者做一些自己喜欢的事情转移注意力。记住，时间是最好的良药，你会慢慢好起来的。相信未来会有更好的人在等你。' },
  { prompt: '感觉自己不够优秀，很自卑怎么办？', response: '每个人都有自己的闪光点，只是你可能还没有发现。建议你每天记录一件自己做得好的事情，慢慢积累自信心。同时，不要和别人比较，专注于自己的成长和进步。记住，你就是独一无二的，值得被爱和尊重。' },
  { prompt: '和家人关系不好，总是吵架？', response: '家人之间的矛盾往往源于缺乏沟通和理解。建议你试着站在家人的角度思考问题，多一些耐心和包容。找个合适的时机，和家人好好聊聊，表达你的感受，也听听他们的想法。记住，家人是最亲近的人，血浓于水，多一些理解和关爱，关系会越来越好。' },
  { prompt: '朋友越来越少，感觉很孤独？', response: '随着年龄增长，朋友确实会越来越少，但真正的朋友会一直陪伴在你身边。建议你多参加一些社交活动，认识新的朋友。同时，也要学会享受独处的时光，独处并不等于孤独，它可以让你更好地了解自己。记住，质量比数量更重要，有几个知心朋友就足够了。' }
];

function shuffleArray(array) {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

exports.main = async (event, context) => {
  try {
    const randomIndex = (arr) => Math.floor(Math.random() * arr.length);
    
    const storyCount = Math.floor(Math.random() * 8) + 3;
    const shuffledStories = shuffleArray(stories);
    const selectedStories = shuffledStories.slice(0, storyCount);
    
    const lifeTipCount = Math.floor(Math.random() * 4) + 2;
    const shuffledLifeTips = shuffleArray(lifeTips);
    const selectedLifeTips = shuffledLifeTips.slice(0, lifeTipCount);
    
    const selectedEmotional = emotionalPrompts[randomIndex(emotionalPrompts)];
    
    const template = fortuneTemplates[randomIndex(fortuneTemplates)];
    const luckyColor = luckyColors[randomIndex(luckyColors)];
    const luckyNumber = luckyNumbers[randomIndex(luckyNumbers)];
    
    const fortune = {
      ...template,
      bazi: event.bazi || '未设置',
      zodiac: event.zodiac || '',
      luckyColor,
      luckyNumber,
      improvement: template.improvement
        .replace('{{luckyColor}}', luckyColor)
        .replace('{{luckyNumber}}', luckyNumber)
    };

    const shuffledJokes = shuffleArray(jokes);
    const selectedJokes = shuffledJokes.slice(0, 3);
    
    const shuffledNews = shuffleArray(newsList);
    const selectedNews = shuffledNews.slice(0, 10);

    const result = {
      encouragement: encouragements[randomIndex(encouragements)],
      jokes: selectedJokes,
      stories: selectedStories,
      news: selectedNews,
      weather: weatherList[randomIndex(weatherList)],
      fortune,
      suggestions: suggestionsList[randomIndex(suggestionsList)],
      lifeTips: selectedLifeTips,
      emotionalAdvice: selectedEmotional
    };

    return { code: 0, message: 'success', data: result };
  } catch (err) {
    console.error('[generateContent] error:', err);
    return { code: -1, message: err.message || '服务异常', data: null };
  }
};