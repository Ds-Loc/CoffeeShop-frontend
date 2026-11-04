import type { ReactNode } from 'react'

interface IconProps {
  size?: number
  className?: string
}

interface BaseIconProps extends IconProps {
  children: ReactNode
}

function BaseIcon({ children, size = 20, className }: BaseIconProps) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      height={size}
      viewBox="0 0 24 24"
      width={size}
    >
      {children}
    </svg>
  )
}

const stroke = {
  stroke: 'currentColor',
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
} as const

export const CartIcon = (props: IconProps) => (
  <BaseIcon {...props}>
    <path d="M3 4h2l2.3 10.1a2 2 0 0 0 2 1.6h7.8a2 2 0 0 0 1.9-1.4L21 7H6" strokeWidth="1.8" {...stroke} />
    <circle cx="9.5" cy="19.5" fill="currentColor" r="1.2" />
    <circle cx="17.5" cy="19.5" fill="currentColor" r="1.2" />
  </BaseIcon>
)

export const CloseIcon = (props: IconProps) => (
  <BaseIcon {...props}>
    <path d="m6 6 12 12M18 6 6 18" strokeWidth="1.8" {...stroke} />
  </BaseIcon>
)

export const ArrowRightIcon = (props: IconProps) => (
  <BaseIcon {...props}>
    <path d="M5 12h14m-6-6 6 6-6 6" strokeWidth="1.8" {...stroke} />
  </BaseIcon>
)

export const ArrowLeftIcon = (props: IconProps) => (
  <BaseIcon {...props}>
    <path d="M19 12H5m6-6-6 6 6 6" strokeWidth="1.8" {...stroke} />
  </BaseIcon>
)

export const SearchIcon = (props: IconProps) => (
  <BaseIcon {...props}>
    <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="1.8" />
    <path d="m16 16 4 4" strokeWidth="1.8" {...stroke} />
  </BaseIcon>
)

export const CheckIcon = ({ size = 20, ...props }: IconProps) => (
  <BaseIcon size={size} {...props}>
    <path d="m5 12.5 4.2 4L19 7" strokeWidth="2" {...stroke} />
  </BaseIcon>
)

export const ClockIcon = (props: IconProps) => (
  <BaseIcon {...props}>
    <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.7" />
    <path d="M12 7.5V12l3 2" strokeWidth="1.7" {...stroke} />
  </BaseIcon>
)

export const UserIcon = (props: IconProps) => (
  <BaseIcon {...props}>
    <circle cx="12" cy="8.5" r="3.2" stroke="currentColor" strokeWidth="1.7" />
    <path d="M5.8 20c.7-3.3 3-5 6.2-5s5.5 1.7 6.2 5" strokeWidth="1.7" {...stroke} />
  </BaseIcon>
)
