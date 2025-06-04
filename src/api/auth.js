import request from '../utils/request'

/**
 * 用户登录
 * @param {Object} data - 登录参数
 * @param {string} data.username - 用户名
 * @param {string} data.password - 密码
 * @returns {Promise}
 */
export const login = (data) => {
  return request.post('/auth/login', data)
}

/**
 * 用户注册
 * @param {Object} data - 注册参数
 * @returns {Promise}
 */
export const register = (data) => {
  return request.post('/auth/register', data)
}

/**
 * 获取当前用户信息
 * @returns {Promise}
 */
export const getCurrentUser = () => {
  return request.get('/auth/me')
}

/**
 * 退出登录
 * @returns {Promise}
 */
export const logout = () => {
  return request.post('/auth/logout')
}

export default {
  login,
  register,
  getCurrentUser,
  logout,
}
