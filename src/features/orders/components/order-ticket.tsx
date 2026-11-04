import { CartIcon, CheckIcon } from '@/components/icons/icon'
import { STORE_INFO } from '@/config/store-info'
import { cn } from '@/lib/cn'
import { formatVnd } from '@/lib/format'
import { PAYMENT_METHOD_LABEL } from '../constants'
import type { Order } from '../types'
import { StatusPill } from './status-pill'

const TIMELINE_STEPS = [
  { key: 'PAID', label: 'Đã thanh toán', note: 'Vừa xong' },
  { key: 'PREPARING', label: 'Đang chuẩn bị', note: 'Khoảng 10 phút' },
  { key: 'READY', label: 'Sẵn sàng nhận', note: 'Tại quầy' },
  { key: 'COMPLETED', label: 'Đã hoàn tất', note: 'Cảm ơn bạn' },
] as const

const metaLabelClass = 'text-[11px] text-muted'

export function OrderTicket({ order }: { order: Order }) {
  return (
    <div className="mx-auto w-full max-w-[650px] rounded-[23px] border border-line bg-paper px-5 pt-7 pb-8 text-left shadow-xl shadow-ink/5 sm:px-8">
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-[10px] text-muted uppercase">Mã đơn hàng</span>
          <strong className="mt-1 font-display text-2xl">#{order.id}</strong>
        </div>
        <StatusPill status={order.status} />
      </div>

      <hr className="my-6 border-t border-dashed border-line-strong" />

      <ol className="relative grid grid-cols-4 before:absolute before:top-4 before:right-[12.5%] before:left-[12.5%] before:h-px before:bg-stone-300">
        {TIMELINE_STEPS.map((step, index) => {
          const currentIndex = TIMELINE_STEPS.findIndex((item) => item.key === order.status)
          const isDone = order.status !== 'CANCELLED' && index < currentIndex
          const isActive = order.status !== 'CANCELLED' && index === currentIndex
          return (
            <li className="z-10 flex flex-col items-center text-center" key={step.key}>
              <span
                className={cn(
                  'mb-2 grid size-8 place-items-center rounded-full border bg-paper text-stone-400',
                  isDone && 'border-forest bg-forest text-white',
                  isActive && 'border-caramel',
                )}
              >
                {isDone && <CheckIcon size={16} />}
                {isActive && <span className="size-2 rounded-full bg-caramel ring-4 ring-caramel/15" />}
                {!isDone && !isActive && <CartIcon size={16} />}
              </span>
              <strong className="text-[11px]">{step.label}</strong>
              <small className="mt-0.5 text-[10px] text-muted">{step.note}</small>
            </li>
          )
        })}
      </ol>

      <dl className="mt-6 grid grid-cols-3 border-t border-line pt-5 text-center">
        <div className="border-r border-line">
          <dt className={metaLabelClass}>Thời gian dự kiến</dt>
          <dd className="mt-1 text-xs font-bold">{STORE_INFO.pickupEstimate}</dd>
        </div>
        <div className="border-r border-line">
          <dt className={metaLabelClass}>Thanh toán</dt>
          <dd className="mt-1 text-xs font-bold">{PAYMENT_METHOD_LABEL[order.paymentMethod]}</dd>
        </div>
        <div>
          <dt className={metaLabelClass}>Tổng cộng</dt>
          <dd className="mt-1 text-xs font-bold">{formatVnd(order.total)}</dd>
        </div>
      </dl>
    </div>
  )
}
