import { Outlet } from '@tanstack/react-router'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import { AuthDialog } from '@/features/auth/components/auth-dialog'
import { CartDrawer } from '@/features/cart/components/cart-drawer'
import { Footer } from './footer'
import { Header } from './header'
import { Toast } from './toast'

export function RootLayout() {
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
