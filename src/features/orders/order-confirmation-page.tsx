import { getRouteApi, Link } from '@tanstack/react-router'
import { CartIcon, CheckIcon } from '@/components/icons/icon'
import { buttonClass } from '@/components/ui/button-styles'
import { EmptyState } from '@/components/ui/empty-state'
import { Eyebrow } from '@/components/ui/eyebrow'
import { OrderTicket } from './components/order-ticket'
import { useOrder } from './orders.store'

const orderRoute = getRouteApi('/orders/$orderId')

export function OrderConfirmationPage() {
  const { orderId } = orderRoute.useParams()
  const order = useOrder(orderId)

  if (!order) {
    return (
      <main className="shell py-20">
        <EmptyState
          action={
            <Link className={buttonClass('primary')} to="/">
              Về trang chủ
            </Link>
          }
          description="Mã đơn không tồn tại hoặc đã bị xoá khỏi thiết bị này."
          icon={<CartIcon size={28} />}
          title="Không tìm thấy đơn hàng"
        />
      </main>
    )
  }

  return (
    <main className="shell min-h-[760px] py-14 text-center sm:py-20">
      <div className="mx-auto mb-6 grid size-[83px] place-items-center rounded-full border-8 border-lime/55 bg-forest text-white">
        <CheckIcon size={42} />
      </div>
      <Eyebrow centered>Thanh toán thành công</Eyebrow>
      <h1 className="mt-3 mb-2.5 font-display text-5xl font-medium tracking-[-0.04em] sm:text-[54px]">Cảm ơn bạn!</h1>
      <p className="mb-8 text-xs leading-relaxed text-muted sm:text-[13px]">
        Đơn hàng đang được chuyển đến quầy pha chế.
        <br />
        Hãy để ý thông báo khi đồ uống đã sẵn sàng nhé.
      </p>

      <OrderTicket order={order} />

      <div className="mt-6 flex flex-col justify-center gap-2.5 sm:flex-row">
        <Link className={buttonClass('primary')} hash="menu" to="/">
          Tiếp tục đặt món
        </Link>
        <Link className={buttonClass('secondary')} to="/orders">
          Xem lịch sử đơn
        </Link>
      </div>
    </main>
  )
}
