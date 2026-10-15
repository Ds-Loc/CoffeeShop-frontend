import { createRootRoute, Link, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

export const Route = createRootRoute({
  component: () => (
    <>
      <nav style={{ display: 'flex', gap: '10px', padding: '10px', borderBottom: '1px solid #ccc' }}>
        <Link to="/" className="[&.active]:font-bold">
          Trang chủ
        </Link>
        <Link to="/about" className="[&.active]:font-bold">
          Giới thiệu
        </Link>
      </nav>
      <main style={{ padding: '20px' }}>
        <Outlet />
      </main>
      {/* Devtools cho Router & Query khi phát triển */}
      <TanStackRouterDevtools />
      <ReactQueryDevtools initialIsOpen={false} />
    </>
  ),
})