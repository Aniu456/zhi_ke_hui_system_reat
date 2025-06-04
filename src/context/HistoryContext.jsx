import { createContext, useState, useContext, useEffect, useCallback } from 'react';

// 历史记录上下文，替代Vue项目中的Pinia状态管理
export const HistoryContext = createContext();

export function HistoryProvider({ children }) {
  const [visitHistory, setVisitHistory] = useState([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // 从本地存储加载历史记录（只在组件挂载时执行一次）
  useEffect(() => {
    if (!isInitialized) {
      const savedHistory = localStorage.getItem('visitHistory');
      if (savedHistory) {
        try {
          setVisitHistory(JSON.parse(savedHistory));
        } catch (error) {
          console.error('Failed to parse visit history:', error);
        }
      }
      setIsInitialized(true);
    }
  }, [isInitialized]);

  // 使用useCallback优化函数，避免重新创建
  const addVisitRecord = useCallback((path, title) => {
    if (!path || !title) return;
    
    setVisitHistory(prevHistory => {
      const timestamp = Date.now();
      const newRecord = { path, title, timestamp };
      // 过滤掉相同路径的记录，并只保留最新的10条
      const newHistory = [
        newRecord,
        ...prevHistory.filter(item => item.path !== path).slice(0, 9)
      ];
      
      // 更新本地存储
      localStorage.setItem('visitHistory', JSON.stringify(newHistory));
      return newHistory;
    });
  }, []);

  // 清空历史记录
  const clearHistory = useCallback(() => {
    setVisitHistory([]);
    localStorage.removeItem('visitHistory');
  }, []);

  // 缓存上下文值，避免重新渲染
  const contextValue = {
    visitHistory,
    addVisitRecord,
    clearHistory
  };

  return (
    <HistoryContext.Provider value={contextValue}>
      {children}
    </HistoryContext.Provider>
  );
}

// 自定义Hook，方便在组件中使用
export const useHistory = () => {
  return useContext(HistoryContext);
}; 