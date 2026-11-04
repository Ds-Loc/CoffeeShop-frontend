import type { ButtonHTMLAttributes } from 'react'
import { buttonClass, type ButtonVariant } from './button-styles'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
}

export function Button({ variant = 'primary', className, type = 'button', ...props }: ButtonProps) {
  return <button className={buttonClass(variant, className)} type={type} {...props} />
}
