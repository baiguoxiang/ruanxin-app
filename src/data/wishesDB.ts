export interface Wish {
  id: string;
  content: string;
  createdAt: string;
  likes: number;
}

export const defaultWishes: Wish[] = [
  { id: '1', content: '希望家人身体健康，平安喜乐。🙏', createdAt: '2026-07-01', likes: 128 },
  { id: '2', content: '愿所有的努力都能得到回报。💪', createdAt: '2026-07-01', likes: 96 },
  { id: '3', content: '希望今年能实现自己的小目标。🎯', createdAt: '2026-07-01', likes: 87 },
  { id: '4', content: '愿世界和平，每个人都能被温柔以待。💝', createdAt: '2026-07-02', likes: 156 },
  { id: '5', content: '希望我的朋友都能幸福快乐。😊', createdAt: '2026-07-02', likes: 67 },
  { id: '6', content: '愿自己能变得更勇敢、更坚强。🌟', createdAt: '2026-07-02', likes: 89 },
  { id: '7', content: '希望能遇到生命中的那个对的人。💕', createdAt: '2026-07-02', likes: 78 },
  { id: '8', content: '愿每一天都充满阳光和希望。☀️', createdAt: '2026-07-03', likes: 112 },
  { id: '9', content: '希望能去一次心心念念的旅行。✈️', createdAt: '2026-07-03', likes: 93 },
  { id: '10', content: '愿所有的梦想都能开花结果。🌼', createdAt: '2026-07-03', likes: 134 },
];

export const getStoredWishes = (): Wish[] => {
  const stored = localStorage.getItem('wishes');
  return stored ? JSON.parse(stored) : defaultWishes;
};

export const saveWish = (content: string): Wish => {
  const wishes = getStoredWishes();
  const newWish: Wish = {
    id: Date.now().toString(),
    content,
    createdAt: new Date().toISOString().split('T')[0],
    likes: 0
  };
  wishes.unshift(newWish);
  localStorage.setItem('wishes', JSON.stringify(wishes));
  return newWish;
};

export const likeWish = (id: string): void => {
  const wishes = getStoredWishes();
  const index = wishes.findIndex(w => w.id === id);
  if (index !== -1) {
    wishes[index].likes += 1;
    localStorage.setItem('wishes', JSON.stringify(wishes));
  }
};