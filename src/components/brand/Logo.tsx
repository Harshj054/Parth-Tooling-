import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils'

type Props = {
  className?: string
  /** Show the wordmark next to the mark. */
  withText?: boolean
  to?: string
}

/** Precision-tool monogram: nested hex (a die-set profile) with an ember bore at centre. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} role="img" aria-hidden="true" fill="none">
      <path
        d="M24 3 42 13.5v21L24 45 6 34.5v-21Z"
        stroke="currentColor"
        strokeOpacity="0.35"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M24 11 35 17.5v13L24 37 13 30.5v-13Z"
        stroke="#3DA0FF"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <circle cx="24" cy="24" r="5" stroke="#FF6B2C" strokeWidth="2.2" />
      <circle cx="24" cy="24" r="1.2" fill="#FF6B2C" />
    </svg>
  )
}

export function Logo({ className, withText = true, to = '/' }: Props) {
  return (
    <Link
      to={to}
      aria-label="Parth Tooling — home"
      className={cn('group inline-flex items-center gap-3', className)}
    >
      <LogoMark className="h-9 w-9 text-fg transition-transform duration-500 ease-out group-hover:rotate-[30deg]" />
      {withText && (
        <span className="flex flex-col leading-none">
          <span className="font-display text-lg font-bold tracking-tightest text-fg">
            PARTH<span className="text-arc"> TOOLING</span>
          </span>
          <span className="mt-1 font-mono text-[0.55rem] uppercase tracking-[0.34em] text-faint">
            Precision Tools &amp; Dies
          </span>
        </span>
      )}
    </Link>
  )
}
