import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import { App } from './App'
import { enableMocking } from './mocks'
import './index.css'

const renderApp = () => {
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
}

enableMocking().then(renderApp).catch((error: unknown) => {
  console.error('[App] Không thể khởi động MSW; tiếp tục tải ứng dụng:', error)
  renderApp()
})
