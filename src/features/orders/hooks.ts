import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { uiActions } from '@/lib/ui.store'
import {
  orderQueryKey,
  orderQueryOptions,
  ordersQueryKey,
  ordersQueryOptions,
  updateOrderStatus,
} from './api'
import type { Order, OrderStatus } from './types'

/** Hook truy vấn danh sách đơn hàng qua TanStack Query (Server State). */
export const useOrders = () => useQuery(ordersQueryOptions)

/** Hook truy vấn chi tiết một đơn hàng theo ID. */
export const useOrder = (orderId: string) => useQuery(orderQueryOptions(orderId))

/** Mutation đổi trạng thái đơn với cache update tức thì và rollback nếu thất bại. */
export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: OrderStatus }) => updateOrderStatus({ id, status }),
    onMutate: async ({ id, status }) => {
      await queryClient.cancelQueries({ queryKey: ordersQueryKey })

      const previousOrders = queryClient.getQueryData<Order[]>(ordersQueryKey)
      const detailKey = orderQueryKey(id)
      const previousOrder = queryClient.getQueryData<Order>(detailKey)

      queryClient.setQueryData<Order[]>(ordersQueryKey, (orders) =>
        orders?.map((order) => (order.id === id ? { ...order, status } : order)),
      )
      if (previousOrder) {
        queryClient.setQueryData<Order>(detailKey, { ...previousOrder, status })
      }

      return { id, previousOrders, previousOrder }
    },
    onError: (error, { id }, context) => {
      if (context?.previousOrders) queryClient.setQueryData(ordersQueryKey, context.previousOrders)
      if (context?.previousOrder) queryClient.setQueryData(orderQueryKey(id), context.previousOrder)

      const message =
        typeof error === 'object' && error !== null && 'message' in error && typeof error.message === 'string'
          ? error.message
          : 'Vui lòng kiểm tra kết nối và thử lại.'
      uiActions.showErrorToast(`Không thể cập nhật đơn #${id}: ${message}`)
    },
    onSuccess: (updatedOrder, { id }, context) => {
      if (!updatedOrder) {
        if (context?.previousOrders) queryClient.setQueryData(ordersQueryKey, context.previousOrders)
        if (context?.previousOrder) queryClient.setQueryData(orderQueryKey(id), context.previousOrder)
        return
      }

      queryClient.setQueryData<Order[]>(ordersQueryKey, (orders) =>
        orders?.map((order) => (order.id === updatedOrder.id ? updatedOrder : order)),
      )
      queryClient.setQueryData(orderQueryKey(updatedOrder.id), updatedOrder)
    },
    onSettled: async (_data, _error, { id }) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ordersQueryKey }),
        queryClient.invalidateQueries({ queryKey: orderQueryKey(id) }),
      ])
    },
  })
}
