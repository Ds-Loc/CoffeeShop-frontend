import { Outlet, useRouterState } from '@tanstack/react-router'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import { AuthDialog } from '@/features/auth/components/auth-dialog'
import { CartDrawer } from '@/features/cart/components/cart-drawer'
import { Footer } from './footer'
import { Header } from './header'
import { Toast } from './toast'

export function RootLayout() {
  const pathname = useRouterState({ select: (state) => state.location.pathname })
  const isAdminRoute = pathname.startsWith('/admin')

  if (isAdminRoute) {
    return (
      <div className="min-h-screen overflow-x-clip">
        <Outlet />
        {import.meta.env.DEV && <TanStackRouterDevtools />}
      </div>
    )
  }

  return (
    <div className="min-h-screen overflow-x-clip">
      <Header />
      <Outlet />
      <Footer />

      <CartDrawer />
      <AuthDialog />
      <Toast />

      {import.meta.env.DEV && (
        <>
          <TanStackRouterDevtools />
          <ReactQueryDevtools initialIsOpen={false} />
        </>
      )}
    </div>
  )
}
