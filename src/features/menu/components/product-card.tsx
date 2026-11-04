import { formatVnd } from '@/lib/format'
import { getStartingPrice } from '../utils'
import type { Product } from '../types'

interface ProductCardProps {
  product: Product
  onSelect: (product: Product) => void
}

export function ProductCard({ product, onSelect }: ProductCardProps) {
  return (
    <article className="group min-w-0 overflow-hidden rounded-[20px] border border-ink/8 bg-paper/85 transition duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-ink/10">
      <button
        aria-label={`Chọn món ${product.name}`}
        className="block w-full text-left"
        onClick={() => onSelect(product)}
        type="button"
      >
        <div className="relative h-85 overflow-hidden bg-stone-300 sm:h-64">
          <img
            alt={product.name}
            className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
            src={product.imageUrl}
          />
          {product.badge && (
            <span className="absolute top-3 left-3 rounded-full bg-paper/90 px-2.5 py-1.5 text-[10px] font-extrabold tracking-wide text-forest uppercase">
              {product.badge}
            </span>
          )}
          <span className="absolute right-3 bottom-3 grid size-10 place-items-center rounded-full bg-forest text-2xl font-light text-white shadow-lg">
            +
          </span>
        </div>

        <div className="px-5 pt-5 pb-4">
          <span className="text-[10px] font-extrabold tracking-[0.12em] text-caramel uppercase">{product.category}</span>
          <h3 className="mt-2 mb-2 font-display text-xl font-semibold tracking-tight">{product.name}</h3>
          <p className="line-clamp-2 min-h-10 text-xs leading-relaxed text-muted">{product.description}</p>
          <div className="mt-4 flex items-center justify-between border-t border-line pt-4 text-[11px] text-muted">
            <span>
              Từ <strong className="text-[15px] text-ink">{formatVnd(getStartingPrice(product))}</strong>
            </span>
            <span className="text-xs font-extrabold text-forest">Chọn món</span>
          </div>
        </div>
      </button>
    </article>
  )
}
