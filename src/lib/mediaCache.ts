/**
 * Holds the fully-downloaded hero video as an in-memory object URL so the
 * scroll-scrub plays from RAM (instant, smooth seeking). The preloader fills
 * this; the scrub section reads it (falling back to the network path).
 */
let videoObjectUrl: string | null = null
const listeners = new Set<(url: string) => void>()

export function setVideoObjectUrl(url: string) {
  videoObjectUrl = url
  listeners.forEach((l) => l(url))
}

export function getVideoObjectUrl(): string | null {
  return videoObjectUrl
}

/** Subscribe; fires immediately if already available. Returns an unsubscribe. */
export function onVideoReady(cb: (url: string) => void): () => void {
  if (videoObjectUrl) cb(videoObjectUrl)
  listeners.add(cb)
  return () => listeners.delete(cb)
}
