import type { Product, SizeId, Topping } from '@/features/menu/types'
import type { CartItem } from './types'

/** Miễn phí dịch vụ khi tạm tính từ mức này trở lên (VND). */
export const FREE_SERVICE_FEE_THRESHOLD = 150_000
export const SERVICE_FEE = 5_000

export const calcUnitPrice = (product: Product, sizeId: SizeId, toppings: Topping[]): number => {
  const sizeDelta = product.sizes.find((size) => size.id === sizeId)?.priceDelta ?? 0
  const toppingTotal = toppings.reduce((total, topping) => total + topping.price, 0)
  return product.basePrice + sizeDelta + toppingTotal
}

export const calcLineTotal = (item: CartItem): number => item.unitPrice * item.quantity

export const calcSubtotal = (items: CartItem[]): number =>
  items.reduce((total, item) => total + calcLineTotal(item), 0)

export const calcServiceFee = (subtotal: number): number =>
  subtotal >= FREE_SERVICE_FEE_THRESHOLD ? 0 : SERVICE_FEE

export const countItems = (items: CartItem[]): number =>
  items.reduce((total, item) => total + item.quantity, 0)
