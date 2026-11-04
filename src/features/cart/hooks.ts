import { useMemo } from 'react'
import { useCartItems } from './cart.store'
import { calcServiceFee, calcSubtotal, countItems } from './pricing'

/** Giỏ hàng cùng các giá trị tổng hợp đã tính sẵn. */
export const useCartSummary = () => {
  const items = useCartItems()

  return useMemo(() => {
    const subtotal = calcSubtotal(items)
    const serviceFee = calcServiceFee(subtotal)
    return { items, count: countItems(items), subtotal, serviceFee, total: subtotal + serviceFee }
  }, [items])
}
