import { Link } from '@tanstack/react-router'
import { Logo } from '@/components/ui/logo'
import { STORE_INFO } from '@/config/store-info'
import { cn } from '@/lib/cn'

const columnClass = 'flex flex-col items-start gap-3 text-xs text-white/55'
const headingClass = 'mb-1 text-xs font-bold tracking-wider text-white uppercase'
const linkClass = 'transition-colors hover:text-caramel'

export function Footer() {
  return (
    <footer className="bg-[#18261c] text-white">
      <div className="shell grid gap-10 py-14 sm:grid-cols-[1.5fr_1fr] lg:grid-cols-[2fr_1fr_1.3fr] lg:gap-12">
        <div className={columnClass}>
          <Logo inverted />
          <p>{STORE_INFO.tagline}</p>
        </div>
        <div className={columnClass}>
          <strong className={headingClass}>Khám phá</strong>
          <Link className={linkClass} hash="menu" to="/">
            Thực đơn
          </Link>
          <Link className={linkClass} to="/orders">
            Đơn hàng của tôi
          </Link>
        </div>
        <div className={cn(columnClass, 'sm:col-span-2 lg:col-span-1')}>
          <strong className={headingClass}>Ghé {STORE_INFO.name}</strong>
          <span>{STORE_INFO.address}</span>
          <span>{STORE_INFO.openingHours}</span>
        </div>
      </div>
      <div className="shell border-t border-white/10 py-5 text-[11px] text-white/40">
        © {new Date().getFullYear()} {STORE_INFO.name}. Được pha với sự tận tâm.
      </div>
    </footer>
  )
}
