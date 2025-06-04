/**
 * 将时间戳格式化为相对时间
 * @param {number} timestamp - 时间戳
 * @returns {string} 相对时间文本
 */
export const formatRelativeTime = (timestamp) => {
  const now = Date.now()
  const diff = now - timestamp
  const minute = 60 * 1000
  const hour = minute * 60
  const day = hour * 24

  if (diff < minute) {
    return '刚刚'
  } else if (diff < hour) {
    return `${Math.floor(diff / minute)}分钟前`
  } else if (diff < day) {
    return `${Math.floor(diff / hour)}小时前`
  } else {
    const date = new Date(timestamp)
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(
      2,
      '0',
    )}`
  }
}
