import { useState } from 'react'
import { CheckIcon, CloseIcon } from '@/components/icons/icon'
import { Button } from '@/components/ui/button'
import { Overlay } from '@/components/ui/overlay'
import { QuantityControl } from '@/components/ui/quantity-control'
import { cartActions } from '@/features/cart/cart.store'
import { calcUnitPrice } from '@/features/cart/pricing'
import { buildCartItem } from '@/features/cart/utils'
import { formatVnd } from '@/lib/format'
import { uiActions } from '@/lib/ui.store'
import { DEFAULT_SIZE_ID } from '../constants'
import type { Product, SizeId } from '../types'
import { SizeOptions } from './size-options'
import { ToppingOptions } from './topping-options'

interface ProductCustomizerProps {
  product: Product
  onClose: () => void
}

const fieldsetClass = 'border-0 border-t border-line py-5'
const legendClass = 'flex w-full items-center justify-between text-[13px] font-extrabold'
const legendHintClass = 'text-[10px] font-semibold tracking-wider text-muted uppercase'

export function ProductCustomizer({ product, onClose }: ProductCustomizerProps) {
  const [sizeId, setSizeId] = useState<SizeId>(DEFAULT_SIZE_ID)
  const [toppingIds, setToppingIds] = useState<string[]>([])
  const [quantity, setQuantity] = useState(1)

  const selectedToppings = product.toppings.filter((topping) => toppingIds.includes(topping.id))
  const total = calcUnitPrice(product, sizeId, selectedToppings) * quantity

  const toggleTopping = (toppingId: string) =>
    setToppingIds((current) =>
      current.includes(toppingId) ? current.filter((id) => id !== toppingId) : [...current, toppingId],
    )

  const handleAddToCart = () => {
    cartActions.addItem(buildCartItem({ product, sizeId, toppings: selectedToppings, quantity }))
    uiActions.showToast(`Đã thêm ${product.name} vào giỏ`)
    onClose()
  }

  return (
    <Overlay onClose={onClose}>
      <div
        aria-labelledby="customizer-title"
        aria-modal="true"
        className="relative grid max-h-[94vh] w-full max-w-[930px] animate-modal-in overflow-y-auto rounded-t-3xl bg-paper shadow-2xl sm:max-h-[min(760px,calc(100vh-2.5rem))] sm:rounded-[28px] md:h-[min(760px,calc(100vh-2.5rem))] md:grid-cols-[0.9fr_1.1fr] md:overflow-hidden"
        role="dialog"
      >
        <button
          aria-label="Đóng"
          className="absolute top-4 right-4 z-10 grid size-10 place-items-center rounded-full border border-ink/12 bg-paper/90"
          onClick={onClose}
          type="button"
        >
          <CloseIcon />
        </button>

        <div className="relative h-60 shrink-0 overflow-hidden bg-stone-300 md:h-full">
          <img alt={product.name} className="size-full object-cover" src={product.imageUrl} />
          {product.badge && (
            <span className="absolute top-3.5 left-3.5 rounded-full bg-paper/90 px-2.5 py-1.5 text-[10px] font-extrabold tracking-wide text-forest uppercase">
              {product.badge}
            </span>
          )}
        </div>

        <div className="flex flex-col px-5 pt-7 pb-6 sm:px-10 sm:pt-10 md:overflow-y-auto">
          <span className="text-[10px] font-extrabold tracking-[0.12em] text-caramel uppercase">{product.category}</span>
          <h2 className="mt-2 mb-2 font-display text-3xl font-medium tracking-tight sm:text-4xl" id="customizer-title">
            {product.name}
          </h2>
          <p className="mb-6 text-[13px] leading-relaxed text-muted">{product.description}</p>

          <fieldset className={fieldsetClass}>
            <legend className={legendClass}>
              Chọn kích cỡ <span className={legendHintClass}>Bắt buộc</span>
            </legend>
            <SizeOptions onChange={setSizeId} sizes={product.sizes} value={sizeId} />
          </fieldset>

          <fieldset className={fieldsetClass}>
            <legend className={legendClass}>
              Thêm topping <span className={legendHintClass}>Tùy chọn</span>
            </legend>
            <ToppingOptions onToggle={toggleTopping} selectedIds={toppingIds} toppings={product.toppings} />
          </fieldset>

          <div className="sticky bottom-0 -mx-5 mt-auto grid grid-cols-[auto_1fr] gap-3.5 bg-paper px-5 pt-2 pb-1 sm:-mx-10 sm:px-10">
            <QuantityControl onChange={setQuantity} value={quantity} />
            <Button className="justify-between px-6" onClick={handleAddToCart}>
              <span className="flex items-center gap-2">
                <CheckIcon size={16} /> Thêm vào giỏ
              </span>
              <span>{formatVnd(total)}</span>
            </Button>
          </div>
        </div>
      </div>
    </Overlay>
  )
}
