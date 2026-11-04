import { Link } from '@tanstack/react-router'
import { STORE_INFO } from '@/config/store-info'
import { cn } from '@/lib/cn'

interface LogoProps {
  inverted?: boolean
}

export function Logo({ inverted = false }: LogoProps) {
  return (
    <Link
      aria-label={`${STORE_INFO.name} – Trang chủ`}
      className={cn('flex items-center gap-2.5 text-[21px] font-extrabold tracking-[-0.035em]', inverted && 'text-white')}
      to="/"
    >
      <span className="grid size-9 place-items-center rounded-full bg-forest text-lime shadow-sm">
        <svg aria-hidden="true" fill="none" height="20" viewBox="0 0 24 24" width="20">
          <path d="M5 8h12v5a6 6 0 0 1-6 6 6 6 0 0 1-6-6V8Z" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.8" />
          <path d="M17 10h1a3 3 0 0 1 0 6h-2" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
        </svg>
      </span>
      {STORE_INFO.name}
    </Link>
  )
}
