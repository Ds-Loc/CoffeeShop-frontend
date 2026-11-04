import { CheckIcon } from '@/components/icons/icon'
import { formatVnd } from '@/lib/format'
import type { Topping } from '../types'

interface ToppingOptionsProps {
  toppings: Topping[]
  selectedIds: string[]
  onToggle: (toppingId: string) => void
}

export function ToppingOptions({ toppings, selectedIds, onToggle }: ToppingOptionsProps) {
  return (
    <div className="mt-3.5 flex flex-col gap-2">
      {toppings.map((topping) => (
        <label
          className="group relative grid min-h-11 cursor-pointer grid-cols-[auto_1fr_auto] items-center gap-2.5 rounded-[11px] border border-line px-3.5 has-checked:border-forest has-checked:bg-[#f2f5e9] has-focus-visible:outline-3 has-focus-visible:outline-offset-2 has-focus-visible:outline-caramel/35"
          key={topping.id}
        >
          <input
            checked={selectedIds.includes(topping.id)}
            className="sr-only"
            onChange={() => onToggle(topping.id)}
            type="checkbox"
          />
          <span className="grid size-[18px] place-items-center rounded-[5px] border border-stone-400 text-white group-has-checked:border-forest group-has-checked:bg-forest">
            <CheckIcon className="opacity-0 group-has-checked:opacity-100" size={14} />
          </span>
          <strong className="text-xs">{topping.name}</strong>
          <span className="text-[11px] text-muted">+{formatVnd(topping.price)}</span>
        </label>
      ))}
    </div>
  )
}
