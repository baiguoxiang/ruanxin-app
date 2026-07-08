import React from 'react';
import { View, Text } from '@tarojs/components';
import styles from './index.module.scss';

interface LockOverlayProps {
  onClick: () => void;
}

export default function LockOverlay({ onClick }: LockOverlayProps) {
  return (
    <View className={styles.overlay} onClick={onClick}>
      <View className={styles.lockIcon}>🔒</View>
      <Text className={styles.lockText}>开通会员解锁</Text>
      <View className={styles.lockButton}>
        <Text className={styles.lockButtonText}>立即开通</Text>
      </View>
    </View>
  );
}