import type { Product, SizeId, Topping } from '@/features/menu/types'
import { calcUnitPrice } from './pricing'
import type { CartItem } from './types'

interface BuildCartItemParams {
  product: Product
  sizeId: SizeId
  toppings: Topping[]
  quantity: number
}

export const buildCartItem = ({ product, sizeId, toppings, quantity }: BuildCartItemParams): CartItem => {
  const toppingIds = toppings.map((topping) => topping.id).sort()

  return {
    key: [product.id, sizeId, ...toppingIds].join(':'),
    productId: product.id,
    productName: product.name,
    imageUrl: product.imageUrl,
    sizeId,
    toppings,
    unitPrice: calcUnitPrice(product, sizeId, toppings),
    quantity,
  }
}

/** Mô tả cấu hình món, ví dụ "Size M · Kem sữa, Thạch cà phê". */
export const describeCartItem = (item: CartItem): string => {
  const toppings = item.toppings.map((topping) => topping.name).join(', ')
  return toppings ? `Size ${item.sizeId} · ${toppings}` : `Size ${item.sizeId}`
}
