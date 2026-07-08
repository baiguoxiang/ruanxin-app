import React from 'react';
import { View } from '@tarojs/components';
import styles from './index.module.scss';

interface CardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
  padding?: 'sm' | 'md' | 'lg';
}

export default function Card({ title, children, className = '', padding = 'lg' }: CardProps) {
  const paddingClass = {
    sm: styles.paddingSm,
    md: styles.paddingMd,
    lg: styles.paddingLg
  }[padding];

  return (
    <View className={`${styles.card} ${paddingClass} ${className}`}>
      {title && <View className={styles.cardTitle}>{title}</View>}
      <View className={styles.cardContent}>{children}</View>
    </View>
  );
}