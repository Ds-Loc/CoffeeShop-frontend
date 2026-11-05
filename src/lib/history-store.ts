import { createStore, useStore } from './store'

export interface HistoryState<T> {
  past: T[]
  present: T
  future: T[]
}

export interface HistoryStore<T> {
  getState: () => HistoryState<T>
  setState: (next: T | ((prev: T) => T)) => void
  undo: () => boolean
  redo: () => boolean
  canUndo: () => boolean
  canRedo: () => boolean
  subscribe: (listener: () => void) => () => void
}

export function createHistoryStore<T>(
  initialState: T,
  options: { storageKey?: string; validate?: (value: unknown) => value is T; maxHistory?: number } = {},
): HistoryStore<T> {
  const { maxHistory = 50 } = options

  const inner = createStore<HistoryState<T>>(
    { past: [], present: initialState, future: [] },
    {
      storageKey: options.storageKey,
      validate: (v): v is HistoryState<T> =>
        typeof v === 'object' &&
        v !== null &&
        'present' in v &&
        'past' in v &&
        'future' in v &&
        Array.isArray((v as HistoryState<T>).past) &&
        Array.isArray((v as HistoryState<T>).future) &&
        (!options.validate || options.validate((v as HistoryState<T>).present)),
    },
  )

  return {
    getState: inner.getState,
    subscribe: inner.subscribe,
    setState: (next) => {
      inner.setState((history) => {
        const present = typeof next === 'function' ? (next as (prev: T) => T)(history.present) : next
        return {
          past: [...history.past, history.present].slice(-maxHistory),
          present,
          future: [],
        }
      })
    },
    undo: () => {
      const { past } = inner.getState()
      if (past.length === 0) return false
      inner.setState((history) => ({
        past: history.past.slice(0, -1),
        present: history.past[history.past.length - 1],
        future: [history.present, ...history.future],
      }))
      return true
    },
    redo: () => {
      const { future } = inner.getState()
      if (future.length === 0) return false
      inner.setState((history) => ({
        past: [...history.past, history.present],
        present: history.future[0],
        future: history.future.slice(1),
      }))
      return true
    },
    canUndo: () => inner.getState().past.length > 0,
    canRedo: () => inner.getState().future.length > 0,
  }
}

export function useHistoryPresent<T>(store: HistoryStore<T>): T {
  return useStore(store as Parameters<typeof useStore>[0], (s) => (s as HistoryState<T>).present) as T
}

export function useCanUndo<T>(store: HistoryStore<T>): boolean {
  return useStore(store as Parameters<typeof useStore>[0], (s) => (s as HistoryState<T>).past.length > 0) as boolean
}

export function useCanRedo<T>(store: HistoryStore<T>): boolean {
  return useStore(store as Parameters<typeof useStore>[0], (s) => (s as HistoryState<T>).future.length > 0) as boolean
}

