import { cn } from '@/lib/cn'
import { ORDER_STATUS_LABEL } from '../constants'
import type { OrderStatus } from '../types'

const STATUS_STYLE: Record<OrderStatus, string> = {
  PAID: 'bg-[#e5eed0] text-forest',
  PREPARING: 'bg-[#f9ebdd] text-[#ae632e]',
  READY: 'bg-[#e1ece5] text-[#34714a]',
  COMPLETED: 'bg-[#eeeeeb] text-[#747b74]',
  CANCELLED: 'bg-[#f8e8e5] text-[#ac5146]',
}

export function StatusPill({ status }: { status: OrderStatus }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[10px] font-extrabold tracking-wide uppercase before:size-1.5 before:rounded-full before:bg-current',
        STATUS_STYLE[status],
      )}
    >
      {ORDER_STATUS_LABEL[status]}
    </span>
  )
}
