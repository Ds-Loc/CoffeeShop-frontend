import { ArrowRightIcon, UserIcon } from '@/components/icons/icon'
import { Button } from '@/components/ui/button'
import { useSession } from '@/features/auth/auth.store'
import { useCartSummary } from '@/features/cart/hooks'
import { calcLineTotal } from '@/features/cart/pricing'
import { formatVnd } from '@/lib/format'

interface OrderSummaryProps {
  canPay: boolean
  isPaying: boolean
  onPay: () => void
}

export function OrderSummary({ canPay, isPaying, onPay }: OrderSummaryProps) {
  const session = useSession()
  const { items, count, subtotal, serviceFee, total } = useCartSummary()

  return (
    <aside className="rounded-[20px] border border-line bg-paper p-5 sm:p-7 lg:sticky lg:top-24">
      <div className="flex items-center justify-between border-b border-line pb-4">
        <h2 className="font-display text-2xl font-medium">Đơn của bạn</h2>
        <span className="text-[11px] text-muted">{count} món</span>
      </div>

      {session && (
        <div className="flex items-center gap-2.5 py-3.5 text-forest">
          <UserIcon />
          <div className="flex flex-col">
            <span className="text-[10px] text-muted uppercase">Đặt bởi</span>
            <strong className="text-xs">{session.name}</strong>
          </div>
        </div>
      )}

      <ul className="max-h-52 overflow-y-auto">
        {items.map((item) => (
          <li className="grid grid-cols-[46px_1fr_auto] items-center gap-2.5 py-2" key={item.key}>
            <img alt="" className="h-12 w-[46px] rounded-[9px] object-cover" src={item.imageUrl} />
            <div className="flex min-w-0 flex-col">
              <strong className="truncate text-xs">{item.productName}</strong>
              <span className="text-[10px] text-muted">
                {item.quantity} × Size {item.sizeId}
              </span>
            </div>
            <strong className="text-xs">{formatVnd(calcLineTotal(item))}</strong>
          </li>
        ))}
      </ul>

      <dl className="mt-3 space-y-2.5 border-t border-line pt-4 text-xs text-muted">
        <div className="flex justify-between">
          <dt>Tạm tính</dt>
          <dd>{formatVnd(subtotal)}</dd>
        </div>
        <div className="flex justify-between">
          <dt>Phí dịch vụ</dt>
          <dd>{serviceFee ? formatVnd(serviceFee) : <em className="font-bold text-forest not-italic">Miễn phí</em>}</dd>
        </div>
        <div className="mt-4 flex items-baseline justify-between border-t border-line pt-4 text-base text-ink">
          <dt className="font-bold">Tổng cộng</dt>
          <dd className="font-display text-xl font-bold text-caramel">{formatVnd(total)}</dd>
        </div>
      </dl>

      <Button className="mt-3 w-full" disabled={!canPay || isPaying} onClick={onPay}>
        {isPaying ? (
          <span aria-label="Đang xử lý" className="size-[18px] animate-spin rounded-full border-2 border-white/35 border-t-white" role="status" />
        ) : (
          <>
            Thanh toán {formatVnd(total)} <ArrowRightIcon />
          </>
        )}
      </Button>
      <p className="mt-3 text-center text-[11px] text-muted">
        <span className="text-forest">✓</span> Thanh toán an toàn và được bảo mật
      </p>
    </aside>
  )
}
