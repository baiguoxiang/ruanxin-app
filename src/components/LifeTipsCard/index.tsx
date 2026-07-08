import React from 'react';
import { View, Text } from '@tarojs/components';
import Card from '../Card';
import LockOverlay from '../LockOverlay';
import type { LifeTip } from '@/types';
import { getDailyItems } from '@/utils/dailyRandom';
import styles from './index.module.scss';

interface LifeTipsCardProps {
  tips: LifeTip[];
  isLocked: boolean;
  onUnlock: () => void;
}

const categoryIcons: Record<string, string> = {
  kitchen: '🍳',
  cleaning: '🧹',
  beauty: '💄',
  health: '💊',
  finance: '💰',
  study: '📚'
};

export default function LifeTipsCard({ tips, isLocked, onUnlock }: LifeTipsCardProps) {
  const dailyTips = getDailyItems(tips, 3);

  return (
    <Card className={styles.lifeTipsCard} padding="lg">
      <View className={styles.cardHeader}>
        <Text className={styles.cardIcon}>💡</Text>
        <Text className={styles.cardTitle}>生活小窍门</Text>
        <Text className={styles.cardDate}>{new Date().toLocaleDateString('zh-CN')}</Text>
      </View>
      <View className={styles.tipsList}>
        {dailyTips.map((tip, index) => (
          <View key={index} className={styles.tipItem}>
            <Text className={styles.tipIcon}>{categoryIcons[tip.category] || '💡'}</Text>
            <View className={styles.tipContent}>
              <Text className={styles.tipTitle}>{tip.title}</Text>
              <Text className={styles.tipDesc}>{tip.content}</Text>
            </View>
          </View>
        ))}
      </View>
      {isLocked && <LockOverlay onClick={onUnlock} />}
    </Card>
  );
}