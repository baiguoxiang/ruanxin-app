import React, { useState, useEffect, useRef } from 'react';
import { View, Text } from '@tarojs/components';
import styles from './index.module.scss';

interface HeaderProps {
  onMemberClick: () => void;
}

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function Header({ onMemberClick }: HeaderProps) {
  const [showGuide, setShowGuide] = useState(false);
  const [showCopied, setShowCopied] = useState(false);
  const [browserType, setBrowserType] = useState<'wechat' | 'ios-safari' | 'android-chrome' | 'desktop' | 'other'>('other');
  const deferredPromptRef = useRef<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    const ua = navigator.userAgent.toLowerCase();
    
    if (ua.includes('micromessenger')) {
      setBrowserType('wechat');
    } else if (/iphone|ipad|ipod/.test(ua) && ua.includes('safari') && !ua.includes('chrome')) {
      setBrowserType('ios-safari');
    } else if (ua.includes('android') && ua.includes('chrome')) {
      setBrowserType('android-chrome');
    } else if (!ua.includes('mobile') && !ua.includes('android')) {
      setBrowserType('desktop');
    } else {
      setBrowserType('other');
    }

    const handler = (e: Event) => {
      e.preventDefault();
      deferredPromptRef.current = e as BeforeInstallPromptEvent;
    };
    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleAddToHome = async () => {
    if (deferredPromptRef.current) {
      deferredPromptRef.current.prompt();
      const choice = await deferredPromptRef.current.userChoice;
      if (choice.outcome === 'accepted') {
        deferredPromptRef.current = null;
      }
    } else if (browserType === 'desktop') {
      handleDownloadShortcut();
    } else {
      setShowGuide(true);
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setShowCopied(true);
      setTimeout(() => setShowCopied(false), 2000);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = window.location.href;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setShowCopied(true);
      setTimeout(() => setShowCopied(false), 2000);
    }
  };

  const handleDownloadShortcut = () => {
    const shortcutUrl = window.location.href;
    const content = `[InternetShortcut]
URL=${shortcutUrl}
IconFile=${window.location.origin}/images/icon-512.png
IconIndex=0
`;
    
    const blob = new Blob([content], { type: 'application/octet-stream' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = '暖心助手.url';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleDownloadApp = () => {
    const appUrl = 'https://baiguoxiang.github.io/ruanxin-app/release/暖心助手_v1.0.zip';
    window.open(appUrl, '_blank');
  };

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
        <Text className={styles.headerSubtitle}>愿你拥有一整天好心情 ❤️</Text>
      </View>
      <View className={styles.memberButtons}>
        <View className={styles.memberButton} onClick={onMemberClick}>
          <Text className={styles.memberIcon}>👤</Text>
          <Text className={styles.memberText}>会员中心</Text>
        </View>
        <View className={styles.desktopButton} onClick={handleAddToHome}>
          <Text className={styles.memberIcon}>📱</Text>
          <Text className={styles.memberText}>添加桌面</Text>
        </View>
      </View>

      {showGuide && (
        <View className={styles.guideMask} onClick={() => setShowGuide(false)}>
          <View className={styles.guideModal} onClick={(e) => e.stopPropagation()}>
            <View className={styles.guideHeader}>
              <Text className={styles.guideIcon}>📲</Text>
              <Text className={styles.guideTitle}>添加到桌面</Text>
            </View>
            
            {browserType === 'wechat' && (
              <View className={styles.guideContent}>
                <Text className={styles.guideDesc}>
                  微信浏览器暂不支持直接添加到桌面
                </Text>
                <View className={styles.wechatSteps}>
                  <View className={styles.guideStep}>
                    <Text className={styles.stepNum}>1</Text>
                    <Text className={styles.stepText}>点击右上角「...」</Text>
                  </View>
                  <View className={styles.guideStep}>
                    <Text className={styles.stepNum}>2</Text>
                    <Text className={styles.stepText}>选择「在浏览器中打开」</Text>
                  </View>
                  <View className={styles.guideStep}>
                    <Text className={styles.stepNum}>3</Text>
                    <Text className={styles.stepText}>在浏览器中点击「添加到主屏幕」</Text>
                  </View>
                </View>
                <View className={styles.copySection}>
                  <Text className={styles.copyTip}>或者复制链接，在其他浏览器打开：</Text>
                  <View className={styles.copyButton} onClick={handleCopyLink}>
                    <Text className={styles.copyButtonText}>
                      {showCopied ? '✓ 已复制' : '复制链接'}
                    </Text>
                  </View>
                </View>
              </View>
            )}

            {browserType === 'ios-safari' && (
              <View className={styles.guideContent}>
                <Text className={styles.guideDesc}>在 Safari 浏览器中按以下步骤操作：</Text>
                <View className={styles.guideSteps}>
                  <View className={styles.guideStep}>
                    <Text className={styles.stepNum}>1</Text>
                    <Text className={styles.stepText}>
                      点击底部的「分享」按钮{' '}
                      <Text className={styles.stepIcon}>⬆️</Text>
                    </Text>
                  </View>
                  <View className={styles.guideStep}>
                    <Text className={styles.stepNum}>2</Text>
                    <Text className={styles.stepText}>
                      下滑找到「添加到主屏幕」
                    </Text>
                  </View>
                  <View className={styles.guideStep}>
                    <Text className={styles.stepNum}>3</Text>
                    <Text className={styles.stepText}>点击右上角「添加」即可</Text>
                  </View>
                </View>
              </View>
            )}

            {browserType === 'android-chrome' && (
              <View className={styles.guideContent}>
                <Text className={styles.guideDesc}>在 Chrome 浏览器中：</Text>
                <View className={styles.guideSteps}>
                  <View className={styles.guideStep}>
                    <Text className={styles.stepNum}>1</Text>
                    <Text className={styles.stepText}>
                      点击右上角「⋮」菜单
                    </Text>
                  </View>
                  <View className={styles.guideStep}>
                    <Text className={styles.stepNum}>2</Text>
                    <Text className={styles.stepText}>
                      选择「添加到主屏幕」
                    </Text>
                  </View>
                  <View className={styles.guideStep}>
                    <Text className={styles.stepNum}>3</Text>
                    <Text className={styles.stepText}>点击「添加」即可完成</Text>
                  </View>
                </View>
                <Text className={styles.guideTip}>
                  💡 如果浏览器支持，会自动弹出安装提示
                </Text>
              </View>
            )}

            {browserType === 'desktop' && (
              <View className={styles.guideContent}>
                <Text className={styles.guideDesc}>在电脑上使用暖心助手：</Text>
                <View className={styles.guideSteps}>
                  <View className={styles.guideStep}>
                    <Text className={styles.stepNum}>📦</Text>
                    <Text className={styles.stepText}>
                      点击下方按钮下载桌面应用安装包
                    </Text>
                  </View>
                  <View className={styles.guideStep}>
                    <Text className={styles.stepNum}>📁</Text>
                    <Text className={styles.stepText}>解压后双击启动即可使用</Text>
                  </View>
                  <View className={styles.guideStep}>
                    <Text className={styles.stepNum}>⚡</Text>
                    <Text className={styles.stepText}>像APP一样独立窗口运行</Text>
                  </View>
                </View>
                <Text className={styles.guideTip}>
                  💡 需要先安装Node.js：https://nodejs.org/
                </Text>
                <View className={styles.copySection}>
                  <Text className={styles.copyTip}>选择下载方式：</Text>
                  <View className={styles.downloadButtons}>
                    <View className={styles.copyButton} onClick={handleDownloadShortcut}>
                      <Text className={styles.copyButtonText}>📎 下载快捷方式</Text>
                    </View>
                    <View className={styles.copyButton} onClick={handleDownloadApp}>
                      <Text className={styles.copyButtonText}>📥 下载桌面应用</Text>
                    </View>
                  </View>
                </View>
              </View>
            )}

            {browserType === 'other' && (
              <View className={styles.guideContent}>
                <Text className={styles.guideDesc}>根据您的浏览器类型操作：</Text>
                <View className={styles.guideSteps}>
                  <View className={styles.guideStep}>
                    <Text className={styles.stepNum}>1</Text>
                    <Text className={styles.stepText}>点击浏览器菜单按钮</Text>
                  </View>
                  <View className={styles.guideStep}>
                    <Text className={styles.stepNum}>2</Text>
                    <Text className={styles.stepText}>
                      选择「添加到主屏幕」或「安装应用」
                    </Text>
                  </View>
                  <View className={styles.guideStep}>
                    <Text className={styles.stepNum}>3</Text>
                    <Text className={styles.stepText}>按提示完成添加</Text>
                  </View>
                </View>
                <View className={styles.copySection}>
                  <Text className={styles.copyTip}>或者复制链接，在其他浏览器打开：</Text>
                  <View className={styles.copyButton} onClick={handleCopyLink}>
                    <Text className={styles.copyButtonText}>
                      {showCopied ? '✓ 已复制' : '复制链接'}
                    </Text>
                  </View>
                </View>
              </View>
            )}

            <View
              className={styles.guideCloseBtn}
              onClick={() => setShowGuide(false)}
            >
              <Text className={styles.guideCloseText}>我知道了</Text>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}
