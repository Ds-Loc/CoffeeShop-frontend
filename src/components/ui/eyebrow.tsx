import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

interface EyebrowProps {
  children: ReactNode
  centered?: boolean
  className?: string
}

/** Nhãn nhỏ in hoa phía trên tiêu đề section. */
export function Eyebrow({ children, centered = false, className }: EyebrowProps) {
  return (
    <span
      className={cn(
        'flex items-center gap-2 text-[11px] font-extrabold tracking-[0.15em] text-caramel uppercase before:h-px before:w-6 before:bg-current',
        centered && 'justify-center',
        className,
      )}
    >
      {children}
    </span>
  )
}
