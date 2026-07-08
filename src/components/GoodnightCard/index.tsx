import React, { useState, useEffect } from 'react';
import { View, Text } from '@tarojs/components';
import Card from '../Card';
import { getTodayGoodnight, goodnightList } from '@/data/goodnightDB';
import styles from './index.module.scss';

export default function GoodnightCard() {
  const [currentNight, setCurrentNight] = useState(getTodayGoodnight());

  useEffect(() => {
    const updateNight = () => {
      const now = new Date();
      const seed = now.getFullYear() * 10000 + (now.getMonth() + 1) * 100 + now.getDate();
      const index = seed % goodnightList.length;
      setCurrentNight(goodnightList[index]);
    };

    const getNextUpdateTime = () => {
      const now = new Date();
      const nextUpdate = new Date(now);
      nextUpdate.setHours(6, 0, 0, 0);
      if (now >= nextUpdate) {
        nextUpdate.setDate(nextUpdate.getDate() + 1);
      }
      return nextUpdate.getTime() - now.getTime();
    };

    const timer = setInterval(() => {
      updateNight();
    }, 60000);

    const dailyTimer = setTimeout(() => {
      updateNight();
      setInterval(() => {
        updateNight();
      }, 24 * 60 * 60 * 1000);
    }, getNextUpdateTime());

    return () => {
      clearInterval(timer);
      clearTimeout(dailyTimer);
    };
  }, []);

  return (
    <Card className={styles.goodnightCard} padding="lg">
      <View className={styles.cardHeader}>
        <Text className={styles.cardIcon}>🌙</Text>
        <Text className={styles.cardTitle}>晚安专区</Text>
        <Text className={styles.cardTime}>夜晚</Text>
      </View>
      <View className={styles.airHostessSection}>
        <View className={styles.airHostessWrapper}>
          <Text className={styles.airHostessEmoji}>👩‍✈️</Text>
          <View className={styles.airHostessBubble}>夜深了，好好休息～</View>
        </View>
      </View>
      <View className={styles.moodBadge}>
        <Text className={styles.moodText}>{currentNight.mood}</Text>
      </View>
      <View className={styles.goodnightContent}>
        <Text className={styles.goodnightText}>{currentNight.content}</Text>
      </View>
      <View className={styles.stars}>
        <Text className={styles.star}>✨</Text>
        <Text className={styles.star}>⭐</Text>
        <Text className={styles.star}>🌟</Text>
        <Text className={styles.star}>✨</Text>
        <Text className={styles.star}>⭐</Text>
      </View>
    </Card>
  );
}
