import { queryOptions } from '@tanstack/react-query'
import { axiosClient } from '@/lib/axios'
import type { Order, OrderStatus } from './types'

export const ordersQueryKey = ['orders'] as const
export const orderQueryKey = (orderId: string) => ['orders', orderId] as const

export const fetchOrders = async (): Promise<Order[]> => {
  const orders = await axiosClient.get<Order[], Order[]>('/orders')
  if (!Array.isArray(orders)) {
    throw new Error('Dữ liệu danh sách đơn hàng không hợp lệ.')
  }
  return orders
}

export const fetchOrderById = (orderId: string): Promise<Order> =>
  axiosClient.get<Order, Order>(`/orders/${encodeURIComponent(orderId)}`)

export const updateOrderStatus = ({
  id,
  status,
}: {
  id: string
  status: OrderStatus
}): Promise<Order> =>
  axiosClient.patch<Order, Order>(
    `/orders/${encodeURIComponent(id)}/status`,
    { status },
  )

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
