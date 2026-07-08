import React from 'react';
import { View } from '@tarojs/components';
import DoodleCard from '@/components/DoodleCard';
import styles from './index.module.scss';

export default function DoodlePage() {
  return (
    <View className={styles.page}>
      <DoodleCard />
    </View>
  );
}