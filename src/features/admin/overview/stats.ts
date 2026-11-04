import type { Order } from '@/features/orders/types'

export const getOrderStats = (orders: Order[], now = new Date()) => {
  const day = now.toISOString().slice(0, 10)
  const today = orders.filter((order) => order.createdAt.slice(0, 10) === day)
  const active = orders.filter((order) => ['PAID', 'PREPARING', 'READY'].includes(order.status))
  const completed = today.filter((order) => order.status !== 'CANCELLED')
  const revenue = completed.reduce((sum, order) => sum + order.total, 0)
  const itemCounts = new Map<string, number>()
  orders.forEach((order) =>
    order.items.forEach((item) => itemCounts.set(item.productName, (itemCounts.get(item.productName) ?? 0) + item.quantity)),
  )
  const topProducts = [...itemCounts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5)
  const revenueByDay = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(now)
    date.setDate(now.getDate() - (6 - index))
    const key = date.toISOString().slice(0, 10)
    return {
      label: date.toLocaleDateString('vi-VN', { weekday: 'short' }),
      value: orders
        .filter((order) => order.createdAt.slice(0, 10) === key && order.status !== 'CANCELLED')
        .reduce((sum, order) => sum + order.total, 0),
    }
  })
  return {
    revenue,
    orderCount: today.length,
    activeCount: active.length,
    average: completed.length ? Math.round(revenue / completed.length) : 0,
    topProducts,
    revenueByDay,
  }
}
