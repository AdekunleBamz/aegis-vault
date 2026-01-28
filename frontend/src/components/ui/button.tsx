import { ButtonHTMLAttributes } from 'react'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary'
}

export default function Button({ variant = 'primary', className = '', ...props }: ButtonProps) {
  const base = variant === 'primary' ? 'btn btn-primary' : 'btn btn-secondary'
  return <button className={`${base} ${className}`.trim()} {...props} />
}
