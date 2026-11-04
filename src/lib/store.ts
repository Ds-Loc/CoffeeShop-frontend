import { useSyncExternalStore } from 'react'

type Listener = () => void

export interface Store<T> {
  getState: () => T
  setState: (next: T | ((previous: T) => T)) => void
  subscribe: (listener: Listener) => () => void
}

interface StoreOptions<T> {
  /** Có truyền key thì state được lưu vào localStorage và đồng bộ giữa các tab. */
  storageKey?: string
  /** Kiểm tra dữ liệu đọc từ localStorage; sai định dạng thì dùng lại giá trị khởi tạo. */
  validate?: (value: unknown) => value is T
}

const readFromStorage = <T>(key: string, fallback: T, validate?: (value: unknown) => value is T): T => {
  try {
    const raw = window.localStorage.getItem(key)
    if (raw === null) return fallback
    const parsed: unknown = JSON.parse(raw)
    return !validate || validate(parsed) ? (parsed as T) : fallback
  } catch {
    return fallback
  }
}

const writeToStorage = (key: string, value: unknown): void => {
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // Bộ nhớ đầy hoặc bị chặn: bỏ qua, state vẫn hoạt động trong phiên hiện tại.
  }
}

/** Store tối giản (không cần thư viện ngoài) dùng chung cho nhiều component/route. */
export function createStore<T>(initialState: T, options: StoreOptions<T> = {}): Store<T> {
  const { storageKey, validate } = options
  const listeners = new Set<Listener>()
  let state = storageKey ? readFromStorage(storageKey, initialState, validate) : initialState

  const notify = () => listeners.forEach((listener) => listener())

  if (storageKey) {
    window.addEventListener('storage', (event) => {
      if (event.key !== storageKey) return
      state = readFromStorage(storageKey, initialState, validate)
      notify()
    })
  }

  return {
    getState: () => state,
    setState: (next) => {
      state = typeof next === 'function' ? (next as (previous: T) => T)(state) : next
      if (storageKey) writeToStorage(storageKey, state)
      notify()
    },
    subscribe: (listener) => {
      listeners.add(listener)
      return () => listeners.delete(listener)
    },
  }
}

/** Đọc state của store trong component. `selector` phải trả về giá trị ổn định (primitive hoặc tham chiếu có sẵn). */
export function useStore<T, S = T>(store: Store<T>, selector: (state: T) => S = (state) => state as unknown as S): S {
  return useSyncExternalStore(store.subscribe, () => selector(store.getState()))
}
