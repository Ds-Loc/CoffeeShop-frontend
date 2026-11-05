import { createFileRoute } from '@tanstack/react-router'
import { HomePage } from '@/features/home/home-page'
import { ALL_CATEGORIES, CATEGORY_FILTERS, type CategoryFilter } from '@/features/menu/constants'

const isCategoryFilter = (value: unknown): value is CategoryFilter =>
  typeof value === 'string' && CATEGORY_FILTERS.includes(value as CategoryFilter)

type MenuSearch = {
  category?: Exclude<CategoryFilter, typeof ALL_CATEGORIES>
  q?: string
}

export const Route = createFileRoute('/')({
  validateSearch: (search: Record<string, unknown>): MenuSearch => {
    const category = isCategoryFilter(search.category) && search.category !== ALL_CATEGORIES ? search.category : undefined
    const q = typeof search.q === 'string' ? search.q : undefined
    return { ...(category ? { category } : {}), ...(q ? { q } : {}) }
  },
  component: HomePage,
})
