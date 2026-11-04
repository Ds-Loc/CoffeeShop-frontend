import { Button } from './button'
import { Overlay } from './overlay'

interface ConfirmDialogProps {
  title: string
  description: string
  confirmLabel: string
  onConfirm: () => void
  onClose: () => void
}

export function ConfirmDialog({ title, description, confirmLabel, onConfirm, onClose }: ConfirmDialogProps) {
  return (
    <Overlay onClose={onClose}>
      <div aria-modal="true" className="w-full max-w-md rounded-t-3xl bg-paper p-6 sm:rounded-[24px]" role="dialog">
        <h2 className="font-display text-2xl">{title}</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted">{description}</p>
        <div className="mt-6 flex gap-2">
          <Button className="flex-1" onClick={onClose} variant="secondary">Để sau</Button>
          <Button className="flex-1" onClick={onConfirm}>{confirmLabel}</Button>
        </div>
      </div>
    </Overlay>
  )
}
