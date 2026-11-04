import { queryOptions, useQuery } from '@tanstack/react-query'
import { createStore, useStore } from '@/lib/store'
import { MOCK_PRODUCTS } from './data/mock-products'
import type { Product } from './types'

const productsStore = createStore<Product[]>(MOCK_PRODUCTS, {
  storageKey: 'brewlite:products',
  validate: (value): value is Product[] => Array.isArray(value),
})

export const productsActions = {
  add: (product: Product) => productsStore.setState((products) => [...products, product]),
  update: (product: Product) => productsStore.setState((products) => products.map((item) => (item.id === product.id ? product : item))),
  remove: (id: string) => productsStore.setState((products) => products.filter((item) => item.id !== id)),
}

/**
 * Hiện trả dữ liệu mẫu. Khi backend sẵn sàng, thay thân hàm bằng:
 *   return axiosClient.get<unknown, Product[]>('/products')
 */
const fetchProducts = async (): Promise<Product[]> => productsStore.getState().filter((product) => product.available !== false)

export const productsQueryOptions = queryOptions({
  queryKey: ['products'],
  queryFn: fetchProducts,
})

export const useProducts = () => {
  const products = useStore(productsStore)
  const query = useQuery({ ...productsQueryOptions, queryFn: async () => products })
  return { ...query, data: products }
}

export const useAllProducts = () => useStore(productsStore)
