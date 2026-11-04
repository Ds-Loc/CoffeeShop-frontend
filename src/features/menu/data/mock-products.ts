import type { Product, SizeOption, Topping } from '../types'

const unsplash = (photoId: string, width = 900) =>
  `https://images.unsplash.com/${photoId}?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=85&w=${width}`

const SIZES: SizeOption[] = [
  { id: 'S', label: 'Nhỏ', priceDelta: -5000 },
  { id: 'M', label: 'Vừa', priceDelta: 0 },
  { id: 'L', label: 'Lớn', priceDelta: 10000 },
]

const COFFEE_TOPPINGS: Topping[] = [
  { id: 'shot', name: 'Thêm shot espresso', price: 10000 },
  { id: 'cream', name: 'Kem sữa', price: 8000 },
  { id: 'coffee-jelly', name: 'Thạch cà phê', price: 7000 },
]

const TEA_TOPPINGS: Topping[] = [
  { id: 'pearl', name: 'Trân châu trắng', price: 8000 },
  { id: 'peach', name: 'Đào miếng', price: 10000 },
  { id: 'cream', name: 'Kem sữa', price: 8000 },
]

/** Dữ liệu mẫu — thay bằng API thật trong `features/menu/api.ts`. */
export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'ca-phe-sua',
    name: 'Cà phê sữa BrewLite',
    category: 'Cà phê',
    description: 'Cà phê rang đậm, sữa đặc và lớp bọt mịn theo công thức đặc trưng.',
    imageUrl: unsplash('photo-1749105504681-1889a810be41'),
    basePrice: 39000,
    badge: 'Bán chạy',
    sizes: SIZES,
    toppings: COFFEE_TOPPINGS,
  },
  {
    id: 'americano',
    name: 'Americano',
    category: 'Cà phê',
    description: 'Hai shot espresso cân bằng với nước nóng, thơm sâu và thanh nhẹ.',
    imageUrl: unsplash('photo-1598778124054-f9548b4d5e4c'),
    basePrice: 42000,
    sizes: SIZES,
    toppings: COFFEE_TOPPINGS,
  },
  {
    id: 'cappuccino',
    name: 'Cappuccino',
    category: 'Cà phê',
    description: 'Espresso, sữa nóng và bọt sữa dày, phủ một lớp cacao dịu nhẹ.',
    imageUrl: unsplash('photo-1571263773557-7788164a8ad7'),
    basePrice: 49000,
    badge: 'Đậm vị',
    sizes: SIZES,
    toppings: COFFEE_TOPPINGS,
  },
  {
    id: 'bac-xiu',
    name: 'Bạc xỉu kem muối',
    category: 'Cà phê',
    description: 'Vị sữa béo dịu hòa cùng cà phê và kem muối mằn mặn hấp dẫn.',
    imageUrl: unsplash('photo-1749105862041-d7e03c78eccb'),
    basePrice: 45000,
    badge: 'Mới',
    sizes: SIZES,
    toppings: COFFEE_TOPPINGS,
  },
  {
    id: 'cold-brew',
    name: 'Cold brew cam sả',
    category: 'Cà phê',
    description: 'Cold brew ủ lạnh 16 giờ, thêm cam vàng và sả cho hậu vị tươi mát.',
    imageUrl: unsplash('photo-1745816743825-b1be5b23e528'),
    basePrice: 52000,
    sizes: SIZES,
    toppings: COFFEE_TOPPINGS,
  },
  {
    id: 'tra-dao',
    name: 'Trà đào cam sả',
    category: 'Trà',
    description: 'Trà đen thanh mát, đào giòn, cam vàng và hương sả tự nhiên.',
    imageUrl: unsplash('photo-1751033390130-cdc5a6082089'),
    basePrice: 45000,
    badge: 'Tươi mát',
    sizes: SIZES,
    toppings: TEA_TOPPINGS,
  },
  {
    id: 'matcha',
    name: 'Matcha latte',
    category: 'Trà',
    description: 'Matcha Nhật Bản thơm thanh, quyện cùng sữa tươi béo nhẹ.',
    imageUrl: unsplash('photo-1749280447307-31a68eb38673'),
    basePrice: 52000,
    badge: 'Yêu thích',
    sizes: SIZES,
    toppings: TEA_TOPPINGS,
  },
  {
    id: 'chocolate',
    name: 'Chocolate đá xay',
    category: 'Đá xay',
    description: 'Chocolate đậm đà xay mịn cùng sữa và phủ kem tươi mềm mượt.',
    imageUrl: unsplash('photo-1629644087983-c85380e0b543'),
    basePrice: 55000,
    sizes: SIZES,
    toppings: COFFEE_TOPPINGS,
  },
]

export const HERO_IMAGE_URL = unsplash('photo-1749105504681-1889a810be41', 1200)
