import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { cartActions } from '@/features/cart/cart.store'
import { ordersActions } from '@/features/orders/orders.store'
import { placeOrder } from './api'

export const usePlaceOrder = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: placeOrder,
    onSuccess: async (order) => {
      ordersActions.add(order)
      // Invalidate server state của query 'orders' để trang admin và lịch sử đơn đồng bộ dữ liệu mới
      await queryClient.invalidateQueries({ queryKey: ['orders'] })
      // Cập nhật sẵn dữ liệu cho query chi tiết của order vừa tạo
      queryClient.setQueryData(['orders', order.id], order)
      // Chuyển trang trước rồi mới xoá giỏ để trang checkout không nhấp nháy giỏ rỗng.
      await navigate({ to: '/orders/$orderId', params: { orderId: order.id } })
      cartActions.clear()
    },
  })
}
