import { http, HttpResponse, delay } from 'msw'
import { getApiUrl } from '@/mocks/utils'

export const testConnectionHandlers = [
  // GET /hello - Kiểm tra kết nối backend
  http.get(getApiUrl('/hello'), async () => {
    await delay(100)
    return HttpResponse.json({
      status: 'ok',
      message: 'Hello from MSW Mock Server! Backend connection is active.',
      timestamp: new Date().toISOString(),
    })
  }),
  http.get('/hello', async () => {
    await delay(100)
    return HttpResponse.json({
      status: 'ok',
      message: 'Hello from MSW Mock Server! Backend connection is active.',
      timestamp: new Date().toISOString(),
    })
  }),
]
