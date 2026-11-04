import { createFileRoute } from '@tanstack/react-router'
import { AdminCustomersPage } from '@/features/admin/admin-pages'
export const Route = createFileRoute('/admin/customers')({ component: AdminCustomersPage })
