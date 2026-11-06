import { http, HttpResponse, delay } from 'msw'
import { getApiUrl } from '@/mocks/utils'
import type { UserSession } from '../types'

export const authHandlers = [
  // POST /auth/login - Đăng nhập
  http.post(getApiUrl('/auth/login'), async ({ request }) => {
    await delay(200)
    const body = (await request.json()) as { email?: string; password?: string }
    const email = body?.email ?? 'guest@example.com'
    const role: UserSession['role'] = email.toLowerCase().includes('admin') ? 'admin' : 'customer'
    const name = email.split('@')[0].replace(/[._-]/g, ' ')
    const displayName = name.charAt(0).toUpperCase() + name.slice(1)
    const user: UserSession = { email, name: displayName, role }

    return HttpResponse.json({
      token: 'mock-jwt-token-coffeeshop',
      user,
    })
  }),
  http.post('/auth/login', async ({ request }) => {
    await delay(200)
    const body = (await request.json()) as { email?: string; password?: string }
    const email = body?.email ?? 'guest@example.com'
    const role: UserSession['role'] = email.toLowerCase().includes('admin') ? 'admin' : 'customer'
    const name = email.split('@')[0].replace(/[._-]/g, ' ')
    const displayName = name.charAt(0).toUpperCase() + name.slice(1)
    const user: UserSession = { email, name: displayName, role }

    return HttpResponse.json({
      token: 'mock-jwt-token-coffeeshop',
      user,
    })
  }),

  // POST /auth/register - Đăng ký
  http.post(getApiUrl('/auth/register'), async ({ request }) => {
    await delay(200)
    const body = (await request.json()) as { email: string; name: string }
    const user: UserSession = {
      email: body.email,
      name: body.name,
      role: 'customer',
    }
    return HttpResponse.json(
      {
        token: 'mock-jwt-token-register',
        user,
      },
      { status: 201 },
    )
  }),
  http.post('/auth/register', async ({ request }) => {
    await delay(200)
    const body = (await request.json()) as { email: string; name: string }
    const user: UserSession = {
      email: body.email,
      name: body.name,
      role: 'customer',
    }
    return HttpResponse.json(
      {
        token: 'mock-jwt-token-register',
        user,
      },
      { status: 201 },
    )
  }),

  // GET /auth/me - Lấy thông tin user hiện tại
  http.get(getApiUrl('/auth/me'), async ({ request }) => {
    await delay(100)
    const authHeader = request.headers.get('Authorization')
    if (!authHeader) {
      return HttpResponse.json({ message: 'Chưa đăng nhập' }, { status: 401 })
    }
    const user: UserSession = {
      email: 'customer@brewlite.vn',
      name: 'BrewLite Fan',
      role: 'customer',
    }
    return HttpResponse.json(user)
  }),
  http.get('/auth/me', async ({ request }) => {
    await delay(100)
    const authHeader = request.headers.get('Authorization')
    if (!authHeader) {
      return HttpResponse.json({ message: 'Chưa đăng nhập' }, { status: 401 })
    }
    const user: UserSession = {
      email: 'customer@brewlite.vn',
      name: 'BrewLite Fan',
      role: 'customer',
    }
    return HttpResponse.json(user)
  }),
]
