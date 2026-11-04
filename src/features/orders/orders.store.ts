import { createStore, useStore } from '@/lib/store'
import type { Order, OrderStatus } from './types'

const ordersStore = createStore<Order[]>([], {
  storageKey: 'brewlite:orders',
  validate: (value): value is Order[] => Array.isArray(value),
})

export const ordersActions = {
  add: (order: Order) => ordersStore.setState((orders) => [...orders, order]),
  updateStatus: (id: string, status: OrderStatus): boolean => {
    const order = ordersStore.getState().find((item) => item.id === id)
    if (!order) return false
    const allowed: Record<OrderStatus, OrderStatus[]> = {
      PAID: ['PREPARING', 'CANCELLED'],
      PREPARING: ['READY', 'CANCELLED'],
      READY: ['COMPLETED'],
      COMPLETED: [],
      CANCELLED: [],
    }
    if (!allowed[order.status].includes(status)) return false
    ordersStore.setState((orders) => orders.map((item) => (item.id === id ? { ...item, status } : item)))
    return true
  },
}

export const useOrders = () => useStore(ordersStore)

export const useOrder = (orderId: string) =>
  useStore(ordersStore, (orders) => orders.find((order) => order.id === orderId))
