import { CheckIcon } from '@/components/icons/icon'
import { uiActions, useToast } from '@/lib/ui.store'

export function Toast() {
  const toast = useToast()
  if (!toast) return null

  return (
    <div
      className="fixed right-3.5 bottom-3.5 left-3.5 z-150 flex animate-toast-in items-center gap-2.5 rounded-full bg-forest-dark py-3 pr-2 pl-3 text-xs font-bold text-white shadow-2xl sm:right-6 sm:bottom-6 sm:left-auto"
      role="status"
    >
      <span className="grid size-6 shrink-0 place-items-center rounded-full bg-lime text-forest">
        <CheckIcon size={16} />
      </span>
      <span className="flex-1">{toast.message}</span>
      {toast.actionLabel && toast.onAction && (
        <button
          className="ml-1 shrink-0 rounded-full bg-white/15 px-3 py-1.5 text-[11px] font-extrabold text-white transition hover:bg-white/25"
          onClick={toast.onAction}
          type="button"
        >
          {toast.actionLabel}
        </button>
      )}
      <button
        aria-label="Đóng thông báo"
        className="ml-1 grid size-7 shrink-0 place-items-center rounded-full text-white/60 hover:bg-white/10 hover:text-white"
        onClick={uiActions.dismissToast}
        type="button"
      >
        ×
      </button>
    </div>
  )
}
