import React from 'react';
import { View } from '@tarojs/components';
import ContentCard from '@/components/ContentCard';
import WhiteNoiseCard from '@/components/WhiteNoiseCard';
import EncouragementCard from '@/components/EncouragementCard';
import FortuneCard from '@/components/FortuneCard';
import { getDailyFortune } from '@/data/fortuneDB';
import styles from './index.module.scss';

export default function HappyPage() {
  const fortune = getDailyFortune();

  return (
    <View className={styles.pageContainer}>
      <EncouragementCard />
      <ContentCard type="jokes" />
      <FortuneCard fortune={fortune} isLocked={false} onUnlock={() => {}} />
      <WhiteNoiseCard />
    </View>
  );
}