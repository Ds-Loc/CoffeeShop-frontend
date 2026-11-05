import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { orderQueryOptions, ordersQueryOptions, updateOrderStatus } from './api'
import type { Order, OrderStatus } from './types'

/**
 * Hook truy vấn danh sách đơn hàng qua TanStack Query (Server State)
 */
export const useOrders = () => {
  return useQuery({
    ...ordersQueryOptions,
  })
}

/**
 * Hook truy vấn chi tiết một đơn hàng theo ID
 */
export const useOrder = (orderId: string) => {
  return useQuery({
    ...orderQueryOptions(orderId),
  })
}

/**
 * Mutation: Cập nhật trạng thái đơn hàng (Dành cho Admin/Barista)
 * Tự động gọi queryClient.invalidateQueries({ queryKey: ['orders'] }) để cập nhật giao diện
 */
export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: OrderStatus }) => updateOrderStatus({ id, status }),
    onMutate: async ({ id, status }) => {
      await queryClient.cancelQueries({ queryKey: ['orders'] })

      const previousOrders = queryClient.getQueryData<Order[]>(['orders'])
      const previousOrder = queryClient.getQueryData<Order>(['orders', id])

      queryClient.setQueryData<Order[]>(['orders'], (orders) =>
        orders?.map((order) => (order.id === id ? { ...order, status } : order)),
      )
      queryClient.setQueryData<Order>(['orders', id], (order) => (order ? { ...order, status } : order))

      return { id, previousOrders, previousOrder }
    },
    onError: (_error, _variables, context) => {
      if (!context) return
      if (context.previousOrders) queryClient.setQueryData(['orders'], context.previousOrders)
      if (context.previousOrder) queryClient.setQueryData(['orders', context.id], context.previousOrder)
    },
    onSuccess: (updatedOrder) => {
      // Replace optimistic detail data with the server response.
      queryClient.setQueryData(['orders', updatedOrder.id], updatedOrder)
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['orders'] }),
  })
}
