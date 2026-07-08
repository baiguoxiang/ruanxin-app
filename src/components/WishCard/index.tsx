import React, { useState, useEffect } from 'react';
import { View, Text, Button, Textarea } from '@tarojs/components';
import Card from '../Card';
import { getStoredWishes, saveWish, likeWish, type Wish } from '@/data/wishesDB';
import styles from './index.module.scss';

export default function WishCard() {
  const [wishes, setWishes] = useState<Wish[]>(getStoredWishes());
  const [newWish, setNewWish] = useState('');
  const [showTip, setShowTip] = useState('');

  useEffect(() => {
    setWishes(getStoredWishes());
  }, []);

  const handleSubmit = () => {
    if (!newWish.trim()) {
      setShowTip('请输入您的心愿✨');
      setTimeout(() => setShowTip(''), 2000);
      return;
    }
    
    const negativeWords = [
      '难过', '伤心', '痛苦', '绝望', '讨厌', '恨', '死', '滚', '骂', '烦',
      '难受', '失望', '崩溃', '焦虑', '抑郁', '愤怒', '悲伤', '哭泣',
      '孤独', '无助', '害怕', '恐惧', '紧张', '不安', '烦躁', '郁闷',
      '嫌弃', '鄙视', '嘲笑', '讽刺', '挖苦', '羞辱', '攻击', '伤害',
      '垃圾', '废物', '没用', '失败', '完蛋', '糟糕', '恶心', '讨厌',
      '去死', '跳楼', '自杀', '杀人', '暴力', '血腥', '恐怖', '惊悚'
    ];
    const hasNegative = negativeWords.some(word => newWish.includes(word));
    
    if (hasNegative) {
      setShowTip('💝 这里是温暖的许愿池，请留下正能量的心愿');
      setTimeout(() => setShowTip(''), 3000);
      return;
    }
    
    const positiveWords = ['爱', '幸福', '快乐', '希望', '梦想', '祝福', '感恩', '温暖', '美好', '加油', '努力', '坚持', '相信', '自信', '阳光', '微笑'];
    const hasPositive = positiveWords.some(word => newWish.includes(word));
    
    saveWish(newWish.trim());
    setWishes(getStoredWishes());
    setNewWish('');
    setShowTip(hasPositive ? '✨ 温暖的心愿，会被世界温柔以待' : '✅ 心愿已发布');
    setTimeout(() => setShowTip(''), 2000);
  };

  const handleLike = (id: string) => {
    likeWish(id);
    setWishes(getStoredWishes());
  };

  return (
    <Card className={styles.wishCard} padding="lg">
      <View className={styles.cardHeader}>
        <Text className={styles.cardIcon}>🎋</Text>
        <Text className={styles.cardTitle}>许愿留言板</Text>
      </View>
      
      <View className={styles.inputArea}>
        <Textarea
          className={styles.wishInput}
          placeholder="写下你的心愿或祝福...✨"
          value={newWish}
          onInput={(e) => setNewWish(e.detail.value)}
          maxlength={100}
        />
        <Button className={styles.submitButton} onClick={handleSubmit}>
          <Text>发送</Text>
        </Button>
      </View>
      
      {showTip && (
        <View className={styles.tipMessage}>
          <Text>{showTip}</Text>
        </View>
      )}
      
      <View className={styles.wishesList}>
        {wishes.map((wish) => (
          <View key={wish.id} className={styles.wishItem}>
            <Text className={styles.wishContent}>{wish.content}</Text>
            <View className={styles.wishFooter}>
              <Text className={styles.wishDate}>{wish.createdAt}</Text>
              <Button className={styles.likeButton} onClick={() => handleLike(wish.id)}>
                <Text>❤️ {wish.likes}</Text>
              </Button>
            </View>
          </View>
        ))}
      </View>
    </Card>
  );
}