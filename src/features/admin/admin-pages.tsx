import { useMemo, useState, type FormEvent } from 'react'
import { Link, useNavigate, useSearch } from '@tanstack/react-router'
import { CartIcon } from '@/components/icons/icon'
import { Button } from '@/components/ui/button'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import { EmptyState } from '@/components/ui/empty-state'
import { Eyebrow } from '@/components/ui/eyebrow'
import { Overlay } from '@/components/ui/overlay'
import { StatusPill } from '@/features/orders/components/status-pill'
import { ORDER_STATUS_LABEL, PAYMENT_METHOD_LABEL } from '@/features/orders/constants'
import { useOrders, useUpdateOrderStatus } from '@/features/orders/hooks'
import type { Order, OrderStatus } from '@/features/orders/types'
import { formatDateTime, formatVnd } from '@/lib/format'
import {
  useAdminProducts,
  useCreateProduct,
  useUpdateProduct,
  useDeleteProduct,
} from '@/features/menu'
import type { Product } from '@/features/menu/types'
import { uiActions } from '@/lib/ui.store'
import { getOrderStats } from './overview/stats'

const card = 'rounded-[20px] border border-line bg-paper p-5'
const statuses: Array<'ALL' | OrderStatus> = ['ALL', 'PAID', 'PREPARING', 'READY', 'COMPLETED', 'CANCELLED']

function PageTitle({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return (
    <div className="mb-7">
      <Eyebrow>{eyebrow}</Eyebrow>
      <h1 className="mt-2 font-display text-4xl tracking-tight sm:text-5xl">{title}</h1>
      <p className="mt-2 text-sm text-muted">{description}</p>
    </div>
  )
}

export function AdminOverviewPage() {
  const { data: orders = [], isPending } = useOrders()
  const stats = getOrderStats(orders)
  const cards = [
    ['Doanh thu hôm nay', formatVnd(stats.revenue)],
    ['Đơn hôm nay', String(stats.orderCount)],
    ['Đang xử lý', String(stats.activeCount)],
    ['Giá trị đơn TB', formatVnd(stats.average)],
  ]

  if (isPending) {
    return (
      <div className="py-20 text-center">
        <p className="text-sm text-muted">Đang tải dữ liệu tổng quan...</p>
      </div>
    )
  }

  return (
    <>
      <PageTitle description="Theo dõi nhanh tình hình vận hành trong ngày." eyebrow="Tổng quan" title="Chào mừng trở lại" />
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map(([label, value]) => (
          <div className={card} key={label}>
            <p className="text-xs text-muted">{label}</p>
            <strong className="mt-3 block font-display text-2xl">{value}</strong>
          </div>
        ))}
      </div>
      <div className="mt-5 grid gap-5 xl:grid-cols-[1.4fr_1fr]">
        <section className={card}><div className="mb-5 flex items-center justify-between"><h2 className="font-display text-xl">Doanh thu 7 ngày</h2><span className="text-[11px] text-muted">VND</span></div>
          {orders.length === 0 ? <EmptyState icon={<CartIcon size={24} />} description="Số liệu sẽ xuất hiện khi có đơn hàng." title="Chưa có dữ liệu" /> : <div className="flex h-48 items-end gap-2 border-b border-line pb-1">{stats.revenueByDay.map((day) => { const max = Math.max(...stats.revenueByDay.map((item) => item.value), 1); return <div className="flex h-full flex-1 flex-col items-center justify-end gap-2" key={day.label}><span className="text-[10px] text-muted">{day.value ? formatVnd(day.value).replace(' ₫', '') : '0'}</span><div aria-label={`${day.label}: ${formatVnd(day.value)}`} className="w-full rounded-t-lg bg-forest transition-all hover:bg-caramel" style={{ height: `${Math.max((day.value / max) * 70, day.value ? 8 : 2)}%` }} /><span className="text-[11px] text-muted">{day.label}</span></div> })}</div>}
        </section>
      </div>
      <section className={`${card} mt-5`}>
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl">Đơn gần đây</h2>
          <Link className="text-xs font-bold text-forest" to="/admin/orders">
            Xem tất cả →
          </Link>
        </div>
        {orders.length ? (
          <div className="mt-4 space-y-2">
            {[...orders]
              .reverse()
              .slice(0, 5)
              .map((order) => (
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line py-3 text-sm" key={order.id}>
                  <span className="font-bold">#{order.id}</span>
                  <span className="text-muted">{formatDateTime(order.createdAt)}</span>
                  <StatusPill status={order.status} />
                  <strong>{formatVnd(order.total)}</strong>
                </div>
              ))}
          </div>
        ) : (
          <p className="mt-4 text-sm text-muted">Chưa có đơn hàng gần đây.</p>
        )}
      </section>
    </>
  )
}

function OrderDrawer({ order, onClose }: { order: Order; onClose: () => void }) {
  const nextStatus: Partial<Record<OrderStatus, OrderStatus>> = { PAID: 'PREPARING', PREPARING: 'READY', READY: 'COMPLETED' }
  const prevStatus: Partial<Record<OrderStatus, OrderStatus>> = { PREPARING: 'PAID', READY: 'PREPARING', COMPLETED: 'READY' }
  const [confirmCancel, setConfirmCancel] = useState(false)
  const { mutateAsync: updateOrderStatus } = useUpdateOrderStatus()

  const handleAdvance = () => {
    const next = nextStatus[order.status]
    if (!next) return
    const previous = order.status
    onClose()
    void updateOrderStatus({ id: order.id, status: next }).then((updatedOrder) => {
      if (!updatedOrder) return
      uiActions.showToastWithAction(
        `Đơn #${order.id} → ${ORDER_STATUS_LABEL[next]}`,
        'Hoàn tác',
        () => {
          void updateOrderStatus({ id: order.id, status: previous }).then((rolledBack) => {
            if (rolledBack) uiActions.showToast(`Đã hoàn tác về ${ORDER_STATUS_LABEL[previous]}.`)
          })
        },
      )
    })
  }

  const handleRollback = () => {
    const prev = prevStatus[order.status]
    if (!prev) return
    const previous = order.status
    onClose()
    void updateOrderStatus({ id: order.id, status: prev }).then((updatedOrder) => {
      if (!updatedOrder) return
      uiActions.showToastWithAction(
        `Đã hoàn tác về ${ORDER_STATUS_LABEL[prev]}`,
        'Làm lại',
        () => {
          void updateOrderStatus({ id: order.id, status: previous }).then((redone) => {
            if (redone) uiActions.showToast(`Đã chuyển lại sang ${ORDER_STATUS_LABEL[previous]}.`)
          })
        },
      )
    })
  }

  const handleCancel = () => {
    onClose()
    void updateOrderStatus({ id: order.id, status: 'CANCELLED' }).then((updatedOrder) => {
      if (updatedOrder) uiActions.showToast(`Đơn #${order.id} đã bị huỷ.`)
    })
  }

  return (
    <Overlay onClose={onClose} placement="end">
      <section aria-modal="true" className="h-full w-full max-w-[460px] overflow-y-auto bg-paper p-6 shadow-2xl" role="dialog">
        <div className="flex items-start justify-between">
          <div><Eyebrow>Chi tiết đơn</Eyebrow><h2 className="mt-1 font-display text-3xl">#{order.id}</h2></div>
          <button aria-label="Đóng chi tiết" className="rounded-full border border-line p-2" onClick={onClose} type="button">×</button>
        </div>
        <div className="mt-5 flex items-center justify-between">
          <StatusPill status={order.status} />
          <span className="text-xs text-muted">{formatDateTime(order.createdAt)}</span>
        </div>
        <div className="mt-6 space-y-3">
          {order.items.map((item) => (
            <div className="flex justify-between border-b border-line pb-3 text-sm" key={`${item.productId}-${item.sizeId}`}>
              <span>{item.quantity} × {item.productName}<small className="block text-xs text-muted">Size {item.sizeId}</small></span>
              <strong>{formatVnd(item.unitPrice * item.quantity)}</strong>
            </div>
          ))}
        </div>
        <div className="mt-5 space-y-2 text-sm">
          <div className="flex justify-between"><span className="text-muted">Thanh toán</span><span>{PAYMENT_METHOD_LABEL[order.paymentMethod]}</span></div>
          <div className="flex justify-between font-bold"><span>Tổng cộng</span><span>{formatVnd(order.total)}</span></div>
        </div>

        {/* ── Hành động ── */}
        <div className="mt-6 space-y-2">
          {nextStatus[order.status] && (
            <Button className="w-full" onClick={handleAdvance}>
              Chuyển sang {ORDER_STATUS_LABEL[nextStatus[order.status] as OrderStatus]}
            </Button>
          )}
          {prevStatus[order.status] && (
            <Button className="w-full" onClick={handleRollback} variant="secondary">
              Trả về {ORDER_STATUS_LABEL[prevStatus[order.status] as OrderStatus]}
            </Button>
          )}
          {(order.status === 'PAID' || order.status === 'PREPARING') && (
            <Button className="w-full" onClick={() => setConfirmCancel(true)} variant="secondary">
              Huỷ đơn
            </Button>
          )}
        </div>
      </section>
      {confirmCancel && (
        <ConfirmDialog
          confirmLabel="Xác nhận huỷ"
          description="Đơn đã huỷ không thể khôi phục về quy trình pha chế."
          onClose={() => setConfirmCancel(false)}
          onConfirm={handleCancel}
          title="Huỷ đơn hàng?"
        />
      )}
    </Overlay>
  )
}

export function AdminOrdersPage() {
  const { data: orders = [] } = useOrders()
  const { status: selectedStatus, q } = useSearch({ from: '/admin/orders' })
  const navigate = useNavigate({ from: '/admin/orders' })
  const filter: typeof statuses[number] = selectedStatus ?? 'ALL'
  const query = q ?? ''
  const [selected, setSelected] = useState<Order | null>(null)

  const updateOrderSearch = (updates: { status?: typeof statuses[number]; q?: string }) =>
    navigate({
      search: (previous) => ({
        ...previous,
        status: updates.status === 'ALL' ? undefined : updates.status ?? previous.status,
        q: updates.q === undefined ? previous.q : updates.q || undefined,
      }),
      replace: true,
      resetScroll: false,
    })

  // Giữ selected order đồng bộ với dữ liệu mới nhất từ query cache
  const activeSelected = useMemo(() => {
    if (!selected) return null
    return orders.find((o) => o.id === selected.id) ?? selected
  }, [orders, selected])

  const filtered = [...orders]
    .reverse()
    .filter((order) => (filter === 'ALL' || order.status === filter) && order.id.toLowerCase().includes(query.toLowerCase()))

  return (
    <>
      <PageTitle description="Theo dõi và cập nhật trạng thái đơn theo quy trình." eyebrow="Vận hành" title="Đơn hàng" />
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          aria-label="Tìm mã đơn"
          className="min-h-11 rounded-full border border-line bg-paper px-4 text-sm outline-0 focus:border-forest"
          onChange={(event) => void updateOrderSearch({ q: event.target.value })}
          placeholder="Tìm mã đơn..."
          value={query}
        />
        <div className="flex gap-2 overflow-x-auto">
          {statuses.map((status) => (
            <button
              className="rounded-full border border-line px-3 py-2 text-[11px] font-bold whitespace-nowrap aria-selected:bg-forest aria-selected:text-white"
              key={status}
              aria-selected={filter === status}
              onClick={() => void updateOrderSearch({ status })}
              type="button"
            >
              {status === 'ALL' ? 'Tất cả' : ORDER_STATUS_LABEL[status]}
            </button>
          ))}
        </div>
      </div>
      <div className={`${card} mt-5 overflow-x-auto p-0`}>
        {filtered.length ? (
          <table className="w-full min-w-[700px] text-left text-xs">
            <thead className="border-b border-line text-muted"><tr><th className="p-4">Mã đơn</th><th>Thời gian</th><th>Khách</th><th>Tổng tiền</th><th>Trạng thái</th><th /></tr></thead>
            <tbody>
              {filtered.map((order) => (
                <tr className="border-b border-line last:border-0" key={order.id}>
                  <td className="p-4 font-bold">#{order.id}</td>
                  <td>{formatDateTime(order.createdAt)}</td>
                  <td>{order.customerName ?? 'Khách tại quầy'}</td>
                  <td>{formatVnd(order.total)}</td>
                  <td><StatusPill status={order.status} /></td>
                  <td><Button onClick={() => setSelected(order)} variant="secondary">Chi tiết</Button></td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="p-8"><EmptyState icon={<CartIcon size={24} />} description="Thử bộ lọc khác hoặc chờ đơn mới." title="Không có đơn phù hợp" /></div>
        )}
      </div>
      {activeSelected && <OrderDrawer onClose={() => setSelected(null)} order={activeSelected} />}
    </>
  )
}

function ProductDialog({
  product,
  onClose,
  onSave,
}: {
  product?: Product
  onClose: () => void
  onSave: (product: Product, isEdit: boolean) => Promise<void>
}) {
  const [name, setName] = useState(product?.name ?? '')
  const [price, setPrice] = useState(String(product?.basePrice ?? 0))
  const save = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const defaults: Product = { id: `product-${Date.now()}`, category: 'Cà phê', description: '', imageUrl: '', sizes: [{ id: 'S', label: 'S', priceDelta: -5000 }, { id: 'M', label: 'M', priceDelta: 0 }, { id: 'L', label: 'L', priceDelta: 5000 }], toppings: [], name: '', basePrice: 0, available: true }
    const next = { ...(product ?? defaults), name: name.trim(), basePrice: Number(price), available: true }
    try {
      await onSave(next, Boolean(product))
      onClose()
    } catch (error) {
      const message =
        typeof error === 'object' && error !== null && 'message' in error &&
        typeof error.message === 'string'
          ? error.message
          : 'Vui lòng thử lại.'
      uiActions.showErrorToast(`Không thể lưu món: ${message}`)
    }
  }
  return (
    <Overlay onClose={onClose}>
      <form aria-modal="true" className="w-full max-w-lg rounded-t-3xl bg-paper p-6 sm:rounded-[24px]" onSubmit={save} role="dialog">
        <Eyebrow>{product ? 'Chỉnh sửa' : 'Thêm món'}</Eyebrow>
        <h2 className="mt-2 font-display text-3xl">{product ? 'Cập nhật món' : 'Món mới'}</h2>
        <label className="mt-5 flex flex-col gap-2 text-xs font-bold">Tên món<input className="min-h-11 rounded-xl border border-line px-3 outline-0 focus:border-forest" onChange={(event) => setName(event.target.value)} required value={name} /></label>
        <label className="mt-4 flex flex-col gap-2 text-xs font-bold">Giá gốc<input className="min-h-11 rounded-xl border border-line px-3 outline-0 focus:border-forest" min="0" onChange={(event) => setPrice(event.target.value)} required type="number" value={price} /></label>
        <Button className="mt-6 w-full" type="submit">Lưu món</Button>
      </form>
    </Overlay>
  )
}

export function AdminMenuPage() {
  const { data: products = [], isPending, isError } = useAdminProducts()
  const createProduct = useCreateProduct()
  const updateProduct = useUpdateProduct()
  const deleteProduct = useDeleteProduct()
  const [editing, setEditing] = useState<Product | undefined>()
  const [open, setOpen] = useState(false)
  const [deleting, setDeleting] = useState<Product | undefined>()

  const withUndo = (message: string, action: () => Promise<unknown>, successMessage: string) => {
    uiActions.showToastWithAction(message, 'Hoàn tác', () => {
      void action()
        .then(() => uiActions.showToast(successMessage))
        .catch(() => uiActions.showErrorToast('Không thể hoàn tác. Vui lòng thử lại.'))
    })
  }

  const handleSave = async (product: Product, isEdit: boolean) => {
    const previousProduct = editing
    const saved = isEdit
      ? await updateProduct.mutateAsync(product)
      : await createProduct.mutateAsync(product)

    withUndo(
      `${isEdit ? 'Đã cập nhật' : 'Đã thêm'} "${saved.name}"`,
      () =>
        isEdit && previousProduct
          ? updateProduct.mutateAsync(previousProduct)
          : deleteProduct.mutateAsync(saved.id),
      isEdit && previousProduct
        ? `Đã khôi phục "${previousProduct.name}".`
        : `Đã xoá "${saved.name}".`,
    )
  }

  const handleToggleAvailable = async (product: Product) => {
    const next = product.available === false
    await updateProduct.mutateAsync({ ...product, available: next })
    withUndo(
      next ? `Đã hiện "${product.name}"` : `Đã ẩn "${product.name}"`,
      () => updateProduct.mutateAsync(product),
      `Đã khôi phục "${product.name}".`,
    )
  }

  const handleDelete = async (product: Product) => {
    await deleteProduct.mutateAsync(product.id)
    setDeleting(undefined)
    withUndo(
      `Đã xoá "${product.name}"`,
      () => createProduct.mutateAsync(product),
      `Đã khôi phục "${product.name}".`,
    )
  }

  return (
    <>
      <PageTitle description="Quản lý món, giá bán và trạng thái hiển thị." eyebrow="Danh mục" title="Thực đơn" />
      <div className="mb-5 flex justify-end">
        <Button onClick={() => { setEditing(undefined); setOpen(true) }}>+ Thêm món</Button>
      </div>
      {isPending ? (
        <p className="py-20 text-center text-sm text-muted">Đang tải thực đơn...</p>
      ) : isError ? (
        <EmptyState icon={<CartIcon size={24} />} description="Vui lòng tải lại trang hoặc thử lại sau." title="Không thể tải thực đơn" />
      ) : products.length ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {products.map((product) => (
          <article className={card} key={product.id}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="font-display text-xl">{product.name}</h2>
                <p className="mt-1 text-xs text-muted">{product.category}</p>
              </div>
              <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${product.available === false ? 'bg-line text-muted' : 'bg-lime-soft text-forest'}`}>
                {product.available === false ? 'Tạm ẩn' : 'Đang bán'}
              </span>
            </div>
            <p className="mt-5 font-bold">{formatVnd(product.basePrice)}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              <Button onClick={() => { setEditing(product); setOpen(true) }} variant="secondary">Sửa</Button>
              <Button onClick={() => {
                void handleToggleAvailable(product).catch(() =>
                  uiActions.showErrorToast('Không thể cập nhật món. Vui lòng thử lại.'),
                )
              }} variant="secondary">
                {product.available === false ? 'Hiện món' : 'Ẩn món'}
              </Button>
              <Button onClick={() => setDeleting(product)} variant="secondary">Xoá</Button>
            </div>
          </article>
        ))}
        </div>
      ) : (
        <EmptyState icon={<CartIcon size={24} />} description="Thêm món đầu tiên để bắt đầu quản lý thực đơn." title="Chưa có món nào" />
      )}
      {open && <ProductDialog onClose={() => setOpen(false)} onSave={handleSave} product={editing} />}
      {deleting && (
        <ConfirmDialog
          confirmLabel="Xoá món"
          description="Bạn vẫn có thể hoàn tác ngay sau khi xoá."
          onClose={() => setDeleting(undefined)}
          onConfirm={() => {
            void handleDelete(deleting).catch(() =>
              uiActions.showErrorToast('Không thể xoá món. Vui lòng thử lại.'),
            )
          }}
          title={`Xoá "${deleting.name}"?`}
        />
      )}
    </>
  )
}

export function AdminCustomersPage() {
  const { data: orders = [], isPending } = useOrders()
  const [query, setQuery] = useState('')

  const customers = useMemo(() => {
    return [...new Map(orders.filter((order) => order.customerEmail).map((order) => [order.customerEmail, order])).values()]
      .map((latest) => {
        const customerOrders = orders.filter((order) => order.customerEmail === latest.customerEmail)
        return {
          ...latest,
          count: customerOrders.length,
          spent: customerOrders.reduce((sum, order) => sum + order.total, 0),
        }
      })
      .filter((customer) => `${customer.customerName} ${customer.customerEmail}`.toLowerCase().includes(query.toLowerCase()))
      .sort((a, b) => b.spent - a.spent)
  }, [orders, query])

  return (
    <>
      <PageTitle description="Khách hàng được tổng hợp từ các đơn online." eyebrow="Quan hệ khách hàng" title="Khách hàng" />
      <input
        aria-label="Tìm khách hàng"
        className="min-h-11 w-full max-w-md rounded-full border border-line bg-paper px-4 text-sm outline-0 focus:border-forest"
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Tìm theo tên hoặc email..."
      />
      {isPending ? (
        <p className="py-20 text-center text-sm text-muted">Đang tải danh sách khách hàng...</p>
      ) : customers.length ? (
        <div className={`${card} mt-5 overflow-x-auto p-0`}>
          <table className="w-full min-w-[600px] text-left text-xs">
            <thead className="border-b border-line text-muted">
              <tr>
                <th className="p-4">Khách hàng</th>
                <th>Số đơn</th>
                <th>Tổng chi tiêu</th>
                <th>Đơn gần nhất</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer) => (
                <tr className="border-b border-line last:border-0" key={customer.customerEmail}>
                  <td className="p-4">
                    <strong>{customer.customerName}</strong>
                    <span className="block text-muted">{customer.customerEmail}</span>
                  </td>
                  <td>{customer.count}</td>
                  <td>{formatVnd(customer.spent)}</td>
                  <td>{formatDateTime(customer.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="mt-5">
          <EmptyState icon={<CartIcon size={24} />} description="Khách online sẽ xuất hiện sau khi có đơn." title="Chưa có khách hàng" />
        </div>
      )}
    </>
  )
}
