import { queryOptions, useQuery } from '@tanstack/react-query'
import { axiosClient } from '@/lib/axios'
import { createStore, useStore } from '@/lib/store'
import { MOCK_PRODUCTS } from './data/mock-products'
import type { Product } from './types'

const productsStore = createStore<Product[]>(MOCK_PRODUCTS, {
  storageKey: 'brewlite:products',
  validate: (value): value is Product[] => Array.isArray(value),
})

export const productsActions = {
  add: (product: Product) => productsStore.setState((products) => [...products, product]),
  update: (product: Product) =>
    productsStore.setState((products) => products.map((item) => (item.id === product.id ? product : item))),
  remove: (id: string) => productsStore.setState((products) => products.filter((item) => item.id !== id)),
  setAll: (products: Product[]) => productsStore.setState(products),
}

/**
 * Lấy danh sách món từ API (được MSW đánh chặn trong môi trường dev).
 */
export const fetchProducts = async (): Promise<Product[]> => {
  try {
    const data = await axiosClient.get<Product[], Product[]>('/products')
    if (Array.isArray(data)) {
      productsActions.setAll(data)
      return data
    }
  } catch (error) {
    console.warn('[Menu API] Không thể kết nối API/MSW, sử dụng store cục bộ:', error)
  }
  return productsStore.getState().filter((product) => product.available !== false)
}

export const productsQueryOptions = queryOptions({
  queryKey: ['products'],
  queryFn: fetchProducts,
})

export const useProducts = () => {
  const query = useQuery(productsQueryOptions)
  const localProducts = useStore(productsStore)
  const data = query.data ?? localProducts.filter((product) => product.available !== false)
  return { ...query, data }
}

export const useAllProducts = () => useStore(productsStore)
