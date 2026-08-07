import React, { useState, useMemo, useEffect } from 'react';
import { View, Text, Button, Input } from '@tarojs/components';
import Taro from '@tarojs/taro';
import Card from '../Card';
import LockOverlay from '../LockOverlay';
import styles from './index.module.scss';
import {
  FinanceRecord,
  expenseCategories,
  incomeCategories,
  parseFinanceInput,
  categorizeExpense,
  categorizeIncome,
  generateFinanceReport,
  getRandomFinanceBook,
  calculateBalance,
  calculateDailyStats,
  groupRecordsByDate,
  DailyRecords
} from './financeDB';

interface FinanceCardProps {
  isLocked: boolean;
  onUnlock: () => void;
}

export default function FinanceCard({ isLocked, onUnlock }: FinanceCardProps) {
  const [inputValue, setInputValue] = useState('');
  const [records, setRecords] = useState<FinanceRecord[]>(() => {
    const saved = localStorage.getItem('finance_records');
    if (saved) {
      return JSON.parse(saved);
    }
    // 首次使用时加载示例数据
    const demoData = localStorage.getItem('finance_demo_loaded');
    if (!demoData) {
      const today = new Date();
      const dateStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
      const demoRecords: FinanceRecord[] = [
        { id: 'demo1', type: 'income', amount: 8000, category: '工资', description: '月薪', date: dateStr, timestamp: today.getTime() - 7200000 },
        { id: 'demo2', type: 'expense', amount: 35, category: '餐饮', description: '午餐', date: dateStr, timestamp: today.getTime() - 3600000 },
        { id: 'demo3', type: 'expense', amount: 15, category: '交通', description: '地铁费', date: dateStr, timestamp: today.getTime() - 1800000 },
        { id: 'demo4', type: 'expense', amount: 128, category: '购物', description: '日用品', date: dateStr, timestamp: today.getTime() - 900000 }
      ];
      localStorage.setItem('finance_records', JSON.stringify(demoRecords));
      localStorage.setItem('finance_demo_loaded', 'true');
      return demoRecords;
    }
    return [];
  });
  const [report, setReport] = useState<ReturnType<typeof generateFinanceReport> | null>(null);
  const [showReport, setShowReport] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [showBook, setShowBook] = useState(false);
  const [currentBook, setCurrentBook] = useState(getRandomFinanceBook());

  const today = useMemo(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  }, []);

  const balance = useMemo(() => calculateBalance(records), [records]);
  const dailyStats = useMemo(() => calculateDailyStats(records, today), [records, today]);
  const groupedRecords = useMemo(() => groupRecordsByDate(records), [records]);
  
  const totalIncome = useMemo(() => records.filter(r => r.type === 'income').reduce((sum, r) => sum + r.amount, 0), [records]);
  const totalExpense = useMemo(() => records.filter(r => r.type === 'expense').reduce((sum, r) => sum + r.amount, 0), [records]);

  useEffect(() => {
    localStorage.setItem('finance_records', JSON.stringify(records));
  }, [records]);

  const addRecord = (type: 'income' | 'expense', amount: number, description: string) => {
    const category = type === 'income' ? categorizeIncome(description) : categorizeExpense(description);
    const now = new Date();
    const record: FinanceRecord = {
      id: `${now.getTime()}`,
      type,
      amount,
      category,
      description,
      date: `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`,
      timestamp: now.getTime()
    };
    setRecords(prev => [...prev, record]);
    setInputValue('');
    Taro.showToast({ title: `已记录${type === 'income' ? '收入' : '支出'}¥${amount}`, icon: 'success' });
  };

  const handleSend = () => {
    if (!inputValue.trim()) {
      Taro.showToast({ title: '请说出你的收支', icon: 'none' });
      return;
    }

    if (isLocked) {
      Taro.showModal({
        title: '需要开通会员',
        content: '开通会员后可享受完整的财务管家服务，立即开通？',
        success: (res) => {
          if (res.confirm) {
            onUnlock();
          }
        }
      });
      return;
    }

    const parsed = parseFinanceInput(inputValue);
    if (parsed) {
      addRecord(parsed.type, parsed.amount, parsed.description);
    } else {
      Taro.showToast({ title: '没听懂，请说清楚金额，比如：买饭花了20元', icon: 'none' });
    }
  };

  const handleVoiceInput = () => {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (isMobile) {
      Taro.showToast({ title: '请点击输入框，使用手机输入法的语音功能', icon: 'none', duration: 2500 });
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      Taro.showModal({
        title: '浏览器不支持',
        content: '当前浏览器不支持语音输入。建议使用手机访问，通过输入法自带的语音功能输入。',
        showCancel: false
      });
      return;
    }

    if (isRecording) {
      setIsRecording(false);
      Taro.hideToast();
      return;
    }

    const recognition = new SpeechRecognition();
    
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'zh-CN';
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsRecording(true);
      Taro.showToast({ title: '正在听...请说话', icon: 'none', duration: 0 });
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      if (transcript && transcript.trim()) {
        setInputValue(transcript);
        Taro.showToast({ title: '识别完成', icon: 'success', duration: 1500 });
      } else {
        Taro.showToast({ title: '没有识别到内容', icon: 'none' });
      }
      setIsRecording(false);
    };

    recognition.onerror = (event: any) => {
      setIsRecording(false);
      Taro.hideToast();
      
      if (event.error === 'network') {
        Taro.showModal({
          title: '语音识别失败',
          content: '网络连接问题导致无法使用语音识别。建议使用手机访问，通过输入法自带的语音功能输入。',
          showCancel: false
        });
      } else {
        const errorMessages: Record<string, string> = {
          'not-allowed': '请允许麦克风权限。在浏览器地址栏左侧点击锁图标，允许麦克风访问。',
          'no-speech': '没有检测到声音，请靠近麦克风清晰地说话。',
          'service-not-available': '语音服务暂时不可用，请稍后重试或使用手机输入法的语音功能。',
          'audio-capture': '没有检测到麦克风设备，请检查麦克风是否连接。',
          'bad-grammar': '语音语法错误，请重新说话。',
          'language-not-supported': '当前语言不支持，请使用普通话。'
        };
        
        Taro.showModal({
          title: '语音识别失败',
          content: errorMessages[event.error] || '语音识别失败: ' + event.error,
          showCancel: false
        });
      }
    };

    recognition.onend = () => {
      if (isRecording) {
        setIsRecording(false);
        Taro.hideToast();
      }
    };

    try {
      recognition.start();
    } catch (error) {
      setIsRecording(false);
      Taro.showModal({
        title: '启动失败',
        content: '无法启动语音识别。建议使用手机访问，通过输入法自带的语音功能输入。',
        showCancel: false
      });
    }
  };

  const generateReport = () => {
    if (records.length === 0) {
      Taro.showToast({ title: '暂无记录，请先添加财务记录', icon: 'none' });
      return;
    }
    const financeReport = generateFinanceReport(records);
    setReport(financeReport);
    setShowReport(true);
  };

  const clearRecords = () => {
    Taro.showModal({
      title: '确认清空',
      content: '确定要清空所有财务记录吗？',
      success: (res) => {
        if (res.confirm) {
          setRecords([]);
          setReport(null);
          setShowReport(false);
          Taro.showToast({ title: '已清空', icon: 'success' });
        }
      }
    });
  };

  const loadDemoData = () => {
    Taro.showModal({
      title: '恢复示例数据',
      content: '将加载演示数据用于体验，原有的数据将被覆盖。确定要恢复吗？',
      success: (res) => {
        if (res.confirm) {
          const today = new Date();
          const dateStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
          const demoRecords: FinanceRecord[] = [
            { id: 'demo1', type: 'income', amount: 8000, category: '工资', description: '月薪', date: dateStr, timestamp: today.getTime() - 7200000 },
            { id: 'demo2', type: 'expense', amount: 35, category: '餐饮', description: '午餐', date: dateStr, timestamp: today.getTime() - 3600000 },
            { id: 'demo3', type: 'expense', amount: 15, category: '交通', description: '地铁费', date: dateStr, timestamp: today.getTime() - 1800000 },
            { id: 'demo4', type: 'expense', amount: 128, category: '购物', description: '日用品', date: dateStr, timestamp: today.getTime() - 900000 }
          ];
          setRecords(demoRecords);
          setReport(null);
          setShowReport(false);
          Taro.showToast({ title: '已恢复示例数据', icon: 'success' });
        }
      }
    });
  };

  const exportData = () => {
    if (records.length === 0) {
      Taro.showToast({ title: '暂无数据可导出', icon: 'none' });
      return;
    }
    const dataStr = JSON.stringify(records, null, 2);
    Taro.setClipboardData({
      data: dataStr,
      success: () => {
        Taro.showModal({
          title: '导出成功',
          content: `已将 ${records.length} 条财务记录复制到剪贴板，请粘贴到安全位置保存。`,
          showCancel: false
        });
      }
    });
  };

  const getCategoryIcon = (category: string, type: 'income' | 'expense') => {
    const categories = type === 'income' ? incomeCategories : expenseCategories;
    const cat = categories.find(c => c.name === category);
    return cat ? cat.icon : '📝';
  };

  return (
    <View className={styles.cardContainer}>
      <Card className={styles.financeCard} padding="lg">
        <View className={styles.cardHeader}>
          <Text className={styles.cardIcon}>💰</Text>
          <Text className={styles.cardTitle}>财务管家</Text>
          <Text className={styles.cardSubtitle}>智能记账，实时掌握</Text>
        </View>

        <View className={styles.summarySection}>
          <View className={styles.summaryCard}>
            <Text className={styles.summaryLabel}>当前结余</Text>
            <Text className={`${styles.summaryAmount} ${balance >= 0 ? styles.positive : styles.negative}`}>
              {balance >= 0 ? '+' : ''}¥{balance.toFixed(2)}
            </Text>
          </View>
          <View className={styles.summaryCard}>
            <Text className={styles.summaryLabel}>总收入</Text>
            <Text className={`${styles.summaryAmount} ${styles.income}`}>+¥{totalIncome.toFixed(2)}</Text>
          </View>
          <View className={styles.summaryCard}>
            <Text className={styles.summaryLabel}>总支出</Text>
            <Text className={`${styles.summaryAmount} ${styles.expense}`}>-¥{totalExpense.toFixed(2)}</Text>
          </View>
        </View>

        <View className={styles.dailySection}>
          <View className={styles.dailyCard}>
            <Text className={styles.dailyIcon}>☀️</Text>
            <View className={styles.dailyInfo}>
              <Text className={styles.dailyLabel}>今日收入</Text>
              <Text className={styles.dailyAmount} style={{ color: '#10b981' }}>+¥{dailyStats.income.toFixed(2)}</Text>
            </View>
          </View>
          <View className={styles.dailyCard}>
            <Text className={styles.dailyIcon}>🌙</Text>
            <View className={styles.dailyInfo}>
              <Text className={styles.dailyLabel}>今日支出</Text>
              <Text className={styles.dailyAmount} style={{ color: '#ef4444' }}>-¥{dailyStats.expense.toFixed(2)}</Text>
            </View>
          </View>
        </View>

        <View className={styles.contentWrapper}>
          {!showReport ? (
            <>
              {records.length > 0 && (
                <View className={styles.recordsArea}>
                  <View className={styles.recordsHeader}>
                    <Text className={styles.recordsTitle}>📅 收支记录</Text>
                    <View className={styles.recordsActions}>
                      <Button className={styles.actionButton} onClick={generateReport}>
                        <Text>📊 报表</Text>
                      </Button>
                      <Button className={styles.actionButton} onClick={loadDemoData}>
                        <Text>🔄 恢复</Text>
                      </Button>
                      <Button className={styles.actionButton} onClick={exportData}>
                        <Text>💾 导出</Text>
                      </Button>
                    </View>
                  </View>
                  <View className={styles.recordsList}>
                    {groupedRecords.map((dailyGroup: DailyRecords) => (
                      <View key={dailyGroup.date} className={styles.dateGroup}>
                        <View className={styles.dateHeader}>
                          <Text className={styles.dateTitle}>
                            {dailyGroup.date === today ? '今天' : dailyGroup.date}
                          </Text>
                          <Text className={styles.dateSummary}>
                            {dailyGroup.income > 0 && <Text style={{ color: '#10b981' }}>+¥{dailyGroup.income.toFixed(2)}</Text>}
                            {dailyGroup.expense > 0 && <Text style={{ color: '#ef4444', marginLeft: '8px' }}>-¥{dailyGroup.expense.toFixed(2)}</Text>}
                          </Text>
                        </View>
                        <View className={styles.dateRecords}>
                          {dailyGroup.records.map(record => (
                            <View key={record.id} className={styles.recordItem}>
                              <Text className={styles.recordIcon}>
                                {getCategoryIcon(record.category, record.type)}
                              </Text>
                              <View className={styles.recordInfo}>
                                <Text className={styles.recordDescription}>
                                  {record.description || record.category}
                                </Text>
                                <Text className={styles.recordCategory}>{record.category}</Text>
                              </View>
                              <Text className={`${styles.recordAmount} ${record.type === 'income' ? styles.income : styles.expense}`}>
                                {record.type === 'income' ? '+' : '-'}¥{record.amount.toFixed(2)}
                              </Text>
                            </View>
                          ))}
                        </View>
                      </View>
                    ))}
                  </View>
                  <View className={styles.clearSection}>
                    <Button className={styles.clearButton} onClick={clearRecords}>
                      <Text>🗑️ 清空所有记录</Text>
                    </Button>
                  </View>
                </View>
              )}

              {records.length === 0 && (
                <View className={styles.emptyState}>
                  <Text className={styles.emptyIcon}>💹</Text>
                  <Text className={styles.emptyText}>开始记录你的第一笔收支</Text>
                  <Text className={styles.emptyHint}>随便说：吃饭花了15块 / 发工资了5000</Text>
                </View>
              )}
            </>
          ) : (
            <View className={styles.reportArea}>
              <View className={styles.reportHeader}>
                <Text className={styles.reportTitle}>📊 财务报表</Text>
                <Button className={styles.backButton} onClick={() => setShowReport(false)}>
                  <Text>← 返回</Text>
                </Button>
              </View>

              <View className={styles.summaryCards}>
                <View className={styles.summaryCard}>
                  <Text className={styles.summaryLabel}>总收入</Text>
                  <Text className={`${styles.summaryAmount} ${styles.income}`}>+¥{report!.totalIncome.toFixed(2)}</Text>
                </View>
                <View className={styles.summaryCard}>
                  <Text className={styles.summaryLabel}>总支出</Text>
                  <Text className={`${styles.summaryAmount} ${styles.expense}`}>-¥{report!.totalExpense.toFixed(2)}</Text>
                </View>
                <View className={styles.summaryCard}>
                  <Text className={styles.summaryLabel}>结余</Text>
                  <Text className={`${styles.summaryAmount} ${report!.balance >= 0 ? styles.income : styles.expense}`}>
                    {report!.balance >= 0 ? '+' : ''}¥{report!.balance.toFixed(2)}
                  </Text>
                </View>
              </View>

              <View className={styles.categorySection}>
                <Text className={styles.sectionTitle}>📈 支出分类</Text>
                <View className={styles.categoryList}>
                  {Object.entries(report!.expenseByCategory)
                    .sort((a, b) => b[1] - a[1])
                    .map(([category, amount]) => {
                      const total = report!.totalExpense || 1;
                      const percentage = (amount / total) * 100;
                      return (
                        <View key={category} className={styles.categoryItem}>
                          <View className={styles.categoryInfo}>
                            <Text className={styles.categoryIcon}>{getCategoryIcon(category, 'expense')}</Text>
                            <Text className={styles.categoryName}>{category}</Text>
                          </View>
                          <View className={styles.categoryBarWrapper}>
                            <View 
                              className={styles.categoryBar}
                              style={{ width: `${percentage}%` }}
                            />
                          </View>
                          <Text className={styles.categoryAmount}>¥{amount.toFixed(2)}</Text>
                        </View>
                      );
                    })}
                </View>
              </View>

              <View className={styles.suggestionsSection}>
                <Text className={styles.sectionTitle}>💡 财务建议</Text>
                <View className={styles.suggestionsList}>
                  {report!.suggestions.slice(0, 3).map((suggestion, index) => (
                    <View key={index} className={styles.suggestionItem}>
                      <Text className={styles.suggestionIcon}>✓</Text>
                      <Text className={styles.suggestionText}>{suggestion}</Text>
                    </View>
                  ))}
                </View>
              </View>

              <View className={styles.bookSection}>
                <Button className={styles.bookCard} onClick={() => {
                  setCurrentBook(getRandomFinanceBook());
                  setShowBook(true);
                }}>
                  <Text className={styles.bookIcon}>📚</Text>
                  <View className={styles.bookInfo}>
                    <Text className={styles.bookTitle}>推荐阅读：{currentBook.name}</Text>
                    <Text className={styles.bookAuthor}>{currentBook.author} · {currentBook.description}</Text>
                  </View>
                </Button>
              </View>
            </View>
          )}

          {isLocked && <LockOverlay onClick={onUnlock} />}
        </View>
      </Card>

      <View className={styles.inputSection}>
        <View className={styles.inputRow}>
          <Input
            className={styles.input}
            placeholder="随便说：吃饭花了15块 / 发工资了5000"
            value={inputValue}
            onInput={(e) => setInputValue(e.detail.value)}
            onConfirm={handleSend}
          />
        </View>
        <View className={styles.buttonRow}>
          <Button className={styles.sendBtn} onClick={handleSend}>
            <Text className={styles.sendBtnText}>记录</Text>
          </Button>
          <Button className={styles.voiceBtn} onClick={handleVoiceInput}>
            <Text className={styles.voiceIcon}>{isRecording ? '🔴' : '🎤'}</Text>
          </Button>
        </View>
      </View>
    </View>
  );
}
