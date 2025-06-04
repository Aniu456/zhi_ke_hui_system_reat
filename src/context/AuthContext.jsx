import { useState, useEffect, useCallback, useMemo } from 'react';
import request from '../utils/request'; // 导入 request 工具
import { AuthContext } from './authUtils';

function AuthProvider({ children }) {
  const [token, setToken] = useState('');
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true); // 初始加载状态，可以用于等待用户信息获取

  // 计算属性
  const isLoggedIn = Boolean(token);

  // 封装的获取完整用户信息的函数
  const fetchFullUserInfo = useCallback(async (initialUserInfo, currentToken) => {
    if (initialUserInfo) {
      // 确保有用户ID（可以是sub或id）
      const userId = initialUserInfo.sub || initialUserInfo.id;
      
      if (userId && currentToken) {
        setUserInfo(initialUserInfo); // 先设置初始信息，让应用可以感知到用户已登录
        // setLoading(true); // 可选：在获取完整信息时再次显示加载状态
        try {
          // 使用userId作为用户ID
          console.log('获取完整用户信息，使用用户ID:', userId);
          const response = await request.get(`/users/${userId}`);
          const fullUserInfo = response.data; 
          if (fullUserInfo) {
            // 确保fullUserInfo也有sub字段
            if (!fullUserInfo.sub && fullUserInfo.id) {
              fullUserInfo.sub = fullUserInfo.id;
              console.log('为完整用户信息添加sub字段:', fullUserInfo);
            }
            
            setUserInfo(fullUserInfo); // 更新为完整的用户信息
            localStorage.setItem('userInfo', JSON.stringify(fullUserInfo)); // 保存完整的用户信息到localStorage
          }
        } catch (error) {
          console.error('Failed to fetch full user info:', error);
          // 获取失败，userInfo 保持为 initialUserInfo
        } finally {
          setLoading(false); // 无论成功失败，结束加载状态
        }
      } else {
        // 如果没有 userId 或 token
        // 确保初始用户信息至少有sub字段（如果有id的话）
        if (!initialUserInfo.sub && initialUserInfo.id) {
          initialUserInfo = { ...initialUserInfo, sub: initialUserInfo.id };
          console.log('为初始用户信息添加sub字段:', initialUserInfo);
        }
        
        setUserInfo(initialUserInfo);
        localStorage.setItem('userInfo', JSON.stringify(initialUserInfo));
        setLoading(false); // 结束加载状态
      }
    } else {
      // 如果没有 initialUserInfo
      setUserInfo(null);
      localStorage.removeItem('userInfo');
      setLoading(false); // 结束加载状态
    }
  }, []);

  // 初始化用户状态（尝试从localStorage恢复token和基本用户信息）
  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedUserInfo = localStorage.getItem('userInfo'); // 尝试恢复基本用户信息
    
    if (savedToken) {
      setToken(savedToken);
      if (savedUserInfo) {
        try {
          const parsedUserInfo = JSON.parse(savedUserInfo);
          // 当从localStorage恢复时，也尝试获取完整的用户信息
          fetchFullUserInfo(parsedUserInfo, savedToken); 
        } catch (e) {
          console.error("Failed to parse userInfo from localStorage", e);
          localStorage.removeItem('userInfo'); // 解析失败则移除
          setLoading(false);
        }
      } else {
        setLoading(false); // 没有用户信息，直接完成加载
      }
    } else {
      setLoading(false); // 没有token，直接完成加载
    }
  }, [fetchFullUserInfo]); // 添加fetchFullUserInfo作为依赖项

  // 设置token并保存到本地存储
  const handleSetToken = useCallback((newToken) => {
    if (newToken) {
      setToken(newToken);
      localStorage.setItem('token', newToken);
    } else {
      setToken('');
      localStorage.removeItem('token');
    }
  }, []);

  // 设置用户信息，并触发获取完整信息
  const handleSetUserInfo = useCallback((info) => {
    // 确保info包含sub字段，如果没有但有id，则使用id作为sub
    let userInfoToStore = info;
    if (info && !info.sub && info.id) {
      userInfoToStore = { ...info, sub: info.id };
      console.log('添加sub字段到userInfo:', userInfoToStore);
    }

    // 先设置本地状态和localStorage
    if (userInfoToStore) {
      setUserInfo(userInfoToStore);
      localStorage.setItem('userInfo', JSON.stringify(userInfoToStore));
    }

    // 当调用setUserInfo时，例如登录成功后，会传入初始用户信息
    // 然后调用 fetchFullUserInfo 获取更详细的数据
    // token 此时应该已经通过 handleSetToken 设置好了，或者从 localStorage 恢复了
    // 我们需要确保 fetchFullUserInfo 能拿到当前的 token
    const currentToken = localStorage.getItem('token'); // 或者从 state 的 token 获取
    fetchFullUserInfo(userInfoToStore, currentToken);
  }, [fetchFullUserInfo]);

  // 清除用户信息
  const handleClearUserInfo = useCallback(() => {
    setToken('');
    setUserInfo(null);
    localStorage.removeItem('token');
    localStorage.removeItem('userInfo'); // 同时清除userInfo
  }, []);

  const contextValue = useMemo(() => ({
    token,
    userInfo,
    isLoggedIn,
    setToken: handleSetToken,
    // setUserInfo 将由内部的 fetchFullUserInfo 逻辑包装
    setUserInfo: handleSetUserInfo, 
    clearUserInfo: handleClearUserInfo,
    loading,
  }), [token, userInfo, loading, isLoggedIn, handleSetToken, handleSetUserInfo, handleClearUserInfo]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider; 