import { Link } from '@tanstack/react-router'
import { ArrowLeftIcon, CartIcon } from '@/components/icons/icon'
import { buttonClass } from '@/components/ui/button-styles'
import { EmptyState } from '@/components/ui/empty-state'
import { Eyebrow } from '@/components/ui/eyebrow'
import { useSession } from '@/features/auth/auth.store'
import { OrderHistoryCard } from './components/order-history-card'
import { useOrders } from './hooks'

export function OrderHistoryPage() {
  const { data: allOrders = [], isPending } = useOrders()
  const session = useSession()
  const accountEmail = session?.email.trim().toLocaleLowerCase('vi')
  const orders = accountEmail
    ? allOrders.filter((order) => order.customerEmail?.trim().toLocaleLowerCase('vi') === accountEmail)
    : []
  const latestFirst = [...orders].reverse()

  return (
    <main className="shell min-h-[700px] pt-7 pb-24 sm:pt-11">
      <Link className="flex min-h-10 items-center gap-1.5 text-xs font-bold text-muted hover:text-forest" to="/">
        <ArrowLeftIcon /> Quay lại menu
      </Link>

      <div className="mt-7 mb-9 sm:mt-10">
        <Eyebrow>BrewLite của bạn</Eyebrow>
        <h1 className="mt-2.5 mb-2 font-display text-[39px] font-medium tracking-[-0.05em] sm:text-5xl">Lịch sử đơn hàng</h1>
        <p className="text-[13px] text-muted">Lịch sử chỉ hiển thị đơn hàng của tài khoản đang đăng nhập.</p>
      </div>

      {isPending ? (
        <p className="py-20 text-center text-sm text-muted">Đang tải lịch sử đơn hàng...</p>
      ) : latestFirst.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2">
          {latestFirst.map((order) => (
            <OrderHistoryCard key={order.id} order={order} />
          ))}
        </div>
      ) : (
        <EmptyState
          action={
            <Link className={buttonClass('primary')} hash="menu" to="/">
              Đặt món ngay
            </Link>
          }
          description={
            accountEmail
              ? 'Đơn hàng đầu tiên của bạn sẽ xuất hiện tại đây.'
              : 'Đăng nhập bằng tài khoản đã đặt hàng để xem lịch sử của bạn.'
          }
          icon={<CartIcon size={28} />}
          title={accountEmail ? 'Chưa có đơn hàng nào' : 'Chưa đăng nhập'}
        />
      )}
    </main>
  )
}
