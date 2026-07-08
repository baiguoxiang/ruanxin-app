import Taro from '@tarojs/taro'
import login from '../data/login'
import checkSubscription from '../data/checkSubscription'
import contentDB from '../data/contentDB'
import addFavorite from '../data/addFavorite'
import getUserFavorites from '../data/getUserFavorites'
import removeFavorite from '../data/removeFavorite'
import createOrder from '../data/createOrder'

const isWeapp = process.env.TARO_ENV === 'weapp'

const mockModules: Record<string, (data?: Record<string, any>) => any> = {
  login,
  checkSubscription,
  contentDB,
  addFavorite,
  getUserFavorites,
  removeFavorite,
  createOrder,
}

export async function callFunction<T = any>(
  name: string,
  data?: Record<string, any>
): Promise<T> {
  if (!isWeapp) {
    const mockModule = mockModules[name]
    if (!mockModule) {
      console.error(`[Cloud] Mock module not found: ${name}`)
      throw new Error(`模块不存在: ${name}`)
    }
    return mockModule(data) as T
  }
  const res = await Taro.cloud.callFunction({ name, data })
  const result = res.result as { code: number; message: string; data: T }
  if (result.code !== 0) {
    console.error(`[Cloud] ${name} failed:`, result.message)
    throw new Error(result.message || '请求失败')
  }
  return result.data
}

export function getDatabase() {
  if (!isWeapp) {
    return null
  }
  return Taro.cloud.database()
}
