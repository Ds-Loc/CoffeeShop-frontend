import { useState } from 'react'
import { useNavigate, useSearch } from '@tanstack/react-router'
import { SearchIcon } from '@/components/icons/icon'
import { Button } from '@/components/ui/button'
import { EmptyState } from '@/components/ui/empty-state'
import { Eyebrow } from '@/components/ui/eyebrow'
import { useProducts } from '../api'
import { ALL_CATEGORIES, CATEGORY_FILTERS, type CategoryFilter } from '../constants'
import type { Product } from '../types'
import { ProductCard } from './product-card'
import { ProductCustomizer } from './product-customizer'

export function MenuSection() {
  const { category: selectedCategory, q } = useSearch({ from: '/' })
  const navigate = useNavigate({ from: '/' })
  const category: CategoryFilter = selectedCategory ?? ALL_CATEGORIES
  const query = q ?? ''
  const { data: filteredProducts = [], isPending, isError, refetch } = useProducts(category, query)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

  const updateSearch = (updates: { category?: CategoryFilter; q?: string }) =>
    navigate({
      search: (previous) => ({
        ...previous,
        category: updates.category === ALL_CATEGORIES ? undefined : updates.category ?? previous.category,
        q: updates.q === undefined ? previous.q : updates.q || undefined,
      }),
      replace: true,
      resetScroll: false,
    })

  const resetFilters = () => {
    void updateSearch({ category: ALL_CATEGORIES, q: '' })
  }

  return (
    <section className="shell py-16 sm:py-24" id="menu">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Eyebrow>Thực đơn hôm nay</Eyebrow>
          <h2 className="mt-2.5 font-display text-4xl font-medium tracking-[-0.05em] sm:text-5xl">Món ngon cho mọi tâm trạng</h2>
        </div>
        <label className="flex min-h-12 w-full items-center gap-2.5 rounded-full border border-line bg-white/55 px-4 text-stone-500 focus-within:border-forest focus-within:bg-white sm:w-[310px]">
          <SearchIcon />
          <input
            aria-label="Tìm kiếm đồ uống"
            className="w-full bg-transparent text-[13px] text-ink outline-0 placeholder:text-stone-400"
            onChange={(event) => void updateSearch({ q: event.target.value })}
            placeholder="Tìm món bạn thích..."
            value={query}
          />
        </label>
      </div>

      <div aria-label="Danh mục đồ uống" className="my-8 flex gap-2 overflow-x-auto [scrollbar-width:none]" role="tablist">
        {CATEGORY_FILTERS.map((item) => (
          <button
            aria-selected={category === item}
            className="min-h-10 rounded-full border border-line px-[18px] text-[13px] font-semibold whitespace-nowrap text-stone-500 transition-colors aria-selected:border-forest aria-selected:bg-forest aria-selected:text-white"
            key={item}
            onClick={() => void updateSearch({ category: item })}
            role="tab"
            type="button"
          >
            {item}
          </button>
        ))}
      </div>

      {isPending && filteredProducts.length === 0 && (
        <p className="py-20 text-center text-sm text-muted">Đang tải thực đơn...</p>
      )}

      {isError && (
        <EmptyState
          action={<Button onClick={() => refetch()}>Thử lại</Button>}
          description="Không thể tải thực đơn lúc này. Vui lòng thử lại."
          icon={<SearchIcon size={28} />}
          title="Có lỗi xảy ra"
        />
      )}

      {!isError && filteredProducts.length > 0 && (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} onSelect={setSelectedProduct} product={product} />
          ))}
        </div>
      )}

      {!isPending && !isError && filteredProducts.length === 0 && (
        <EmptyState
          action={
            <Button onClick={resetFilters} variant="secondary">
              Xem tất cả
            </Button>
          }
          description="Thử một từ khóa khác hoặc xem lại tất cả món nhé."
          icon={<SearchIcon size={28} />}
          title="Chưa tìm thấy món phù hợp"
        />
      )}

      {selectedProduct && <ProductCustomizer onClose={() => setSelectedProduct(null)} product={selectedProduct} />}
    </section>
  )
}
