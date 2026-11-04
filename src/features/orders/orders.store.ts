import { createStore, useStore } from '@/lib/store'
import type { Order, OrderStatus } from './types'

const ordersStore = createStore<Order[]>([], {
  storageKey: 'brewlite:orders',
  validate: (value): value is Order[] => Array.isArray(value),
})

export const ordersActions = {
  add: (order: Order) => ordersStore.setState((orders) => [...orders, order]),
  updateStatus: (id: string, status: OrderStatus) =>
    ordersStore.setState((orders) => orders.map((order) => (order.id === id ? { ...order, status } : order))),
}

export const useOrders = () => useStore(ordersStore)

export const useOrder = (orderId: string) =>
  useStore(ordersStore, (orders) => orders.find((order) => order.id === orderId))
