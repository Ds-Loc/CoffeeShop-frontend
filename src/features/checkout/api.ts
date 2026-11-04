import type { Order } from '@/features/orders/types'
import type { PlaceOrderPayload } from './types'

const SIMULATED_LATENCY_MS = 900

/**
 * Giả lập thanh toán và tạo đơn. Khi backend sẵn sàng, thay bằng:
 *   return axiosClient.post<unknown, Order>('/orders', payload)
 */
export const placeOrder = async (payload: PlaceOrderPayload): Promise<Order> => {
  await new Promise((resolve) => window.setTimeout(resolve, SIMULATED_LATENCY_MS))

  return {
    id: `BL${String(Date.now()).slice(-6)}`,
    items: payload.items,
    subtotal: payload.subtotal,
    serviceFee: payload.serviceFee,
    total: payload.subtotal + payload.serviceFee,
    paymentMethod: payload.paymentMethod,
    walletProvider: payload.walletProvider,
    status: 'PAID',
    createdAt: new Date().toISOString(),
  }
}
