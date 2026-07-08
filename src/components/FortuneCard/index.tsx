import React from 'react';
import { View, Text } from '@tarojs/components';
import Card from '../Card';
import LockOverlay from '../LockOverlay';
import type { FortuneInfo } from '@/types';
import styles from './index.module.scss';

interface FortuneCardProps {
  fortune: FortuneInfo;
  isLocked: boolean;
  onUnlock: () => void;
}

const fortuneConfig: Record<string, { label: string; color: string; bgColor: string }> = {
  great: { label: '大吉', color: '#FF6B6B', bgColor: 'rgba(255, 107, 107, 0.1)' },
  good: { label: '小吉', color: '#52C41A', bgColor: 'rgba(82, 196, 26, 0.1)' },
  normal: { label: '平稳', color: '#7B68EE', bgColor: 'rgba(123, 104, 238, 0.1)' },
  caution: { label: '需谨慎', color: '#FF7D00', bgColor: 'rgba(255, 125, 0, 0.1)' }
};

export default function FortuneCard({ fortune, isLocked, onUnlock }: FortuneCardProps) {
  const config = fortuneConfig[fortune.overall] || fortuneConfig.normal;

  return (
    <Card className={styles.fortuneCard} padding="lg">
      <View className={styles.cardHeader}>
        <Text className={styles.cardIcon}>🌟</Text>
        <Text className={styles.cardTitle}>今日运程</Text>
      </View>
      {fortune.bazi && (
        <View className={styles.baziSection}>
          <Text className={styles.baziLabel}>八字命理</Text>
          <Text className={styles.baziValue}>{fortune.bazi}</Text>
          {fortune.zodiac && (
            <Text className={styles.zodiacValue}>🐾 {fortune.zodiac}座</Text>
          )}
        </View>
      )}
      <View className={styles.fortuneOverall} style={{ background: config.bgColor }}>
        <Text className={styles.overallLabel}>今日运势</Text>
        <Text className={styles.overallValue} style={{ color: config.color }}>
          {config.label}
        </Text>
      </View>
      <View className={styles.luckySection}>
        <View className={styles.luckyItem}>
          <Text className={styles.luckyIcon}>🎨</Text>
          <Text className={styles.luckyLabel}>幸运色</Text>
          <Text className={styles.luckyValue}>{fortune.luckyColor}</Text>
        </View>
        <View className={styles.luckyItem}>
          <Text className={styles.luckyIcon}>🔢</Text>
          <Text className={styles.luckyLabel}>幸运数字</Text>
          <Text className={styles.luckyValue}>{fortune.luckyNumber}</Text>
        </View>
      </View>
      <View className={styles.fortuneDetails}>
        <View className={styles.detailItem}>
          <Text className={styles.detailIcon}>💼</Text>
          <Text className={styles.detailLabel}>事业运</Text>
          <Text className={styles.detailText}>{fortune.career}</Text>
        </View>
        <View className={styles.detailItem}>
          <Text className={styles.detailIcon}>💰</Text>
          <Text className={styles.detailLabel}>财运</Text>
          <Text className={styles.detailText}>{fortune.wealth}</Text>
        </View>
        <View className={styles.detailItem}>
          <Text className={styles.detailIcon}>❤️</Text>
          <Text className={styles.detailLabel}>情绪运</Text>
          <Text className={styles.detailText}>{fortune.emotion}</Text>
        </View>
        <View className={styles.detailItem}>
          <Text className={styles.detailIcon}>👥</Text>
          <Text className={styles.detailLabel}>人际运</Text>
          <Text className={styles.detailText}>{fortune.relationship}</Text>
        </View>
      </View>
      <View className={styles.fortuneAdvice}>
        <Text className={styles.adviceIcon}>✨</Text>
        <Text className={styles.adviceText}>{fortune.advice}</Text>
      </View>
      <View className={styles.improvementSection}>
        <Text className={styles.improvementIcon}>💫</Text>
        <Text className={styles.improvementLabel}>改运建议</Text>
        <Text className={styles.improvementText}>{fortune.improvement}</Text>
      </View>
      {isLocked && <LockOverlay onClick={onUnlock} />}
    </Card>
  );
}