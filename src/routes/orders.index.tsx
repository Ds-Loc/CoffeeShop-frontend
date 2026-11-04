import { createFileRoute } from '@tanstack/react-router'
import { OrderHistoryPage } from '@/features/orders/order-history-page'

export const Route = createFileRoute('/orders/')({
  component: OrderHistoryPage,
})
