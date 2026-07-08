export interface Encouragement {
  id: string;
  content: string;
  author?: string;
  day: number;
}

export const encouragementList: Encouragement[] = [
  { id: '1', content: '你比想象中更强大，今天也要加油！💪', day: 1 },
  { id: '2', content: '每一个不曾起舞的日子，都是对生命的辜负。✨', author: '尼采', day: 2 },
  { id: '3', content: '相信自己，你值得拥有更好的一切。🌟', day: 3 },
  { id: '4', content: '不要等待机会，而要创造机会。🚀', day: 4 },
  { id: '5', content: '你的努力，时光不会辜负。⏳', day: 5 },
  { id: '6', content: '做自己的太阳，无需借助谁的光。☀️', day: 6 },
  { id: '7', content: '生活不会因为你是女孩就对你温柔，但你可以因为是自己而温柔生活。🌸', day: 7 },
  { id: '8', content: '你所期待的，正在路上向你奔赴而来。🌈', day: 8 },
  { id: '9', content: '发光不是太阳的权利，你也可以。💫', day: 9 },
  { id: '10', content: '再小的努力，乘以365天也会变得很强大。📅', day: 10 },
  { id: '11', content: '不要否定自己，你真的很棒！👏', day: 11 },
  { id: '12', content: '人生没有白走的路，每一步都算数。👣', day: 12 },
  { id: '13', content: '今天的你，比昨天更接近梦想了。🎯', day: 13 },
  { id: '14', content: '你的价值不取决于别人的认可，而在于你自己的努力。💎', day: 14 },
  { id: '15', content: '即使没有人鼓掌，也要优雅地谢幕。👏', day: 15 },
  { id: '16', content: '勇敢去做你害怕的事，害怕自然会消失。🔥', day: 16 },
  { id: '17', content: '你的潜力是无限的，不要给自己设限。🌌', day: 17 },
  { id: '18', content: '今天的努力是明天最好的铺垫。🎁', day: 18 },
  { id: '19', content: '你就是独一无二的，无可替代。💖', day: 19 },
  { id: '20', content: '心若向阳，无畏悲伤。🌻', day: 20 },
  { id: '21', content: '世界上最美好的事情之一，就是你正在努力成为更好的自己。💝', day: 21 },
  { id: '22', content: '不要放弃，最好的时刻还没有到来。🎊', day: 22 },
  { id: '23', content: '你的坚持，终将美好。💫', day: 23 },
  { id: '24', content: '每一天都是新的开始，加油！🌟', day: 24 },
  { id: '25', content: '你比自己想象中更勇敢、更聪明、更坚强。💪', day: 25 },
  { id: '26', content: '未来的你，会感谢现在努力的自己。🙏', day: 26 },
  { id: '27', content: '保持热爱，奔赴山海。🌊', day: 27 },
  { id: '28', content: '做一个温暖的人，温暖自己，也温暖别人。❤️', day: 28 },
  { id: '29', content: '你的微笑是这个世界最美好的风景。😊', day: 29 },
  { id: '30', content: '愿你眼中有光，心中有爱，一路春暖花开。🌷', day: 30 },
];

export const getTodayEncouragement = (): Encouragement => {
  const now = new Date();
  const seed = now.getFullYear() * 10000 + (now.getMonth() + 1) * 100 + now.getDate();
  const index = seed % encouragementList.length;
  return encouragementList[index];
};