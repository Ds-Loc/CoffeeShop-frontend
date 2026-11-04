import { cn } from '@/lib/cn'

interface QuantityControlProps {
  value: number
  onChange: (value: number) => void
  size?: 'md' | 'sm'
}

export function QuantityControl({ value, onChange, size = 'md' }: QuantityControlProps) {
  const isSmall = size === 'sm'
  const buttonClass = cn('h-full transition-colors hover:text-forest disabled:text-stone-300', isSmall ? 'text-base' : 'text-xl')

  return (
    <div
      className={cn(
        'grid items-center rounded-full border border-line bg-white text-center',
        isSmall ? 'min-h-9 grid-cols-[32px_28px_32px]' : 'min-h-12 grid-cols-[44px_34px_44px]',
      )}
    >
      <button aria-label="Giảm số lượng" className={buttonClass} disabled={value <= 1} onClick={() => onChange(value - 1)} type="button">
        −
      </button>
      <span aria-live="polite" className="text-xs font-extrabold">
        {value}
      </span>
      <button aria-label="Tăng số lượng" className={buttonClass} onClick={() => onChange(value + 1)} type="button">
        +
      </button>
    </div>
  )
}
