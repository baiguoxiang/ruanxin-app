import React from 'react';
import { View, Text } from '@tarojs/components';
import styles from './index.module.scss';

interface ActionButtonProps {
  icon: string;
  text: string;
  onClick: () => void;
  active?: boolean;
}

export default function ActionButton({ icon, text, onClick, active = false }: ActionButtonProps) {
  return (
    <View className={`${styles.button} ${active ? styles.active : ''}`} onClick={onClick}>
      <Text className={styles.icon}>{icon}</Text>
      <Text className={styles.text}>{text}</Text>
    </View>
  );
}