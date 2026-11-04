import type { CartItem } from '@/features/cart/types'
import type { PaymentMethod, WalletProvider } from '@/features/orders/types'

export type { WalletProvider }

export interface PaymentDetails {
  walletProvider?: WalletProvider
  cardValid: boolean
}

export interface PlaceOrderPayload {
  items: CartItem[]
  subtotal: number
  serviceFee: number
  paymentMethod: PaymentMethod
  walletProvider?: WalletProvider
}
