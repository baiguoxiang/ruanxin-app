import React from 'react';
import { View, Text } from '@tarojs/components';
import Card from '../Card';
import LockOverlay from '../LockOverlay';
import type { NewsItem } from '@/types';
import styles from './index.module.scss';

interface NewsCardProps {
  news: NewsItem[];
  isLocked: boolean;
  onUnlock: () => void;
}

const categoryConfig: Record<string, { icon: string; label: string; color: string; bgColor: string }> = {
  economy: { icon: '�', label: '经济', color: '#FF6B6B', bgColor: 'rgba(255, 107, 107, 0.15)' },
  life: { icon: '🏠', label: '生活', color: '#52C41A', bgColor: 'rgba(82, 196, 26, 0.15)' },
  tech: { icon: '�', label: '科技', color: '#7B68EE', bgColor: 'rgba(123, 104, 238, 0.15)' },
  ai: { icon: '�', label: 'AI', color: '#FF7D00', bgColor: 'rgba(255, 125, 0, 0.15)' },
  health: { icon: '🍎', label: '健康', color: '#00B42A', bgColor: 'rgba(0, 180, 42, 0.15)' },
  business: { icon: '💼', label: '企业', color: '#1677FF', bgColor: 'rgba(22, 119, 255, 0.15)' }
};

export default function NewsCard({ news, isLocked, onUnlock }: NewsCardProps) {
  return (
    <Card className={styles.newsCard} padding="lg">
      <View className={styles.cardHeader}>
        <Text className={styles.cardIcon}>📰</Text>
        <Text className={styles.cardTitle}>今日多领域资讯</Text>
      </View>
      <View className={styles.newsList}>
        {news.map((item, index) => {
          const config = categoryConfig[item.category] || { icon: '📝', label: '资讯', color: '#666' };
          return (
            <View key={index} className={styles.newsItem}>
              <View className={styles.newsHeader}>
                <View className={styles.iconWrapper} style={{ background: config.bgColor }}>
                  <Text className={styles.newsIcon}>{config.icon}</Text>
                </View>
                <Text className={styles.newsCategory} style={{ color: config.color, background: config.bgColor }}>
                  {config.label}
                </Text>
              </View>
              <Text className={styles.newsContent}>{item.content}</Text>
            </View>
          );
        })}
      </View>
      {isLocked && <LockOverlay onClick={onUnlock} />}
    </Card>
  );
}