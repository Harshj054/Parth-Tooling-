import { motion } from 'framer-motion'
import { EASE_OUT } from '@/lib/motion'
import { cn } from '@/lib/utils'

/**
 * Signature motif: an engineering dimension line. The horizontal extension
 * lines draw outward from a centred mono measurement — a structural device
 * that says "this is a precision shop" rather than mere decoration.
 */
export function DimensionDivider({
  label = 'TOL ±0.01 mm',
  className,
}: {
  label?: string
  className?: string
}) {
  return (
    <div className={cn('container-x', className)} aria-hidden="true">
      <div className="flex items-center gap-3 text-line-bright">
        <span className="h-3 w-px bg-line-bright" />
        <motion.span
          className="hairline origin-left"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: EASE_OUT }}
          style={{ flex: 1 }}
        />
        <span className="min-w-0 shrink text-center font-mono text-[0.56rem] uppercase tracking-[0.1em] text-faint sm:whitespace-nowrap sm:text-[0.68rem] sm:tracking-[0.24em]">
          {label}
        </span>
        <motion.span
          className="hairline origin-right"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: EASE_OUT }}
          style={{ flex: 1 }}
        />
        <span className="h-3 w-px bg-line-bright" />
      </div>
    </div>
  )
}
