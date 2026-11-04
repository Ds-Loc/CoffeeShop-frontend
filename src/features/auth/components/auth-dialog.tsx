import { useState, type FormEvent } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { ArrowRightIcon, CloseIcon, UserIcon } from '@/components/icons/icon'
import { Button } from '@/components/ui/button'
import { Eyebrow } from '@/components/ui/eyebrow'
import { Overlay } from '@/components/ui/overlay'
import { uiActions, useAuthMode, useAuthSource, useIsAuthOpen } from '@/lib/ui.store'
import { authActions } from '../auth.store'
import { getDisplayName, MIN_PASSWORD_LENGTH, validateCredentials, validateRegistration } from '../utils'

export const DEMO_ADMIN_EMAIL = 'admin@brewlite.vn'

const labelClass = 'mt-3.5 flex flex-col gap-1.5 text-xs font-extrabold'
const inputClass =
  'min-h-12 rounded-[11px] border border-line bg-white px-3.5 text-[13px] font-medium outline-0 focus:border-forest'

export function AuthDialog() {
  const isOpen = useIsAuthOpen()
  const mode = useAuthMode()
  const source = useAuthSource()
  return isOpen ? <AuthDialogContent mode={mode} source={source} /> : null
}

interface AuthDialogContentProps {
  mode: 'login' | 'register'
  source: 'header' | 'checkout'
}

function AuthDialogContent({ mode: initialMode, source }: AuthDialogContentProps) {
  const navigate = useNavigate()
  const [mode, setMode] = useState(initialMode)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    const validationError =
      mode === 'register' ? validateRegistration(name, email, password, confirmPassword) : validateCredentials(email, password)
    if (validationError) {
      setError(validationError)
      return
    }

    authActions.login({
      email,
      name: mode === 'register' ? name.trim() : getDisplayName(email),
      role: email.trim().toLowerCase() === DEMO_ADMIN_EMAIL ? 'admin' : 'customer',
    })
    uiActions.closeAuth()
    if (source === 'checkout') {
      void navigate({ to: '/checkout' })
    } else {
      uiActions.showToast(mode === 'register' ? 'Tạo tài khoản thành công.' : 'Chào mừng bạn quay lại.')
    }
  }

  return (
    <Overlay onClose={uiActions.closeAuth}>
      <form
        aria-labelledby="login-title"
        aria-modal="true"
        className="relative w-full max-w-[430px] animate-modal-in rounded-t-3xl bg-paper px-6 pt-10 pb-7 shadow-2xl sm:rounded-[26px] sm:p-10"
        onSubmit={handleSubmit}
        role="dialog"
      >
        <button
          aria-label="Đóng"
          className="absolute top-4 right-4 grid size-10 place-items-center rounded-full border border-ink/12 bg-paper/90"
          onClick={uiActions.closeAuth}
          type="button"
        >
          <CloseIcon />
        </button>

        <span className="mb-6 grid size-12 place-items-center rounded-full bg-lime text-forest">
          <UserIcon />
        </span>
        <div className="mb-5 grid grid-cols-2 rounded-full bg-lime-soft p-1">
          {(['login', 'register'] as const).map((tab) => (
            <button
              className={`min-h-9 rounded-full text-[11px] font-extrabold transition ${
                mode === tab ? 'bg-forest text-white' : 'text-muted hover:text-forest'
              }`}
              key={tab}
              onClick={() => {
                setMode(tab)
                setError('')
              }}
              type="button"
            >
              {tab === 'login' ? 'Đăng nhập' : 'Đăng ký'}
            </button>
          ))}
        </div>
        <Eyebrow>{mode === 'login' ? 'Chào mừng trở lại' : 'Tạo tài khoản BrewLite'}</Eyebrow>
        <h2 className="mt-2 mb-2 font-display text-3xl font-medium tracking-tight" id="login-title">
          {mode === 'login' ? 'Đăng nhập để tiếp tục' : 'Đăng ký tài khoản'}
        </h2>
        <p className="mb-6 text-xs leading-relaxed text-muted">
          {mode === 'login' ? 'Đăng nhập nhanh để lưu và theo dõi đơn hàng của bạn.' : 'Tạo tài khoản demo để lưu và theo dõi đơn hàng.'}
        </p>

        {mode === 'register' && (
          <label className={labelClass}>
            Họ tên
            <input
              autoFocus
              className={inputClass}
              onChange={(event) => {
                setName(event.target.value)
                setError('')
              }}
              placeholder="Nguyễn Văn A"
              type="text"
              value={name}
            />
          </label>
        )}
        <label className={labelClass}>
          Email
          <input
            autoFocus={mode === 'login'}
            className={inputClass}
            onChange={(event) => {
              setEmail(event.target.value)
              setError('')
            }}
            placeholder="ban@email.com"
            type="email"
            value={email}
          />
        </label>
        <label className={labelClass}>
          Mật khẩu
          <input
            className={inputClass}
            onChange={(event) => {
              setPassword(event.target.value)
              setError('')
            }}
            placeholder={`Tối thiểu ${MIN_PASSWORD_LENGTH} ký tự`}
            type="password"
            value={password}
          />
        </label>
        {mode === 'register' && (
          <label className={labelClass}>
            Nhập lại mật khẩu
            <input
              className={inputClass}
              onChange={(event) => {
                setConfirmPassword(event.target.value)
                setError('')
              }}
              placeholder="Nhập lại mật khẩu"
              type="password"
              value={confirmPassword}
            />
          </label>
        )}

        {error && (
          <p className="mt-2.5 text-xs text-danger" role="alert">
            {error}
          </p>
        )}

        <Button className="mt-5 w-full" type="submit">
          {mode === 'login' ? 'Đăng nhập & tiếp tục' : 'Tạo tài khoản'} <ArrowRightIcon />
        </Button>
        <small className="mt-3.5 block text-center text-[11px] text-muted">
          Đây là tài khoản demo. BrewLite không lưu mật khẩu của bạn.
        </small>
      </form>
    </Overlay>
  )
}
