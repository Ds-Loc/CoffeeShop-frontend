import { createHistoryStore, useCanRedo, useCanUndo, useHistoryPresent } from '@/lib/history-store'
import { queryOptions, useQuery } from '@tanstack/react-query'
import { MOCK_PRODUCTS } from './data/mock-products'
import type { Product } from './types'

const productsHistoryStore = createHistoryStore<Product[]>(MOCK_PRODUCTS, {
  storageKey: 'brewlite:products',
  validate: (value): value is Product[] => Array.isArray(value),
})

export const productsActions = {
  add: (product: Product) =>
    productsHistoryStore.setState((products) => [...products, product]),
  update: (product: Product) =>
    productsHistoryStore.setState((products) =>
      products.map((item) => (item.id === product.id ? product : item)),
    ),
  remove: (id: string) =>
    productsHistoryStore.setState((products) => products.filter((item) => item.id !== id)),
  undo: () => productsHistoryStore.undo(),
  redo: () => productsHistoryStore.redo(),
}

const fetchProducts = async (): Promise<Product[]> =>
  productsHistoryStore.getState().present.filter((product) => product.available !== false)

export const productsQueryOptions = queryOptions({
  queryKey: ['products'],
  queryFn: fetchProducts,
})

export const useProducts = () => {
  const products = useHistoryPresent(productsHistoryStore)
  const query = useQuery({ ...productsQueryOptions, queryFn: async () => products })
  return { ...query, data: products }
}

export const useAllProducts = () => useHistoryPresent(productsHistoryStore)
export const useProductsCanUndo = () => useCanUndo(productsHistoryStore)
export const useProductsCanRedo = () => useCanRedo(productsHistoryStore)
