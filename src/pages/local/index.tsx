import React, { useState, useEffect } from 'react';
import { View, Text } from '@tarojs/components';
import LocalNewsCard from '@/components/LocalNewsCard';
import ContentCard from '@/components/ContentCard';
import WeatherCard from '@/components/WeatherCard';
import { getCurrentCity } from '@/utils/location';
import styles from './index.module.scss';

export default function LocalPage() {
  const [city, setCity] = useState('获取中...');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getCurrentCity().then(cityName => {
      setCity(cityName);
      setIsLoading(false);
    }).catch(() => {
      setCity('北京');
      setIsLoading(false);
    });
  }, []);

  const mockWeather = {
    city: city,
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
      {isLoading && (
        <View className={styles.loadingContainer}>
          <Text className={styles.loadingText}>正在定位您的城市...</Text>
        </View>
      )}
      <LocalNewsCard city={city} />
      <ContentCard type="news" />
    </View>
  );
}