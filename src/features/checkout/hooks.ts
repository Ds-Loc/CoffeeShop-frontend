import { useMutation } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { cartActions } from '@/features/cart/cart.store'
import { ordersActions } from '@/features/orders/orders.store'
import { placeOrder } from './api'

export const usePlaceOrder = () => {
  const navigate = useNavigate()

  return useMutation({
    mutationFn: placeOrder,
    onSuccess: async (order) => {
      ordersActions.add(order)
      // Chuyển trang trước rồi mới xoá giỏ để trang checkout không nhấp nháy giỏ rỗng.
      await navigate({ to: '/orders/$orderId', params: { orderId: order.id } })
      cartActions.clear()
    },
  })
}
