import axios from 'axios'
import { queryOptions } from '@tanstack/react-query'
import { axiosClient } from '@/lib/axios'
import { uiActions } from '@/lib/ui.store'
import { ordersActions } from './orders.store'
import type { Order, OrderStatus } from './types'

const pendingStatusUpdates = new Set<string>()

const getErrorMessage = (error: unknown): string => {
  if (typeof error === 'string' && error.trim()) return error

  if (axios.isAxiosError(error) && !error.response) {
    return 'Không thể kết nối máy chủ. Vui lòng kiểm tra mạng và thử lại.'
  }

  if (typeof error === 'object' && error !== null) {
    if ('message' in error && typeof error.message === 'string' && error.message.trim()) {
      return error.message
    }
    if ('error' in error && typeof error.error === 'string' && error.error.trim()) {
      return error.error
    }
  }

  return 'Vui lòng thử lại.'
}

export const ordersQueryKey = ['orders'] as const
export const orderQueryKey = (orderId: string) => ['orders', orderId] as const

export const fetchOrders = async (): Promise<Order[]> => {
  const orders = await axiosClient.get<Order[], Order[]>('/orders')
  if (!Array.isArray(orders)) {
    throw new Error('Dữ liệu danh sách đơn hàng không hợp lệ.')
  }

  ordersActions.setAll(orders)
  return orders
}

export const fetchOrderById = (orderId: string): Promise<Order> =>
  axiosClient.get<Order, Order>(`/orders/${encodeURIComponent(orderId)}`)

export const updateOrderStatus = async ({
  id,
  status,
}: {
  id: string
  status: OrderStatus
}): Promise<Order | null> => {
  if (pendingStatusUpdates.has(id)) {
    uiActions.showErrorToast(`Đơn #${id} đang được cập nhật. Vui lòng thử lại.`)
    return null
  }

  const previousOrder = ordersActions.getById(id)
  if (!previousOrder) {
    uiActions.showErrorToast(`Không tìm thấy đơn #${id}.`)
    return null
  }
  if (previousOrder.status === status) return previousOrder

  pendingStatusUpdates.add(id)
  ordersActions.setStatus(id, status)

  try {
    const updatedOrder = await axiosClient.patch<Order, Order>(
      `/orders/${encodeURIComponent(id)}/status`,
      { status },
    )
    ordersActions.setStatus(id, updatedOrder.status)
    return updatedOrder
  } catch (error) {
    ordersActions.setStatus(id, previousOrder.status)
    uiActions.showErrorToast(
      `Không thể cập nhật đơn #${id}: ${getErrorMessage(error)}`,
    )
    return null
  } finally {
    pendingStatusUpdates.delete(id)
  }
}

export const ordersQueryOptions = queryOptions({
  queryKey: ordersQueryKey,
  queryFn: fetchOrders,
})

export const orderQueryOptions = (orderId: string) =>
  queryOptions({
    queryKey: orderQueryKey(orderId),
    queryFn: () => fetchOrderById(orderId),
    enabled: Boolean(orderId),
  })
