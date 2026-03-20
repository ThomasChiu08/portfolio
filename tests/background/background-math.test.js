import { describe, expect, it } from 'vitest'

import { getBackgroundState } from '../../src/background/backgroundConfig'
import {
  formatColor,
  getRouteEmphasis,
  interpolateBackgroundState,
  mapSamplePoints,
  mixColor,
  pointAlongSamples,
} from '../../src/background/backgroundMath'

describe('backgroundMath', () => {
  it('mixes and formats colors deterministically', () => {
    expect(mixColor([10, 20, 30], [110, 220, 230], 0.25)).toEqual([35, 70, 80])
    expect(formatColor([12.2, 23.7, 34.1], 0.5)).toBe('rgba(12, 24, 34, 0.5)')
  })

  it('interpolates the background state in place without mutating the source preset', () => {
    const current = getBackgroundState('hero')
    const target = getBackgroundState('projects')
    const targetAccent = [...target.accent]

    interpolateBackgroundState(current, target, 0.5)

    expect(current.accent).not.toEqual(getBackgroundState('hero').accent)
    expect(current.accent[0]).toBeGreaterThan(getBackgroundState('hero').accent[0])
    expect(current.accent[0]).toBeLessThan(targetAccent[0])
    expect(target.accent).toEqual(targetAccent)
  })

  it('samples and remaps points along a route', () => {
    const samples = [
      { x: 0, y: 0 },
      { x: 0.5, y: 0.25 },
      { x: 1, y: 1 },
    ]

    expect(pointAlongSamples(samples, 0.5)).toEqual({ x: 0.5, y: 0.25 })
    expect(mapSamplePoints(samples, 100, 200, 10, -20)).toEqual([
      { x: 10, y: -20 },
      { x: 60, y: 30 },
      { x: 110, y: 180 },
    ])
  })

  it('falls back to hero emphasis when a section weight is missing', () => {
    const route = {
      weights: { hero: 0.72, projects: 0.4 },
    }

    expect(getRouteEmphasis(route, 'contact')).toBe(0.72)
  })
})
