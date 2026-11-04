const vndFormatter = new Intl.NumberFormat('vi-VN', {
  style: 'currency',
  currency: 'VND',
  maximumFractionDigits: 0,
})

const dateTimeFormatter = new Intl.DateTimeFormat('vi-VN', {
  dateStyle: 'medium',
  timeStyle: 'short',
})

export const formatVnd = (value: number): string => vndFormatter.format(value)

export const formatDateTime = (isoDate: string): string =>
  dateTimeFormatter.format(new Date(isoDate))
