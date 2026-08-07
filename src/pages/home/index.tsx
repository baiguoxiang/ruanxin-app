import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Input, Button } from '@tarojs/components';
import Taro, { usePullDownRefresh } from '@tarojs/taro';
import { useApp } from '@/store';
import { callFunction } from '@/services/cloud';
import Header from '@/components/Header';
import Card from '@/components/Card';
import ContentCenterCard from '@/components/ContentCard';
import WeatherCard from '@/components/WeatherCard';
import FortuneCard from '@/components/FortuneCard';
import SuggestionsCard from '@/components/SuggestionsCard';
import LifeTipsCard from '@/components/LifeTipsCard';
import GoodnightCard from '@/components/GoodnightCard';
import EmotionalChatCard from '@/components/EmotionalChatCard';
import WishCard from '@/components/WishCard';
import IdeaCard from '@/components/IdeaCard';
import FinanceCard from '@/components/FinanceCard';
import LocalNewsCard from '@/components/LocalNewsCard';
import WhiteNoiseCard from '@/components/WhiteNoiseCard';
import EmotionFirstAidCard from '@/components/EmotionFirstAidCard';
import ParallelLifeCard from '@/components/ParallelLifeCard';
import CelebrationCard from '@/components/CelebrationCard';
import LonelinessCard from '@/components/LonelinessCard';
import SelfDiscoveryCard from '@/components/SelfDiscoveryCard';
import WorldCollectionCard from '@/components/WorldCollectionCard';
import DailyLifeNewsCard from '@/components/DailyLifeNewsCard';
import PetPage from '@/pages/pet/index';
import type { DailyContent, Favorite, LoginResult } from '@/types';
import { getTodayEncouragement } from '@/data/encouragementDB';
import styles from './index.module.scss';
import generateDefaultContent from '@/data/generateContent';

const AUTO_UPDATE_HOUR = 6;
const AUTO_UPDATE_MINUTE = 0;

interface FeatureItem {
  id: string;
  icon: string;
  title: string;
  subtitle: string;
  gradient: string;
  isMemberOnly: boolean;
}

const FEATURES: FeatureItem[] = [
  {
    id: 'firstaid',
    icon: '🩹',
    title: '情绪急救箱',
    subtitle: '深夜崩溃时的避风港',
    gradient: 'linear-gradient(135deg, #FF9A9E 0%, #FECFef 100%)',
    isMemberOnly: false
  },
  {
    id: 'parallel',
    icon: '📖',
    title: '平行人生',
    subtitle: '探索不同人生可能性',
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    isMemberOnly: false
  },
  {
    id: 'celebration',
    icon: '🎊',
    title: '微小庆祝',
    subtitle: '为每一个小胜利欢呼',
    gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    isMemberOnly: false
  },
  {
    id: 'emotional',
    icon: '💬',
    title: '情感树洞',
    subtitle: '倾诉心声，温暖陪伴',
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    isMemberOnly: false
  },
  {
    id: 'loneliness',
    icon: '🌌',
    title: '孤独分级回应',
    subtitle: '看见孤独，温暖陪伴',
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    isMemberOnly: false
  },
  {
    id: 'selfdiscovery',
    icon: '🔮',
    title: '重新认识你',
    subtitle: '发现真实的自己',
    gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    isMemberOnly: false
  },
  {
    id: 'worldcollection',
    icon: '🌟',
    title: '人间值得收藏夹',
    subtitle: '收集人间真实温暖',
    gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    isMemberOnly: false
  },
  {
    id: 'pet',
    icon: '🐾',
    title: '我的宠物',
    subtitle: '治愈养成，喂养成长',
    gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    isMemberOnly: false
  },
  {
    id: 'jokes',
    icon: '😄',
    title: '笑话大全',
    subtitle: '开心一刻，笑口常开',
    gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    isMemberOnly: false
  },
  {
    id: 'news',
    icon: '🏙️',
    title: '我的城市',
    subtitle: '本地天气与资讯',
    gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    isMemberOnly: false
  },
  {
    id: 'finance',
    icon: '💰',
    title: '财务管家',
    subtitle: '智能记账，理性消费',
    gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    isMemberOnly: true
  },
  {
    id: 'idea',
    icon: '💡',
    title: '创意灵感',
    subtitle: '捕捉灵感，点亮创意',
    gradient: 'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)',
    isMemberOnly: true
  },
  {
    id: 'fortune',
    icon: '🔮',
    title: '每日运势',
    subtitle: '今日运势测算',
    gradient: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
    isMemberOnly: true
  },
  {
    id: 'tips',
    icon: '✨',
    title: '生活贴士',
    subtitle: '实用生活建议',
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    isMemberOnly: false
  },
  {
    id: 'goodnight',
    icon: '🌙',
    title: '晚安寄语',
    subtitle: '温馨晚安祝福',
    gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    isMemberOnly: false
  }
];

export default function HomePage() {
  const { user, subscription, dailyContent, setUser, setSubscription, setDailyContent, favorites, addFavorite, removeFavorite } = useApp();
  const [loading, setLoading] = useState(true);
  const [showBirthDateModal, setShowBirthDateModal] = useState(false);
  const [birthDate, setBirthDate] = useState('');
  const [bazi, setBazi] = useState('');
  const [zodiac, setZodiac] = useState('');
  const [expandedFeature, setExpandedFeature] = useState<string | null>(null);
  const lastUpdateDateRef = useRef<string>('');

  const isMember = subscription.isMember;

  const loadUser = async (submitBirthDate?: string) => {
    try {
      const params = submitBirthDate ? { birthDate: submitBirthDate } : {};
      const result = await callFunction<LoginResult>('login', params);
      setUser({ openid: result.openid });
      if (result.bazi) setBazi(result.bazi);
      if (result.zodiac) setZodiac(result.zodiac);
      if (result.isNewUser) {
        Taro.showToast({
          title: '欢迎！免费试用一个月',
          icon: 'none',
          duration: 3000
        });
      }
      return result;
    } catch (error: any) {
      console.error('[HomePage] login failed:', error);
      if (error.message && error.message.includes('该IP地址已注册')) {
        Taro.showModal({
          title: '提示',
          content: '该IP地址已注册过账号，请使用已注册的账号登录',
          showCancel: false
        });
      } else if (error.message && error.message.includes('请输入出生日期')) {
        setShowBirthDateModal(true);
      }
      return null;
    }
  };

  const handleBirthDateSubmit = async () => {
    if (!birthDate) {
      Taro.showToast({ title: '请选择出生日期', icon: 'none' });
      return;
    }
    setShowBirthDateModal(false);
    const result = await loadUser(birthDate);
    if (result) {
      loadContent();
    }
  };

  const loadSubscription = async () => {
    try {
      const result = await callFunction<{ isMember: boolean; type: string | null; expireTime: string | null; isFreeTrial?: boolean }>('checkSubscription');
      setSubscription({
        isMember: result.isMember,
        type: result.type as 'monthly' | 'yearly' | 'free_trial' | null,
        expireTime: result.expireTime,
        isFreeTrial: result.isFreeTrial
      });
    } catch (error) {
      console.error('[HomePage] checkSubscription failed:', error);
    }
  };

  const loadContent = async () => {
    try {
      setLoading(true);
      const params = bazi ? { bazi, zodiac } : {};
      const result = await callFunction<DailyContent>('generateContent', params);
      setDailyContent(result);
    } catch (error) {
      console.error('[HomePage] generateContent failed, using default content:', error);
      const defaultContent = generateDefaultContent();
      setDailyContent(defaultContent);
    } finally {
      setLoading(false);
      Taro.stopPullDownRefresh();
    }
  };

  const getTodayStr = () => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  };

  const shouldAutoUpdate = () => {
    const now = new Date();
    const today = getTodayStr();
    const lastUpdate = lastUpdateDateRef.current;
    
    if (lastUpdate !== today) {
      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();
      if (currentHour > AUTO_UPDATE_HOUR || 
          (currentHour === AUTO_UPDATE_HOUR && currentMinute >= AUTO_UPDATE_MINUTE)) {
        return true;
      }
    }
    return false;
  };

  useEffect(() => {
    loadUser();
    loadSubscription();
    loadContent();

    const interval = setInterval(() => {
      if (shouldAutoUpdate()) {
        loadContent();
        lastUpdateDateRef.current = getTodayStr();
      }
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (dailyContent) {
      lastUpdateDateRef.current = getTodayStr();
    }
  }, [dailyContent]);

  usePullDownRefresh(() => {
    loadContent();
  });

  const handleRefresh = () => {
    if (isMember) {
      loadContent();
    } else {
      Taro.navigateTo({ url: '/pages/subscribe/index' });
    }
  };

  const handleUnlock = () => {
    Taro.navigateTo({ url: '/pages/subscribe/index' });
  };

  const handleMemberClick = () => {
    Taro.navigateTo({ url: '/pages/member/index' });
  };

  const handleFavorite = (type: Favorite['type'], content: string) => {
    const exists = favorites.find(f => f.content === content && f.type === type);
    if (exists) {
      removeFavorite(exists.id);
      Taro.showToast({ title: '已取消收藏', icon: 'none' });
    } else {
      addFavorite({ type, content });
      Taro.showToast({ title: '已收藏', icon: 'success' });
    }
  };

  const handleFeatureClick = (feature: FeatureItem) => {
    if (feature.isMemberOnly && !isMember) {
      Taro.showModal({
        title: '需要开通会员',
        content: '开通会员后可享受完整服务，立即开通？',
        success: (res) => {
          if (res.confirm) {
            Taro.navigateTo({ url: '/pages/subscribe/index' });
          }
        }
      });
      return;
    }
    setExpandedFeature(feature.id);
    setTimeout(() => {
      const element = document.getElementById(`expanded-${feature.id}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  const handleClose = () => {
    setExpandedFeature(null);
  };

  const getCurrentTimeGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 6) return '夜深了，好好休息';
    if (hour < 12) return '早上好，开启美好的一天';
    if (hour < 14) return '中午好，记得午休';
    if (hour < 18) return '下午好，继续加油';
    return '晚上好，放松一下';
  };

  const renderExpandedContent = () => {
    if (!expandedFeature || !dailyContent) return null;
    
    const mockWeather = {
      city: '我的城市',
      temperature: '24°C',
      weather: '晴',
      wind: '微风',
      humidity: '60%',
      aqi: '50 良',
      tip: '今天天气不错，适合保持好心情！'
    };

    const feature = FEATURES.find(f => f.id === expandedFeature);

    return (
      <View id={`expanded-${expandedFeature}`} className={styles.expandedSection}>
        <Card className={styles.expandedCard} padding="lg">
          <View className={styles.expandedHeader}>
            <Button className={styles.backButton} onClick={handleClose}>
              <Text>← 返回</Text>
            </Button>
            <View className={styles.expandedTitleContainer}>
              <Text className={styles.expandedTitle}>{feature?.title}</Text>
              <Text className={styles.expandedDate}>
                {new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' })}
              </Text>
            </View>
            <View className={styles.placeholder} />
          </View>
          
          <View className={styles.expandedContent}>
            {expandedFeature === 'emotional' && (
              <>
                <EmotionalChatCard
                  emotionalAdvice={dailyContent?.emotionalAdvice || { prompt: '', response: '你好，我是你的情感树洞。有什么心事都可以跟我说。' }}
                  isLocked={!isMember}
                  onUnlock={handleUnlock}
                />
                <WishCard />
                <ContentCenterCard type="articles" />
              </>
            )}
            
            {expandedFeature === 'pet' && (
              <PetPage />
            )}
            
            {expandedFeature === 'jokes' && (
              <>
                <ContentCenterCard type="jokes" />
                <WhiteNoiseCard />
              </>
            )}
            
            {expandedFeature === 'news' && (
              <>
                <WeatherCard weather={mockWeather} isMember={true} onUnlock={() => {}} />
                <LocalNewsCard />
                <ContentCenterCard type="news" />
              </>
            )}
            
            {expandedFeature === 'finance' && (
              <FinanceCard isLocked={!isMember} onUnlock={handleUnlock} />
            )}
            
            {expandedFeature === 'idea' && (
              <IdeaCard isLocked={!isMember} onUnlock={handleUnlock} />
            )}
            
            {expandedFeature === 'fortune' && (
              <FortuneCard fortune={dailyContent.fortune} isLocked={!isMember} onUnlock={handleUnlock} />
            )}
            
            {expandedFeature === 'tips' && (
              <>
                <SuggestionsCard suggestions={dailyContent.suggestions} />
                <LifeTipsCard tips={dailyContent.lifeTips} isLocked={!isMember} onUnlock={handleUnlock} />
              </>
            )}
            
            {expandedFeature === 'goodnight' && (
              <GoodnightCard />
            )}
            
            {expandedFeature === 'firstaid' && (
              <EmotionFirstAidCard />
            )}
            
            {expandedFeature === 'parallel' && (
              <ParallelLifeCard />
            )}
            
            {expandedFeature === 'celebration' && (
              <CelebrationCard />
            )}
            
            {expandedFeature === 'loneliness' && (
              <LonelinessCard />
            )}
            
            {expandedFeature === 'selfdiscovery' && (
              <SelfDiscoveryCard />
            )}
            
            {expandedFeature === 'worldcollection' && (
              <WorldCollectionCard />
            )}
          </View>
        </Card>
      </View>
    );
  };

  if (loading || !dailyContent) {
    return (
      <View className={styles.page}>
        <Header onMemberClick={handleMemberClick} />
        <View className={styles.loading}>
          <Text className={styles.loadingIcon}>🌸</Text>
          <Text className={styles.loadingText}>正在为您生成今日专属内容...</Text>
        </View>
      </View>
    );
  }

  return (
    <View className={styles.page}>
      <Header onMemberClick={handleMemberClick} />
      <View className={styles.content}>
        <Card className={styles.greetingCard}>
          <View className={styles.greetingContent}>
            <Text className={styles.greetingTime}>{new Date().toLocaleDateString('zh-CN', { month: 'long', day: 'numeric', weekday: 'long' })}</Text>
            <Text className={styles.greetingText}>🌷 {getCurrentTimeGreeting()}</Text>
            <Text className={styles.encouragementQuote}>"{getTodayEncouragement().content}"</Text>
          </View>
          <Text className={styles.greetingIcon}>💖</Text>
        </Card>

        <View className={styles.featuresSection}>
          <View className={styles.sectionHeader}>
            <Text className={styles.sectionIcon}>✨</Text>
            <Text className={styles.sectionTitle}>功能服务</Text>
          </View>
          <View className={styles.featuresGrid}>
            {FEATURES.map(feature => (
              <View 
                key={feature.id} 
                className={`${styles.featureCard} ${expandedFeature === feature.id ? styles.active : ''}`}
                onClick={() => handleFeatureClick(feature)}
                style={{ background: feature.gradient }}
              >
                <Text className={styles.featureIcon}>{feature.icon}</Text>
                <Text className={styles.featureTitle}>{feature.title}</Text>
                <Text className={styles.featureSubtitle}>{feature.subtitle}</Text>
                {feature.isMemberOnly && (
                  <Text className={styles.memberBadge}>VIP</Text>
                )}
                <Text className={styles.featureArrow}>→</Text>
              </View>
            ))}
          </View>
        </View>

        <Card className={styles.psyTestSection}>
          <View className={styles.sectionHeader}>
            <Text className={styles.sectionIcon}>🧠</Text>
            <Text className={styles.sectionTitle}>心理测试</Text>
          </View>
          <View className={styles.psyTestGrid}>
            <Button 
              className={styles.psyTestCard}
              onClick={() => Taro.navigateTo({ url: '/pages/psytest/index?testId=mood' })}
              style={{ background: 'linear-gradient(135deg, #FF9A9E 0%, #FECFEF 100%)' }}
            >
              <Text className={styles.psyTestIcon}>🌈</Text>
              <Text className={styles.psyTestTitle}>心晴刻度</Text>
              <Text className={styles.psyTestSubtitle}>测测当下心情状态</Text>
            </Button>
            <Button 
              className={styles.psyTestCard}
              onClick={() => Taro.navigateTo({ url: '/pages/psytest/index?testId=insight' })}
              style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
            >
              <Text className={styles.psyTestIcon}>🔮</Text>
              <Text className={styles.psyTestTitle}>慧眼识珠</Text>
              <Text className={styles.psyTestSubtitle}>测测认知和判断力</Text>
            </Button>
            <Button 
              className={styles.psyTestCard}
              onClick={() => Taro.navigateTo({ url: '/pages/psytest/index?testId=vitality' })}
              style={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' }}
            >
              <Text className={styles.psyTestIcon}>⚡</Text>
              <Text className={styles.psyTestTitle}>活力续航</Text>
              <Text className={styles.psyTestSubtitle}>测测生活习惯状态</Text>
            </Button>
          </View>
        </Card>

        <DailyLifeNewsCard />

        {renderExpandedContent()}

        {!expandedFeature && (
          <>
            <ContentCenterCard type="jokes" />
            
            <Card className={styles.dailyCollection}>
              <View className={styles.cardHeader}>
                <Text className={styles.cardIcon}>📚</Text>
                <Text className={styles.cardTitle}>今日精选</Text>
              </View>
              <View className={styles.collectionGrid}>
                <Button className={styles.collectionItem} onClick={() => handleFeatureClick(FEATURES.find(f => f.id === 'jokes')!)}>
                  <Text className={styles.collectionIcon}>😄</Text>
                  <Text className={styles.collectionText}>笑话大海</Text>
                </Button>
                <Button className={styles.collectionItem} onClick={() => handleFeatureClick(FEATURES.find(f => f.id === 'emotional')!)}>
                  <Text className={styles.collectionIcon}>💝</Text>
                  <Text className={styles.collectionText}>暖心故事</Text>
                </Button>
                <Button className={styles.collectionItem} onClick={() => handleFeatureClick(FEATURES.find(f => f.id === 'news')!)}>
                  <Text className={styles.collectionIcon}>🏙️</Text>
                  <Text className={styles.collectionText}>我的城市</Text>
                </Button>
                <Button className={styles.collectionItem} onClick={() => handleFeatureClick(FEATURES.find(f => f.id === 'goodnight')!)}>
                  <Text className={styles.collectionIcon}>🎧</Text>
                  <Text className={styles.collectionText}>晚安寄语</Text>
                </Button>
              </View>
            </Card>

            <WeatherCard
              weather={dailyContent.weather}
              isMember={isMember}
              onUnlock={handleUnlock}
            />
            <FortuneCard
              fortune={dailyContent.fortune}
              isLocked={!isMember}
              onUnlock={handleUnlock}
            />
            
            <SuggestionsCard suggestions={dailyContent.suggestions} />
            <LifeTipsCard
              tips={dailyContent.lifeTips}
              isLocked={!isMember}
              onUnlock={handleUnlock}
            />

            {new Date().getHours() >= 18 && <GoodnightCard />}
          </>
        )}
      </View>
      
      {showBirthDateModal && (
        <View className={styles.modalOverlay}>
          <View className={styles.modalContent}>
            <Text className={styles.modalTitle}>请输入出生日期</Text>
            <Text className={styles.modalSubtitle}>以便为您提供更准确的运势测算</Text>
            <Input
              className={styles.dateInput}
              type="date"
              value={birthDate}
              onInput={(e) => setBirthDate(e.detail.value)}
              placeholder="选择日期"
            />
            <View className={styles.modalActions}>
              <Button className={styles.cancelBtn} onClick={() => setShowBirthDateModal(false)}>取消</Button>
              <Button className={styles.confirmBtn} onClick={handleBirthDateSubmit}>确认</Button>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}
