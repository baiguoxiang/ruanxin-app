import React, { useState, useEffect } from 'react';
import { View, Text } from '@tarojs/components';
import Card from '../Card';
import LockOverlay from '../LockOverlay';
import type { WeatherInfo } from '@/types';
import styles from './index.module.scss';

interface WeatherCardProps {
  weather: WeatherInfo;
  isMember: boolean;
  onUnlock: () => void;
}

const weatherDataByCity: Record<string, Partial<WeatherInfo>> = {
  '北京': { temperature: '26°C', weather: '多云', wind: '东南风3级', humidity: '65%', aqi: '45 优', tip: '今天天气舒适，适合出门散步或运动，记得做好防晒哦！' },
  '上海': { temperature: '28°C', weather: '晴', wind: '东风2级', humidity: '70%', aqi: '58 良', tip: '阳光明媚，紫外线较强，外出请做好防晒措施。' },
  '广州': { temperature: '32°C', weather: '阵雨', wind: '西南风4级', humidity: '85%', aqi: '65 良', tip: '午后可能有雷雨，出门记得带伞，注意防暑降温。' },
  '深圳': { temperature: '31°C', weather: '多云转晴', wind: '南风3级', humidity: '80%', aqi: '42 优', tip: '天气多变，早晚温差不大，适合户外活动。' },
  '杭州': { temperature: '27°C', weather: '阴', wind: '东北风2级', humidity: '75%', aqi: '52 良', tip: '阴天适合室内活动，记得保持室内通风。' },
  '成都': { temperature: '24°C', weather: '小雨', wind: '北风1级', humidity: '90%', aqi: '78 良', tip: '小雨绵绵，空气湿润，记得带雨具。' },
  '武汉': { temperature: '29°C', weather: '晴转多云', wind: '东南风3级', humidity: '68%', aqi: '62 良', tip: '天气晴朗，适合户外运动，但中午时分请注意避暑。' },
  '西安': { temperature: '25°C', weather: '晴', wind: '西北风2级', humidity: '45%', aqi: '85 良', tip: '天气干燥，请注意补充水分，防晒也要做好。' },
  '南京': { temperature: '28°C', weather: '多云', wind: '东风3级', humidity: '72%', aqi: '55 良', tip: '多云天气，体感舒适，适合外出游玩。' },
  '重庆': { temperature: '34°C', weather: '晴', wind: '南风2级', humidity: '60%', aqi: '72 良', tip: '天气炎热，请注意防暑降温，多喝凉茶。' },
  '天津': { temperature: '25°C', weather: '多云转晴', wind: '北风3级', humidity: '55%', aqi: '58 良', tip: '北风习习，体感舒适，适合户外活动。' },
  '苏州': { temperature: '27°C', weather: '晴', wind: '东风2级', humidity: '68%', aqi: '48 优', tip: '阳光明媚，适合园林游览，享受春日时光。' },
  '郑州': { temperature: '26°C', weather: '多云', wind: '西南风2级', humidity: '60%', aqi: '75 良', tip: '天气舒适，适合出行，但请注意空气质量。' },
  '长沙': { temperature: '28°C', weather: '阵雨', wind: '东南风3级', humidity: '82%', aqi: '52 良', tip: '午后有阵雨，出门记得带伞，天气闷热请注意防暑。' },
  '青岛': { temperature: '22°C', weather: '晴', wind: '海风4级', humidity: '65%', aqi: '35 优', tip: '海风习习，凉爽舒适，适合海边漫步。' },
  '东莞': { temperature: '30°C', weather: '多云', wind: '东南风3级', humidity: '80%', aqi: '60 良', tip: '天气闷热，请注意防暑降温，多喝水。' },
  '佛山': { temperature: '31°C', weather: '晴', wind: '南风2级', humidity: '78%', aqi: '55 良', tip: '阳光充足，适合户外活动，但请注意防晒。' },
  '厦门': { temperature: '26°C', weather: '多云', wind: '海风3级', humidity: '72%', aqi: '40 优', tip: '海风拂面，天气宜人，适合海边散步。' },
  '福州': { temperature: '28°C', weather: '晴', wind: '东风3级', humidity: '75%', aqi: '58 良', tip: '天气晴朗，适合出行，但中午较热请注意避暑。' },
  '昆明': { temperature: '22°C', weather: '晴', wind: '西南风2级', humidity: '55%', aqi: '35 优', tip: '春城昆明，气候宜人，适合外出游玩。' },
  '贵阳': { temperature: '20°C', weather: '阴', wind: '东风2级', humidity: '85%', aqi: '65 良', tip: '天气凉爽，但空气湿度较大，请注意防潮。' },
  '南宁': { temperature: '30°C', weather: '阵雨', wind: '东南风3级', humidity: '85%', aqi: '62 良', tip: '午后有阵雨，出门记得带伞，天气闷热。' },
  '合肥': { temperature: '27°C', weather: '晴', wind: '东风2级', humidity: '68%', aqi: '55 良', tip: '天气舒适，适合户外活动，享受美好时光。' },
  '济南': { temperature: '28°C', weather: '晴', wind: '西南风3级', humidity: '55%', aqi: '70 良', tip: '天气炎热，请注意防暑，多喝水。' },
  '沈阳': { temperature: '22°C', weather: '晴', wind: '北风3级', humidity: '45%', aqi: '52 良', tip: '北风微凉，天气晴朗，适合户外活动。' },
  '大连': { temperature: '23°C', weather: '晴', wind: '海风4级', humidity: '60%', aqi: '40 优', tip: '海风习习，凉爽舒适，适合海边游玩。' },
  '哈尔滨': { temperature: '18°C', weather: '晴', wind: '西北风3级', humidity: '40%', aqi: '45 优', tip: '天气凉爽，请注意增添衣物，早晚温差较大。' },
  '长春': { temperature: '20°C', weather: '多云', wind: '西南风2级', humidity: '50%', aqi: '50 良', tip: '多云天气，体感舒适，适合户外活动。' },
  '石家庄': { temperature: '26°C', weather: '晴', wind: '东南风2级', humidity: '55%', aqi: '80 良', tip: '天气炎热，请注意防晒，补充水分。' },
  '太原': { temperature: '24°C', weather: '多云', wind: '西北风3级', humidity: '50%', aqi: '72 良', tip: '天气舒适，但空气干燥，请注意保湿。' },
  '兰州': { temperature: '22°C', weather: '晴', wind: '东风2级', humidity: '40%', aqi: '65 良', tip: '天气干燥，请注意补充水分，防晒也要做好。' },
  '乌鲁木齐': { temperature: '28°C', weather: '晴', wind: '西北风4级', humidity: '35%', aqi: '55 良', tip: '天气炎热，风较大，请注意防晒和防风。' },
  '拉萨': { temperature: '18°C', weather: '晴', wind: '东风2级', humidity: '45%', aqi: '25 优', tip: '阳光充足，紫外线极强，请注意防晒和高原反应。' },
  '西宁': { temperature: '16°C', weather: '多云', wind: '东南风3级', humidity: '55%', aqi: '42 优', tip: '天气凉爽，请注意增添衣物，早晚温差较大。' },
  '银川': { temperature: '25°C', weather: '晴', wind: '西北风3级', humidity: '45%', aqi: '68 良', tip: '天气干燥，请注意补充水分，防晒也要做好。' },
  '呼和浩特': { temperature: '24°C', weather: '晴', wind: '西北风4级', humidity: '40%', aqi: '65 良', tip: '风较大，请注意防风，防晒也要做好。' },
};

const fallbackWeather: Partial<WeatherInfo> = {
  temperature: '24°C',
  weather: '晴',
  wind: '微风',
  humidity: '60%',
  aqi: '50 良',
  tip: '今天天气不错，适合保持好心情！'
};

const weatherConditions = ['晴', '多云', '阴', '小雨', '阵雨', '雷阵雨', '晴转多云', '多云转晴', '阴转晴', '小雨转晴'];
const weatherTips = [
  '今天天气舒适，适合出门散步或运动，记得做好防晒哦！',
  '阳光明媚，紫外线较强，外出请做好防晒措施。',
  '午后可能有雷雨，出门记得带伞，注意防暑降温。',
  '天气多变，早晚温差不大，适合户外活动。',
  '阴天适合室内活动，记得保持室内通风。',
  '小雨绵绵，空气湿润，记得带雨具。',
  '天气晴朗，适合户外运动，但中午时分请注意避暑。',
  '天气干燥，请注意补充水分，防晒也要做好。',
  '多云天气，体感舒适，适合外出游玩。',
  '天气炎热，请注意防暑降温，多喝凉茶。',
  '海风习习，凉爽舒适，适合海边漫步。',
  '今天天气不错，适合保持好心情！'
];

const getDailyWeatherVariation = () => {
  const now = new Date();
  const seed = now.getFullYear() * 10000 + (now.getMonth() + 1) * 100 + now.getDate();
  const conditionIndex = seed % weatherConditions.length;
  const tipIndex = seed % weatherTips.length;
  return {
    condition: weatherConditions[conditionIndex],
    tip: weatherTips[tipIndex]
  };
};

export default function WeatherCard({ weather, isMember, onUnlock }: WeatherCardProps) {
  const [localWeather, setLocalWeather] = useState<WeatherInfo>(weather);

  useEffect(() => {
    const fetchCityByIP = async () => {
      try {
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        const city = data.city || data.region || '北京';
        const cityWeather = weatherDataByCity[city] || fallbackWeather;
        const dailyVariation = getDailyWeatherVariation();
        
        setLocalWeather({
          city,
          temperature: cityWeather.temperature || weather.temperature,
          weather: dailyVariation.condition,
          wind: cityWeather.wind || weather.wind,
          humidity: cityWeather.humidity || weather.humidity,
          aqi: cityWeather.aqi || weather.aqi,
          tip: dailyVariation.tip
        });
      } catch (error) {
        console.log('IP定位失败，使用默认天气:', error);
      }
    };

    const fetchWeather = () => {
      fetchCityByIP();

      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            const cityList = [
              { name: '北京', lng: [115, 117], lat: [39, 41] },
              { name: '上海', lng: [120, 122], lat: [30, 32] },
              { name: '广州', lng: [113, 114], lat: [22, 24] },
              { name: '深圳', lng: [113, 114], lat: [22.5, 22.8] },
              { name: '杭州', lng: [119, 121], lat: [30, 31] },
              { name: '成都', lng: [103, 104], lat: [30, 31] },
              { name: '武汉', lng: [114, 115], lat: [30, 31] },
              { name: '西安', lng: [108, 109], lat: [34, 35] },
              { name: '南京', lng: [118, 119], lat: [31, 32] },
              { name: '重庆', lng: [106, 107], lat: [29, 30] },
              { name: '天津', lng: [116, 118], lat: [38.5, 39.5] },
              { name: '苏州', lng: [120.5, 121.5], lat: [31, 32] },
              { name: '郑州', lng: [113.5, 114.5], lat: [34.5, 35.5] },
              { name: '长沙', lng: [112.5, 113.5], lat: [28, 29] },
              { name: '青岛', lng: [120, 121], lat: [35.5, 36.5] },
              { name: '东莞', lng: [113.5, 114.5], lat: [22.8, 23.2] },
              { name: '佛山', lng: [112.5, 113.5], lat: [22.5, 23] },
              { name: '厦门', lng: [118.5, 119.5], lat: [24.3, 24.8] },
              { name: '福州', lng: [119, 120], lat: [25.5, 26.5] },
              { name: '昆明', lng: [102.5, 103.5], lat: [24.8, 25.3] },
              { name: '贵阳', lng: [106.5, 107.5], lat: [26.3, 26.8] },
              { name: '南宁', lng: [108.0, 109.0], lat: [22.4, 22.9] },
              { name: '合肥', lng: [117, 118], lat: [31.5, 32] },
              { name: '济南', lng: [116.5, 117.5], lat: [36.3, 36.8] },
              { name: '沈阳', lng: [123.5, 124.5], lat: [41.4, 41.9] },
              { name: '大连', lng: [121.5, 122.5], lat: [38.8, 39.3] },
              { name: '哈尔滨', lng: [126, 127], lat: [45.5, 46] },
              { name: '长春', lng: [125, 126], lat: [43.7, 44.2] },
              { name: '石家庄', lng: [114.3, 115.3], lat: [38, 38.5] },
              { name: '太原', lng: [112.2, 113.2], lat: [37.7, 38.2] },
              { name: '兰州', lng: [103.4, 104.4], lat: [35.8, 36.3] },
              { name: '乌鲁木齐', lng: [87.5, 88.5], lat: [43.7, 44.2] },
              { name: '拉萨', lng: [91, 92], lat: [29.4, 29.9] },
              { name: '西宁', lng: [101.4, 102.4], lat: [36.3, 36.8] },
              { name: '银川', lng: [106, 107], lat: [38.2, 38.7] },
              { name: '呼和浩特', lng: [111, 112], lat: [40.6, 41.1] },
            ];
            
            const matchedCity = cityList.find(c => 
              longitude > c.lng[0] && longitude < c.lng[1] && 
              latitude > c.lat[0] && latitude < c.lat[1]
            );
            
            if (matchedCity) {
              const cityWeather = weatherDataByCity[matchedCity.name] || fallbackWeather;
              const dailyVariation = getDailyWeatherVariation();
              setLocalWeather({
                city: matchedCity.name,
                temperature: cityWeather.temperature || weather.temperature,
                weather: dailyVariation.condition,
                wind: cityWeather.wind || weather.wind,
                humidity: cityWeather.humidity || weather.humidity,
                aqi: cityWeather.aqi || weather.aqi,
                tip: dailyVariation.tip
              });
            }
          },
          () => {},
          { timeout: 10000 }
        );
      }
    };

    fetchWeather();

    const getNextUpdateTime = () => {
      const now = new Date();
      const nextUpdate = new Date(now);
      nextUpdate.setHours(6, 0, 0, 0);
      if (now >= nextUpdate) {
        nextUpdate.setDate(nextUpdate.getDate() + 1);
      }
      return nextUpdate.getTime() - now.getTime();
    };

    const dailyTimer = setTimeout(() => {
      fetchWeather();
      setInterval(() => {
        fetchWeather();
      }, 24 * 60 * 60 * 1000);
    }, getNextUpdateTime());

    return () => {
      clearTimeout(dailyTimer);
    };
  }, [weather]);

  return (
    <Card className={styles.weatherCard} padding="lg">
      <View className={styles.cardHeader}>
        <Text className={styles.cardIcon}>🌤️</Text>
        <Text className={styles.cardTitle}>本地天气</Text>
      </View>
      <View className={styles.weatherMain}>
        <Text className={styles.cityName}>{localWeather.city}</Text>
        <View className={styles.weatherInfo}>
          <Text className={styles.temperature}>{localWeather.temperature}</Text>
          <Text className={styles.weatherText}>{localWeather.weather}</Text>
        </View>
      </View>
      {isMember && (
        <>
          <View className={styles.weatherDetails}>
            <View className={styles.detailItem}>
              <Text className={styles.detailIcon}>💨</Text>
              <Text className={styles.detailText}>{localWeather.wind}</Text>
            </View>
            <View className={styles.detailItem}>
              <Text className={styles.detailIcon}>💧</Text>
              <Text className={styles.detailText}>{localWeather.humidity}</Text>
            </View>
            <View className={styles.detailItem}>
              <Text className={styles.detailIcon}>🌿</Text>
              <Text className={styles.detailText}>{localWeather.aqi}</Text>
            </View>
          </View>
          <View className={styles.weatherTip}>
            <Text className={styles.tipIcon}>💡</Text>
            <Text className={styles.tipText}>{localWeather.tip}</Text>
          </View>
        </>
      )}
      {!isMember && <LockOverlay onClick={onUnlock} />}
    </Card>
  );
}