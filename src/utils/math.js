export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max)
}

export function lerp(start, end, amount) {
  return start + (end - start) * amount
}

export function mapRange(value, inMin, inMax, outMin, outMax) {
  const progress = clamp((value - inMin) / (inMax - inMin), 0, 1)
  return lerp(outMin, outMax, progress)
}
