import { createFileRoute } from '@tanstack/react-router'
import { AdminOrdersPage } from '@/features/admin/admin-pages'
export const Route = createFileRoute('/admin/orders')({ component: AdminOrdersPage })
