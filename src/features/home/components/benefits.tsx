const BENEFITS = [
  { title: 'Chọn món đúng gu', description: 'Tùy chỉnh size và topping theo cách riêng của bạn.' },
  { title: 'Thanh toán một chạm', description: 'Ví điện tử hoặc thẻ — nhanh chóng và bảo mật.' },
  { title: 'Nhận ngay tại quầy', description: 'Không xếp hàng, chỉ cần đến và mang ly ngon đi.' },
] as const

export function Benefits() {
  return (
    <section className="shell mb-20 grid overflow-hidden rounded-[28px] bg-forest text-white md:mb-28 md:grid-cols-3">
      {BENEFITS.map((benefit, index) => (
        <div className="border-b border-white/13 p-8 last:border-b-0 md:border-r md:border-b-0 md:p-10 md:last:border-r-0" key={benefit.title}>
          <span className="font-display text-sm text-lime">{String(index + 1).padStart(2, '0')}</span>
          <h3 className="mt-6 mb-2 font-display text-2xl font-medium">{benefit.title}</h3>
          <p className="text-[13px] leading-relaxed text-white/65">{benefit.description}</p>
        </div>
      ))}
    </section>
  )
}
