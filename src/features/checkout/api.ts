import type { Order } from '@/features/orders/types'
import { createMockOrderAggregate, mapMockOrderToUi } from '@/features/orders/data/mapper'
import { getSession } from '@/features/auth/auth.store'
import type { PlaceOrderPayload } from './types'

const SIMULATED_LATENCY_MS = 900

/**
 * Giả lập thanh toán và tạo đơn. Khi backend sẵn sàng, thay bằng:
 *   return axiosClient.post<unknown, Order>('/orders', payload)
 */
export const placeOrder = async (payload: PlaceOrderPayload): Promise<Order> => {
  await new Promise((resolve) => window.setTimeout(resolve, SIMULATED_LATENCY_MS))

  const aggregate = createMockOrderAggregate(payload)
  const order = mapMockOrderToUi(aggregate, payload.items)
  const session = getSession()
  return session ? { ...order, customerEmail: session.email, customerName: session.name } : order
}
