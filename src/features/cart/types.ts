import type { SizeId, Topping } from '@/features/menu/types'

/** Một dòng trong giỏ. Lưu snapshot tên/ảnh/giá để giỏ và đơn hàng không phụ thuộc vào danh mục hiện tại. */
export interface CartItem {
  /** Định danh theo cấu hình: `productId:size:toppingIds` — cùng cấu hình thì cộng dồn số lượng. */
  key: string
  productId: string
  productName: string
  imageUrl: string
  sizeId: SizeId
  toppings: Topping[]
  /** Giá một ly đã gồm size và topping (VND). */
  unitPrice: number
  quantity: number
}
