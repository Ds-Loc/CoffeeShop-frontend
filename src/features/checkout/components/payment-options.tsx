import type { ReactNode } from 'react'
import { PAYMENT_METHOD_LABEL } from '@/features/orders/constants'
import type { PaymentMethod } from '@/features/orders/types'
import { cn } from '@/lib/cn'

interface PaymentOptionsProps {
  value: PaymentMethod
  onChange: (method: PaymentMethod) => void
}

const OPTIONS: { method: PaymentMethod; description: string; icon: ReactNode; iconClass: string }[] = [
  { method: 'wallet', description: 'MoMo, ZaloPay hoặc VNPay', icon: 'W', iconClass: 'bg-[#d93068] text-base font-black' },
  { method: 'card', description: 'Visa, Mastercard hoặc thẻ nội địa', icon: '••', iconClass: 'bg-[#31588c] tracking-widest' },
]

export function PaymentOptions({ value, onChange }: PaymentOptionsProps) {
  return (
    <div className="mt-5 grid gap-3 sm:grid-cols-2">
      {OPTIONS.map((option) => (
        <label
          className="relative grid min-h-20 cursor-pointer grid-cols-[auto_1fr_auto] items-center gap-3 rounded-[14px] border border-line px-4 has-checked:border-forest has-checked:bg-[#f4f6ed] has-focus-visible:outline-3 has-focus-visible:outline-offset-2 has-focus-visible:outline-caramel/35"
          key={option.method}
        >
          <input
            checked={value === option.method}
            className="sr-only peer"
            name="payment"
            onChange={() => onChange(option.method)}
            type="radio"
          />
          <span className={cn('grid size-10 place-items-center rounded-[11px] text-white', option.iconClass)}>{option.icon}</span>
          <div className="flex flex-col">
            <strong className="text-xs">{PAYMENT_METHOD_LABEL[option.method]}</strong>
            <small className="mt-0.5 text-[10px] text-muted">{option.description}</small>
          </div>
          <span className="size-4 rounded-full border border-stone-400 peer-checked:border-[5px] peer-checked:border-forest" />
        </label>
      ))}
    </div>
  )
}
