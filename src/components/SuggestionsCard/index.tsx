import React, { useState, useEffect } from 'react';
import { View, Text, Button, Input } from '@tarojs/components';
import Taro from '@tarojs/taro';
import Card from '../Card';
import { useApp } from '@/store';
import type { SuggestionInfo } from '@/types';
import styles from './index.module.scss';

interface SuggestionsCardProps {
  suggestions: SuggestionInfo;
}

interface Task {
  id: string;
  content: string;
  completed: boolean;
  isDefault: boolean;
}

export default function SuggestionsCard({ suggestions }: SuggestionsCardProps) {
  const { customTasks, addCustomTask, toggleCustomTask, deleteCustomTask } = useApp();
  const [newTask, setNewTask] = useState('');
  const [showInput, setShowInput] = useState(false);
  const [allTasks, setAllTasks] = useState<Task[]>([]);

  useEffect(() => {
    const defaultTasks: Task[] = suggestions.tasks.map((task, index) => ({
      id: `default-${index}`,
      content: task,
      completed: false,
      isDefault: true
    }));
    
    const userTasks: Task[] = customTasks.map(task => ({
      id: task.id,
      content: task.content,
      completed: task.completed,
      isDefault: false
    }));
    
    setAllTasks([...defaultTasks, ...userTasks]);
  }, [suggestions.tasks, customTasks]);

  const handleAddTask = () => {
    if (!newTask.trim()) {
      Taro.showToast({ title: '请输入任务内容', icon: 'none' });
      return;
    }
    addCustomTask(newTask.trim());
    setNewTask('');
    setShowInput(false);
    Taro.showToast({ title: '添加成功', icon: 'success' });
  };

  const handleToggleTask = (task: Task) => {
    if (task.isDefault) {
      const updatedTasks = allTasks.map(t => 
        t.id === task.id ? { ...t, completed: !t.completed } : t
      );
      setAllTasks(updatedTasks);
    } else {
      toggleCustomTask(task.id);
    }
  };

  const handleDeleteTask = (task: Task) => {
    if (task.isDefault) {
      const updatedTasks = allTasks.filter(t => t.id !== task.id);
      setAllTasks(updatedTasks);
    } else {
      deleteCustomTask(task.id);
    }
  };

  return (
    <Card className={styles.suggestionsCard} padding="lg">
      <View className={styles.cardHeader}>
        <Text className={styles.cardIcon}>✅</Text>
        <Text className={styles.cardTitle}>今日行动清单</Text>
        <Text className={styles.taskCount}>共 {allTasks.length} 项</Text>
      </View>

      <View className={styles.addTaskSection}>
        {showInput ? (
          <View className={styles.inputWrapper}>
            <Input
              className={styles.taskInput}
              value={newTask}
              onInput={(e) => setNewTask(e.detail.value)}
              placeholder="添加你今天要做的事情..."
              onConfirm={handleAddTask}
              autoFocus
            />
            <View className={styles.inputButtons}>
              <Button className={styles.cancelButton} onClick={() => { setShowInput(false); setNewTask(''); }}>
                取消
              </Button>
              <Button className={styles.confirmButton} onClick={handleAddTask}>
                添加
              </Button>
            </View>
          </View>
        ) : (
          <Button className={styles.addButton} onClick={() => setShowInput(true)}>
            <Text className={styles.addIcon}>+</Text>
            <Text>添加任务</Text>
          </Button>
        )}
      </View>

      <View className={styles.tasksList}>
        {allTasks.length === 0 ? (
          <View className={styles.emptyState}>
            <Text className={styles.emptyIcon}>📝</Text>
            <Text className={styles.emptyText}>还没有任务，点击上方按钮添加吧</Text>
          </View>
        ) : (
          allTasks.map((task) => (
            <View key={task.id} className={styles.taskItem}>
              <Button
                className={`${styles.taskCheckbox} ${task.completed ? styles.checked : ''}`}
                onClick={() => handleToggleTask(task)}
              >
                {task.completed ? '✓' : ''}
              </Button>
              <Text className={`${styles.taskText} ${task.completed ? styles.completed : ''} ${task.isDefault ? styles.defaultText : ''}`}>
                {task.content}
              </Text>
              <Button className={styles.deleteButton} onClick={() => handleDeleteTask(task)}>
                <Text>×</Text>
              </Button>
            </View>
          ))
        )}
      </View>

      <View className={styles.tipsSection}>
        <View className={styles.tipsHeader}>
          <Text className={styles.tipsIcon}>💡</Text>
          <Text className={styles.tipsTitle}>生活好建议</Text>
        </View>
        <View className={styles.tipsList}>
          {suggestions.tips.map((tip, index) => (
            <View key={index} className={styles.tipItem}>
              <Text className={styles.tipDot}>•</Text>
              <Text className={styles.tipText}>{tip}</Text>
            </View>
          ))}
        </View>
      </View>
    </Card>
  );
}
