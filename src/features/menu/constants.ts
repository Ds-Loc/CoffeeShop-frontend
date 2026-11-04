import type { Category, SizeId } from './types'

export const ALL_CATEGORIES = 'Tất cả' as const

export type CategoryFilter = Category | typeof ALL_CATEGORIES

export const CATEGORY_FILTERS: readonly CategoryFilter[] = [ALL_CATEGORIES, 'Cà phê', 'Trà', 'Đá xay']

export const DEFAULT_SIZE_ID: SizeId = 'M'
