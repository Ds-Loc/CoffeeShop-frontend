import type { WalletProvider } from '../types'

export type MockOrderChannel = 'in_store' | 'online'
export type MockOrderStatus = 'open' | 'paid' | 'cancelled'
export type MockOrderItemStatus = 'pending' | 'preparing' | 'done' | 'served' | 'cancelled'
export type MockPaymentMethod = 'cash' | 'transfer' | 'card' | 'wallet'
export type MockPaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded'

export interface MockCustomer {
  id: number
  name: string
  phone: string | null
  email: string | null
  is_member: boolean
  points: number
  created_at: string
}

export interface MockOrder {
  id: number
  table_id: number | null
  customer_id: number | null
  user_id: number | null
  order_channel: MockOrderChannel
  status: MockOrderStatus
  created_at: string
}

export interface MockOrderItem {
  id: number
  order_id: number
  product_id: number
  quantity: number
  unit_price: number
  size_code: string | null
  note: string | null
  status: MockOrderItemStatus
}

export interface MockOrderItemTopping {
  order_item_id: number
  topping_id: number
  unit_price: number
}

export interface MockInvoice {
  id: number
  order_id: number
  subtotal: number
  service_fee: number
  discount: number
  total: number
  payment_method: MockPaymentMethod
  payment_provider: WalletProvider | null
  transaction_id: string | null
  payment_status: MockPaymentStatus
  points_earned: number
  paid_at: string | null
}

export const MOCK_CUSTOMERS: MockCustomer[] = [
  {
    id: 1,
    name: 'Nguyễn Văn Demo',
    phone: '0900000000',
    email: 'demo@example.com',
    is_member: true,
    points: 120,
    created_at: '2026-01-15T08:00:00.000Z',
  },
]

export const MOCK_ORDERS: MockOrder[] = []
export const MOCK_ORDER_ITEMS: MockOrderItem[] = []
export const MOCK_ORDER_ITEM_TOPPINGS: MockOrderItemTopping[] = []
export const MOCK_INVOICES: MockInvoice[] = []
