import type Lenis from 'lenis'

/** Module-level handle to the active Lenis instance so non-React code
 *  (e.g. the router's scroll manager) can drive smooth programmatic scrolls. */
let instance: Lenis | null = null

export function setLenis(l: Lenis | null) {
  instance = l
}

export function getLenis(): Lenis | null {
  return instance
}
