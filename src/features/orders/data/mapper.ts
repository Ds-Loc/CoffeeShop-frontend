import type { CartItem } from '@/features/cart/types'
import type { PlaceOrderPayload } from '@/features/checkout/types'
import type { Order, PaymentMethod } from '../types'
import {
  MOCK_CUSTOMERS,
  MOCK_INVOICES,
  MOCK_ORDER_ITEM_TOPPINGS,
  MOCK_ORDER_ITEMS,
  MOCK_ORDERS,
  type MockInvoice,
  type MockOrder,
  type MockOrderItem,
  type MockOrderItemTopping,
} from './mock-domain'

const nextId = (values: { id: number }[]): number => Math.max(0, ...values.map((value) => value.id)) + 1

const toProductId = (productId: string): number => {
  const parsed = Number(productId)
  if (!Number.isInteger(parsed) || parsed <= 0) throw new Error(`Product ID không hợp lệ: ${productId}`)
  return parsed
}

const toDatabasePaymentMethod = (paymentMethod: PaymentMethod): MockInvoice['payment_method'] =>
  paymentMethod === 'wallet' ? 'wallet' : 'card'

const toUiPaymentMethod = (paymentMethod: MockInvoice['payment_method']): PaymentMethod =>
  paymentMethod === 'wallet' ? 'wallet' : 'card'

export interface MockOrderAggregate {
  order: MockOrder
  items: MockOrderItem[]
  itemToppings: MockOrderItemTopping[]
  invoice: MockInvoice
}

export const createMockOrderAggregate = (payload: PlaceOrderPayload): MockOrderAggregate => {
  const orderId = nextId(MOCK_ORDERS)
  const customer = MOCK_CUSTOMERS[0] ?? null
  const now = new Date().toISOString()
  const order: MockOrder = {
    id: orderId,
    table_id: null,
    customer_id: customer?.id ?? null,
    user_id: null,
    order_channel: 'online',
    status: 'paid',
    created_at: now,
  }

  const items = payload.items.map((item, index): MockOrderItem => ({
    id: orderId * 100 + index + 1,
    order_id: orderId,
    product_id: toProductId(item.productId),
    quantity: item.quantity,
    unit_price: item.unitPrice,
    size_code: item.sizeId,
    note: null,
    status: 'pending',
  }))

  const itemToppings = payload.items.flatMap((item, index) =>
    item.toppings.map((topping) => ({
      order_item_id: orderId * 100 + index + 1,
      topping_id: toProductId(topping.id),
      unit_price: topping.price,
    })),
  )

  const invoice: MockInvoice = {
    id: orderId,
    order_id: orderId,
    subtotal: payload.subtotal,
    service_fee: payload.serviceFee,
    discount: 0,
    total: payload.subtotal + payload.serviceFee,
    payment_method: toDatabasePaymentMethod(payload.paymentMethod),
    payment_provider: payload.walletProvider ?? null,
    transaction_id: null,
    payment_status: 'paid',
    points_earned: 0,
    paid_at: now,
  }

  MOCK_ORDERS.push(order)
  MOCK_ORDER_ITEMS.push(...items)
  MOCK_ORDER_ITEM_TOPPINGS.push(...itemToppings)
  MOCK_INVOICES.push(invoice)

  return { order, items, itemToppings, invoice }
}

export const mapMockOrderToUi = (aggregate: MockOrderAggregate, cartItems: CartItem[]): Order => ({
  id: `BL${String(aggregate.order.id).padStart(6, '0')}`,
  items: cartItems,
  subtotal: aggregate.invoice.subtotal,
  serviceFee: aggregate.invoice.service_fee,
  total: aggregate.invoice.total,
  paymentMethod: toUiPaymentMethod(aggregate.invoice.payment_method),
  walletProvider: aggregate.invoice.payment_provider ?? undefined,
  status: 'PAID',
  createdAt: aggregate.order.created_at,
})
