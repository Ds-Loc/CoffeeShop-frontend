import { formatVnd } from '@/lib/format'
import type { SizeId, SizeOption } from '../types'

interface SizeOptionsProps {
  sizes: SizeOption[]
  value: SizeId
  onChange: (sizeId: SizeId) => void
}

const formatDelta = (delta: number) =>
  delta === 0 ? 'Tiêu chuẩn' : `${delta > 0 ? '+' : ''}${formatVnd(delta)}`

export function SizeOptions({ sizes, value, onChange }: SizeOptionsProps) {
  return (
    <div className="mt-3.5 grid grid-cols-3 gap-2.5">
      {sizes.map((size) => (
        <label
          className="group relative flex min-w-0 cursor-pointer flex-col items-center rounded-xl border border-line px-2 pt-3 pb-2.5 has-checked:border-forest has-checked:bg-[#f2f5e9] has-focus-visible:outline-3 has-focus-visible:outline-offset-2 has-focus-visible:outline-caramel/35"
          key={size.id}
        >
          <input
            checked={value === size.id}
            className="sr-only"
            name="size"
            onChange={() => onChange(size.id)}
            type="radio"
          />
          <strong className="grid size-7 place-items-center rounded-full bg-stone-200 text-[11px] group-has-checked:bg-forest group-has-checked:text-white">
            {size.id}
          </strong>
          <span className="mt-1.5 text-[11px] font-bold">{size.label}</span>
          <small className="text-[10px] text-muted">{formatDelta(size.priceDelta)}</small>
        </label>
      ))}
    </div>
  )
}
