export interface WhiteNoise {
  id: string;
  title: string;
  category: string;
  icon: string;
  audioUrl: string;
}

export const whiteNoiseList: WhiteNoise[] = [
  {
    id: '1',
    title: '雨声',
    category: '自然',
    icon: '🌧️',
    audioUrl: 'http://rainsoundsforsleeping.com/audio/rain-base.mp3'
  },
  {
    id: '2',
    title: '海浪',
    category: '自然',
    icon: '🌊',
    audioUrl: 'https://happysoulmusic.com/wp-content/grand-media/audio/Zen-Ocean-Waves-Ocean-Waves-Ambience-Water_Sound_Effects.mp3'
  },
  {
    id: '3',
    title: '森林',
    category: '自然',
    icon: '🌲',
    audioUrl: 'http://klassikaknigi.info/til/30/dozhd-v-lesu.mp3'
  },
  {
    id: '4',
    title: '溪流',
    category: '自然',
    icon: '💧',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3'
  },
  {
    id: '5',
    title: '鸟鸣',
    category: '自然',
    icon: '🐦',
    audioUrl: 'http://klassikaknigi.info/til/30/letniy-dozhd.mp3'
  },
  {
    id: '6',
    title: '冥想',
    category: '音乐',
    icon: '🧘',
    audioUrl: 'http://klassikaknigi.info/til/30/raskaty-groma-i-tihiy-dozhd.mp3'
  },
  {
    id: '7',
    title: '钢琴',
    category: '音乐',
    icon: '🎹',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'
  },
  {
    id: '8',
    title: '吉他',
    category: '音乐',
    icon: '🎸',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3'
  },
];

export const noiseCategories = ['全部', '自然', '音乐'];