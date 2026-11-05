import { useNavigate } from '@tanstack/react-router'
import { CartIcon, ClockIcon, CloseIcon } from '@/components/icons/icon'
import { Button } from '@/components/ui/button'
import { EmptyState } from '@/components/ui/empty-state'
import { Eyebrow } from '@/components/ui/eyebrow'
import { Overlay } from '@/components/ui/overlay'
import { QuantityControl } from '@/components/ui/quantity-control'
import { STORE_INFO } from '@/config/store-info'
import { getSession } from '@/features/auth/auth.store'
import { formatVnd } from '@/lib/format'
import { uiActions, useIsCartOpen } from '@/lib/ui.store'
import { cartActions } from '../cart.store'
import { useCartSummary } from '../hooks'
import { calcLineTotal } from '../pricing'
import { describeCartItem } from '../utils'

export function CartDrawer() {
  const isOpen = useIsCartOpen()
  return isOpen ? <CartDrawerContent /> : null
}

function CartDrawerContent() {
  const navigate = useNavigate()
  const { items, count, subtotal } = useCartSummary()

  const handleCheckout = () => {
    uiActions.closeCart()
    if (getSession()) {
      void navigate({ to: '/checkout' })
    } else {
      uiActions.openAuth('login', 'checkout')
    }
  }

  const handleRemoveItem = (key: string, name: string) => {
    cartActions.removeItem(key)
    uiActions.showToastWithAction(
      `Đã xoá "${name}"`,
      'Hoàn tác',
      () => cartActions.undo(),
    )
  }

  return (
    <Overlay onClose={uiActions.closeCart} placement="end">
      <aside aria-label="Giỏ hàng" className="flex h-full w-[min(470px,100%)] animate-drawer-in flex-col bg-paper shadow-2xl">
        <div className="flex items-center justify-between border-b border-line px-5 py-7 sm:px-8">
          <div>
            <Eyebrow>Đơn của bạn</Eyebrow>
            <h2 className="mt-1.5 font-display text-3xl font-medium">
              Giỏ hàng <small className="font-sans text-[11px] font-semibold text-muted">{count} món</small>
            </h2>
          </div>
          <button
            aria-label="Đóng giỏ hàng"
            className="grid size-10 place-items-center rounded-full border border-ink/12 bg-paper/90"
            onClick={uiActions.closeCart}
            type="button"
          >
            <CloseIcon />
          </button>
        </div>

        {items.length === 0 ? (
          <EmptyState
            action={
              <Button onClick={uiActions.closeCart} variant="secondary">
                Khám phá menu
              </Button>
            }
            bordered={false}
            className="flex-1 justify-center"
            description="Thêm một ly thật ngon để bắt đầu đơn hàng nhé."
            icon={<CartIcon size={32} />}
            title="Giỏ hàng đang trống"
          />
        ) : (
          <>
            <ul className="flex-1 overflow-y-auto px-5 sm:px-8">
              {items.map((item) => (
                <li className="grid grid-cols-[86px_1fr] gap-4 border-b border-line py-5" key={item.key}>
                  <img alt="" className="h-24 w-[86px] rounded-xl object-cover" src={item.imageUrl} />
                  <div>
                    <h3 className="mt-0.5 mb-1 font-display text-lg">{item.productName}</h3>
                    <p className="mb-1.5 line-clamp-2 text-[11px] leading-normal text-muted">{describeCartItem(item)}</p>
                    <strong className="text-[13px]">{formatVnd(calcLineTotal(item))}</strong>
                    <div className="mt-3 flex items-center justify-between">
                      <QuantityControl
                        onChange={(quantity) => cartActions.setQuantity(item.key, quantity)}
                        size="sm"
                        value={item.quantity}
                      />
                      <button
                        className="text-[11px] text-[#9a5e4e] underline"
                        onClick={() => handleRemoveItem(item.key, item.productName)}
                        type="button"
                      >
                        Xóa
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <div className="border-t border-line bg-white px-5 pt-5 pb-7 sm:px-8">
              <div className="flex justify-between text-[13px]">
                <span>Tạm tính</span>
                <strong className="text-[17px]">{formatVnd(subtotal)}</strong>
              </div>
              <p className="my-4 flex items-center gap-2 rounded-[10px] bg-lime-soft px-3.5 py-3 text-[11px] text-forest">
                <ClockIcon size={16} /> Nhận tại quầy sau khoảng {STORE_INFO.pickupEstimate}
              </p>
              <Button className="w-full justify-between" onClick={handleCheckout}>
                Thanh toán <span>{formatVnd(subtotal)}</span>
              </Button>
            </div>
          </>
        )}
      </aside>
    </Overlay>
  )
}
