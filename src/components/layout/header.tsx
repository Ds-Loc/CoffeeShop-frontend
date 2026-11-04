import { Link } from '@tanstack/react-router'
import { CartIcon, UserIcon } from '@/components/icons/icon'
import { Logo } from '@/components/ui/logo'
import { useCartSummary } from '@/features/cart/hooks'
import { useSession } from '@/features/auth/auth.store'
import { uiActions } from '@/lib/ui.store'

const navLinkClass = 'text-sm font-semibold text-stone-600 transition-colors hover:text-caramel'

export function Header() {
  const session = useSession()
  const { count } = useCartSummary()

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
          {session && (
            <span className="hidden max-w-36 items-center gap-1.5 text-[13px] font-semibold text-stone-600 md:flex" title={session.email}>
              <UserIcon />
              <span className="truncate">{session.name}</span>
            </span>
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
