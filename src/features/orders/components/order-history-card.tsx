import { formatDateTime, formatVnd } from '@/lib/format'
import { countItems } from '@/features/cart/pricing'
import type { Order } from '../types'
import { StatusPill } from './status-pill'

export function OrderHistoryCard({ order }: { order: Order }) {
  return (
    <article className="rounded-[20px] border border-line bg-paper p-5 sm:p-6">
      <div className="flex items-start justify-between border-b border-line pb-4">
        <div className="flex flex-col">
          <span className="text-[10px] text-muted uppercase">Mã đơn</span>
          <h2 className="my-0.5 font-display text-xl">#{order.id}</h2>
          <small className="text-[11px] text-muted">{formatDateTime(order.createdAt)}</small>
        </div>
        <StatusPill status={order.status} />
      </div>

      <div className="grid grid-cols-[auto_1fr_auto] items-center gap-3.5 pt-4">
        <div className="flex">
          {order.items.slice(0, 3).map((item) => (
            <img alt="" className="-ml-2.5 size-10 rounded-full border-2 border-paper object-cover first:ml-0" key={item.key} src={item.imageUrl} />
          ))}
        </div>
        <div className="flex min-w-0 flex-col">
          <strong className="text-xs">{countItems(order.items)} món</strong>
          <span className="truncate text-[11px] text-muted">{order.items.map((item) => item.productName).join(', ')}</span>
        </div>
        <strong className="text-[13px]">{formatVnd(order.total)}</strong>
      </div>
    </article>
  )
}
