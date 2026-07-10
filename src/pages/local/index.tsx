import React from 'react';
import { View } from '@tarojs/components';
import LocalNewsCard from '@/components/LocalNewsCard';
import ContentCard from '@/components/ContentCard';
import WeatherCard from '@/components/WeatherCard';
import styles from './index.module.scss';

export default function LocalPage() {
  const mockWeather = {
    city: '我的城市',
    temperature: '24°C',
    weather: '晴',
    wind: '微风',
    humidity: '60%',
    aqi: '50 良',
    tip: '今天天气不错，适合保持好心情！'
  };

  return (
    <View className={styles.pageContainer}>
      <WeatherCard 
        weather={mockWeather} 
        isMember={true} 
        onUnlock={() => {}} 
      />
      <LocalNewsCard />
      <ContentCard type="news" />
    </View>
  );
}