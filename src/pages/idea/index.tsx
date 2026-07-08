import React from 'react';
import Taro from '@tarojs/taro';
import { View, Text, Button } from '@tarojs/components';
import IdeaCard from '@/components/IdeaCard';
import styles from './index.module.scss';

export default function IdeaPage() {
  const handleBack = () => {
    Taro.navigateBack();
  };

  const handleUnlock = () => {
    Taro.navigateTo({ url: '/pages/subscribe/index' });
  };

  return (
    <View className={styles.page}>
      <View className={styles.header}>
        <Button className={styles.backButton} onClick={handleBack}>
          <Text className={styles.backIcon}>←</Text>
        </Button>
        <Text className={styles.headerTitle}>创意灵感手札</Text>
        <View className={styles.placeholder}></View>
      </View>
      <View className={styles.content}>
        <IdeaCard isLocked={false} onUnlock={handleUnlock} />
      </View>
    </View>
  );
}