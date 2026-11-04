import { createFileRoute } from '@tanstack/react-router'
import { OrderConfirmationPage } from '@/features/orders/order-confirmation-page'

export const Route = createFileRoute('/orders/$orderId')({
  component: OrderConfirmationPage,
})
