import { axiosClient } from '@/lib/axios'

/** Kiểm tra nhanh backend có phản hồi hay không (GET /hello). */
export const testApiConnection = async (): Promise<boolean> => {
  try {
    await axiosClient.get('/hello')
    return true
  } catch {
    return false
  }
}
