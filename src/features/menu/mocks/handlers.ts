import { http, HttpResponse, delay } from 'msw'
import { getApiUrl } from '@/mocks/utils'
import { MOCK_PRODUCTS } from '../data/mock-products'
import type { Product } from '../types'

// Mock database in-memory cho thực đơn
let mockProducts: Product[] = [...MOCK_PRODUCTS]

export const menuHandlers = [
  // GET /products - Lấy danh sách món đang bán (hoặc tất cả nếu all=true)
  http.get(getApiUrl('/products'), async ({ request }) => {
    await delay(200)
    const url = new URL(request.url)
    const showAll = url.searchParams.get('all') === 'true'
    const list = showAll ? mockProducts : mockProducts.filter((product) => product.available !== false)
    return HttpResponse.json(list)
  }),
  http.get('/products', async ({ request }) => {
    await delay(200)
    const url = new URL(request.url)
    const showAll = url.searchParams.get('all') === 'true'
    const list = showAll ? mockProducts : mockProducts.filter((product) => product.available !== false)
    return HttpResponse.json(list)
  }),

  // GET /products/:id - Lấy chi tiết món
  http.get(getApiUrl('/products/:id'), async ({ params }) => {
    await delay(150)
    const product = mockProducts.find((item) => item.id === params.id)
    if (!product) {
      return HttpResponse.json({ message: 'Không tìm thấy sản phẩm' }, { status: 404 })
    }
    return HttpResponse.json(product)
  }),
  http.get('/products/:id', async ({ params }) => {
    await delay(150)
    const product = mockProducts.find((item) => item.id === params.id)
    if (!product) {
      return HttpResponse.json({ message: 'Không tìm thấy sản phẩm' }, { status: 404 })
    }
    return HttpResponse.json(product)
  }),

  // POST /products - Thêm món mới (dành cho Admin)
  http.post(getApiUrl('/products'), async ({ request }) => {
    await delay(200)
    const newProduct = (await request.json()) as Product
    const id = newProduct.id || `product-${Date.now()}`
    const productWithId: Product = { ...newProduct, id }
    mockProducts.push(productWithId)
    return HttpResponse.json(productWithId, { status: 201 })
  }),
  http.post('/products', async ({ request }) => {
    await delay(200)
    const newProduct = (await request.json()) as Product
    const id = newProduct.id || `product-${Date.now()}`
    const productWithId: Product = { ...newProduct, id }
    mockProducts.push(productWithId)
    return HttpResponse.json(productWithId, { status: 201 })
  }),

  // PUT /products/:id - Sửa thông tin món
  http.put(getApiUrl('/products/:id'), async ({ params, request }) => {
    await delay(200)
    const updated = (await request.json()) as Product
    mockProducts = mockProducts.map((p) => (p.id === params.id ? updated : p))
    return HttpResponse.json(updated)
  }),
  http.put('/products/:id', async ({ params, request }) => {
    await delay(200)
    const updated = (await request.json()) as Product
    mockProducts = mockProducts.map((p) => (p.id === params.id ? updated : p))
    return HttpResponse.json(updated)
  }),

  // DELETE /products/:id - Xoá món
  http.delete(getApiUrl('/products/:id'), async ({ params }) => {
    await delay(150)
    mockProducts = mockProducts.filter((p) => p.id !== params.id)
    return HttpResponse.json({ success: true, message: 'Đã xoá món thành công' })
  }),
  http.delete('/products/:id', async ({ params }) => {
    await delay(150)
    mockProducts = mockProducts.filter((p) => p.id !== params.id)
    return HttpResponse.json({ success: true, message: 'Đã xoá món thành công' })
  }),
]
