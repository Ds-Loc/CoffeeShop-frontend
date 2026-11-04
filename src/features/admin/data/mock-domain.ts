export type MockTableStatus = 'empty' | 'occupied' | 'reserved'
export type MockUserRole = 'admin' | 'staff'

export interface MockTable {
  id: number
  name: string
  status: MockTableStatus
}

export interface MockIngredient {
  id: number
  name: string
  unit: string
  quantity: number
  min_quantity: number
}

export interface MockUser {
  id: number
  username: string
  password_hash: string
  full_name: string
  role: MockUserRole
  is_active: boolean
  created_at: string
}

export interface MockCustomerAccount {
  id: number
  customer_id: number
  username: string
  password_hash: string
  is_active: boolean
  created_at: string
}

export interface MockRevenueReport {
  ngay: string
  doanh_thu: number
}

export interface MockTopProductReport {
  name: string
  so_luong: number
}

export type MockLowStockReport = MockIngredient

export const MOCK_TABLES: MockTable[] = [
  { id: 1, name: 'Bàn 1', status: 'empty' },
  { id: 2, name: 'Bàn 2', status: 'occupied' },
  { id: 3, name: 'Bàn 3', status: 'reserved' },
  { id: 4, name: 'Bàn 4', status: 'empty' },
  { id: 5, name: 'Bàn 5', status: 'empty' },
  { id: 6, name: 'Bàn 6', status: 'occupied' },
]

export const MOCK_INGREDIENTS: MockIngredient[] = [
  { id: 1, name: 'Cà phê hạt', unit: 'kg', quantity: 8.5, min_quantity: 2 },
  { id: 2, name: 'Sữa tươi', unit: 'lít', quantity: 24, min_quantity: 8 },
  { id: 3, name: 'Sữa đặc', unit: 'hộp', quantity: 18, min_quantity: 5 },
  { id: 4, name: 'Bột matcha', unit: 'kg', quantity: 1.2, min_quantity: 1.5 },
  { id: 5, name: 'Trà đen', unit: 'kg', quantity: 3.8, min_quantity: 1 },
  { id: 6, name: 'Đường', unit: 'kg', quantity: 11, min_quantity: 3 },
]

const DEMO_PASSWORD_HASH = '$2b$10$demo-only-placeholder-not-a-real-password-hash'

export const MOCK_USERS: MockUser[] = [
  {
    id: 1,
    username: 'admin',
    password_hash: DEMO_PASSWORD_HASH,
    full_name: 'Quản trị viên',
    role: 'admin',
    is_active: true,
    created_at: '2026-01-01T08:00:00.000Z',
  },
  {
    id: 2,
    username: 'thu-ngan',
    password_hash: DEMO_PASSWORD_HASH,
    full_name: 'Nguyễn Thu Ngân',
    role: 'staff',
    is_active: true,
    created_at: '2026-01-05T08:00:00.000Z',
  },
  {
    id: 3,
    username: 'pha-che',
    password_hash: DEMO_PASSWORD_HASH,
    full_name: 'Trần Minh Phúc',
    role: 'staff',
    is_active: true,
    created_at: '2026-01-06T08:00:00.000Z',
  },
]

export const MOCK_CUSTOMER_ACCOUNTS: MockCustomerAccount[] = [
  {
    id: 1,
    customer_id: 1,
    username: 'demo@example.com',
    password_hash: DEMO_PASSWORD_HASH,
    is_active: true,
    created_at: '2026-01-15T08:00:00.000Z',
  },
]

/**
 * Các mảng report mô phỏng kết quả từ các query trong schema.
 * Khi có orders/invoices thật, thay bằng dữ liệu aggregate từ API.
 */
export const MOCK_REVENUE_REPORT: MockRevenueReport[] = [
  { ngay: '2026-11-01', doanh_thu: 2480000 },
  { ngay: '2026-11-02', doanh_thu: 3120000 },
  { ngay: '2026-11-03', doanh_thu: 2860000 },
]

export const MOCK_TOP_PRODUCTS_REPORT: MockTopProductReport[] = [
  { name: 'Cà phê sữa BrewLite', so_luong: 86 },
  { name: 'Matcha latte', so_luong: 64 },
  { name: 'Trà đào cam sả', so_luong: 51 },
  { name: 'Cappuccino', so_luong: 43 },
]

export const MOCK_LOW_STOCK_REPORT: MockLowStockReport[] = MOCK_INGREDIENTS.filter(
  (ingredient) => ingredient.quantity <= ingredient.min_quantity,
)

export const ADMIN_PERMISSIONS = {
  admin: ['manage_users', 'manage_products', 'manage_tables', 'manage_inventory', 'view_reports'] as const,
  staff: ['manage_orders', 'manage_tables', 'view_inventory'] as const,
} as const
