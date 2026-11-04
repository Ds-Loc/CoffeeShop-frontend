import { createFileRoute, redirect } from '@tanstack/react-router'
import { getSession } from '@/features/auth/auth.store'
import { AdminLayout } from '@/features/admin/components/admin-layout'

export const Route = createFileRoute('/admin')({
  beforeLoad: () => {
    if (getSession()?.role !== 'admin') throw redirect({ to: '/' })
  },
  component: AdminLayout,
})
