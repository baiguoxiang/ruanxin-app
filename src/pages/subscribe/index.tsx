import React, { useState } from 'react';
import { View, Text, Image, Button } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { useApp } from '@/store';
import styles from './index.module.scss';

type PackageType = 'monthly' | 'yearly';

interface PackageInfo {
  type: PackageType;
  name: string;
  icon: string;
  price: number;
  duration: string;
  tag: string;
  benefits: string[];
}

const packages: PackageInfo[] = [
  {
    type: 'monthly',
    name: '月卡会员',
    icon: '🌙',
    price: 10,
    duration: '30天',
    tag: '',
    benefits: ['解锁全部内容', '无限刷新', '无收藏限制']
  },
  {
    type: 'yearly',
    name: '年卡会员',
    icon: '🌟',
    price: 100,
    duration: '365天',
    tag: '平均每月不到8.4元',
    benefits: ['解锁全部内容', '无限刷新', '无收藏限制', '性价比更高']
  }
];

type PaymentStatus = 'select' | 'show-qrcode' | 'confirming' | 'success';

export default function SubscribePage() {
  const [selectedPackage, setSelectedPackage] = useState<PackageType>('monthly');
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('select');
  const [orderId, setOrderId] = useState('');
  const { setSubscription } = useApp();

  React.useEffect(() => {
    console.log('[SubscribePage] mounted');
  }, []);

  const selectedInfo = packages.find(p => p.type === selectedPackage)!;

  const handleSelectPackage = (type: PackageType) => {
    setSelectedPackage(type);
  };

  const handlePurchase = () => {
    console.log('[SubscribePage] handlePurchase called');
    Taro.showLoading({ title: '生成订单...' });

    setTimeout(() => {
      Taro.hideLoading();
      setOrderId(`ORDER_${Date.now()}`);
      setPaymentStatus('show-qrcode');
      Taro.showToast({ title: '订单已生成', icon: 'success' });
    }, 1000);
  };

  const handleConfirmPayment = () => {
    if (!orderId) return;

    Taro.showModal({
      title: '支付确认',
      content: `请确认您已使用微信扫码完成支付 ¥${selectedInfo.price}。\n\n⚠️ 未完成支付请勿点击确定，系统将验证支付状态。`,
      confirmText: '我已完成支付',
      cancelText: '继续支付',
      success: (res) => {
        if (!res.confirm) return;

        setPaymentStatus('confirming');
        Taro.showLoading({ title: '正在验证支付状态...' });

        setTimeout(() => {
          Taro.hideLoading();
          
          Taro.showModal({
            title: '支付验证',
            content: '请上传支付成功截图或输入支付密码以完成验证（演示模式）',
            confirmText: '跳过验证',
            cancelText: '上传截图',
            success: (verifyRes) => {
              if (!verifyRes.confirm) {
                setPaymentStatus('show-qrcode');
                Taro.showToast({ title: '请先完成支付', icon: 'none' });
                return;
              }

              const now = new Date();
              const expireDate = new Date(
                now.getTime() + (selectedPackage === 'monthly' ? 30 : 365) * 24 * 60 * 60 * 1000
              );

              setSubscription({
                isMember: true,
                type: selectedPackage,
                expireTime: expireDate.toISOString()
              });

              setPaymentStatus('success');

              setTimeout(() => {
                Taro.showModal({
                  title: '开通成功',
                  content: `恭喜您成为${selectedInfo.name}！\n订单号：${orderId}\n有效期：${selectedInfo.duration}`,
                  showCancel: false,
                  success: () => {
                    Taro.navigateBack();
                  }
                });
              }, 500);
            }
          });
        }, 2000);
      }
    });
  };

  const handleBackToSelect = () => {
    setPaymentStatus('select');
    setOrderId('');
  };

  return (
    <View className={styles.page}>
      {paymentStatus === 'select' && (
        <>
          <View className={styles.header}>
            <Text className={styles.headerTitle}>开通暖心会员</Text>
            <Text className={styles.headerSubtitle}>解锁每日全部治愈内容</Text>
          </View>

          <View className={styles.packageList}>
            {packages.map((pkg) => (
              <View
                key={pkg.type}
                className={`${styles.packageCard} ${selectedPackage === pkg.type ? styles.selected : ''}`}
                onClick={() => handleSelectPackage(pkg.type)}
              >
                <Text className={styles.checkIcon}>✓</Text>
                <View className={styles.packageHeader}>
                  <Text className={styles.packageIcon}>{pkg.icon}</Text>
                  <Text className={styles.packageName}>{pkg.name}</Text>
                  {pkg.tag && (
                    <Text className={`${styles.packageTag} ${pkg.type === 'monthly' ? styles.monthlyTag : ''}`}>
                      {pkg.tag}
                    </Text>
                  )}
                </View>
                <View className={styles.packagePrice}>
                  <Text className={styles.priceValue}>¥{pkg.price}</Text>
                  <Text className={styles.priceUnit}>/ {pkg.duration}</Text>
                </View>
                <Text className={styles.packageDuration}>有效期{pkg.duration}</Text>
                <View className={styles.packageBenefits}>
                  {pkg.benefits.map((benefit, index) => (
                    <View key={index} className={styles.benefitItem}>
                      <Text className={styles.benefitCheck}>✓</Text>
                      <Text className={styles.benefitText}>{benefit}</Text>
                    </View>
                  ))}
                </View>
              </View>
            ))}
          </View>

          <Button className={styles.purchaseButton} onClick={handlePurchase}>
            <Text className={styles.purchaseText}>
              立即开通 ¥{selectedInfo.price}
            </Text>
          </Button>

          <View className={styles.tips}>
            <Text className={styles.tipsText}>
              开通后立即解锁所有板块；会员到期前可随时续费叠加时长。
              所有内容以舒缓压力、调节情绪、带来好心情为核心。
            </Text>
          </View>
        </>
      )}

      {(paymentStatus === 'show-qrcode' || paymentStatus === 'confirming' || paymentStatus === 'success') && (
        <View className={styles.qrcodeContainer}>
          <View className={styles.qrcodeHeader}>
            <Text className={styles.backButton} onClick={handleBackToSelect}>← 返回</Text>
            <Text className={styles.qrcodeTitle}>扫码支付</Text>
            <View className={styles.placeholder} />
          </View>

          <View className={styles.qrcodeCard}>
            <View className={styles.qrcodeTip}>
              <Text className={styles.qrcodeTipIcon}>💳</Text>
              <Text className={styles.qrcodeTipText}>使用微信扫码支付</Text>
            </View>
            <View className={styles.paymentSteps}>
              <View className={styles.stepItem}>
                <Text className={styles.stepNumber}>1</Text>
                <Text className={styles.stepText}>截图保存二维码</Text>
              </View>
              <View className={styles.stepItem}>
                <Text className={styles.stepNumber}>2</Text>
                <Text className={styles.stepText}>打开微信扫码支付</Text>
              </View>
              <View className={styles.stepItem}>
                <Text className={styles.stepNumber}>3</Text>
                <Text className={styles.stepText}>支付完成后点击确认</Text>
              </View>
            </View>

            <View className={styles.qrcodeWrapper}>
              <Image
                className={styles.qrcodeImage}
                src="./images/wechat_pay_qrcode.png"
                mode="aspectFit"
              />
              <View className={styles.qrcodeOverlay}>
                <Text className={styles.qrcodeOverlayText}>支付 ¥{selectedInfo.price}</Text>
              </View>
            </View>

            <View className={styles.paymentInfo}>
              <View className={styles.paymentRow}>
                <Text className={styles.paymentLabel}>套餐</Text>
                <Text className={styles.paymentValue}>{selectedInfo.name}</Text>
              </View>
              <View className={styles.paymentRow}>
                <Text className={styles.paymentLabel}>金额</Text>
                <Text className={styles.paymentAmount}>¥{selectedInfo.price}</Text>
              </View>
              <View className={styles.paymentRow}>
                <Text className={styles.paymentLabel}>订单号</Text>
                <Text className={styles.paymentValue}>{orderId}</Text>
              </View>
            </View>
          </View>

          {paymentStatus !== 'success' && (
            <View className={styles.confirmButton} onClick={handleConfirmPayment}>
              <Text className={styles.confirmText}>
                {paymentStatus === 'confirming' ? '验证中...' : '我已完成支付'}
              </Text>
            </View>
          )}

          {paymentStatus === 'success' && (
            <View className={styles.successIcon}>✓</View>
          )}

          <View className={styles.qrcodeTips}>
            <Text className={styles.qrcodeTipsText}>
              支付完成后，请点击上方按钮确认开通会员
            </Text>
          </View>
        </View>
      )}
    </View>
  );
}
