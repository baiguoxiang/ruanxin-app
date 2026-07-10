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
import { getDailySeed, seededRandom } from '@/utils/dailyRandom'
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

  const filteredContent = {
    jokes: getJokesByCategory(currentCategory),
    stories: getStoriesByCategory(currentCategory),
    news: getNewsByCategory(currentCategory),
    articles: getEmotionalArticlesByCategory(currentCategory)
  }

  useEffect(() => {
    const seedOffset = {
      jokes: 0,
      stories: 1000,
      news: 2000,
      articles: 3000
    }
    const seed = getDailySeed() + seedOffset[activeTab]
    const random = seededRandom(seed)
    const total = filteredContent[activeTab].length
    const dailyIndex = total > 0 ? Math.floor(random() * total) : 0
    setCurrentIndex(dailyIndex)
  }, [activeTab, currentCategory])

  useEffect(() => {
    const updateContent = () => {
      const today = getDailySeed()
      const seedOffset = {
        jokes: 0,
        stories: 1000,
        news: 2000,
        articles: 3000
      }
      const seed = today + seedOffset[activeTab]
      const random = seededRandom(seed)
      const total = filteredContent[activeTab].length
      const dailyIndex = total > 0 ? Math.floor(random() * total) : 0
      setCurrentIndex(dailyIndex)
      localStorage.setItem('contentDate', String(today))
    }

    const getNextUpdateTime = () => {
      const now = new Date()
      const nextUpdate = new Date(now)
      nextUpdate.setHours(6, 0, 0, 0)
      if (now >= nextUpdate) {
        nextUpdate.setDate(nextUpdate.getDate() + 1)
      }
      return nextUpdate.getTime() - now.getTime()
    }

    const interval = setInterval(() => {
      const today = getDailySeed()
      const storedDate = localStorage.getItem('contentDate')
      if (storedDate !== String(today)) {
        updateContent()
      }
    }, 60000)

    const dailyTimer = setTimeout(() => {
      updateContent()
      setInterval(() => {
        updateContent()
      }, 24 * 60 * 60 * 1000)
    }, getNextUpdateTime())

    return () => {
      clearInterval(interval)
      clearTimeout(dailyTimer)
    }
  }, [activeTab, currentCategory])

  const currentContent = filteredContent[activeTab]
  const total = currentContent.length
  const currentIndexClamped = total > 0 ? currentIndex % total : 0
  const currentItem = currentContent[currentIndexClamped]

  const handlePrev = () => {
    if (currentIndexClamped > 0) {
      setCurrentIndex(currentIndex - 1)
    }
  }

  const handleNext = () => {
    if (currentIndexClamped < total - 1) {
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
      const [isSpeaking, setIsSpeaking] = useState(false)
      
      const handleSpeak = () => {
        if (isSpeaking) {
          window.speechSynthesis.cancel()
          setIsSpeaking(false)
        } else {
          const utterance = new SpeechSynthesisUtterance(`${item.title}。${item.content}`)
          utterance.lang = 'zh-CN'
          utterance.rate = 0.9
          utterance.onend = () => setIsSpeaking(false)
          utterance.onerror = () => setIsSpeaking(false)
          window.speechSynthesis.speak(utterance)
          setIsSpeaking(true)
        }
      }
      
      return (
        <View className={styles.contentItem}>
          <View className={styles.contentHeader}>
            <Text className={styles.categoryTag}>{item.category}</Text>
            <Text className={styles.dateText}>{item.date}</Text>
            <Button className={`${styles.speakButton} ${isSpeaking ? styles.speaking : ''}`} onClick={handleSpeak}>
              <Text>{isSpeaking ? '⏹️' : '🔊'}</Text>
              <Text>{isSpeaking ? '停止朗读' : '朗读'}</Text>
            </Button>
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
  }

  return (
    <Card className={styles.contentCard} padding="lg">
      <View className={styles.cardHeader}>
        <Text className={styles.cardIcon}>{activeTab === 'articles' ? '💝' : '📖'}</Text>
        <Text className={styles.cardTitle}>{activeTab === 'articles' ? '情感短文' : '暖心驿站'}</Text>
        <Text className={styles.cardSubtitle}>
          {activeTab === 'articles' ? '治愈 · 释怀 · 自信' : '笑话 · 故事 · 资讯'}
        </Text>
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
          className={`${styles.navButton} ${currentIndexClamped === 0 ? styles.disabled : ''}`}
          onClick={handlePrev}
          disabled={currentIndexClamped === 0}
        >
          <Text>← 上一个</Text>
        </Button>
        <Text className={styles.pageIndicator}>
          {currentIndexClamped + 1} / {total}
        </Text>
        <Button
          className={`${styles.navButton} ${currentIndexClamped === total - 1 ? styles.disabled : ''}`}
          onClick={handleNext}
          disabled={currentIndexClamped === total - 1}
        >
          <Text>下一个 →</Text>
        </Button>
      </View>
    </Card>
  )
}