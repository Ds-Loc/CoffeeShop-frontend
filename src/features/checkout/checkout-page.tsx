import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { ArrowLeftIcon, CheckIcon, ClockIcon } from '@/components/icons/icon'
import { Eyebrow } from '@/components/ui/eyebrow'
import { STORE_INFO } from '@/config/store-info'
import { useCartSummary } from '@/features/cart/hooks'
import type { PaymentMethod } from '@/features/orders/types'
import { cn } from '@/lib/cn'
import type { PaymentDetails } from './types'
import { usePlaceOrder } from './hooks'
import { OrderSummary } from './components/order-summary'
import { PaymentOptions } from './components/payment-options'

const stepBadgeClass = 'grid size-8 shrink-0 place-items-center rounded-full bg-forest text-[11px] font-extrabold text-white'
const cardClass = 'rounded-[20px] border border-line bg-paper p-5 sm:p-7'

export function CheckoutPage() {
  const { items, subtotal, serviceFee } = useCartSummary()
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('wallet')
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails>({ cardValid: false })
  const [isConfirmed, setIsConfirmed] = useState(false)
  const { mutate: pay, isPending } = usePlaceOrder()

  const isPaymentValid = paymentMethod === 'wallet' ? Boolean(paymentDetails.walletProvider) : paymentDetails.cardValid
  const handlePay = () => {
    if (!isPaymentValid) return
    pay({ items, subtotal, serviceFee, paymentMethod, walletProvider: paymentDetails.walletProvider })
  }

  return (
    <main className="shell min-h-[700px] pt-7 pb-24 sm:pt-11">
      <Link className="flex min-h-10 items-center gap-1.5 text-xs font-bold text-muted hover:text-forest" to="/">
        <ArrowLeftIcon /> Quay lại menu
      </Link>

      <div className="mt-7 mb-9 sm:mt-10">
        <Eyebrow>Bước cuối cùng</Eyebrow>
        <h1 className="mt-2.5 mb-2 font-display text-[42px] font-medium tracking-[-0.05em] sm:text-6xl">Thanh toán đơn hàng</h1>
        <p className="text-[13px] text-muted">Kiểm tra lại món và chọn phương thức thanh toán phù hợp.</p>
      </div>

      <div className="grid items-start gap-6 lg:grid-cols-[1fr_390px]">
        <section className="flex flex-col gap-4">
          <div className={cn(cardClass, 'grid grid-cols-[auto_1fr] gap-4')}>
            <span className={stepBadgeClass}>1</span>
            <div>
              <h2 className="mb-1 font-display text-xl font-semibold">Nhận tại quầy</h2>
              <p className="text-xs text-muted">
                {STORE_INFO.name} · {STORE_INFO.address}
              </p>
              <span className="mt-3.5 flex items-center gap-1.5 text-[11px] font-bold text-forest">
                <ClockIcon size={16} /> Dự kiến sẵn sàng trong {STORE_INFO.pickupEstimate}
              </span>
            </div>
          </div>

          <div className={cardClass}>
            <div className="flex items-start gap-4">
              <span className={stepBadgeClass}>2</span>
              <div>
                <h2 className="mb-1 font-display text-xl font-semibold">Phương thức thanh toán</h2>
                <p className="text-xs text-muted">Chọn cách bạn muốn thanh toán</p>
              </div>
            </div>
            <PaymentOptions onChange={setPaymentMethod} onDetailsChange={setPaymentDetails} value={paymentMethod} />
          </div>

          <label className="group flex cursor-pointer items-center gap-2.5 px-1 py-2 text-xs text-muted">
            <input checked={isConfirmed} className="peer sr-only" onChange={(event) => setIsConfirmed(event.target.checked)} type="checkbox" />
            <span className="grid size-[18px] shrink-0 place-items-center rounded-[5px] border border-stone-400 text-white peer-checked:border-forest peer-checked:bg-forest peer-focus-visible:outline-3 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-caramel/35">
              <CheckIcon className="opacity-0 group-has-checked:opacity-100" size={14} />
            </span>
            Tôi đã kiểm tra thông tin đơn hàng và đồng ý thanh toán.
          </label>
        </section>

        <OrderSummary canPay={isConfirmed && isPaymentValid} isPaying={isPending} onPay={handlePay} />
      </div>
    </main>
  )
}
