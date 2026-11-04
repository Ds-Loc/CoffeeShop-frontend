import { useState, type ChangeEvent, type ReactNode } from 'react'
import { PAYMENT_METHOD_LABEL } from '@/features/orders/constants'
import type { PaymentMethod } from '@/features/orders/types'
import { cn } from '@/lib/cn'
import type { PaymentDetails, WalletProvider } from '../types'

interface PaymentOptionsProps {
  value: PaymentMethod
  onChange: (method: PaymentMethod) => void
  onDetailsChange: (details: PaymentDetails) => void
}

const OPTIONS: { method: PaymentMethod; description: string; icon: ReactNode; iconClass: string }[] = [
  { method: 'wallet', description: 'MoMo, ZaloPay hoặc VNPay', icon: 'W', iconClass: 'bg-caramel text-base font-black' },
  { method: 'card', description: 'Visa, Mastercard hoặc thẻ nội địa', icon: '••', iconClass: 'bg-forest tracking-widest' },
]

const WALLET_PROVIDERS: { id: WalletProvider; label: string }[] = [
  { id: 'momo', label: 'MoMo' },
  { id: 'zalopay', label: 'ZaloPay' },
  { id: 'vnpay', label: 'VNPay' },
]

const formatCardNumber = (value: string) => value.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim()
const formatExpiry = (value: string) => value.replace(/\D/g, '').slice(0, 4).replace(/(.{2})/, '$1/')

export function PaymentOptions({ value, onChange, onDetailsChange }: PaymentOptionsProps) {
  const [walletProvider, setWalletProvider] = useState<WalletProvider | undefined>()
  const [cardNumber, setCardNumber] = useState('')
  const [cardName, setCardName] = useState('')
  const [expiry, setExpiry] = useState('')
  const [cvv, setCvv] = useState('')

  const cardValid = cardNumber.replace(/\s/g, '').length === 16 && cardName.trim().length > 1 && /^\d{2}\/\d{2}$/.test(expiry) && /^\d{3,4}$/.test(cvv)
  const details = value === 'wallet' ? { walletProvider, cardValid: false } : { cardValid }

  const handleMethodChange = (method: PaymentMethod) => {
    onChange(method)
    onDetailsChange(method === 'wallet' ? { walletProvider, cardValid: false } : { cardValid })
  }

  const handleCardChange = (field: 'cardNumber' | 'cardName' | 'expiry' | 'cvv', setter: (value: string) => void, formatter: (value: string) => string) => (event: ChangeEvent<HTMLInputElement>) => {
    const nextValue = formatter(event.target.value)
    setter(nextValue)
    const nextCard = { cardNumber, cardName, expiry, cvv, [field]: nextValue }
    onDetailsChange({ cardValid: nextCard.cardNumber.replace(/\s/g, '').length === 16 && nextCard.cardName.trim().length > 1 && /^\d{2}\/\d{2}$/.test(nextCard.expiry) && /^\d{3,4}$/.test(nextCard.cvv) })
  }

  return (
    <div className="mt-5 grid gap-3 sm:grid-cols-2">
      {OPTIONS.map((option) => (
        <label
          className="relative grid min-h-20 cursor-pointer grid-cols-[auto_1fr_auto] items-center gap-3 rounded-[14px] border border-line px-4 has-checked:border-forest has-checked:bg-lime-soft has-focus-visible:outline-3 has-focus-visible:outline-offset-2 has-focus-visible:outline-caramel/35"
          key={option.method}
        >
          <input checked={value === option.method} className="peer sr-only" name="payment" onChange={() => handleMethodChange(option.method)} type="radio" />
          <span className={cn('grid size-10 place-items-center rounded-[11px] text-white', option.iconClass)}>{option.icon}</span>
          <div className="flex flex-col">
            <strong className="text-xs">{PAYMENT_METHOD_LABEL[option.method]}</strong>
            <small className="mt-0.5 text-[10px] text-muted">{option.description}</small>
          </div>
          <span className="size-4 rounded-full border border-stone-400 peer-checked:border-[5px] peer-checked:border-forest" />
        </label>
      ))}

      <div className="col-span-full rounded-[14px] bg-lime-soft p-4">
        {value === 'wallet' ? (
          <>
            <p className="mb-3 text-[11px] font-bold text-forest">Chọn ví điện tử</p>
            <div className="flex flex-wrap gap-2">
              {WALLET_PROVIDERS.map((provider) => (
                <button
                  className={cn(
                    'rounded-full border px-3.5 py-2 text-[11px] font-bold transition',
                    walletProvider === provider.id ? 'border-forest bg-forest text-white' : 'border-line-strong bg-paper text-muted hover:border-forest hover:text-forest',
                  )}
                  key={provider.id}
                  onClick={() => {
                    setWalletProvider(provider.id)
                    onDetailsChange({ walletProvider: provider.id, cardValid: false })
                  }}
                  type="button"
                >
                  {provider.label}
                </button>
              ))}
            </div>
            {!details.walletProvider && <p className="mt-2 text-[11px] text-danger">Vui lòng chọn ví điện tử.</p>}
          </>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="flex flex-col gap-1 text-[11px] font-bold sm:col-span-2">
              Số thẻ
              <input className="min-h-10 rounded-[11px] border border-line bg-paper px-3 text-xs outline-0 focus:border-forest" inputMode="numeric" onChange={handleCardChange('cardNumber', setCardNumber, formatCardNumber)} placeholder="1234 5678 9012 3456" value={cardNumber} />
            </label>
            <label className="flex flex-col gap-1 text-[11px] font-bold sm:col-span-2">
              Tên chủ thẻ
              <input className="min-h-10 rounded-[11px] border border-line bg-paper px-3 text-xs uppercase outline-0 focus:border-forest" onChange={handleCardChange('cardName', setCardName, (value) => value.slice(0, 60))} placeholder="NGUYEN VAN A" value={cardName} />
            </label>
            <label className="flex flex-col gap-1 text-[11px] font-bold">
              Hết hạn
              <input className="min-h-10 rounded-[11px] border border-line bg-paper px-3 text-xs outline-0 focus:border-forest" inputMode="numeric" onChange={handleCardChange('expiry', setExpiry, formatExpiry)} placeholder="MM/YY" value={expiry} />
            </label>
            <label className="flex flex-col gap-1 text-[11px] font-bold">
              CVV
              <input className="min-h-10 rounded-[11px] border border-line bg-paper px-3 text-xs outline-0 focus:border-forest" inputMode="numeric" onChange={handleCardChange('cvv', setCvv, (value) => value.replace(/\D/g, '').slice(0, 4))} placeholder="123" type="password" value={cvv} />
            </label>
            {!cardValid && <p className="text-[11px] text-danger sm:col-span-2">Vui lòng nhập đủ thông tin thẻ hợp lệ.</p>}
          </div>
        )}
      </div>
    </div>
  )

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
