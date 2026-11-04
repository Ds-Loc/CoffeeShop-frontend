import type { CartItem } from '@/features/cart/types'
import type { PaymentMethod } from '@/features/orders/types'

export interface PlaceOrderPayload {
  items: CartItem[]
  subtotal: number
  serviceFee: number
  paymentMethod: PaymentMethod
}
