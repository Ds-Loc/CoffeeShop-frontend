import { useState } from 'react'
import { Link, Outlet, useLocation } from '@tanstack/react-router'
import { CloseIcon, UserIcon } from '@/components/icons/icon'
import { Logo } from '@/components/ui/logo'
import { Overlay } from '@/components/ui/overlay'
import { authActions, useSession } from '@/features/auth/auth.store'
import { uiActions } from '@/lib/ui.store'

const links = [
  { to: '/admin', label: 'Tổng quan' },
  { to: '/admin/orders', label: 'Đơn hàng' },
  { to: '/admin/menu', label: 'Thực đơn' },
  { to: '/admin/customers', label: 'Khách hàng' },
] as const

function Navigation({ onNavigate }: { onNavigate?: () => void }) {
  const { pathname } = useLocation()
  return (
    <nav aria-label="Điều hướng quản trị" className="flex flex-col gap-1">
      {links.map((link) => (
        <Link
          activeProps={{ className: 'bg-lime text-forest' }}
          className="rounded-full px-4 py-3 text-sm font-bold text-muted hover:bg-lime-soft hover:text-forest"
          key={link.to}
          onClick={onNavigate}
          to={link.to}
        >
          <span aria-hidden="true" className="mr-2">
            {pathname === link.to ? '●' : '○'}
          </span>
          {link.label}
        </Link>
      ))}
    </nav>
  )
}

function Sidebar({ mobile = false, onClose }: { mobile?: boolean; onClose?: () => void }) {
  return (
    <aside className={mobile ? 'h-full w-[290px] bg-paper p-5 shadow-2xl' : 'hidden w-64 shrink-0 border-r border-line bg-paper p-5 lg:block'}>
      <div className="mb-10 flex items-center justify-between">
        <Logo />
        {mobile && (
          <button aria-label="Đóng menu" className="rounded-full p-2 hover:bg-lime-soft" onClick={onClose} type="button">
            <CloseIcon size={18} />
          </button>
        )}
      </div>
      <p className="mb-3 px-4 text-[11px] font-bold tracking-widest text-muted uppercase">Quản trị</p>
      <Navigation onNavigate={onClose} />
      <div className="mt-auto pt-12">
        <Link className="block rounded-full px-4 py-3 text-sm font-bold text-muted hover:bg-lime-soft hover:text-forest" to="/">
          ← Về trang khách
        </Link>
        <button
          className="mt-1 w-full rounded-full px-4 py-3 text-left text-sm font-bold text-danger hover:bg-lime-soft"
          onClick={() => {
            authActions.logout()
            uiActions.showToast('Bạn đã đăng xuất.')
          }}
          type="button"
        >
          Đăng xuất
        </button>
      </div>
    </aside>
  )
}

export function AdminLayout() {
  const session = useSession()
  const [menuOpen, setMenuOpen] = useState(false)
  return (
    <div className="flex min-h-screen bg-cream text-ink">
      <Sidebar />
      {menuOpen && (
        <Overlay onClose={() => setMenuOpen(false)} placement="end">
          <Sidebar mobile onClose={() => setMenuOpen(false)} />
        </Overlay>
      )}
      <div className="min-w-0 flex-1">
        <header className="sticky top-0 z-30 flex min-h-16 items-center justify-between border-b border-line bg-cream/90 px-4 backdrop-blur-lg sm:px-8">
          <button aria-label="Mở menu quản trị" className="rounded-full border border-line p-2 lg:hidden" onClick={() => setMenuOpen(true)} type="button">
            ☰
          </button>
          <div className="hidden lg:block">
            <p className="text-[11px] font-bold tracking-widest text-muted uppercase">BrewLite workspace</p>
          </div>
          <div className="flex items-center gap-2 text-xs font-bold">
            <span className="grid size-8 place-items-center rounded-full bg-lime text-forest"><UserIcon size={16} /></span>
            <span className="hidden sm:inline">{session?.name ?? 'Quản trị viên'}</span>
          </div>
        </header>
        <main className="p-4 sm:p-8"><Outlet /></main>
      </div>
    </div>
  )
}
