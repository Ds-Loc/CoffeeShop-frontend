import { delay, http, HttpResponse } from 'msw'
import { getApiUrl } from '@/mocks/utils'
import { MOCK_PRODUCTS } from '../data/mock-products'
import type { Category, Product, SizeId } from '../types'

type ProductInput = Omit<Product, 'id'> & { id?: string }

const categories: Category[] = ['Cà phê', 'Trà', 'Đá xay']
const sizeIds: SizeId[] = ['S', 'M', 'L']
let mockProducts: Product[] = [...MOCK_PRODUCTS]

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null

const isCategory = (value: unknown): value is Category =>
  categories.some((category) => category === value)

const isSizeId = (value: unknown): value is SizeId =>
  sizeIds.some((sizeId) => sizeId === value)

const isProductInput = (value: unknown): value is ProductInput => {
  if (!isRecord(value)) return false

  return (
    (value.id === undefined || typeof value.id === 'string') &&
    typeof value.name === 'string' &&
    isCategory(value.category) &&
    typeof value.description === 'string' &&
    typeof value.imageUrl === 'string' &&
    typeof value.basePrice === 'number' &&
    Number.isFinite(value.basePrice) &&
    (value.badge === undefined || typeof value.badge === 'string') &&
    (value.available === undefined || typeof value.available === 'boolean') &&
    Array.isArray(value.sizes) &&
    value.sizes.every(
      (size) =>
        isRecord(size) &&
        isSizeId(size.id) &&
        typeof size.label === 'string' &&
        typeof size.priceDelta === 'number' &&
        Number.isFinite(size.priceDelta),
    ) &&
    Array.isArray(value.toppings) &&
    value.toppings.every(
      (topping) =>
        isRecord(topping) &&
        typeof topping.id === 'string' &&
        typeof topping.name === 'string' &&
        typeof topping.price === 'number' &&
        Number.isFinite(topping.price),
    )
  )
}

const readProductInput = async (request: Request): Promise<ProductInput | null> => {
  try {
    const body: unknown = await request.json()
    return isProductInput(body) ? body : null
  } catch {
    return null
  }
}

const createProductId = (): string => {
  let id = `product-${Date.now()}`
  while (mockProducts.some((product) => product.id === id)) {
    id = `product-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
  }
  return id
}

const notFound = () => HttpResponse.json({ message: 'Không tìm thấy sản phẩm' }, { status: 404 })
const invalidProduct = () =>
  HttpResponse.json({ message: 'Dữ liệu sản phẩm không hợp lệ' }, { status: 400 })

export const menuHandlers = [
  http.get(getApiUrl('/products'), async ({ request }) => {
    await delay(200)
    const showAll = new URL(request.url).searchParams.get('all') === 'true'
    return HttpResponse.json(
      showAll ? mockProducts : mockProducts.filter((product) => product.available !== false),
    )
  }),

  http.get(getApiUrl('/products/:id'), async ({ params }) => {
    await delay(150)
    const id = String(params.id)
    const product = mockProducts.find((item) => item.id === id)
    return product ? HttpResponse.json(product) : notFound()
  }),

  http.post(getApiUrl('/products'), async ({ request }) => {
    await delay(200)
    const input = await readProductInput(request)
    if (!input) return invalidProduct()

    const id = input.id || createProductId()
    if (mockProducts.some((product) => product.id === id)) {
      return HttpResponse.json({ message: 'Mã sản phẩm đã tồn tại' }, { status: 409 })
    }

    const product: Product = { ...input, id }
    mockProducts = [...mockProducts, product]
    return HttpResponse.json(product, { status: 201 })
  }),

  http.put(getApiUrl('/products/:id'), async ({ params, request }) => {
    await delay(200)
    const input = await readProductInput(request)
    if (!input) return invalidProduct()

    const id = String(params.id)
    const index = mockProducts.findIndex((product) => product.id === id)
    if (index === -1) return notFound()

    const product: Product = { ...input, id }
    mockProducts = mockProducts.map((item, itemIndex) => (itemIndex === index ? product : item))
    return HttpResponse.json(product)
  }),

  http.delete(getApiUrl('/products/:id'), async ({ params }) => {
    await delay(150)
    const id = String(params.id)
    const remaining = mockProducts.filter((product) => product.id !== id)
    if (remaining.length === mockProducts.length) return notFound()

    mockProducts = remaining
    return HttpResponse.json({ success: true, message: 'Đã xoá món thành công' })
  }),
]
