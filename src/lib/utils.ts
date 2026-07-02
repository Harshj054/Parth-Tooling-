/** Tiny classNames joiner (keeps the dependency footprint minimal). */
export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(' ')
}
