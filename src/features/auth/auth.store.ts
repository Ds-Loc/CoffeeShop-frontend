import { createStore, useStore } from '@/lib/store'
import type { UserSession } from './types'

const authStore = createStore<UserSession | null>(null, {
  storageKey: 'brewlite:session',
  validate: (value): value is UserSession | null =>
    value === null || (typeof value === 'object' && 'email' in value && 'name' in value),
})

export const authActions = {
  login: (session: UserSession) => authStore.setState(session),
  logout: () => authStore.setState(null),
}

export const getSession = () => authStore.getState()

export const useSession = () => useStore(authStore)
