import { authHandlers } from '@/features/auth/mocks/handlers'
import { menuHandlers } from '@/features/menu/mocks/handlers'
import { ordersHandlers } from '@/features/orders/mocks/handlers'
import { testConnectionHandlers } from '@/features/test-connection/mocks/handlers'

/**
 * Tổng hợp toàn bộ Mock Handlers theo kiến trúc Feature-based.
 * Mỗi feature tự quản lý mock handlers tương ứng với domain của mình.
 */
export const handlers = [
  ...testConnectionHandlers,
  ...menuHandlers,
  ...ordersHandlers,
  ...authHandlers,
]
