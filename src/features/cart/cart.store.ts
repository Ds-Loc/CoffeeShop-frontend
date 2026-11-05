import { createHistoryStore, useCanRedo, useCanUndo, useHistoryPresent } from '@/lib/history-store'
import { useStore } from '@/lib/store'
import type { CartItem } from './types'

const cartHistoryStore = createHistoryStore<CartItem[]>([], {
  storageKey: 'brewlite:cart',
  validate: (value): value is CartItem[] => Array.isArray(value),
})

export const cartActions = {
  /** Thêm món; nếu cùng cấu hình đã có trong giỏ thì cộng dồn số lượng. */
  addItem: (item: CartItem) =>
    cartHistoryStore.setState((items) =>
      items.some((existing) => existing.key === item.key)
        ? items.map((existing) =>
            existing.key === item.key ? { ...existing, quantity: existing.quantity + item.quantity } : existing,
          )
        : [...items, item],
    ),
  setQuantity: (key: string, quantity: number) =>
    cartHistoryStore.setState((items) =>
      items.map((item) => (item.key === key ? { ...item, quantity: Math.max(1, quantity) } : item)),
    ),
  removeItem: (key: string) =>
    cartHistoryStore.setState((items) => items.filter((item) => item.key !== key)),
  clear: () => cartHistoryStore.setState([]),
  undo: () => cartHistoryStore.undo(),
  redo: () => cartHistoryStore.redo(),
}

export const getCartItems = () => cartHistoryStore.getState().present

export const useCartItems = () => useHistoryPresent(cartHistoryStore)
export const useCartCanUndo = () => useCanUndo(cartHistoryStore)
export const useCartCanRedo = () => useCanRedo(cartHistoryStore)
