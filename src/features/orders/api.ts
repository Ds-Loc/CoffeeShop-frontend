import axios from 'axios'
import { axiosClient } from '@/lib/axios'
import { uiActions } from '@/lib/ui.store'
import { ORDER_STATUS_LABEL } from './constants'
import { ordersActions } from './orders.store'
import type { OrderStatus } from './types'

const pendingUpdates = new Set<string>()

const getErrorMessage = (error: unknown): string => {
  if (typeof error === 'string' && error.trim()) return error
  if (axios.isAxiosError(error) && !error.response) {
    return 'Không thể kết nối máy chủ. Vui lòng kiểm tra mạng và thử lại.'
  }
  if (typeof error === 'object' && error !== null && 'message' in error) {
    const message = error.message
    if (typeof message === 'string' && message.trim()) return message
  }
  if (typeof error === 'object' && error !== null && 'error' in error) {
    const message = error.error
    if (typeof message === 'string' && message.trim()) return message
  }
  return 'Vui lòng thử lại.'
}

export const updateOrderStatus = async (orderId: string, status: OrderStatus): Promise<boolean> => {
  if (pendingUpdates.has(orderId)) {
    uiActions.showErrorToast(`Đơn #${orderId} đang được cập nhật. Vui lòng thử lại.`)
    return false
  }

  const order = ordersActions.getById(orderId)
  if (!order) {
    uiActions.showErrorToast(`Không tìm thấy đơn #${orderId}.`)
    return false
  }
  if (order.status === status) return true

  pendingUpdates.add(orderId)
  ordersActions.setStatus(orderId, status)

  try {
    await axiosClient.patch(`/orders/${encodeURIComponent(orderId)}/status`, { status })
    return true
  } catch (error) {
    ordersActions.setStatus(orderId, order.status)
    uiActions.showErrorToast(
      `Không thể cập nhật đơn #${orderId} (${ORDER_STATUS_LABEL[status]}): ${getErrorMessage(error)}`,
    )
    return false
  } finally {
    pendingUpdates.delete(orderId)
  }
}
