import { createFileRoute } from '@tanstack/react-router'
import { AdminMenuPage } from '@/features/admin/admin-pages'
export const Route = createFileRoute('/admin/menu')({ component: AdminMenuPage })
