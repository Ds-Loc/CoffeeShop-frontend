import type { CartItem } from '@/features/cart/types'

export type PaymentMethod = 'wallet' | 'card'
export type WalletProvider = 'momo' | 'zalopay' | 'vnpay'

export type OrderStatus = 'PAID' | 'PREPARING' | 'READY' | 'COMPLETED' | 'CANCELLED'

export interface Order {
  id: string
  items: CartItem[]
  subtotal: number
  serviceFee: number
  total: number
  paymentMethod: PaymentMethod
  walletProvider?: WalletProvider
  status: OrderStatus
  /** ISO 8601. */
  createdAt: string
}
