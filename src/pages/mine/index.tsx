import React, { useState, useEffect } from 'react';
import { View, Text, Button, Input } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { useApp } from '@/store';
import { loginAsAdmin } from '@/utils/adminConfig';
import Card from '@/components/Card';
import AdBanner from '@/components/AdBanner';
import styles from './index.module.scss';

export default function MinePage() {
  const [activeTab, setActiveTab] = useState('favorites');
  const { subscription, favorites, history, removeFavorite, clearHistory } = useApp();
  const [loginVisible, setLoginVisible] = useState(false);
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const isMember = subscription.isMember;

  const handleAdminClick = () => {
    setLoginUsername('');
    setLoginPassword('');
    setLoginVisible(true);
  };

  const handleLoginSubmit = () => {
    if (!loginUsername.trim()) {
      Taro.showToast({ title: '请输入用户名', icon: 'none' });
      return;
    }
    if (!loginPassword.trim()) {
      Taro.showToast({ title: '请输入密码', icon: 'none' });
      return;
    }
    if (loginAsAdmin(loginUsername, loginPassword)) {
      setLoginVisible(false);
      Taro.showToast({ title: '登录成功', icon: 'success' });
      setTimeout(() => {
        Taro.navigateTo({ url: '/pages/admin/index' });
      }, 500);
    } else {
      Taro.showToast({ title: '用户名或密码错误', icon: 'none' });
    }
  };

  const handleVipClick = () => {
    Taro.navigateTo({ url: '/pages/subscribe/index' });
  };

  const handlePetClick = () => {
    Taro.navigateTo({ url: '/pages/pet/index' });
  };

  const handleClearHistory = () => {
    Taro.showModal({
      title: '提示',
      content: '确定要清空浏览历史吗？',
      success: (res) => {
        if (res.confirm) {
          clearHistory();
          Taro.showToast({ title: '已清空', icon: 'success' });
        }
      }
    });
  };

  const getTypeIcon = (type: string) => {
    const icons: Record<string, string> = {
      encouragement: '💪',
      joke: '😄',
      story: '📝',
      article: '📖',
      news: '📰'
    };
    return icons[type] || '📄';
  };

  const getTypeName = (type: string) => {
    const names: Record<string, string> = {
      encouragement: '语录',
      joke: '笑话',
      story: '故事',
      article: '短文',
      news: '资讯'
    };
    return names[type] || '其他';
  };

  const formatTime = (timeStr: string) => {
    const date = new Date(timeStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days === 0) {
      const hours = Math.floor(diff / (1000 * 60 * 60));
      if (hours === 0) {
        const minutes = Math.floor(diff / (1000 * 60));
        return minutes <= 0 ? '刚刚' : `${minutes}分钟前`;
      }
      return `${hours}小时前`;
    } else if (days === 1) {
      return '昨天';
    } else if (days < 7) {
      return `${days}天前`;
    }
    return date.toLocaleDateString('zh-CN');
  };

  return (
    <View className={styles.pageContainer}>
      <Card className={styles.userCard} padding="lg">
        <View className={styles.userAvatar}>
          <Text className={styles.avatarIcon}>👤</Text>
        </View>
        <View className={styles.userInfo}>
          <Text className={styles.userName}>暖心用户</Text>
          <Text className={styles.userLevel}>{isMember ? '✨ VIP会员' : '普通会员'}</Text>
        </View>
        <Button className={styles.vipButton} onClick={handleVipClick}>
          <Text>{isMember ? '管理会员' : '开通会员'}</Text>
        </Button>
      </Card>

      <Card className={styles.menuCard} padding="lg">
        <View className={styles.menuItem}>
          <Text className={styles.menuIcon}>❤️</Text>
          <Text className={styles.menuText}>我的收藏</Text>
          {favorites.length > 0 && (
            <Text className={styles.menuBadge}>{favorites.length}</Text>
          )}
          <Text className={styles.menuArrow}>›</Text>
        </View>
        <View className={styles.menuItem}>
          <Text className={styles.menuIcon}>📖</Text>
          <Text className={styles.menuText}>浏览历史</Text>
          {history.length > 0 && (
            <Text className={styles.menuBadge}>{history.length}</Text>
          )}
          <Text className={styles.menuArrow}>›</Text>
        </View>
        <View className={styles.menuItem} onClick={handlePetClick}>
          <Text className={styles.menuIcon}>🐾</Text>
          <Text className={styles.menuText}>我的宠物</Text>
          <Text className={styles.menuArrow}>›</Text>
        </View>
        <View className={styles.menuItem}>
          <Text className={styles.menuIcon}>⚙️</Text>
          <Text className={styles.menuText}>个人设置</Text>
          <Text className={styles.menuArrow}>›</Text>
        </View>
        <View className={styles.menuItem}>
          <Text className={styles.menuIcon}>💬</Text>
          <Text className={styles.menuText}>意见反馈</Text>
          <Text className={styles.menuArrow}>›</Text>
        </View>
        <View className={styles.menuItem} onClick={handleAdminClick}>
          <Text className={styles.menuIcon}>🛠️</Text>
          <Text className={styles.menuText}>管理员入口</Text>
          <Text className={styles.menuArrow}>›</Text>
        </View>
      </Card>

      <Card className={styles.contentCard} padding="lg">
        <View className={styles.tabs}>
          <Button 
            className={`${styles.tab} ${activeTab === 'favorites' ? styles.active : ''}`}
            onClick={() => setActiveTab('favorites')}
          >
            <Text>收藏 ({favorites.length})</Text>
          </Button>
          <Button 
            className={`${styles.tab} ${activeTab === 'history' ? styles.active : ''}`}
            onClick={() => setActiveTab('history')}
          >
            <Text>历史记录 ({history.length})</Text>
          </Button>
        </View>

        {activeTab === 'favorites' && (
          <>
            {favorites.length === 0 ? (
              <View className={styles.emptyState}>
                <Text className={styles.emptyIcon}>❤️</Text>
                <Text className={styles.emptyText}>暂无收藏内容</Text>
                <Text className={styles.emptyHint}>看到喜欢的内容，点击收藏按钮保存吧</Text>
              </View>
            ) : (
              <View className={styles.listContainer}>
                {favorites.map((item) => (
                  <View key={item.id} className={styles.listItem}>
                    <Text className={styles.itemIcon}>{getTypeIcon(item.type)}</Text>
                    <View className={styles.itemContent}>
                      <Text className={styles.itemTitle}>
                        {item.title || item.content.slice(0, 30)}{item.content.length > 30 ? '...' : ''}
                      </Text>
                      <View className={styles.itemMeta}>
                        <Text className={styles.itemType}>{getTypeName(item.type)}</Text>
                        <Text className={styles.itemTime}>{formatTime(item.createTime)}</Text>
                      </View>
                    </View>
                    <Button 
                      className={styles.deleteButton} 
                      onClick={() => removeFavorite(item.id)}
                    >
                      <Text>×</Text>
                    </Button>
                  </View>
                ))}
              </View>
            )}
          </>
        )}

        {activeTab === 'history' && (
          <>
            {history.length === 0 ? (
              <View className={styles.emptyState}>
                <Text className={styles.emptyIcon}>📖</Text>
                <Text className={styles.emptyText}>暂无浏览历史</Text>
                <Text className={styles.emptyHint}>浏览内容后会自动记录在这里</Text>
              </View>
            ) : (
              <>
                <View className={styles.listContainer}>
                  {history.map((item) => (
                    <View key={item.id} className={styles.listItem}>
                      <Text className={styles.itemIcon}>{getTypeIcon(item.type)}</Text>
                      <View className={styles.itemContent}>
                        <Text className={styles.itemTitle}>
                          {item.title || item.content.slice(0, 30)}{item.content.length > 30 ? '...' : ''}
                        </Text>
                        <View className={styles.itemMeta}>
                          <Text className={styles.itemType}>{getTypeName(item.type)}</Text>
                          <Text className={styles.itemTime}>{formatTime(item.visitTime)}</Text>
                        </View>
                      </View>
                    </View>
                  ))}
                </View>
                <Button className={styles.clearButton} onClick={handleClearHistory}>
                  <Text>清空历史记录</Text>
                </Button>
              </>
            )}
          </>
        )}
      </Card>

      {loginVisible && (
        <View className={styles.modalOverlay} onClick={() => setLoginVisible(false)}>
          <View className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <Text className={styles.modalIcon}>🔐</Text>
            <Text className={styles.modalTitle}>管理员登录</Text>
            <Text className={styles.modalDesc}>请输入账号密码进入后台</Text>
            <Input
              className={styles.modalInput}
              type="text"
              placeholder="用户名"
              value={loginUsername}
              onInput={(e) => setLoginUsername(e.detail.value)}
            />
            <Input
              className={styles.modalInput}
              type="password"
              placeholder="密码"
              value={loginPassword}
              onInput={(e) => setLoginPassword(e.detail.value)}
              onConfirm={handleLoginSubmit}
            />
            <View className={styles.modalButtons}>
              <Button className={styles.modalCancelBtn} onClick={() => setLoginVisible(false)}>
                取消
              </Button>
              <Button className={styles.modalConfirmBtn} onClick={handleLoginSubmit}>
                登录
              </Button>
            </View>
          </View>
        </View>
      )}

      <AdBanner />
    </View>
  );
}