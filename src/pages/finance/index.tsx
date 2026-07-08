import React from 'react';
import Taro from '@tarojs/taro';
import { View, Text, Button } from '@tarojs/components';
import FinanceCard from '@/components/FinanceCard';
import styles from './index.module.scss';
import type { FinancialAdvice } from '@/types';

interface FinancePageProps {
  financialAdvice?: FinancialAdvice;
}

export default function FinancePage({ financialAdvice }: FinancePageProps) {
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
        <Text className={styles.headerTitle}>财务管家</Text>
        <View className={styles.placeholder}></View>
      </View>
      <View className={styles.content}>
        <FinanceCard
          financialAdvice={financialAdvice || { response: '欢迎来到财务管家。告诉我你的财务状况，我来帮你分析。' }}
          isLocked={false}
          onUnlock={handleUnlock}
        />
      </View>
    </View>
  );
}