import React, { useState, useEffect } from 'react';
import Taro from '@tarojs/taro';
import { View, Text, Button, Input, Textarea } from '@tarojs/components';
import Card from '../Card';
import LockOverlay from '../LockOverlay';
import styles from './index.module.scss';
import {
  Idea,
  IdeaProject,
  categorizeIdea,
  analyzeIdea,
  getCategoryIcon
} from './ideaDB';

interface IdeaCardProps {
  isLocked: boolean;
  onUnlock: () => void;
}

export interface ChatMessage {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: number;
}

export default function IdeaCard({ isLocked, onUnlock }: IdeaCardProps) {
  const [inputValue, setInputValue] = useState('');
  const [projects, setProjects] = useState<IdeaProject[]>(() => {
    const saved = localStorage.getItem('idea_projects');
    return saved ? JSON.parse(saved) : [];
  });
  const [selectedProject, setSelectedProject] = useState<IdeaProject | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showCreateProject, setShowCreateProject] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');

  useEffect(() => {
    localStorage.setItem('idea_projects', JSON.stringify(projects));
  }, [projects]);

  const createProject = (name: string, description: string) => {
    const now = new Date();
    const category = categorizeIdea(description);
    const project: IdeaProject = {
      id: `${now.getTime()}`,
      name: name || '新项目',
      category,
      description,
      createdAt: now.getTime(),
      ideas: []
    };
    setProjects(prev => [project, ...prev]);
    setSelectedProject(project);
    setShowCreateProject(false);
    setNewProjectName('');
    setInputValue('');
    
    setChatMessages([{
      id: '1',
      type: 'ai',
      content: `🎉 新项目创建成功！我来帮你分析这个创意：\n\n${analyzeIdea(description, category).encouragement}`,
      timestamp: now.getTime()
    }]);
    
    Taro.showToast({ title: '项目已创建！', icon: 'success' });
  };

  const addIdeaToProject = (content: string) => {
    if (!selectedProject) {
      createProject(content.slice(0, 10), content);
      return;
    }

    const category = categorizeIdea(content);
    const now = new Date();
    const idea: Idea = {
      id: `${now.getTime()}`,
      content,
      category,
      timestamp: now.getTime(),
      date: `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
    };

    setProjects(prev => prev.map(p => 
      p.id === selectedProject.id 
        ? { ...p, ideas: [...p.ideas, idea], category }
        : p
    ));

    setChatMessages(prev => [...prev, {
      id: `${now.getTime()}-user`,
      type: 'user',
      content,
      timestamp: now.getTime()
    }]);

    setIsAnalyzing(true);
    setInputValue('');

    setTimeout(() => {
      const analysis = analyzeIdea(content, category);
      
      setChatMessages(prev => [...prev, {
        id: `${now.getTime()}-ai`,
        type: 'ai',
        content: `${analysis.encouragement}\n\n📊 **创意分析**：${analysis.analysis}\n\n📋 **实现步骤**：\n${analysis.steps.map((step, i) => `${i + 1}. ${step}`).join('\n')}`,
        timestamp: now.getTime() + 1
      }]);
      
      setIsAnalyzing(false);
    }, 1500);
  };

  const handleSend = () => {
    if (!inputValue.trim()) {
      Taro.showToast({ title: '请输入创意灵感', icon: 'none' });
      return;
    }

    if (isLocked) {
      Taro.showModal({
        title: '需要开通会员',
        content: '开通会员后可享受完整的创意灵感手札服务，立即开通？',
        success: (res) => {
          if (res.confirm) {
            onUnlock();
          }
        }
      });
      return;
    }

    if (!selectedProject) {
      setShowCreateProject(true);
      return;
    }

    addIdeaToProject(inputValue.trim());
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

  const deleteProject = (id: string) => {
    Taro.showModal({
      title: '确认删除',
      content: '确定要删除这个项目吗？',
      success: (res) => {
        if (res.confirm) {
          setProjects(prev => prev.filter(p => p.id !== id));
          if (selectedProject?.id === id) {
            setSelectedProject(null);
            setChatMessages([]);
          }
          Taro.showToast({ title: '已删除', icon: 'success' });
        }
      }
    });
  };

  return (
    <View className={styles.cardContainer}>
      <Card className={styles.ideaCard} padding="lg">
        <View className={styles.cardHeader}>
          <Text className={styles.cardIcon}>💡</Text>
          <Text className={styles.cardTitle}>创意灵感手札</Text>
          <Text className={styles.cardSubtitle}>捕捉灵感，点亮创意</Text>
        </View>

        <View className={styles.contentWrapper}>
          {showCreateProject ? (
            <View className={styles.createProjectArea}>
              <View className={styles.createTitle}>📝 创建新项目</View>
              <Input
                className={styles.projectInput}
                placeholder="给项目起个名字"
                value={newProjectName}
                onInput={(e) => setNewProjectName(e.detail.value)}
              />
              <View className={styles.createButtons}>
                <Button className={styles.createButton} onClick={() => createProject(newProjectName, inputValue)}>
                  创建并开始
                </Button>
                <Button className={styles.cancelButton} onClick={() => {
                  setShowCreateProject(false);
                  setNewProjectName('');
                }}>
                  取消
                </Button>
              </View>
            </View>
          ) : selectedProject ? (
            <View className={styles.chatArea}>
              <View className={styles.chatHeader}>
                <Button className={styles.backButton} onClick={() => {
                  setSelectedProject(null);
                  setChatMessages([]);
                }}>
                  <Text>← 返回</Text>
                </Button>
                <View className={styles.projectInfo}>
                  <Text className={styles.projectIcon}>{getCategoryIcon(selectedProject.category)}</Text>
                  <Text className={styles.projectName}>{selectedProject.name}</Text>
                </View>
                <Button className={styles.deleteProjectBtn} onClick={() => deleteProject(selectedProject.id)}>
                  <Text>🗑️</Text>
                </Button>
              </View>

              <View className={styles.messageList}>
                {chatMessages.map(msg => (
                  <View key={msg.id} className={`${styles.message} ${msg.type === 'user' ? styles.userMessage : styles.aiMessage}`}>
                    {msg.type === 'ai' && <Text className={styles.avatar}>💡</Text>}
                    <View className={styles.messageBubble}>
                      <Text className={styles.messageText}>{msg.content}</Text>
                    </View>
                  </View>
                ))}
                {isAnalyzing && (
                  <View className={`${styles.message} ${styles.aiMessage}`}>
                    <Text className={styles.avatar}>💡</Text>
                    <View className={styles.messageBubble}>
                      <Text className={styles.typingIndicator}>
                        <Text className={styles.dot}></Text>
                        <Text className={styles.dot}></Text>
                        <Text className={styles.dot}></Text>
                      </Text>
                    </View>
                  </View>
                )}
              </View>
            </View>
          ) : (
            <View className={styles.projectsArea}>
              <View className={styles.projectsHeader}>
                <Text className={styles.projectsTitle}>我的创意项目</Text>
                <Text className={styles.projectsCount}>{projects.length}个</Text>
              </View>
              
              {projects.length > 0 ? (
                <View className={styles.projectsList}>
                  {projects.map(project => (
                    <Button 
                      key={project.id} 
                      className={styles.projectItem}
                      onClick={() => {
                        setSelectedProject(project);
                        setChatMessages([{
                          id: 'welcome',
                          type: 'ai',
                          content: `欢迎回来！继续完善 "${project.name}" 这个项目吧～\n\n上次的想法：${project.description}`,
                          timestamp: Date.now()
                        }]);
                      }}
                    >
                      <Text className={styles.projectIcon}>{getCategoryIcon(project.category)}</Text>
                      <View className={styles.projectContent}>
                        <Text className={styles.projectName}>{project.name}</Text>
                        <Text className={styles.projectDesc}>{project.description}</Text>
                      </View>
                      <Text className={styles.projectIdeaCount}>{project.ideas.length}个想法</Text>
                    </Button>
                  ))}
                </View>
              ) : (
                <View className={styles.emptyState}>
                  <Text className={styles.emptyIcon}>✨</Text>
                  <Text className={styles.emptyText}>还没有任何创意项目</Text>
                  <Text className={styles.emptyHint}>输入一个想法，开始你的第一个创意项目</Text>
                </View>
              )}
            </View>
          )}

          {isLocked && <LockOverlay onClick={onUnlock} />}
        </View>
      </Card>

      <View className={styles.inputSection}>
        <View className={styles.inputRow}>
          <Textarea
            className={styles.input}
            placeholder={selectedProject ? '继续添加想法...' : '输入你的创意灵感...'}
            value={inputValue}
            onInput={(e) => setInputValue(e.detail.value)}
            onConfirm={handleSend}
            maxlength={200}
            style={{ height: '120px', maxHeight: '120px', resize: 'none', overflowY: 'auto' }}
          />
        </View>
        <View className={styles.buttonRow}>
          <Button className={styles.sendBtn} onClick={handleSend}>
            <Text className={styles.sendBtnText}>{selectedProject ? '添加' : '开始'}</Text>
          </Button>
          <Button className={styles.voiceBtn} onClick={handleVoiceInput}>
            <Text className={styles.voiceIcon}>{isRecording ? '🔴' : '🎤'}</Text>
          </Button>
        </View>
      </View>
    </View>
  );
}