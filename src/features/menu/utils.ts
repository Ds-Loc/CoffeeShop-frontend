import { ALL_CATEGORIES, type CategoryFilter } from './constants'
import type { Product } from './types'

const normalize = (text: string) =>
  text
    .trim()
    .toLocaleLowerCase('vi')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')

export const filterProducts = (products: Product[], category: CategoryFilter, query: string): Product[] => {
  const keyword = normalize(query)

  return products.filter((product) => {
    const matchesCategory = category === ALL_CATEGORIES || product.category === category
    const matchesQuery = normalize(product.name).includes(keyword)
    return matchesCategory && matchesQuery
  })
}

/** Giá thấp nhất của món (size nhỏ nhất, không topping) — hiển thị "Từ ...". */
export const getStartingPrice = (product: Product): number =>
  product.basePrice + Math.min(...product.sizes.map((size) => size.priceDelta))
