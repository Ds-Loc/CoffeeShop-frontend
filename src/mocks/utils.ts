/**
 * Trả về URL khớp với axiosClient (hỗ trợ baseURL domain hoặc relative path).
 * Dùng cho cả MSW handlers và các công cụ mock mạng.
 */
export const getApiUrl = (path: string): string => {
  const base = import.meta.env.VITE_API_URL || 'http://localhost:8080'
  const cleanBase = base.replace(/\/+$/, '')
  const cleanPath = path.startsWith('/') ? path : `/${path}`
  return `${cleanBase}${cleanPath}`
}
