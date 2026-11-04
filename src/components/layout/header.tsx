import { useEffect, useRef, useState } from 'react'
import { Link } from '@tanstack/react-router'
import { CartIcon, UserIcon } from '@/components/icons/icon'
import { Button } from '@/components/ui/button'
import { Logo } from '@/components/ui/logo'
import { authActions, useSession } from '@/features/auth/auth.store'
import { useCartSummary } from '@/features/cart/hooks'
import { uiActions } from '@/lib/ui.store'

const navLinkClass = 'text-sm font-semibold text-stone-600 transition-colors hover:text-caramel'

export function Header() {
  const session = useSession()
  const { count } = useCartSummary()
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const userMenuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isUserMenuOpen) return
    const handlePointerDown = (event: PointerEvent) => {
      if (!userMenuRef.current?.contains(event.target as Node)) setIsUserMenuOpen(false)
    }
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsUserMenuOpen(false)
    }
    document.addEventListener('pointerdown', handlePointerDown)
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isUserMenuOpen])

  return (
    <header className="sticky top-0 z-50 border-b border-ink/10 bg-cream/90 backdrop-blur-lg">
      <div className="shell flex min-h-[67px] items-center justify-between sm:min-h-19">
        <Logo />

        <nav aria-label="Điều hướng chính" className="hidden gap-8 md:flex">
          <Link className={navLinkClass} hash="menu" to="/">
            Thực đơn
          </Link>
          <Link className={navLinkClass} to="/orders">
            Đơn hàng
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          {session ? (
            <div className="relative" ref={userMenuRef}>
              <button
                aria-expanded={isUserMenuOpen}
                aria-haspopup="menu"
                className="flex max-w-36 items-center gap-1.5 rounded-full border border-line-strong px-2.5 py-2 text-[13px] font-semibold text-stone-600 hover:border-forest hover:text-forest sm:px-3"
                onClick={() => setIsUserMenuOpen((open) => !open)}
                type="button"
              >
                <UserIcon size={17} />
                <span className="hidden truncate sm:inline">{session.name}</span>
              </button>
              {isUserMenuOpen && (
                <div className="absolute top-[calc(100%+0.6rem)] right-0 z-60 min-w-48 rounded-[20px] border border-line bg-paper p-2 shadow-xl" role="menu">
                  <Link
                    className="block rounded-full px-3 py-2.5 text-xs font-bold text-ink hover:bg-lime-soft hover:text-forest"
                    onClick={() => setIsUserMenuOpen(false)}
                    role="menuitem"
                    to="/orders"
                  >
                    Đơn hàng của tôi
                  </Link>
                  <button
                    className="w-full rounded-full px-3 py-2.5 text-left text-xs font-bold text-danger hover:bg-lime-soft"
                    onClick={() => {
                      authActions.logout()
                      setIsUserMenuOpen(false)
                      uiActions.showToast('Bạn đã đăng xuất.')
                    }}
                    role="menuitem"
                    type="button"
                  >
                    Đăng xuất
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Button className="hidden min-h-10 px-4 text-xs sm:inline-flex" onClick={() => uiActions.openAuth('login')} variant="secondary">
                Đăng nhập
              </Button>
              <Button className="hidden min-h-10 px-4 text-xs md:inline-flex" onClick={() => uiActions.openAuth('register')}>
                Đăng ký
              </Button>
            </>
          )}
          {!session && (
            <Button className="min-h-10 px-4 text-xs sm:hidden" onClick={() => uiActions.openAuth('login')} variant="secondary">
              Đăng nhập
            </Button>
          )}
          <button
            aria-label={`Mở giỏ hàng, ${count} sản phẩm`}
            className="relative flex size-11 items-center justify-center gap-2 rounded-full bg-forest text-sm font-bold text-white transition hover:-translate-y-px hover:bg-forest-dark sm:w-auto sm:px-4"
            onClick={uiActions.openCart}
            type="button"
          >
            <CartIcon />
            <span className="hidden sm:inline">Giỏ hàng</span>
            {count > 0 && (
              <span className="absolute -top-1 -right-1 grid size-5 place-items-center rounded-full border-2 border-forest bg-lime text-[11px] font-bold text-forest sm:static sm:-mr-1.5">
                {count}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  )
}
