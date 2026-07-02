import { cn } from '@/lib/utils'

/**
 * Atmospheric haze — soft, slowly drifting arc-blue and ember blobs plus a
 * faint film grain, tuned to the forge palette. Brings still imagery and video
 * to life without competing with content. Drift stops under reduced motion
 * (global media query), leaving a static haze.
 */
export function Haze({ className, grain = true }: { className?: string; grain?: boolean }) {
  return (
    <div className={cn('pointer-events-none absolute inset-0 overflow-hidden', className)} aria-hidden="true">
      <span className="absolute -left-[8%] top-[8%] h-[45%] w-[55%] rounded-full bg-arc/[0.07] blur-[90px] animate-drift-a" />
      <span className="absolute -right-[6%] top-[28%] h-[52%] w-[46%] rounded-full bg-ember/[0.05] blur-[100px] animate-drift-b" />
      <span
        className="absolute -bottom-[12%] left-[28%] h-[42%] w-[50%] rounded-full bg-arc/[0.05] blur-[110px] animate-drift-b"
        style={{ animationDelay: '-9s' }}
      />
      {grain && <div className="bg-grain absolute inset-0 opacity-[0.05] mix-blend-overlay" />}
    </div>
  )
}
