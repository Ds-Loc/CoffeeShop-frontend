import { Link } from '@tanstack/react-router'
import { ArrowRightIcon, CheckIcon, ClockIcon } from '@/components/icons/icon'
import { buttonClass } from '@/components/ui/button-styles'
import { Eyebrow } from '@/components/ui/eyebrow'
import { STORE_INFO } from '@/config/store-info'
import { HERO_IMAGE_URL } from '@/features/menu/data/mock-products'
import { cn } from '@/lib/cn'

const floatingCardClass = 'absolute z-30 border border-white/85 bg-paper/95 shadow-xl backdrop-blur-md'

export function Hero() {
  return (
    <section className="shell grid items-center gap-6 py-14 sm:py-16 lg:min-h-[680px] lg:grid-cols-[1.02fr_0.98fr] lg:gap-19">
      <div className="text-center lg:text-left">
        <Eyebrow className="justify-center lg:justify-start">Pha mới mỗi ngày</Eyebrow>
        <h1 className="mt-5 mb-5 font-display text-[clamp(3.3rem,6vw,5.4rem)] leading-[0.93] font-medium tracking-[-0.055em]">
          Đặt trước.
          <br />
          <em className="text-forest">Nhận thật nhanh.</em>
        </h1>
        <p className="mx-auto max-w-[540px] text-sm leading-[1.72] text-muted sm:text-[17px] lg:mx-0">
          Một ly đúng gu đang chờ bạn. Chọn món, thanh toán và ghé quầy nhận ngay — không cần xếp hàng.
        </p>

        <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center sm:gap-6 lg:justify-start">
          <Link className={buttonClass('primary')} hash="menu" to="/">
            Khám phá menu <ArrowRightIcon />
          </Link>
          <span className="flex items-center gap-2 text-[13px] font-semibold text-stone-600">
            <ClockIcon /> Sẵn sàng trong {STORE_INFO.pickupEstimate}
          </span>
        </div>

        <div className="mt-10 flex items-center justify-center gap-3.5 lg:justify-start">
          <div className="flex">
            {['H', 'M', 'A'].map((initial, index) => (
              <span
                className="-ml-2 grid size-8 place-items-center rounded-full border-2 border-cream bg-[#d8b497] text-[10px] font-extrabold text-white first:ml-0 first:bg-[#7f9b80] last:bg-[#a8816b]"
                key={initial + index}
              >
                {initial}
              </span>
            ))}
          </div>
          <div className="flex flex-col text-left">
            <strong className="text-[13px]">4.9/5</strong>
            <small className="text-[11px] text-muted">từ hơn 1.200 tín đồ cà phê</small>
          </div>
        </div>
      </div>

      <div className="relative grid min-h-[460px] place-items-center sm:min-h-[560px]">
        <div aria-hidden="true" className="absolute hidden size-[430px] rounded-full border border-forest/15 sm:block lg:size-[520px]" />
        <div aria-hidden="true" className="absolute hidden h-[420px] w-[620px] -rotate-28 rounded-full border border-forest/15 lg:block" />

        <div className="relative z-20 aspect-[0.84] w-[84%] max-w-[430px] overflow-hidden rounded-t-[47%] rounded-b-[30px] border-10 border-white/50 shadow-2xl after:absolute after:inset-0 after:bg-linear-to-t after:from-forest-dark/20 after:to-transparent after:to-40%">
          <img alt="Ly cà phê sữa đá BrewLite" className="size-full object-cover" src={HERO_IMAGE_URL} />
        </div>

        <div className={cn(floatingCardClass, 'top-16 right-0 flex size-21 rotate-[8deg] flex-col items-center justify-center rounded-full')}>
          <span className="text-[10px] text-muted uppercase">Từ</span>
          <strong className="font-display text-2xl text-caramel">39K</strong>
        </div>

        <div className={cn(floatingCardClass, 'bottom-10 left-0 flex items-center gap-3 rounded-2xl px-4 py-3 sm:bottom-16')}>
          <span className="grid size-9 place-items-center rounded-full bg-lime text-forest">
            <CheckIcon />
          </span>
          <div className="flex flex-col">
            <strong className="text-xs">Nhận tại quầy</strong>
            <span className="text-[11px] text-muted">Không cần chờ lâu</span>
          </div>
        </div>
      </div>
    </section>
  )
}
