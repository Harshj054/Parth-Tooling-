import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils'

type Variant = 'primary' | 'secondary' | 'ghost' | 'steel'
type Size = 'md' | 'lg'

type BaseProps = {
  children: ReactNode
  variant?: Variant
  size?: Size
  className?: string
}

const base =
  'group/btn inline-flex items-center justify-center gap-2 rounded-md font-medium tracking-tight ' +
  'transition-[transform,background-color,border-color,box-shadow,color] duration-200 ease-out ' +
  'active:scale-[0.98] focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50'

const variants: Record<Variant, string> = {
  primary: 'bg-ember text-ink hover:bg-ember-bright hover:shadow-glow-ember',
  secondary: 'border border-arc/40 text-fg hover:border-arc hover:bg-arc/10 hover:shadow-glow-arc',
  ghost: 'text-muted hover:text-fg',
  steel: 'steel-panel border border-line text-fg hover:border-arc/60',
}

const sizes: Record<Size, string> = {
  md: 'h-11 px-5 text-sm',
  lg: 'h-14 px-7 text-[0.95rem]',
}

function classesFor(v: Variant, s: Size, className?: string) {
  return cn(base, variants[v], sizes[s], className)
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  className,
  to,
  href,
  onClick,
  type = 'button',
  disabled,
  ariaLabel,
}: BaseProps & {
  to?: string
  href?: string
  onClick?: () => void
  type?: 'button' | 'submit'
  disabled?: boolean
  ariaLabel?: string
}) {
  const cls = classesFor(variant, size, className)

  if (to) {
    return (
      <Link to={to} className={cls} aria-label={ariaLabel}>
        {children}
      </Link>
    )
  }
  if (href) {
    return (
      <a href={href} className={cls} aria-label={ariaLabel}>
        {children}
      </a>
    )
  }
  return (
    <button type={type} onClick={onClick} disabled={disabled} aria-label={ariaLabel} className={cls}>
      {children}
    </button>
  )
}
