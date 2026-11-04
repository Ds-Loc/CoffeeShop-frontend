import { CheckIcon } from '@/components/icons/icon'
import { useToast } from '@/lib/ui.store'

export function Toast() {
  const message = useToast()
  if (!message) return null

  return (
    <div
      className="fixed right-3.5 bottom-3.5 left-3.5 z-150 flex animate-toast-in items-center justify-center gap-2.5 rounded-full bg-forest-dark py-3 pr-4 pl-3 text-xs font-bold text-white shadow-2xl sm:right-6 sm:bottom-6 sm:left-auto sm:justify-start"
      role="status"
    >
      <span className="grid size-6 place-items-center rounded-full bg-lime text-forest">
        <CheckIcon size={16} />
      </span>
      {message}
    </div>
  )
}
