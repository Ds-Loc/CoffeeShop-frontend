import { useEffect, useRef, type ReactNode } from 'react'
import { cn } from '@/lib/cn'

interface OverlayProps {
  onClose: () => void
  /** `center`: modal giữa màn hình (bottom sheet trên mobile). `end`: drawer bên phải. */
  placement?: 'center' | 'end'
  children: ReactNode
}

/** Lớp nền mờ dùng chung cho modal/drawer: đóng bằng Escape hoặc click nền, khoá scroll trang. */
export function Overlay({ onClose, placement = 'center', children }: OverlayProps) {
  const onCloseRef = useRef(onClose)

  useEffect(() => {
    onCloseRef.current = onClose
  })

  useEffect(() => {
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onCloseRef.current()
    }
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  return (
    <div
      className={cn(
        'fixed inset-0 z-100 flex animate-fade-in bg-[rgb(19_28_22/0.62)] backdrop-blur-sm',
        placement === 'center' ? 'items-end justify-center sm:items-center sm:p-5' : 'justify-end',
      )}
      onMouseDown={(event) => event.target === event.currentTarget && onCloseRef.current()}
    >
      {children}
    </div>
  )
}
