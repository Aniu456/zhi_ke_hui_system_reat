import { createContext, useContext } from 'react'

// 认证上下文，替代Vue项目中的Pinia状态管理
export const AuthContext = createContext()

// 自定义hook，用于在组件中访问认证上下文
export function useAuth() {
  return useContext(AuthContext)
}
