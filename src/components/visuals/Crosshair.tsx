import { cn } from '@/lib/utils'

/** Decorative metrology target — concentric rings, crosshair and a rotating tick
 *  ring. Used as an accent behind product indices and section corners. */
export function Crosshair({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" className={cn('pointer-events-none', className)} fill="none" aria-hidden="true">
      <circle cx="100" cy="100" r="92" stroke="#3DA0FF" strokeOpacity="0.12" />
      <circle cx="100" cy="100" r="64" stroke="#3DA0FF" strokeOpacity="0.22" />
      <circle cx="100" cy="100" r="36" stroke="#3DA0FF" strokeOpacity="0.4" />
      <g
        className="origin-center animate-[spin_48s_linear_infinite] motion-reduce:animate-none"
        style={{ transformBox: 'fill-box' }}
      >
        <circle cx="100" cy="100" r="80" stroke="#8A99AD" strokeOpacity="0.35" strokeDasharray="2 12" />
      </g>
      <path
        d="M100 2v34M100 164v34M2 100h34M164 100h34"
        stroke="#3DA0FF"
        strokeOpacity="0.3"
        strokeWidth="1"
      />
      <circle cx="100" cy="100" r="3.5" fill="#FF6B2C" />
    </svg>
  )
}
