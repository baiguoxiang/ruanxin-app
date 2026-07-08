import React, { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import type { User, Subscription, DailyContent, Favorite, CustomTask, HistoryItem } from '@/types';

interface UserPet {
  type: 'dog' | 'cat' | 'chicken';
  name: string;
  feedCount: number;
  lastFeedDate: string;
  createdAt: string;
}

interface AppContextType {
  user: User | null;
  subscription: Subscription;
  dailyContent: DailyContent | null;
  favorites: Favorite[];
  history: HistoryItem[];
  customTasks: CustomTask[];
  pets: UserPet[];
  petDiscount: number;
  setUser: (user: User | null) => void;
  setSubscription: (subscription: Subscription) => void;
  setDailyContent: (content: DailyContent | null) => void;
  setFavorites: (favorites: Favorite[]) => void;
  addFavorite: (item: Omit<Favorite, 'id' | 'createTime'>) => void;
  removeFavorite: (id: string) => void;
  addHistory: (item: Omit<HistoryItem, 'id' | 'visitTime'>) => void;
  clearHistory: () => void;
  setCustomTasks: (tasks: CustomTask[]) => void;
  addCustomTask: (content: string) => void;
  toggleCustomTask: (id: string) => void;
  deleteCustomTask: (id: string) => void;
  clearCustomTasks: () => void;
  setPets: (pets: UserPet[]) => void;
  addPet: (pet: UserPet) => void;
  feedPet: (index: number) => void;
  sellPet: (index: number) => void;
  setPetDiscount: (discount: number) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [subscription, setSubscription] = useState<Subscription>({
    isMember: false,
    type: null,
    expireTime: null
  });
  const [dailyContent, setDailyContent] = useState<DailyContent | null>(null);
  const [favorites, setFavorites] = useState<Favorite[]>(() => {
    const saved = localStorage.getItem('favorites');
    return saved ? JSON.parse(saved) : [];
  });
  const [history, setHistory] = useState<HistoryItem[]>(() => {
    const saved = localStorage.getItem('history');
    return saved ? JSON.parse(saved) : [];
  });
  const [customTasks, setCustomTasks] = useState<CustomTask[]>(() => {
    const saved = localStorage.getItem('customTasks');
    return saved ? JSON.parse(saved) : [];
  });
  const [pets, setPets] = useState<UserPet[]>(() => {
    const saved = localStorage.getItem('userPets');
    return saved ? JSON.parse(saved) : [];
  });
  const [petDiscount, setPetDiscount] = useState(() => {
    const saved = localStorage.getItem('petDiscount');
    return saved ? parseInt(saved) : 0;
  });

  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('history', JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    localStorage.setItem('customTasks', JSON.stringify(customTasks));
  }, [customTasks]);

  useEffect(() => {
    localStorage.setItem('userPets', JSON.stringify(pets));
  }, [pets]);

  useEffect(() => {
    localStorage.setItem('petDiscount', petDiscount.toString());
  }, [petDiscount]);

  const addPet = useCallback((pet: UserPet) => {
    setPets(prev => [...prev, pet]);
  }, []);

  const feedPet = useCallback((index: number) => {
    setPets(prev => prev.map((pet, i) => {
      if (i === index) {
        return {
          ...pet,
          feedCount: pet.feedCount + 1,
          lastFeedDate: new Date().toDateString()
        };
      }
      return pet;
    }));
  }, []);

  const sellPet = useCallback((index: number) => {
    setPets(prev => prev.filter((_, i) => i !== index));
  }, []);

  const addFavorite = useCallback((item: Omit<Favorite, 'id' | 'createTime'>) => {
    const newFavorite: Favorite = {
      ...item,
      id: Date.now().toString(),
      createTime: new Date().toISOString()
    };
    setFavorites(prev => [...prev, newFavorite]);
  }, []);

  const removeFavorite = useCallback((id: string) => {
    setFavorites(prev => prev.filter(f => f.id !== id));
  }, []);

  const addHistory = useCallback((item: Omit<HistoryItem, 'id' | 'visitTime'>) => {
    const newItem: HistoryItem = {
      ...item,
      id: Date.now().toString(),
      visitTime: new Date().toISOString()
    };
    setHistory(prev => {
      const filtered = prev.filter(h => h.content !== item.content);
      return [newItem, ...filtered].slice(0, 50);
    });
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
  }, []);

  const addCustomTask = useCallback((content: string) => {
    const newTask: CustomTask = {
      id: Date.now().toString(),
      content,
      completed: false,
      createdAt: new Date().toISOString()
    };
    setCustomTasks(prev => [...prev, newTask]);
  }, []);

  const toggleCustomTask = useCallback((id: string) => {
    setCustomTasks(prev => prev.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  }, []);

  const deleteCustomTask = useCallback((id: string) => {
    setCustomTasks(prev => prev.filter(task => task.id !== id));
  }, []);

  const clearCustomTasks = useCallback(() => {
    setCustomTasks([]);
  }, []);

  return (
    <AppContext.Provider
      value={{
        user,
        subscription,
        dailyContent,
        favorites,
        history,
        customTasks,
        pets,
        petDiscount,
        setUser,
        setSubscription,
        setDailyContent,
        setFavorites,
        addFavorite,
        removeFavorite,
        addHistory,
        clearHistory,
        setCustomTasks,
        addCustomTask,
        toggleCustomTask,
        deleteCustomTask,
        clearCustomTasks,
        setPets,
        addPet,
        feedPet,
        sellPet,
        setPetDiscount
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}