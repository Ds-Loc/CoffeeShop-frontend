import type { Product, SizeOption, Topping } from '../types'
import {
  MOCK_CATEGORIES,
  MOCK_PRODUCT_PRESENTATION,
  MOCK_PRODUCT_SIZES,
  MOCK_PRODUCT_TOPPINGS,
  MOCK_PRODUCTS_DOMAIN,
  MOCK_TOPPINGS,
} from './mock-domain'

export const mapMockProductToUi = (productId: number): Product | null => {
  const product = MOCK_PRODUCTS_DOMAIN.find((item) => item.id === productId)
  if (!product || product.status !== 'available') return null

  const category = MOCK_CATEGORIES.find((item) => item.id === product.category_id)
  const presentation = MOCK_PRODUCT_PRESENTATION[product.id]
  if (!category || !presentation) return null

  const sizes: SizeOption[] = MOCK_PRODUCT_SIZES.filter((size) => size.product_id === product.id && size.status === 'available').map(
    (size) => ({ id: size.size_code, label: size.label, priceDelta: size.price_delta }),
  )

  const toppingIds = new Set(MOCK_PRODUCT_TOPPINGS.filter((link) => link.product_id === product.id).map((link) => link.topping_id))
  const toppings: Topping[] = MOCK_TOPPINGS.filter((topping) => toppingIds.has(topping.id) && topping.status === 'available').map((topping) => ({
    id: String(topping.id),
    name: topping.name,
    price: topping.price,
  }))

  return {
    id: String(product.id),
    name: product.name,
    category: category.name as Product['category'],
    description: presentation.description,
    imageUrl: product.image_url,
    basePrice: product.price,
    badge: presentation.badge,
    sizes,
    toppings,
  }
}

export const mapMockProductsToUi = (): Product[] =>
  MOCK_PRODUCTS_DOMAIN.map((product) => mapMockProductToUi(product.id)).filter((product): product is Product => product !== null)
