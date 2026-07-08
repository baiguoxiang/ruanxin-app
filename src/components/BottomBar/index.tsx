import React from 'react';
import { View, Text } from '@tarojs/components';
import styles from './index.module.scss';

interface BottomBarProps {
  onRefresh: () => void;
  onFavorites: () => void;
  isMember: boolean;
}

export default function BottomBar({ onRefresh, onFavorites, isMember }: BottomBarProps) {
  return (
    <View className={styles.bottomBar}>
      <View className={styles.barInner}>
        <View className={styles.refreshButton} onClick={onRefresh}>
          <Text className={styles.buttonIcon}>🔄</Text>
          <Text className={styles.buttonText}>{isMember ? '刷新今日内容' : '解锁全部内容'}</Text>
        </View>
        <View className={styles.divider} />
        <View className={styles.favoritesButton} onClick={onFavorites}>
          <Text className={styles.buttonIcon}>❤️</Text>
          <Text className={styles.buttonText}>我的收藏</Text>
        </View>
      </View>
    </View>
  );
}