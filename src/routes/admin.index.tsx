import { createFileRoute } from '@tanstack/react-router'
import { AdminOverviewPage } from '@/features/admin/admin-pages'
export const Route = createFileRoute('/admin/')({ component: AdminOverviewPage })
