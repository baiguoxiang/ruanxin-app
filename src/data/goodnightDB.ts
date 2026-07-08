export interface Goodnight {
  id: string;
  content: string;
  mood: string;
  day: number;
}

export const goodnightList: Goodnight[] = [
  { id: '1', content: '晚安，愿你的梦里有星光和温暖。🌙✨', mood: '宁静', day: 1 },
  { id: '2', content: '放下今天的疲惫，明天又是新的开始。💤', mood: '放松', day: 2 },
  { id: '3', content: '晚安，愿你一夜好梦，醒来元气满满。🌛', mood: '治愈', day: 3 },
  { id: '4', content: '把烦恼留在今天，把希望留给明天。🌌', mood: '释怀', day: 4 },
  { id: '5', content: '晚安，愿你被温柔以待。💫', mood: '温暖', day: 5 },
  { id: '6', content: '星星在眨眼，月亮在微笑，晚安好梦。⭐', mood: '浪漫', day: 6 },
  { id: '7', content: '无论今天过得怎样，都要好好爱自己。💖', mood: '自爱', day: 7 },
  { id: '8', content: '晚安，愿你的梦里有花香和微风。🌸🍃', mood: '美好', day: 8 },
  { id: '9', content: '休息是为了更好地出发，晚安。🌊', mood: '宁静', day: 9 },
  { id: '10', content: '闭上眼睛，让心灵去旅行。🌍', mood: '放松', day: 10 },
  { id: '11', content: '晚安，愿你拥有一个甜甜的梦。🍬', mood: '治愈', day: 11 },
  { id: '12', content: '今天辛苦了，好好休息吧。❤️', mood: '温暖', day: 12 },
  { id: '13', content: '愿你梦里有诗和远方。📜', mood: '浪漫', day: 13 },
  { id: '14', content: '晚安，明天会更好。🌞', mood: '希望', day: 14 },
  { id: '15', content: '放下焦虑，享受夜晚的宁静。🌙', mood: '平静', day: 15 },
  { id: '16', content: '愿你一夜好眠，醒来皆是美好。🌈', mood: '美好', day: 16 },
  { id: '17', content: '晚安，做一个幸福的梦。💭', mood: '幸福', day: 17 },
  { id: '18', content: '让夜晚治愈你所有的疲惫。✨', mood: '治愈', day: 18 },
  { id: '19', content: '晚安，愿你梦里有阳光和彩虹。☀️🌈', mood: '温暖', day: 19 },
  { id: '20', content: '把今天的故事放下，明天再续写新篇。📖', mood: '释怀', day: 20 },
];

export const getTodayGoodnight = (): Goodnight => {
  const now = new Date();
  const seed = now.getFullYear() * 10000 + (now.getMonth() + 1) * 100 + now.getDate();
  const index = seed % goodnightList.length;
  return goodnightList[index];
};