import { createFileRoute } from '@tanstack/react-router'
import { AdminOrdersPage } from '@/features/admin/admin-pages'
import type { OrderStatus } from '@/features/orders/types'

const orderStatuses: OrderStatus[] = ['PAID', 'PREPARING', 'READY', 'COMPLETED', 'CANCELLED']

type OrderSearch = {
  status?: OrderStatus
  q?: string
}

export const Route = createFileRoute('/admin/orders')({
  validateSearch: (search: Record<string, unknown>): OrderSearch => {
    const status = typeof search.status === 'string' && orderStatuses.includes(search.status as OrderStatus)
      ? (search.status as OrderStatus)
      : undefined
    const q = typeof search.q === 'string' ? search.q : undefined
    return { ...(status ? { status } : {}), ...(q ? { q } : {}) }
  },
  component: AdminOrdersPage,
})
