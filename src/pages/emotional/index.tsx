import React from 'react';
import Taro from '@tarojs/taro';
import { View, Text, Button } from '@tarojs/components';
import EmotionalChatCard from '@/components/EmotionalChatCard';
import styles from './index.module.scss';
import type { EmotionalAdvice } from '@/types';

interface EmotionalPageProps {
  emotionalAdvice?: EmotionalAdvice;
}

export default function EmotionalPage({ emotionalAdvice }: EmotionalPageProps) {
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
        <Text className={styles.headerTitle}>情感树洞</Text>
        <View className={styles.placeholder}></View>
      </View>
      <View className={styles.content}>
        <EmotionalChatCard
          emotionalAdvice={emotionalAdvice || { response: '你好，我是你的情感树洞。有什么心事都可以跟我说。' }}
          isLocked={false}
          onUnlock={handleUnlock}
        />
      </View>
    </View>
  );
}