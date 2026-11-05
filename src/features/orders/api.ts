import { queryOptions } from '@tanstack/react-query'
import { axiosClient } from '@/lib/axios'
import { ordersActions } from './orders.store'
import type { Order, OrderStatus } from './types'

/**
 * Lấy danh sách toàn bộ đơn hàng từ Server/MSW API
 */
export const fetchOrders = async (): Promise<Order[]> => {
  try {
    const data = await axiosClient.get<Order[], Order[]>('/orders')
    if (Array.isArray(data)) {
      ordersActions.setAll(data)
      return data
    }
  } catch (error) {
    console.warn('[Orders API] fetchOrders lỗi, sử dụng fallback store:', error)
  }
  return []
}

/**
 * Lấy chi tiết một đơn hàng theo orderId
 */
export const fetchOrderById = async (orderId: string): Promise<Order> => {
  const data = await axiosClient.get<Order, Order>(`/orders/${orderId}`)
  return data
}

/**
 * Cập nhật trạng thái đơn hàng (Dành cho Barista/Admin)
 */
export const updateOrderStatus = async (params: { id: string; status: OrderStatus }): Promise<Order> => {
  const updated = await axiosClient.patch<Order, Order>(`/orders/${params.id}/status`, {
    status: params.status,
  })
  ordersActions.updateStatus(params.id, params.status)
  return updated
}

export const ordersQueryOptions = queryOptions({
  queryKey: ['orders'],
  queryFn: fetchOrders,
})

export const orderQueryOptions = (orderId: string) =>
  queryOptions({
    queryKey: ['orders', orderId],
    queryFn: () => fetchOrderById(orderId),
    enabled: Boolean(orderId),
  })
