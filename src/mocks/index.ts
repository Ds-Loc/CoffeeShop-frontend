/**
 * Khởi tạo Mock Service Worker (MSW).
 * Tự động bật trong môi trường dev trừ khi cấu hình VITE_ENABLE_MSW=false.
 */
export async function enableMocking(): Promise<ServiceWorkerRegistration | undefined> {
  const isMockEnabled =
    import.meta.env.VITE_ENABLE_MSW === 'true' ||
    (import.meta.env.DEV && import.meta.env.VITE_ENABLE_MSW !== 'false')

  if (!isMockEnabled) {
    return undefined
  }

  const { worker } = await import('./browser')

  return worker.start({
    onUnhandledFrame: 'bypass',
  })
}
