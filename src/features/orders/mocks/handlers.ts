import { http, HttpResponse, delay } from 'msw'
import { getApiUrl } from '@/mocks/utils'
import type { Order, OrderStatus } from '../types'
import type { PlaceOrderPayload } from '@/features/checkout/types'
import { createMockOrderAggregate, mapMockOrderToUi } from '../data/mapper'
import { getSession } from '@/features/auth/auth.store'

// Mock database in-memory cho đơn hàng
const mockOrders: Order[] = []

export const ordersHandlers = [
  // GET /orders - Danh sách đơn hàng
  http.get(getApiUrl('/orders'), async () => {
    await delay(200)
    return HttpResponse.json(mockOrders)
  }),
  http.get('/orders', async () => {
    await delay(200)
    return HttpResponse.json(mockOrders)
  }),

  // GET /orders/:id - Chi tiết đơn hàng
  http.get(getApiUrl('/orders/:id'), async ({ params }) => {
    await delay(150)
    const order = mockOrders.find((item) => item.id === params.id)
    if (!order) {
      return HttpResponse.json({ message: 'Không tìm thấy đơn hàng' }, { status: 404 })
    }
    return HttpResponse.json(order)
  }),
  http.get('/orders/:id', async ({ params }) => {
    await delay(150)
    const order = mockOrders.find((item) => item.id === params.id)
    if (!order) {
      return HttpResponse.json({ message: 'Không tìm thấy đơn hàng' }, { status: 404 })
    }
    return HttpResponse.json(order)
  }),

  // POST /orders - Tạo đơn hàng thanh toán
  http.post(getApiUrl('/orders'), async ({ request }) => {
    await delay(350)
    const payload = (await request.json()) as PlaceOrderPayload
    const aggregate = createMockOrderAggregate(payload)
    const order = mapMockOrderToUi(aggregate, payload.items)
    const session = getSession()
    const finalOrder: Order = session
      ? { ...order, customerEmail: session.email, customerName: session.name }
      : order

    mockOrders.push(finalOrder)
    return HttpResponse.json(finalOrder, { status: 201 })
  }),
  http.post('/orders', async ({ request }) => {
    await delay(350)
    const payload = (await request.json()) as PlaceOrderPayload
    const aggregate = createMockOrderAggregate(payload)
    const order = mapMockOrderToUi(aggregate, payload.items)
    const session = getSession()
    const finalOrder: Order = session
      ? { ...order, customerEmail: session.email, customerName: session.name }
      : order

    mockOrders.push(finalOrder)
    return HttpResponse.json(finalOrder, { status: 201 })
  }),

  // PATCH /orders/:id/status - Cập nhật trạng thái đơn (admin)
  http.patch(getApiUrl('/orders/:id/status'), async ({ params, request }) => {
    await delay(150)
    const { status } = (await request.json()) as { status: OrderStatus }
    const order = mockOrders.find((item) => item.id === params.id)
    if (!order) {
      return HttpResponse.json({ message: 'Không tìm thấy đơn hàng' }, { status: 404 })
    }
    order.status = status
    return HttpResponse.json(order)
  }),
  http.patch('/orders/:id/status', async ({ params, request }) => {
    await delay(150)
    const { status } = (await request.json()) as { status: OrderStatus }
    const order = mockOrders.find((item) => item.id === params.id)
    if (!order) {
      return HttpResponse.json({ message: 'Không tìm thấy đơn hàng' }, { status: 404 })
    }
    order.status = status
    return HttpResponse.json(order)
  }),
]
