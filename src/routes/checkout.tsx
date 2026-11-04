import { createFileRoute, redirect } from '@tanstack/react-router'
import { getSession } from '@/features/auth/auth.store'
import { getCartItems } from '@/features/cart/cart.store'
import { CheckoutPage } from '@/features/checkout/checkout-page'

export const Route = createFileRoute('/checkout')({
  // Chỉ vào được khi đã đăng nhập và giỏ hàng có món.
  beforeLoad: () => {
    if (!getSession() || getCartItems().length === 0) {
      throw redirect({ to: '/' })
    }
  },
  component: CheckoutPage,
})
