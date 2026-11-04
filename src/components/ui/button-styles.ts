import { cn } from '@/lib/cn'

export type ButtonVariant = 'primary' | 'secondary'

const base =
  'inline-flex min-h-12 items-center justify-center gap-2.5 rounded-full border px-6 text-sm font-bold transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0'

const variants: Record<ButtonVariant, string> = {
  primary: 'border-forest bg-forest text-white hover:bg-forest-dark disabled:hover:bg-forest',
  secondary: 'border-line-strong bg-transparent text-forest hover:border-forest hover:bg-white',
}

/** Dùng cho cả <Button> lẫn <Link> cần giao diện nút. */
export const buttonClass = (variant: ButtonVariant = 'primary', className?: string): string =>
  cn(base, variants[variant], className)
