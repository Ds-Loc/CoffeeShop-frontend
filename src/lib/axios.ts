import axios from 'axios'

export const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
  withCredentials: false,
})

// Bóc sẵn `data` để lời gọi API gọn hơn; lỗi được chuẩn hoá về payload của server (nếu có).
axiosClient.interceptors.response.use(
  (response) => response.data,
  (error) => Promise.reject(error?.response?.data ?? error),
)
