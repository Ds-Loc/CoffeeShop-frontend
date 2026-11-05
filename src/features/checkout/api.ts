import type { Order } from '@/features/orders/types'
import { axiosClient } from '@/lib/axios'
import { createMockOrderAggregate, mapMockOrderToUi } from '@/features/orders/data/mapper'
import { getSession } from '@/features/auth/auth.store'
import type { PlaceOrderPayload } from './types'

/**
 * Thanh toán và tạo đơn hàng qua API (được MSW đánh chặn trong môi trường dev).
 */
export const placeOrder = async (payload: PlaceOrderPayload): Promise<Order> => {
  try {
    const order = await axiosClient.post<Order, Order>('/orders', payload)
    return order
  } catch (error) {
    console.warn('[Checkout API] Fallback xử lý cục bộ:', error)
    const aggregate = createMockOrderAggregate(payload)
    const order = mapMockOrderToUi(aggregate, payload.items)
    const session = getSession()
    return session ? { ...order, customerEmail: session.email, customerName: session.name } : order
  }
}
