import { useState, type FormEvent } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { ArrowRightIcon, CloseIcon, UserIcon } from '@/components/icons/icon'
import { Button } from '@/components/ui/button'
import { Eyebrow } from '@/components/ui/eyebrow'
import { Overlay } from '@/components/ui/overlay'
import { uiActions, useIsAuthOpen } from '@/lib/ui.store'
import { authActions } from '../auth.store'
import { getDisplayName, MIN_PASSWORD_LENGTH, validateCredentials } from '../utils'

const labelClass = 'mt-3.5 flex flex-col gap-1.5 text-xs font-extrabold'
const inputClass =
  'min-h-12 rounded-[11px] border border-line bg-white px-3.5 text-[13px] font-medium outline-0 focus:border-forest'

export function AuthDialog() {
  const isOpen = useIsAuthOpen()
  return isOpen ? <AuthDialogContent /> : null
}

function AuthDialogContent() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    const validationError = validateCredentials(email, password)
    if (validationError) {
      setError(validationError)
      return
    }

    authActions.login({ email, name: getDisplayName(email) })
    uiActions.closeAuth()
    void navigate({ to: '/checkout' })
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
        <Eyebrow>Chào mừng trở lại</Eyebrow>
        <h2 className="mt-2 mb-2 font-display text-3xl font-medium tracking-tight" id="login-title">
          Đăng nhập để tiếp tục
        </h2>
        <p className="mb-6 text-xs leading-relaxed text-muted">Đăng nhập nhanh để lưu và theo dõi đơn hàng của bạn.</p>

        <label className={labelClass}>
          Email
          <input
            autoFocus
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

        {error && (
          <p className="mt-2.5 text-xs text-danger" role="alert">
            {error}
          </p>
        )}

        <Button className="mt-5 w-full" type="submit">
          Đăng nhập & tiếp tục <ArrowRightIcon />
        </Button>
        <small className="mt-3.5 block text-center text-[11px] text-muted">
          Đây là tài khoản demo. BrewLite không lưu mật khẩu của bạn.
        </small>
      </form>
    </Overlay>
  )
}
