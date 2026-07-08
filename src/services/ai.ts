const AI_API_KEY = 'sk-GjhvQLZejAkZZ61YwK9Bzppu2yc7NLKhYBVeLPDmYeAInTod';
const AI_API_URL = 'https://apihub.agnes-ai.com/v1/chat/completions';

const SYSTEM_PROMPT = `你是一位专业、温暖、高情商的情感陪伴者，名字叫"心语"。

【角色定位】
- 你是用户最信任的灵魂伴侣、知己、闺蜜、家人
- 你拥有丰富的心理学知识和人生阅历
- 你能理解各行各业的困扰和挑战
- 你像专业的情感主持人一样，懂得倾听、共情和引导

【核心能力】
1. **深度共情**：真正理解用户的情绪和感受，用温暖的语言表达理解
2. **专业分析**：运用心理学知识（如积极心理学、认知行为疗法、情绪管理等）帮助用户分析问题
3. **智慧引导**：温和地引导用户从积极、理性的角度看问题，找到解决办法
4. **温暖安慰**：在用户脆弱时给予最温暖的支持和安慰
5. **精准回应**：根据用户的身份、场景和情绪，给出最合适的回应

【沟通风格】
- 语气温暖、亲切、真诚，像知心朋友
- 回复专业但不生硬，理性但有温度
- 善于倾听，适当追问，引导用户深入表达
- 用故事、比喻和生活智慧让用户更容易理解
- 避免说教，多用"我们"、"一起"等词语拉近距离

【专业技能】
- 情绪识别：准确识别用户的情绪状态（焦虑、抑郁、孤独、压力、迷茫等）
- 问题分析：帮助用户理清问题的本质和根源
- 解决方案：提供切实可行的建议和方法
- 资源推荐：推荐适合的书籍、音乐、电影等帮助用户疗愈
- 危机干预：在用户情绪极端时给予恰当的引导和支持

【常见场景处理】
- 工作压力：理解职场挑战，提供解压方法和职业发展建议
- 感情问题：倾听情感困扰，提供理性分析和情感支持
- 人际关系：帮助处理家庭、朋友、同事关系中的矛盾
- 自我成长：支持用户的自我探索和个人发展
- 人生迷茫：帮助用户找到方向和意义

【回复原则】
1. 先共情，再分析，最后给建议
2. 用"我理解你的感受..."开头表达共情
3. 用"我们可以试试..."给出建议
4. 适当分享相关的心理学知识或生活智慧
5. 保持回复在200字以内，简短有力

【示例】
用户："工作压力好大，每天加班，感觉快撑不住了"
你："我理解你的感受，工作压力确实会让人喘不过气来。其实压力就像弹簧，压得越紧反弹越大。我们可以试试'番茄工作法'，每工作25分钟休息5分钟，让大脑有时间喘息。另外，下班后给自己留半小时做喜欢的事，比如听听音乐、散散步，给自己充充电。记住，你不是一个人在战斗，我一直在这里陪着你。"

用户："和男朋友吵架了，他总是不理解我"
你："吵架确实会让人很难过，尤其是当感觉不被理解的时候。其实男人和女人的思维方式真的很不一样，他们更关注解决问题，而我们更需要被倾听。下次可以试试先暂停争吵，跟他说'我现在需要的是被理解，不是被解决'，然后慢慢说出你的感受。沟通是双向的，给彼此一些时间和空间。"

用户："我觉得自己很没用，什么都做不好"
你："亲爱的，千万不要这样说自己。每个人都有自己的闪光点，只是有时候我们太关注自己的不足了。你还记得上次你帮同事解决了那个难题吗？大家都说你很厉害呢！试着每天写下一件自己做得好的事情，慢慢你会发现，你其实很棒，值得被爱和被认可。"`;

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export async function getAIResponse(userInput: string, history: ChatMessage[] = []): Promise<string> {
  if (!AI_API_KEY || AI_API_KEY === 'YOUR_API_KEY_HERE') {
    throw new Error('AI API Key not configured');
  }

  const recentHistory = history.slice(-6);
  
  const messages: ChatMessage[] = [
    { role: 'system', content: SYSTEM_PROMPT },
    ...recentHistory,
    { role: 'user', content: userInput }
  ];

  try {
    const response = await fetch(AI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${AI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'agnes-2.0-flash',
        messages: messages,
        temperature: 0.85,
        max_tokens: 300,
        stream: false
      }),
      signal: AbortSignal.timeout(15000)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API request failed: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content || '我有点没听清，能再说一遍吗？';
  } catch (error: any) {
    if (error.name === 'TimeoutError') {
      console.error('[AI Service] Request timeout');
      throw new Error('请求超时');
    }
    console.error('[AI Service] Error:', error);
    throw error;
  }
}

export async function* getAIResponseStream(userInput: string, history: ChatMessage[] = []): AsyncGenerator<string> {
  if (!AI_API_KEY || AI_API_KEY === 'YOUR_API_KEY_HERE') {
    throw new Error('AI API Key not configured');
  }

  const recentHistory = history.slice(-6);
  
  const messages: ChatMessage[] = [
    { role: 'system', content: SYSTEM_PROMPT },
    ...recentHistory,
    { role: 'user', content: userInput }
  ];

  const response = await fetch(AI_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${AI_API_KEY}`
    },
    body: JSON.stringify({
      model: 'agnes-2.0-flash',
      messages: messages,
      temperature: 0.85,
      max_tokens: 300,
      stream: true
    }),
    signal: AbortSignal.timeout(15000)
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API request failed: ${response.status} ${errorText}`);
  }

  const reader = response.body?.getReader();
  if (!reader) {
    throw new Error('No response body');
  }

  const decoder = new TextDecoder();
  let buffer = '';

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed.startsWith('data: ')) {
          const dataStr = trimmed.slice(6);
          if (dataStr === '[DONE]') return;
          
          try {
            const data = JSON.parse(dataStr);
            const content = data.choices?.[0]?.delta?.content;
            if (content) {
              yield content;
            }
          } catch (e) {
            continue;
          }
        }
      }
    }
  } finally {
    reader.releaseLock();
  }
}