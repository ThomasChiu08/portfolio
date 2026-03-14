export function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export function getDeviceProfile() {
  const width = window.innerWidth
  const height = window.innerHeight

  return {
    width,
    height,
    isCompact: width < 900,
    isTouch: window.matchMedia('(pointer: coarse)').matches,
    pixelRatio: Math.min(window.devicePixelRatio || 1, width < 900 ? 1.75 : 2),
  }
}
