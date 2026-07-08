import React, { useState, useRef } from 'react';
import Taro from '@tarojs/taro';
import { View, Text, Textarea, Button } from '@tarojs/components';
import Card from '../Card';
import LockOverlay from '../LockOverlay';
import type { EmotionalAdvice } from '@/types';
import styles from './index.module.scss';
import { getAIResponse, getAIResponseStream, type ChatMessage } from '@/services/ai';
import { 
  psychologyKnowledgeBase, 
  emotionalTips, 
  therapyMethods,
  deepConversationPrompts,
  understandingResponses,
  scenarioResponses,
  getRandomKnowledge,
  getEmotionalTips,
  getTherapyMethod,
  getDeepPrompt,
  getScenarioResponse,
  detectEmotion
} from './psychologyDB';

interface EmotionalChatCardProps {
  emotionalAdvice: EmotionalAdvice;
  isLocked: boolean;
  onUnlock: () => void;
}

const emotionKeywords: Record<string, string[]> = {
  '孤独': ['孤独', '孤单', '一个人', '寂寞', '没人陪'],
  '压力': ['压力', '累', '疲惫', '工作', '忙', '加班', '辛苦'],
  '感情': ['吵架', '男朋友', '女朋友', '感情', '分手', '失恋', '爱', '恋爱'],
  '迷茫': ['迷茫', '未来', '方向', '不知道', '困惑', '不知道该怎么办'],
  '焦虑': ['焦虑', '担心', '害怕', '紧张', '不安', '烦躁'],
  '难过': ['难过', '伤心', '哭', '痛苦', '委屈', '悲伤'],
  '开心': ['开心', '快乐', '高兴', '幸福', '喜悦'],
  '朋友': ['朋友', '友情', '闺蜜', '兄弟', '好朋友'],
  '家庭': ['家庭', '父母', '亲情', '爸妈', '家人'],
  '学习': ['学习', '考试', '成绩', '作业', '上学'],
  '工作': ['工作', '职场', '同事', '领导', '升职', '上班'],
  '自我': ['自信', '自卑', '自我', '接纳', '成长']
};

function extractKeywords(input: string): string[] {
  const keywords: string[] = [];
  for (const emotionKeywords of Object.values(emotionKeywords)) {
    for (const keyword of emotionKeywords) {
      if (input.includes(keyword)) {
        keywords.push(keyword);
      }
    }
  }
  return keywords;
}

function getFallbackResponse(input: string, conversationCount: number): string {
  const emotion = detectEmotion(input);
  const keywords = extractKeywords(input);
  
  const scenarioResult = getScenarioResponse(input);
  if (scenarioResult) {
    if (conversationCount > 0 && scenarioResult.followUp && Math.random() < 0.4) {
      return scenarioResult.response + '\n\n' + scenarioResult.followUp;
    }
    return scenarioResult.response;
  }
  
  if (conversationCount < 2) {
    const understandingResponse = understandingResponses[Math.floor(Math.random() * understandingResponses.length)];
    if (Math.random() < 0.5) {
      return understandingResponse;
    }
    
    if (emotion) {
      const tips = getEmotionalTips(emotion);
      if (tips.length > 0) {
        const randomTip = tips[Math.floor(Math.random() * tips.length)];
        return `${understandingResponse}\n\n给你一个小建议：${randomTip}`;
      }
    }
    
    return understandingResponse;
  } else {
    const responseType = Math.random();
    
    if (responseType < 0.3) {
      const knowledge = getRandomKnowledge(keywords);
      if (knowledge) {
        return `${knowledge.title}：${knowledge.description}\n\n${knowledge.application}`;
      }
    } else if (responseType < 0.5) {
      if (emotion) {
        const tips = getEmotionalTips(emotion);
        if (tips.length > 0) {
          const randomTip = tips[Math.floor(Math.random() * tips.length)];
          return `给你一个小建议：${randomTip}`;
        }
      }
    } else if (responseType < 0.7) {
      const method = getTherapyMethod(keywords);
      if (method) {
        return `推荐一个实用的方法：${method.name}\n${method.description}\n\n步骤：\n${method.steps.slice(0, 3).join('\n')}`;
      }
    } else if (responseType < 0.9) {
      return getDeepPrompt();
    } else {
      return understandingResponses[Math.floor(Math.random() * understandingResponses.length)];
    }
  }
  
  return understandingResponses[Math.floor(Math.random() * understandingResponses.length)];
}

export default function EmotionalChatCard({ emotionalAdvice, isLocked, onUnlock }: EmotionalChatCardProps) {
  const [userInput, setUserInput] = useState('');
  const [messages, setMessages] = useState<{ type: 'user' | 'ai'; content: string }[]>([
    { type: 'ai', content: emotionalAdvice.response }
  ]);
  const [isRecording, setIsRecording] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [aiResponseContent, setAiResponseContent] = useState('');
  const chatHistoryRef = useRef<ChatMessage[]>([]);

  const addMessage = async (content: string, type: 'user' | 'ai') => {
    setMessages(prev => [...prev, { type, content }]);
    
    if (type === 'user') {
      setIsTyping(true);
      setAiResponseContent('');
      
      chatHistoryRef.current.push({ role: 'user', content });
      
      let fullResponse = '';
      let useStream = true;
      
      try {
        if (useStream) {
          const stream = getAIResponseStream(content, chatHistoryRef.current);
          for await (const chunk of stream) {
            fullResponse += chunk;
            setAiResponseContent(fullResponse);
          }
        } else {
          fullResponse = await getAIResponse(content, chatHistoryRef.current);
          setAiResponseContent(fullResponse);
        }
      } catch (error) {
        console.warn('[EmotionalChat] AI API failed, falling back to local database');
        const conversationCount = Math.floor(messages.length / 2);
        fullResponse = getFallbackResponse(content, conversationCount);
        setAiResponseContent(fullResponse);
      }
      
      chatHistoryRef.current.push({ role: 'assistant', content: fullResponse });
      
      if (chatHistoryRef.current.length > 8) {
        chatHistoryRef.current = chatHistoryRef.current.slice(-8);
      }
      
      setMessages(prev => [...prev, { type: 'ai', content: fullResponse }]);
      setAiResponseContent('');
      setIsTyping(false);
    }
  };

  const handleSubmit = () => {
    if (!userInput.trim()) {
      Taro.showToast({ title: '请说出你的心里话...', icon: 'none' });
      return;
    }

    if (isLocked) {
      Taro.showModal({
        title: '需要开通会员',
        content: '开通会员后可享受完整的情感陪伴服务，立即开通？',
        success: (res) => {
          if (res.confirm) {
            onUnlock();
          }
        }
      });
      return;
    }
    
    addMessage(userInput, 'user');
    setUserInput('');
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
      Taro.showToast({ title: '正在倾听...请说', icon: 'none', duration: 0 });
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      if (transcript && transcript.trim()) {
        setUserInput(transcript);
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

  return (
    <Card className={styles.emotionalCard} padding="lg">
      <View className={styles.cardHeader}>
        <Text className={styles.cardIcon}>💝</Text>
        <Text className={styles.cardTitle}>心语</Text>
        <Text className={styles.cardSubtitle}>你的灵魂伴侣，随时倾听你的心声</Text>
      </View>
      
      <View className={styles.contentWrapper}>
        <View className={styles.messageList}>
          {messages.map((msg, index) => (
            <View key={index} className={`${styles.message} ${msg.type === 'user' ? styles.userMessage : styles.aiMessage}`}>
              {msg.type === 'ai' && <Text className={styles.avatar}>💝</Text>}
              <View className={styles.messageBubble}>
                <Text className={styles.messageText}>{msg.content}</Text>
              </View>
            </View>
          ))}
          {isTyping && (
            <View className={`${styles.message} ${styles.aiMessage}`}>
              <Text className={styles.avatar}>💝</Text>
              <View className={styles.messageBubble}>
                {aiResponseContent ? (
                  <Text className={styles.messageText}>{aiResponseContent}</Text>
                ) : (
                  <Text className={styles.typingIndicator}>
                    <Text className={styles.dot}></Text>
                    <Text className={styles.dot}></Text>
                    <Text className={styles.dot}></Text>
                  </Text>
                )}
              </View>
            </View>
          )}
        </View>
        {isLocked && messages.length <= 1 && <LockOverlay onClick={onUnlock} />}
      </View>
      
      <View className={styles.inputSection}>
        <View className={styles.inputRow}>
          <Textarea
            className={styles.input}
            placeholder="和心语说说心里话..."
            value={userInput}
            onInput={(e) => setUserInput(e.detail.value)}
            onConfirm={handleSubmit}
            maxlength={200}
            style={{ height: '120px', maxHeight: '120px', resize: 'none', overflowY: 'auto' }}
          />
        </View>
        <View className={styles.buttonRow}>
          <Button className={styles.sendBtn} onClick={handleSubmit}>
            <Text className={styles.sendBtnText}>发送</Text>
          </Button>
          <Button className={styles.voiceBtn} onClick={handleVoiceInput}>
            <Text className={styles.voiceIcon}>{isRecording ? '🔴' : '🎤'}</Text>
          </Button>
        </View>
      </View>
    </Card>
  );
}