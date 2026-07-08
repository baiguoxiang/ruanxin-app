import React, { useState, useEffect } from 'react';
import { View, Text, Button } from '@tarojs/components';
import Card from '../Card';
import { getTodayEncouragement, encouragementList } from '@/data/encouragementDB';
import styles from './index.module.scss';

export default function EncouragementCard() {
  const [currentQuote, setCurrentQuote] = useState(getTodayEncouragement());
  const [showSaveTip, setShowSaveTip] = useState(false);

  useEffect(() => {
    const updateQuote = () => {
      const now = new Date();
      const seed = now.getFullYear() * 10000 + (now.getMonth() + 1) * 100 + now.getDate();
      const index = seed % encouragementList.length;
      setCurrentQuote(encouragementList[index]);
    };

    const getNextUpdateTime = () => {
      const now = new Date();
      const nextUpdate = new Date(now);
      nextUpdate.setHours(6, 0, 0, 0);
      if (now >= nextUpdate) {
        nextUpdate.setDate(nextUpdate.getDate() + 1);
      }
      return nextUpdate.getTime() - now.getTime();
    };

    const timer = setInterval(() => {
      updateQuote();
    }, 60000);

    const dailyTimer = setTimeout(() => {
      updateQuote();
      setInterval(() => {
        updateQuote();
      }, 24 * 60 * 60 * 1000);
    }, getNextUpdateTime());

    return () => {
      clearInterval(timer);
      clearTimeout(dailyTimer);
    };
  }, []);

  const saveQuote = () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    canvas.width = 600;
    canvas.height = 400;
    
    const gradient = ctx.createLinearGradient(0, 0, 600, 400);
    gradient.addColorStop(0, '#FF9A9E');
    gradient.addColorStop(1, '#FECFEF');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 600, 400);
    
    ctx.fillStyle = 'rgba(255,255,255,0.3)';
    ctx.beginPath();
    ctx.arc(100, 100, 80, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(500, 300, 60, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 28px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('每日打气', 300, 80);
    
    ctx.font = '24px Arial';
    ctx.fillStyle = '#333';
    const lines = [];
    let currentLine = '';
    const words = currentQuote.content.split('');
    for (const word of words) {
      const testLine = currentLine + word;
      const metrics = ctx.measureText(testLine);
      if (metrics.width > 450 && currentLine) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    }
    lines.push(currentLine);
    
    let y = 200;
    lines.forEach(line => {
      ctx.fillText(line, 300, y);
      y += 40;
    });
    
    if (currentQuote.author) {
      ctx.font = 'italic 20px Arial';
      ctx.fillStyle = '#666';
      ctx.fillText(`— ${currentQuote.author}`, 300, y + 30);
    }
    
    const link = document.createElement('a');
    link.download = `打气语录_${new Date().toISOString().split('T')[0]}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
    
    setShowSaveTip(true);
    setTimeout(() => setShowSaveTip(false), 2000);
  };

  return (
    <Card className={styles.encouragementCard} padding="lg">
      <View className={styles.cardHeader}>
        <Text className={styles.cardIcon}>💪</Text>
        <Text className={styles.cardTitle}>每日打气语录</Text>
        <Text className={styles.cardDate}>{new Date().toLocaleDateString('zh-CN', { month: 'long', day: 'numeric' })}</Text>
      </View>
      <View className={styles.handsomeGuySection}>
        <View className={styles.handsomeGuyWrapper}>
          <Text className={styles.handsomeGuyEmoji}>🤵</Text>
          <View className={styles.handsomeGuyBubble}>加油！你最棒～</View>
        </View>
      </View>
      <View className={styles.quoteContent}>
        <Text className={styles.quoteText}>"{currentQuote.content}"</Text>
        {currentQuote.author && (
          <Text className={styles.quoteAuthor}>— {currentQuote.author}</Text>
        )}
      </View>
      <View className={styles.cardActions}>
        <Button className={styles.saveButton} onClick={saveQuote}>
          <Text className={styles.buttonIcon}>💾</Text>
          <Text className={styles.buttonText}>保存图片</Text>
        </Button>
      </View>
      {showSaveTip && (
        <View className={styles.saveTip}>
          <Text>✅ 已保存到相册</Text>
        </View>
      )}
    </Card>
  );
}
