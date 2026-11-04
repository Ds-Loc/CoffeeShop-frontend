import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

interface EmptyStateProps {
  icon: ReactNode
  title: string
  description: string
  action?: ReactNode
  bordered?: boolean
  className?: string
}

export function EmptyState({ icon, title, description, action, bordered = true, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center px-5 py-16 text-center',
        bordered && 'rounded-3xl border border-dashed border-line-strong',
        className,
      )}
    >
      <span className="mb-5 grid size-16 place-items-center rounded-full bg-lime text-forest">{icon}</span>
      <h3 className="mb-2 font-display text-2xl">{title}</h3>
      <p className="mb-6 max-w-72 text-sm text-muted">{description}</p>
      {action}
    </div>
  )
}
