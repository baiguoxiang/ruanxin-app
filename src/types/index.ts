export interface DailyContent {
  encouragement: string;
  jokes: string[];
  stories: string[];
  news: NewsItem[];
  weather: WeatherInfo;
  fortune: FortuneInfo;
  suggestions: SuggestionInfo;
  lifeTips: LifeTip[];
  emotionalAdvice: EmotionalAdvice;
}

export interface NewsItem {
  category: 'economy' | 'life' | 'tech' | 'ai' | 'health' | 'business';
  title: string;
  content: string;
}

export interface WeatherInfo {
  city: string;
  temperature: string;
  weather: string;
  wind: string;
  humidity: string;
  aqi: string;
  tip: string;
}

export interface FortuneInfo {
  overall: 'great' | 'good' | 'normal' | 'caution';
  bazi: string;
  zodiac: string;
  luckyColor: string;
  luckyNumber: string;
  career: string;
  wealth: string;
  emotion: string;
  relationship: string;
  advice: string;
  improvement: string;
}

export interface SuggestionInfo {
  tasks: string[];
  tips: string[];
}

export interface CustomTask {
  id: string;
  content: string;
  completed: boolean;
  createdAt: string;
}

export interface LifeTip {
  category: 'kitchen' | 'cleaning' | 'beauty' | 'health' | 'finance' | 'study';
  title: string;
  content: string;
}

export interface EmotionalAdvice {
  prompt: string;
  response: string;
}

export interface Subscription {
  isMember: boolean;
  type: 'monthly' | 'yearly' | 'free_trial' | null;
  expireTime: string | null;
  isFreeTrial?: boolean;
}

export interface LoginResult {
  openid: string;
  isNewUser: boolean;
  freeTrialEndTime?: string | null;
}

export interface Favorite {
  id: string;
  type: 'encouragement' | 'joke' | 'story' | 'article' | 'news';
  content: string;
  title?: string;
  createTime: string;
}

export interface HistoryItem {
  id: string;
  type: 'encouragement' | 'joke' | 'story' | 'article' | 'news';
  content: string;
  title?: string;
  category?: string;
  visitTime: string;
}

export interface User {
  openid: string;
  nickname?: string;
  avatar?: string;
  birthDate?: string;
}

export interface CloudResponse<T = any> {
  code: number;
  message: string;
  data: T;
}