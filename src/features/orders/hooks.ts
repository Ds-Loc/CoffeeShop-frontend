import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { orderQueryOptions, ordersQueryOptions, updateOrderStatus } from './api'
import type { OrderStatus } from './types'

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
    onSuccess: (updatedOrder) => {
      // 1. Invalidate cache danh sách đơn hàng
      queryClient.invalidateQueries({ queryKey: ['orders'] })
      // 2. Set dữ liệu tươi cho chi tiết đơn vừa cập nhật
      queryClient.setQueryData(['orders', updatedOrder.id], updatedOrder)
    },
  })
}
