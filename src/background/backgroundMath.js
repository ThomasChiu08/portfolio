import { clamp, lerp } from '../utils/math'

export function mixColor(start, end, amount) {
  return [
    lerp(start[0], end[0], amount),
    lerp(start[1], end[1], amount),
    lerp(start[2], end[2], amount),
  ]
}

export function formatColor(color, alpha = 1) {
  return `rgba(${color.map((value) => Math.round(value)).join(', ')}, ${alpha})`
}

export function interpolateBackgroundState(current, target, amount) {
  current.accent = mixColor(current.accent, target.accent, amount)
  current.secondary = mixColor(current.secondary, target.secondary, amount)
  current.routeOpacity = lerp(current.routeOpacity, target.routeOpacity, amount)
  current.nodeOpacity = lerp(current.nodeOpacity, target.nodeOpacity, amount)
  current.linkOpacity = lerp(current.linkOpacity, target.linkOpacity, amount)
  current.dustOpacity = lerp(current.dustOpacity, target.dustOpacity, amount)
  current.pulseIntensity = lerp(current.pulseIntensity, target.pulseIntensity, amount)
  current.gridOpacity = lerp(current.gridOpacity, target.gridOpacity, amount)
  current.vignetteOpacity = lerp(current.vignetteOpacity, target.vignetteOpacity, amount)
  current.fieldShiftX = lerp(current.fieldShiftX, target.fieldShiftX, amount)
  current.fieldShiftY = lerp(current.fieldShiftY, target.fieldShiftY, amount)
  current.primaryAtmosphereOpacity = lerp(
    current.primaryAtmosphereOpacity,
    target.primaryAtmosphereOpacity,
    amount,
  )
  current.secondaryAtmosphereOpacity = lerp(
    current.secondaryAtmosphereOpacity,
    target.secondaryAtmosphereOpacity,
    amount,
  )
  current.pointerStrength = lerp(current.pointerStrength, target.pointerStrength, amount)
}

export function pointAlongSamples(samples, progress) {
  const clamped = clamp(progress, 0, 1) * (samples.length - 1)
  const index = Math.floor(clamped)
  const nextIndex = Math.min(index + 1, samples.length - 1)
  const blend = clamped - index
  const start = samples[index]
  const end = samples[nextIndex]

  return {
    x: lerp(start.x, end.x, blend),
    y: lerp(start.y, end.y, blend),
  }
}

export function mapSamplePoints(samples, width, height, shiftX, shiftY) {
  return samples.map((point) => ({
    x: point.x * width + shiftX,
    y: point.y * height + shiftY,
  }))
}

export function getRouteEmphasis(route, sectionId) {
  return route.weights?.[sectionId] ?? route.weights?.hero ?? 0.32
}
