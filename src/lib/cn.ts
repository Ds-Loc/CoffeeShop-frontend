import { twMerge } from 'tailwind-merge'

type ClassValue = string | false | null | undefined

/** Ghép class name (bỏ giá trị falsy) và để class đứng sau thắng khi xung đột, ví dụ `bg-paper` và `bg-forest`. */
export const cn = (...values: ClassValue[]): string => twMerge(values.filter(Boolean).join(' '))
