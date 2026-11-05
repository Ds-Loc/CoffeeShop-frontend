import { http, HttpResponse, delay } from 'msw'
import { getApiUrl } from '@/mocks/utils'
import type { Order, OrderStatus } from '../types'
import type { PlaceOrderPayload } from '@/features/checkout/types'
import { createMockOrderAggregate, mapMockOrderToUi } from '../data/mapper'
import { getSession } from '@/features/auth/auth.store'

// Dữ liệu mẫu ban đầu để demo Dashboard và lịch sử đơn hàng
const INITIAL_MOCK_ORDERS: Order[] = [
  {
    id: 'BL000101',
    items: [
      {
        key: '1:M:101',
        productId: '1',
        productName: 'Cà phê Muối Biển',
        imageUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop&q=80',
        sizeId: 'M',
        unitPrice: 55000,
        toppings: [{ id: '101', name: 'Trân châu trắng', price: 10000 }],
        quantity: 2,
      },
    ],
    subtotal: 110000,
    serviceFee: 5000,
    total: 115000,
    paymentMethod: 'wallet',
    walletProvider: 'momo',
    status: 'COMPLETED',
    customerEmail: 'minh.nguyen@example.com',
    customerName: 'Nguyễn Văn Minh',
    createdAt: new Date(Date.now() - 3600 * 1000 * 4).toISOString(),
  },
  {
    id: 'BL000102',
    items: [
      {
        key: '2:L:',
        productId: '2',
        productName: 'Trà Đào Cam Sả',
        imageUrl: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=600&auto=format&fit=crop&q=80',
        sizeId: 'L',
        unitPrice: 50000,
        toppings: [],
        quantity: 1,
      },
    ],
    subtotal: 50000,
    serviceFee: 5000,
    total: 55000,
    paymentMethod: 'card',
    status: 'PREPARING',
    customerEmail: 'lan.tran@example.com',
    customerName: 'Trần Thị Lan',
    createdAt: new Date(Date.now() - 3600 * 1000 * 2).toISOString(),
  },
  {
    id: 'BL000103',
    items: [
      {
        key: '3:M:',
        productId: '3',
        productName: 'Bạc Xỉu Sữa Dừa',
        imageUrl: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=600&auto=format&fit=crop&q=80',
        sizeId: 'M',
        unitPrice: 42000,
        toppings: [],
        quantity: 1,
      },
    ],
    subtotal: 42000,
    serviceFee: 5000,
    total: 47000,
    paymentMethod: 'wallet',
    walletProvider: 'zalopay',
    status: 'PAID',
    customerEmail: 'hoang.le@example.com',
    customerName: 'Lê Huy Hoàng',
    createdAt: new Date(Date.now() - 1000 * 60 * 20).toISOString(),
  },
]

// Mock database in-memory cho đơn hàng
const mockOrders: Order[] = [...INITIAL_MOCK_ORDERS]

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
