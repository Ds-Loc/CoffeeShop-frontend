import { createStore, useStore } from '@/lib/store'
import type { CartItem } from './types'

const cartStore = createStore<CartItem[]>([], {
  storageKey: 'brewlite:cart',
  validate: (value): value is CartItem[] => Array.isArray(value),
})

export const cartActions = {
  /** Thêm món; nếu cùng cấu hình đã có trong giỏ thì cộng dồn số lượng. */
  addItem: (item: CartItem) =>
    cartStore.setState((items) =>
      items.some((existing) => existing.key === item.key)
        ? items.map((existing) =>
            existing.key === item.key ? { ...existing, quantity: existing.quantity + item.quantity } : existing,
          )
        : [...items, item],
    ),
  setQuantity: (key: string, quantity: number) =>
    cartStore.setState((items) =>
      items.map((item) => (item.key === key ? { ...item, quantity: Math.max(1, quantity) } : item)),
    ),
  removeItem: (key: string) => cartStore.setState((items) => items.filter((item) => item.key !== key)),
  clear: () => cartStore.setState([]),
}

export const getCartItems = () => cartStore.getState()

export const useCartItems = () => useStore(cartStore)
