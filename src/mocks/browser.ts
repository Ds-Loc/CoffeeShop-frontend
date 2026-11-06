import { setupWorker } from 'msw/browser'
import { handlers } from './handlers'

/**
 * Worker client của MSW để đánh chặn request trong môi trường trình duyệt.
 */
export const worker = setupWorker(...handlers)
