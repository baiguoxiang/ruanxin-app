import React from 'react';
import { View, Text } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { useApp } from '@/store';
import type { Favorite } from '@/types';
import styles from './index.module.scss';

export default function MemberPage() {
  const { subscription, favorites, removeFavorite } = useApp();

  const isMember = subscription.isMember;
  const memberType = subscription.type;
  const expireTime = subscription.expireTime;

  const formatExpireTime = (time: string | null) => {
    if (!time) return '';
    const date = new Date(time);
    return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
  };

  const getMemberStatusText = () => {
    if (!isMember) return '非会员';
    if (subscription.isFreeTrial || memberType === 'free_trial') return '免费试用会员';
    return memberType === 'monthly' ? '月卡会员' : '年卡会员';
  };

  const getMemberBadgeClass = () => {
    if (!isMember) return `${styles.statusBadge} ${styles.nonMemberBadge}`;
    if (subscription.isFreeTrial || memberType === 'free_trial') return `${styles.statusBadge} ${styles.freeTrialBadge}`;
    return styles.statusBadge;
  };

  const getTypeLabel = (type: Favorite['type']) => {
    const labels: Record<Favorite['type'], string> = {
      encouragement: '暖心鼓励',
      joke: '趣味笑话',
      story: '励志故事'
    };
    return labels[type];
  };

  const handleRenew = () => {
    Taro.navigateTo({ url: '/pages/subscribe/index' });
  };

  const handleDeleteFavorite = (id: string) => {
    Taro.showModal({
      title: '确认删除',
      content: '确定要删除这条收藏吗？',
      success: (res) => {
        if (res.confirm) {
          removeFavorite(id);
          Taro.showToast({ title: '已删除', icon: 'success' });
        }
      }
    });
  };

  const handleGoHome = () => {
    Taro.switchTab({ url: '/pages/home/index' });
  };

  const faqList = [
    {
      question: '订阅时长如何计算？',
      answer: '月卡会员订阅后即时生效，有效期30天；年卡会员有效期365天。续费后时长自动叠加。'
    },
    {
      question: '内容刷新规则是什么？',
      answer: '每日零点自动重置所有内容，次日打开小程序即可查看全新专属内容。会员用户可随时手动刷新。'
    },
    {
      question: '会员权限有哪些？',
      answer: '会员用户可查看全部8大板块完整内容，无限次刷新，无收藏数量限制。免费用户仅可查看1条暖心鼓励。'
    },
    {
      question: '如何切换套餐？',
      answer: '在会员中心点击续费按钮，可选择月卡或年卡套餐进行切换，新套餐即时生效。'
    }
  ];

  return (
    <View className={styles.page}>
      <View className={styles.header}>
        <View className={styles.userAvatar}>👤</View>
        <Text className={styles.userName}>亲爱的用户</Text>
        <Text className={styles.userId}>ID: {subscription.isMember ? 'VIP' : 'GUEST'}</Text>
      </View>
      <View className={styles.content}>
        <View className={styles.statusCard}>
          <View className={styles.statusHeader}>
            <View className={styles.statusIcon}>
              {isMember ? '🌟' : '⭐'}
            </View>
            <View className={styles.statusInfo}>
              <Text className={styles.statusTitle}>{getMemberStatusText()}</Text>
              <Text className={getMemberBadgeClass()}>{isMember ? '已开通' : '未开通'}</Text>
            </View>
          </View>
          {isMember && expireTime && (
            <Text className={styles.statusExpire}>会员有效期至：{formatExpireTime(expireTime)}</Text>
          )}
          <View className={styles.renewButton} onClick={handleRenew}>
            <Text className={styles.renewText}>
              {isMember ? '续费会员' : '立即开通会员'}
            </Text>
          </View>
        </View>

        <View className={styles.section}>
          <Text className={styles.sectionTitle}>我的收藏</Text>
          <View className={styles.favoritesList}>
            {favorites.length === 0 ? (
              <View className={styles.emptyFavorites}>
                <Text className={styles.emptyIcon}>📭</Text>
                <Text className={styles.emptyText}>暂无收藏内容</Text>
                <Text className={styles.emptyText} style={{ fontSize: '24rpx' }}>
                  {isMember ? '在首页点击收藏按钮即可收藏喜欢的内容' : '开通会员后可收藏更多内容'}
                </Text>
              </View>
            ) : (
              favorites.map((item) => (
                <View key={item.id} className={styles.favoriteItem}>
                  <View className={styles.favoriteHeader}>
                    <Text className={styles.favoriteType}>{getTypeLabel(item.type)}</Text>
                    <Text className={styles.favoriteDelete} onClick={() => handleDeleteFavorite(item.id)}>
                      删除
                    </Text>
                  </View>
                  <Text className={styles.favoriteContent}>{item.content}</Text>
                </View>
              ))
            )}
          </View>
        </View>

        <View className={styles.section}>
          <Text className={styles.sectionTitle}>会员常见问题</Text>
          <View className={styles.faqList}>
            {faqList.map((item, index) => (
              <View key={index} className={styles.faqItem}>
                <Text className={styles.faqQuestion}>{item.question}</Text>
                <Text className={styles.faqAnswer}>{item.answer}</Text>
              </View>
            ))}
          </View>
        </View>

        <View className={styles.section}>
          <View className={styles.menuList}>
            <View className={styles.menuItem} onClick={handleGoHome}>
              <Text className={styles.menuIcon}>🏠</Text>
              <Text className={styles.menuText}>返回首页</Text>
              <Text className={styles.menuArrow}>›</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}