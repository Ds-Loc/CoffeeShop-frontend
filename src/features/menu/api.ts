import { queryOptions, useQuery } from '@tanstack/react-query'
import { MOCK_PRODUCTS } from './data/mock-products'
import type { Product } from './types'

/**
 * Hiện trả dữ liệu mẫu. Khi backend sẵn sàng, thay thân hàm bằng:
 *   return axiosClient.get<unknown, Product[]>('/products')
 */
const fetchProducts = async (): Promise<Product[]> => MOCK_PRODUCTS

export const productsQueryOptions = queryOptions({
  queryKey: ['products'],
  queryFn: fetchProducts,
})

export const useProducts = () => useQuery(productsQueryOptions)
