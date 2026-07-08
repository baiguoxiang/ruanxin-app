import React, { useState, useEffect } from 'react'
import { View, Text, Button } from '@tarojs/components'
import Card from '@/components/Card'
import {
  jokes,
  stories,
  news,
  emotionalArticles,
  jokeCategories,
  storyCategories,
  newsCategories,
  emotionalArticleCategories,
  getJokesByCategory,
  getStoriesByCategory,
  getNewsByCategory,
  getEmotionalArticlesByCategory,
  Joke,
  Story,
  News,
  EmotionalArticle
} from '@/data/contentDB'
import styles from './index.module.scss'

type TabType = 'jokes' | 'stories' | 'news' | 'articles'

interface ContentCardProps {
  type?: TabType
}

export default function ContentCard({ type }: ContentCardProps) {
  const [activeTab, setActiveTab] = useState<TabType>(type || 'jokes')
  const [currentCategory, setCurrentCategory] = useState('全部')
  const [currentIndex, setCurrentIndex] = useState(0)

  const categories = {
    jokes: jokeCategories,
    stories: storyCategories,
    news: newsCategories,
    articles: emotionalArticleCategories
  }

  const getCurrentContent = () => {
    switch (activeTab) {
      case 'jokes':
        return getJokesByCategory(currentCategory)
      case 'stories':
        return getStoriesByCategory(currentCategory)
      case 'news':
        return getNewsByCategory(currentCategory)
      case 'articles':
        return getEmotionalArticlesByCategory(currentCategory)
      default:
        return []
    }
  }

  const currentContent = getCurrentContent()
  const total = currentContent.length
  const displayIndex = total > 0 ? currentIndex % total : 0
  const currentItem = total > 0 ? currentContent[displayIndex] : null

  useEffect(() => {
    setCurrentIndex(0)
  }, [activeTab, currentCategory])

  const handlePrev = () => {
    if (displayIndex > 0) {
      setCurrentIndex(currentIndex - 1)
    }
  }

  const handleNext = () => {
    if (displayIndex < total - 1) {
      setCurrentIndex(currentIndex + 1)
    }
  }

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab)
    setCurrentCategory('全部')
    setCurrentIndex(0)
  }

  const handleCategoryChange = (category: string) => {
    setCurrentCategory(category)
    setCurrentIndex(0)
  }

  const renderContent = () => {
    if (!currentItem) {
      return (
        <View className={styles.emptyState}>
          <Text className={styles.emptyIcon}>📭</Text>
          <Text className={styles.emptyText}>暂无内容</Text>
        </View>
      )
    }

    if (activeTab === 'jokes') {
      const item = currentItem as Joke
      return (
        <View className={styles.contentItem}>
          <View className={styles.contentHeader}>
            <Text className={styles.categoryTag}>{item.category}</Text>
            <Text className={styles.likeCount}>👍 {item.likes}</Text>
          </View>
          <View className={styles.contentBody}>
            <Text className={styles.jokeContent}>{item.content}</Text>
          </View>
        </View>
      )
    }

    if (activeTab === 'stories') {
      const item = currentItem as Story
      return (
        <View className={styles.contentItem}>
          <View className={styles.contentHeader}>
            <Text className={styles.categoryTag}>{item.category || '故事'}</Text>
            <Text className={styles.dateText}>{item.date || ''}</Text>
          </View>
          <View className={styles.contentBody}>
            <Text className={styles.storyTitle}>{item.title || ''}</Text>
            <Text className={styles.storyContent}>{item.content || ''}</Text>
            <View className={styles.storyFooter}>
              <Text className={styles.likeCount}>❤️ {item.likes || 0}</Text>
            </View>
          </View>
        </View>
      )
    }

    if (activeTab === 'news') {
      const item = currentItem as News
      return (
        <View className={styles.contentItem}>
          <View className={styles.contentHeader}>
            <Text className={styles.categoryTag}>{item.category}</Text>
            <Text className={styles.dateText}>{item.date}</Text>
          </View>
          <View className={styles.contentBody}>
            <Text className={styles.newsTitle}>{item.title}</Text>
            <Text className={styles.newsContent}>{item.content}</Text>
            <View className={styles.newsFooter}>
              <Text className={styles.sourceText}>来源：{item.source}</Text>
              <Text className={styles.readTime}>⏱️ {item.readTime}分钟阅读</Text>
            </View>
          </View>
        </View>
      )
    }

    if (activeTab === 'articles') {
      const item = currentItem as EmotionalArticle
      return (
        <View className={styles.contentItem}>
          <View className={styles.contentHeader}>
            <Text className={styles.categoryTag}>{item.category}</Text>
            <Text className={styles.dateText}>{item.date}</Text>
          </View>
          <View className={styles.contentBody}>
            <Text className={styles.storyTitle}>{item.title}</Text>
            <Text className={styles.storyContent}>{item.content}</Text>
            <View className={styles.storyFooter}>
              <Text className={styles.likeCount}>❤️ {item.likes}</Text>
            </View>
          </View>
        </View>
      )
    }

    return null
  }

  const getTabLabels = () => {
    switch (activeTab) {
      case 'articles':
        return { title: '情感短文', subtitle: '治愈 · 释怀 · 自信', icon: '💝' }
      default:
        return { title: '暖心驿站', subtitle: '笑话 · 故事 · 资讯', icon: '📖' }
    }
  }

  const tabInfo = getTabLabels()

  return (
    <Card className={styles.contentCard} padding="lg">
      <View className={styles.cardHeader}>
        <Text className={styles.cardIcon}>{tabInfo.icon}</Text>
        <Text className={styles.cardTitle}>{tabInfo.title}</Text>
        <Text className={styles.cardSubtitle}>{tabInfo.subtitle}</Text>
      </View>

      <View className={styles.tabBar}>
        {activeTab === 'articles' ? (
          <Button
            className={`${styles.tabButton} ${activeTab === 'articles' ? styles.activeTab : ''}`}
            onClick={() => handleTabChange('articles')}
          >
            <Text className={styles.tabIcon}>💝</Text>
            <Text className={styles.tabLabel}>短文</Text>
            <Text className={styles.tabCount}>{emotionalArticles.length}</Text>
          </Button>
        ) : (
          <>
            <Button
              className={`${styles.tabButton} ${activeTab === 'jokes' ? styles.activeTab : ''}`}
              onClick={() => handleTabChange('jokes')}
            >
              <Text className={styles.tabIcon}>😄</Text>
              <Text className={styles.tabLabel}>笑话</Text>
              <Text className={styles.tabCount}>{jokes.length}</Text>
            </Button>
            <Button
              className={`${styles.tabButton} ${activeTab === 'stories' ? styles.activeTab : ''}`}
              onClick={() => handleTabChange('stories')}
            >
              <Text className={styles.tabIcon}>📝</Text>
              <Text className={styles.tabLabel}>经历</Text>
              <Text className={styles.tabCount}>{stories.length}</Text>
            </Button>
            <Button
              className={`${styles.tabButton} ${activeTab === 'news' ? styles.activeTab : ''}`}
              onClick={() => handleTabChange('news')}
            >
              <Text className={styles.tabIcon}>📰</Text>
              <Text className={styles.tabLabel}>资讯</Text>
              <Text className={styles.tabCount}>{news.length}</Text>
            </Button>
          </>
        )}
      </View>

      <View className={styles.categoryBar}>
        {categories[activeTab].map(category => (
          <Button
            key={category}
            className={`${styles.categoryButton} ${currentCategory === category ? styles.activeCategory : ''}`}
            onClick={() => handleCategoryChange(category)}
          >
            {category}
          </Button>
        ))}
      </View>

      <View className={styles.contentArea}>
        {renderContent()}
      </View>

      <View className={styles.navBar}>
        <Button
          className={`${styles.navButton} ${displayIndex === 0 ? styles.disabled : ''}`}
          onClick={handlePrev}
          disabled={displayIndex === 0}
        >
          <Text>← 上一个</Text>
        </Button>
        <Text className={styles.pageIndicator}>
          {displayIndex + 1} / {total}
        </Text>
        <Button
          className={`${styles.navButton} ${displayIndex === total - 1 ? styles.disabled : ''}`}
          onClick={handleNext}
          disabled={displayIndex === total - 1}
        >
          <Text>下一个 →</Text>
        </Button>
      </View>
    </Card>
  )
}