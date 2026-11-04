export type MockProductStatus = 'available' | 'sold_out' | 'hidden'
export type MockToppingStatus = 'available' | 'sold_out'
export type MockProductSizeStatus = 'available' | 'sold_out'

export interface MockCategory {
  id: number
  name: string
}

export interface MockProduct {
  id: number
  category_id: number
  name: string
  price: number
  image_url: string
  status: MockProductStatus
}

export interface MockProductSize {
  id: number
  product_id: number
  size_code: 'S' | 'M' | 'L'
  label: string
  price_delta: number
  status: MockProductSizeStatus
}

export interface MockTopping {
  id: number
  name: string
  price: number
  status: MockToppingStatus
}

export interface MockProductPresentation {
  description: string
  badge?: string
}

const unsplash = (photoId: string, width = 900) =>
  `https://images.unsplash.com/${photoId}?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=85&w=${width}`

export const MOCK_CATEGORIES: MockCategory[] = [
  { id: 1, name: 'Cà phê' },
  { id: 2, name: 'Trà' },
  { id: 3, name: 'Đá xay' },
]

export const MOCK_PRODUCTS_DOMAIN: MockProduct[] = [
  { id: 1, category_id: 1, name: 'Cà phê sữa BrewLite', price: 39000, image_url: unsplash('photo-1749105504681-1889a810be41'), status: 'available' },
  { id: 2, category_id: 1, name: 'Americano', price: 42000, image_url: unsplash('photo-1598778124054-f9548b4d5e4c'), status: 'available' },
  { id: 3, category_id: 1, name: 'Cappuccino', price: 49000, image_url: unsplash('photo-1571263773557-7788164a8ad7'), status: 'available' },
  { id: 4, category_id: 1, name: 'Bạc xỉu kem muối', price: 45000, image_url: unsplash('photo-1749105862041-d7e03c78eccb'), status: 'available' },
  { id: 5, category_id: 1, name: 'Cold brew cam sả', price: 52000, image_url: unsplash('photo-1745816743825-b1be5b23e528'), status: 'available' },
  { id: 6, category_id: 2, name: 'Trà đào cam sả', price: 45000, image_url: unsplash('photo-1751033390130-cdc5a6082089'), status: 'available' },
  { id: 7, category_id: 2, name: 'Matcha latte', price: 52000, image_url: unsplash('photo-1749280447307-31a68eb38673'), status: 'available' },
  { id: 8, category_id: 3, name: 'Chocolate đá xay', price: 55000, image_url: unsplash('photo-1629644087983-c85380e0b543'), status: 'available' },
]

export const MOCK_PRODUCT_SIZES: MockProductSize[] = MOCK_PRODUCTS_DOMAIN.flatMap((product) => [
  { id: product.id * 10 + 1, product_id: product.id, size_code: 'S', label: 'Nhỏ', price_delta: -5000, status: 'available' },
  { id: product.id * 10 + 2, product_id: product.id, size_code: 'M', label: 'Vừa', price_delta: 0, status: 'available' },
  { id: product.id * 10 + 3, product_id: product.id, size_code: 'L', label: 'Lớn', price_delta: 10000, status: 'available' },
])

export const MOCK_TOPPINGS: MockTopping[] = [
  { id: 1, name: 'Thêm shot espresso', price: 10000, status: 'available' },
  { id: 2, name: 'Kem sữa', price: 8000, status: 'available' },
  { id: 3, name: 'Thạch cà phê', price: 7000, status: 'available' },
  { id: 4, name: 'Trân châu trắng', price: 8000, status: 'available' },
  { id: 5, name: 'Đào miếng', price: 10000, status: 'available' },
]

export const MOCK_PRODUCT_TOPPINGS: { product_id: number; topping_id: number }[] = [
  ...MOCK_PRODUCTS_DOMAIN.filter((product) => product.category_id === 1 || product.category_id === 3).flatMap((product) =>
    [1, 2, 3].map((topping_id) => ({ product_id: product.id, topping_id })),
  ),
  ...MOCK_PRODUCTS_DOMAIN.filter((product) => product.category_id === 2).flatMap((product) =>
    [4, 5, 2].map((topping_id) => ({ product_id: product.id, topping_id })),
  ),
]

export const MOCK_PRODUCT_PRESENTATION: Record<number, MockProductPresentation> = {
  1: { description: 'Cà phê rang đậm, sữa đặc và lớp bọt mịn theo công thức đặc trưng.', badge: 'Bán chạy' },
  2: { description: 'Hai shot espresso cân bằng với nước nóng, thơm sâu và thanh nhẹ.' },
  3: { description: 'Espresso, sữa nóng và bọt sữa dày, phủ một lớp cacao dịu nhẹ.', badge: 'Đậm vị' },
  4: { description: 'Vị sữa béo dịu hòa cùng cà phê và kem muối mằn mặn hấp dẫn.', badge: 'Mới' },
  5: { description: 'Cold brew ủ lạnh 16 giờ, thêm cam vàng và sả cho hậu vị tươi mát.' },
  6: { description: 'Trà đen thanh mát, đào giòn, cam vàng và hương sả tự nhiên.', badge: 'Tươi mát' },
  7: { description: 'Matcha Nhật Bản thơm thanh, quyện cùng sữa tươi béo nhẹ.', badge: 'Yêu thích' },
  8: { description: 'Chocolate đậm đà xay mịn cùng sữa và phủ kem tươi mềm mượt.' },
}

export const HERO_IMAGE_URL = unsplash('photo-1749105504681-1889a810be41', 1200)
