import { queryOptions, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { axiosClient } from '@/lib/axios'
import { createStore, useStore } from '@/lib/store'
import { MOCK_PRODUCTS } from './data/mock-products'
import { ALL_CATEGORIES, type CategoryFilter } from './constants'
import { filterProducts } from './utils'
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

export interface FetchProductsOptions {
  all?: boolean
}

/**
 * Lấy danh sách món từ API (được MSW đánh chặn trong môi trường dev).
 * Khi all = true, lấy cả các món đang ẩn (available = false) cho trang quản trị.
 */
export const fetchProducts = async (options?: FetchProductsOptions): Promise<Product[]> => {
  const showAll = Boolean(options?.all)
  try {
    const url = showAll ? '/products?all=true' : '/products'
    const data = await axiosClient.get<Product[], Product[]>(url)
    if (Array.isArray(data)) {
      if (showAll) {
        productsActions.setAll(data)
      }
      return data
    }
  } catch (error) {
    console.warn('[Menu API] Không thể kết nối API/MSW, sử dụng store cục bộ:', error)
  }
  const local = productsStore.getState()
  return showAll ? local : local.filter((product) => product.available !== false)
}

/** Thêm món mới */
export const createProduct = async (product: Omit<Product, 'id'> | Product): Promise<Product> => {
  try {
    const created = await axiosClient.post<Product, Product>('/products', product)
    productsActions.add(created)
    return created
  } catch (error) {
    console.warn('[Menu API] createProduct fallback store:', error)
    const fallback: Product = { ...product, id: (product as Product).id || `product-${Date.now()}` }
    productsActions.add(fallback)
    return fallback
  }
}

/** Sửa thông tin món / bật tắt hiển thị */
export const updateProduct = async (product: Product): Promise<Product> => {
  try {
    const updated = await axiosClient.put<Product, Product>(`/products/${product.id}`, product)
    productsActions.update(updated)
    return updated
  } catch (error) {
    console.warn('[Menu API] updateProduct fallback store:', error)
    productsActions.update(product)
    return product
  }
}

/** Xoá món */
export const deleteProduct = async (id: string): Promise<{ success: boolean }> => {
  try {
    const res = await axiosClient.delete<{ success: boolean }, { success: boolean }>(`/products/${id}`)
    productsActions.remove(id)
    return res
  } catch (error) {
    console.warn('[Menu API] deleteProduct fallback store:', error)
    productsActions.remove(id)
    return { success: true }
  }
}

export const productsQueryOptions = (options?: FetchProductsOptions) =>
  queryOptions({
    queryKey: options?.all ? ['products', { all: true }] : ['products'],
    queryFn: () => fetchProducts(options),
  })

/** Hook lấy danh sách món đang bán cho khách */
export const useProducts = (category: CategoryFilter = ALL_CATEGORIES, search = '') => {
  const queryClient = useQueryClient()
  const query = useQuery({
    queryKey: ['products', { category, search }],
    queryFn: async () =>
      filterProducts(
        await queryClient.fetchQuery({ ...productsQueryOptions(), staleTime: 30_000 }),
        category,
        search,
      ),
  })
  const localProducts = useStore(productsStore)
  const data = query.data ?? filterProducts(localProducts.filter((product) => product.available !== false), category, search)
  return { ...query, data }
}

/** Hook lấy toàn bộ món (cả món ẩn) cho Admin qua TanStack Query */
export const useAdminProducts = () => {
  const query = useQuery(productsQueryOptions({ all: true }))
  const localProducts = useStore(productsStore)
  const data = query.data ?? localProducts
  return { ...query, data }
}

/** Dành cho component cũ cần sync store trực tiếp */
export const useAllProducts = () => useAdminProducts()

/** Mutation: Thêm món mới + Tự động Invalidate Cache 'products' */
export const useCreateProduct = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      // Invalidate toàn bộ query liên quan đến products
      queryClient.invalidateQueries({ queryKey: ['products'] })
    },
  })
}

/** Mutation: Sửa món / Thay đổi trạng thái hiển thị + Invalidate Cache */
export const useUpdateProduct = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: updateProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
    },
  })
}

/** Mutation: Xoá món + Invalidate Cache */
export const useDeleteProduct = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
    },
  })
}
