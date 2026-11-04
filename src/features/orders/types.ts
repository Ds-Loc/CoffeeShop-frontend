import type { CartItem } from '@/features/cart/types'

export type PaymentMethod = 'wallet' | 'card'

export type OrderStatus = 'PAID' | 'PREPARING' | 'READY' | 'COMPLETED' | 'CANCELLED'

export interface Order {
  id: string
  items: CartItem[]
  subtotal: number
  serviceFee: number
  total: number
  paymentMethod: PaymentMethod
  status: OrderStatus
  /** ISO 8601. */
  createdAt: string
}
