import { cn } from '@/lib/utils'

/** A typographic "logo" lockup for a client. We ship no third-party brand
 *  artwork, so each client is set as a clean wordmark inside a steel plate. */
export function ClientMark({
  name,
  tier,
  className,
}: {
  name: string
  tier?: string
  className?: string
}) {
  return (
    <div
      className={cn(
        'steel-panel lift flex min-w-[180px] flex-col items-center justify-center gap-1 rounded-xl border border-line px-6 py-5 text-center hover:border-arc/50',
        className,
      )}
    >
      <span className="font-display text-base font-semibold tracking-tight text-fg/90">{name}</span>
      {tier && <span className="font-mono text-[0.62rem] uppercase tracking-[0.18em] text-faint">{tier}</span>}
    </div>
  )
}
