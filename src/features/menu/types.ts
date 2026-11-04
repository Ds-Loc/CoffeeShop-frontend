export type Category = 'Cà phê' | 'Trà' | 'Đá xay'

export type SizeId = 'S' | 'M' | 'L'

export interface SizeOption {
  id: SizeId
  label: string
  /** Chênh lệch giá so với giá gốc (VND). */
  priceDelta: number
}

export interface Topping {
  id: string
  name: string
  price: number
}

export interface Product {
  id: string
  name: string
  category: Category
  description: string
  imageUrl: string
  /** Giá gốc (size M, không topping), đơn vị VND. */
  basePrice: number
  badge?: string
  sizes: SizeOption[]
  toppings: Topping[]
  available?: boolean
}
