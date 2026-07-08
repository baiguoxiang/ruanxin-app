import React from 'react';
import { View } from '@tarojs/components';
import EmotionalChatCard from '@/components/EmotionalChatCard';
import WishCard from '@/components/WishCard';
import ContentCard from '@/components/ContentCard';
import styles from './index.module.scss';

export default function EmotionPage() {
  const defaultEmotionalAdvice = {
    response: '你好呀！我是你的情感树洞，如果你有什么心事想倾诉，或者有什么困扰想聊聊，我都在这里听你说。无论是开心的事还是烦恼，我都会认真倾听，并给你温暖的回应。'
  };

  return (
    <View className={styles.pageContainer}>
      <ContentCard type="articles" />
      <EmotionalChatCard 
        emotionalAdvice={defaultEmotionalAdvice} 
        isLocked={false} 
        onUnlock={() => {}} 
      />
      <WishCard />
    </View>
  );
}