import { createHistoryStore, useCanRedo, useCanUndo, useHistoryPresent } from '@/lib/history-store'
import type { Order, OrderStatus } from './types'

const ordersHistoryStore = createHistoryStore<Order[]>([], {
  storageKey: 'brewlite:orders',
  validate: (value): value is Order[] => Array.isArray(value),
})

/** Luồng trạng thái tiến (forward). */
const FORWARD: Record<OrderStatus, OrderStatus | null> = {
  PAID: 'PREPARING',
  PREPARING: 'READY',
  READY: 'COMPLETED',
  COMPLETED: null,
  CANCELLED: null,
}

/** Luồng trạng thái lùi (rollback). */
const BACKWARD: Record<OrderStatus, OrderStatus | null> = {
  PAID: null,
  PREPARING: 'PAID',
  READY: 'PREPARING',
  COMPLETED: 'READY',
  CANCELLED: null,
}

export const ordersActions = {
  add: (order: Order) =>
    ordersHistoryStore.setState((orders) => [...orders, order]),

  setAll: (orders: Order[]) => ordersHistoryStore.setState(orders),

  getById: (id: string) =>
    ordersHistoryStore.getState().present.find((item) => item.id === id),

  setStatus: (id: string, status: OrderStatus): boolean => {
    if (!ordersHistoryStore.getState().present.some((item) => item.id === id)) return false
    ordersHistoryStore.setState((orders) =>
      orders.map((item) => (item.id === id ? { ...item, status } : item)),
    )
    return true
  },

  updateStatus: (id: string, status: OrderStatus): boolean => {
    const order = ordersHistoryStore.getState().present.find((item) => item.id === id)
    if (!order) return false
    const allowed: Record<OrderStatus, OrderStatus[]> = {
      PAID: ['PREPARING', 'CANCELLED'],
      PREPARING: ['READY', 'CANCELLED'],
      READY: ['COMPLETED'],
      COMPLETED: [],
      CANCELLED: [],
    }
    if (!allowed[order.status].includes(status)) return false
    ordersHistoryStore.setState((orders) =>
      orders.map((item) => (item.id === id ? { ...item, status } : item)),
    )
    return true
  },

  /** Chuyển đơn sang trạng thái tiếp theo (forward). */
  advanceStatus: (id: string): OrderStatus | null => {
    const order = ordersHistoryStore.getState().present.find((item) => item.id === id)
    if (!order) return null
    const next = FORWARD[order.status]
    if (!next) return null
    ordersHistoryStore.setState((orders) =>
      orders.map((item) => (item.id === id ? { ...item, status: next } : item)),
    )
    return next
  },

  /** Rollback đơn về trạng thái trước đó (backward). */
  rollbackStatus: (id: string): OrderStatus | null => {
    const order = ordersHistoryStore.getState().present.find((item) => item.id === id)
    if (!order) return null
    const prev = BACKWARD[order.status]
    if (!prev) return null
    ordersHistoryStore.setState((orders) =>
      orders.map((item) => (item.id === id ? { ...item, status: prev } : item)),
    )
    return prev
  },

  /** Undo toàn bộ thay đổi đơn hàng gần nhất. */
  undo: () => ordersHistoryStore.undo(),
  /** Redo lại thay đổi vừa undo. */
  redo: () => ordersHistoryStore.redo(),
}

export const useOrders = () => useHistoryPresent(ordersHistoryStore)
export const useOrder = (orderId: string) => {
  const orders = useHistoryPresent(ordersHistoryStore)
  return orders.find((order) => order.id === orderId)
}
export const useOrdersCanUndo = () => useCanUndo(ordersHistoryStore)
export const useOrdersCanRedo = () => useCanRedo(ordersHistoryStore)
