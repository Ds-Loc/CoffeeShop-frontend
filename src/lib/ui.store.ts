import { createStore, useStore } from '@/lib/store'

interface UiState {
  isCartOpen: boolean
  isAuthOpen: boolean
  toast: string | null
}

const TOAST_DURATION_MS = 2400

const uiStore = createStore<UiState>({ isCartOpen: false, isAuthOpen: false, toast: null })

let toastTimer: number | undefined

export const uiActions = {
  openCart: () => {
    // Tránh toast "Đã thêm vào giỏ" che nút Thanh toán khi giỏ vừa mở.
    window.clearTimeout(toastTimer)
    uiStore.setState((state) => ({ ...state, isCartOpen: true, toast: null }))
  },
  closeCart: () => uiStore.setState((state) => ({ ...state, isCartOpen: false })),
  openAuth: () => uiStore.setState((state) => ({ ...state, isAuthOpen: true })),
  closeAuth: () => uiStore.setState((state) => ({ ...state, isAuthOpen: false })),
  showToast: (message: string) => {
    window.clearTimeout(toastTimer)
    uiStore.setState((state) => ({ ...state, toast: message }))
    toastTimer = window.setTimeout(() => uiStore.setState((state) => ({ ...state, toast: null })), TOAST_DURATION_MS)
  },
}

export const useIsCartOpen = () => useStore(uiStore, (state) => state.isCartOpen)
export const useIsAuthOpen = () => useStore(uiStore, (state) => state.isAuthOpen)
export const useToast = () => useStore(uiStore, (state) => state.toast)
