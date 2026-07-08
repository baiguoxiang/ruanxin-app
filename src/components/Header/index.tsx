import React from 'react';
import { View, Text } from '@tarojs/components';
import styles from './index.module.scss';

interface HeaderProps {
  onMemberClick: () => void;
}

export default function Header({ onMemberClick }: HeaderProps) {
  return (
    <View className={styles.header}>
      <View className={styles.headerContent}>
        <View className={styles.mascotRow}>
          <View className={styles.mascotItem}>
            <Text className={styles.mascotEmoji}>👩‍✈️</Text>
            <View className={styles.mascotBubble}>欢迎回来～</View>
          </View>
          <View className={styles.mascotItem}>
            <Text className={styles.mascotEmoji}>🤵</Text>
            <View className={styles.mascotBubble}>祝你开心！</View>
          </View>
        </View>
        <View className={styles.titleWrapper}>
          <Text className={styles.heartLeft}>💗</Text>
          <Text className={styles.headerTitle}>今日专属</Text>
          <Text className={styles.headerTitleAccent}>心陪伴</Text>
          <Text className={styles.heartRight}>💗</Text>
        </View>
        <View className={styles.sloganWrapper}>
          <Text className={styles.sloganIcon}>🌟</Text>
          <Text className={styles.sloganText}>用整个世界匿名陌生人的光，来照亮一个人幽暗的角落</Text>
          <Text className={styles.sloganIcon}>🌟</Text>
        </View>
        <View className={styles.privacyTips}>
          <Text className={styles.privacyIcon}>🔒</Text>
          <Text className={styles.privacyText}>这里是你专属的内心家园，所有数据只有你自己可见</Text>
        </View>
      </View>
      <View className={styles.memberButtons}>
        <View className={styles.memberButton} onClick={onMemberClick}>
          <Text className={styles.memberIcon}>👤</Text>
          <Text className={styles.memberText}>会员中心</Text>
        </View>
      </View>
    </View>
  );
}
