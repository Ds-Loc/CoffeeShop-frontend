import type { OrderStatus, PaymentMethod } from './types'

export const ORDER_STATUS_LABEL: Record<OrderStatus, string> = {
  PAID: 'Đã thanh toán',
  PREPARING: 'Đang pha chế',
  READY: 'Sẵn sàng',
  COMPLETED: 'Hoàn tất',
  CANCELLED: 'Đã huỷ',
}

export const PAYMENT_METHOD_LABEL: Record<PaymentMethod, string> = {
  wallet: 'Ví điện tử',
  card: 'Thẻ ngân hàng',
}
