import { getViewportFlags, runtimeBreakpoints } from '../experience/runtimeConfig'

export function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export function getDeviceProfile() {
  const width = window.innerWidth
  const height = window.innerHeight
  const reducedMotion = prefersReducedMotion()
  const memory = navigator.deviceMemory ?? 8
  const cores = navigator.hardwareConcurrency ?? 8
  const { isPhone, isTablet, isCompact, isLargeDesktop, isWideDesktop, isUltraWide } =
    getViewportFlags(width)
  const isTouch = window.matchMedia('(pointer: coarse)').matches

  let performanceTier = 'high'

  if (reducedMotion || memory <= 3 || cores <= 4) {
    performanceTier = 'low'
  } else if (
    memory <= 6 ||
    cores <= 6 ||
    width < runtimeBreakpoints.largeDesktop ||
    isPhone ||
    isTablet
  ) {
    performanceTier = 'medium'
  }

  let pixelRatioCap = 1.85

  if (isPhone) {
    pixelRatioCap =
      performanceTier === 'high'
        ? 1.3
        : performanceTier === 'medium'
          ? 1.15
          : 1.05
  } else if (isTablet || isTouch) {
    pixelRatioCap =
      performanceTier === 'high'
        ? 1.45
        : performanceTier === 'medium'
          ? 1.28
          : 1.1
  }

  if (!isPhone && !isTablet && !isTouch && performanceTier === 'medium') {
    pixelRatioCap = isWideDesktop ? 1.45 : 1.35
  }

  if (!isPhone && !isTablet && !isTouch && performanceTier === 'low') {
    pixelRatioCap = isCompact ? 1.05 : 1.15
  }

  let motionScale = isPhone
    ? 0.74
    : isTablet
      ? 0.84
      : isCompact
        ? 0.9
        : isUltraWide
          ? 1.34
          : isWideDesktop
            ? 1.24
            : isLargeDesktop
              ? 1.12
              : 1
  let scrollStrength = isPhone
    ? 0.8
    : isTablet
      ? 0.9
      : isCompact
        ? 0.96
        : isUltraWide
          ? 1.28
          : isWideDesktop
            ? 1.18
            : isLargeDesktop
              ? 1.08
              : 1
  let cameraFloat = isPhone
    ? 0.022
    : isTablet
      ? 0.03
      : isCompact
        ? 0.038
        : isUltraWide
          ? 0.075
          : isWideDesktop
            ? 0.062
            : 0.05
  let cameraSway = isPhone
    ? 0.026
    : isTablet
      ? 0.036
      : isCompact
        ? 0.046
        : isUltraWide
          ? 0.11
          : isWideDesktop
            ? 0.085
            : 0.06

  if (performanceTier === 'medium') {
    motionScale *= 0.94
    scrollStrength *= 0.96
    cameraFloat *= 0.92
    cameraSway *= 0.92
  }

  if (performanceTier === 'low') {
    motionScale *= 0.82
    scrollStrength *= 0.88
    cameraFloat *= 0.75
    cameraSway *= 0.78
  }

  if (reducedMotion) {
    motionScale *= 0.68
    scrollStrength *= 0.72
    cameraFloat *= 0.55
    cameraSway *= 0.55
  }

  return {
    width,
    height,
    isPhone,
    isTablet,
    isCompact,
    isTouch,
    isLargeDesktop,
    isWideDesktop,
    isUltraWide,
    performanceTier,
    reducedMotion,
    motionScale,
    scrollStrength,
    cameraFloat,
    cameraSway,
    pixelRatio: Math.min(window.devicePixelRatio || 1, pixelRatioCap),
    maxFps:
      performanceTier === 'low'
        ? isPhone
          ? 26
          : 30
        : performanceTier === 'medium'
          ? isPhone
            ? 36
            : 45
          : isPhone
            ? 42
            : 60,
  }
}
