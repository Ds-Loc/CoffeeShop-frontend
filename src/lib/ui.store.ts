import { createStore, useStore } from '@/lib/store'

interface ToastData {
  message: string
  variant?: 'success' | 'error'
  /** Nhãn nút action (vd: "Hoàn tác"). Nếu có thì hiển thị nút bên phải toast. */
  actionLabel?: string
  onAction?: () => void
}

interface UiState {
  isCartOpen: boolean
  isAuthOpen: boolean
  authMode: 'login' | 'register'
  authSource: 'header' | 'checkout'
  toast: ToastData | null
}

const TOAST_DURATION_MS = 4000

const uiStore = createStore<UiState>({
  isCartOpen: false,
  isAuthOpen: false,
  authMode: 'login',
  authSource: 'header',
  toast: null,
})

let toastTimer: number | undefined

const scheduleToastDismiss = () => {
  window.clearTimeout(toastTimer)
  toastTimer = window.setTimeout(
    () => uiStore.setState((state) => ({ ...state, toast: null })),
    TOAST_DURATION_MS,
  )
}

export const uiActions = {
  openCart: () => {
    // Tránh toast "Đã thêm vào giỏ" che nút Thanh toán khi giỏ vừa mở.
    window.clearTimeout(toastTimer)
    uiStore.setState((state) => ({ ...state, isCartOpen: true, toast: null }))
  },
  closeCart: () => uiStore.setState((state) => ({ ...state, isCartOpen: false })),
  openAuth: (mode: 'login' | 'register' = 'login', source: 'header' | 'checkout' = 'header') =>
    uiStore.setState((state) => ({ ...state, isAuthOpen: true, authMode: mode, authSource: source })),
  closeAuth: () => uiStore.setState((state) => ({ ...state, isAuthOpen: false })),

  /** Toast đơn giản (không có action). */
  showToast: (message: string) => {
    uiStore.setState((state) => ({ ...state, toast: { message, variant: 'success' } }))
    scheduleToastDismiss()
  },

  showErrorToast: (message: string) => {
    uiStore.setState((state) => ({ ...state, toast: { message, variant: 'error' } }))
    scheduleToastDismiss()
  },

  /** Toast có nút action — dùng cho "Hoàn tác", "Xem đơn", v.v. */
  showToastWithAction: (message: string, actionLabel: string, onAction: () => void) => {
    uiStore.setState((state) => ({
      ...state,
      toast: {
        message,
        variant: 'success',
        actionLabel,
        onAction: () => {
          onAction()
          uiStore.setState((s) => ({ ...s, toast: null }))
          window.clearTimeout(toastTimer)
        },
      },
    }))
    scheduleToastDismiss()
  },

  dismissToast: () => {
    window.clearTimeout(toastTimer)
    uiStore.setState((state) => ({ ...state, toast: null }))
  },
}

export const useIsCartOpen = () => useStore(uiStore, (state) => state.isCartOpen)
export const useIsAuthOpen = () => useStore(uiStore, (state) => state.isAuthOpen)
export const useAuthMode = () => useStore(uiStore, (state) => state.authMode)
export const useAuthSource = () => useStore(uiStore, (state) => state.authSource)
export const useToast = () => useStore(uiStore, (state) => state.toast)
