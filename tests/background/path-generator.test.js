import { describe, expect, it } from 'vitest'

import { createSignalFieldModel, sampleCubicBezier } from '../../src/background/pathGenerator'

describe('pathGenerator', () => {
  it('samples cubic bezier endpoints predictably', () => {
    const samples = sampleCubicBezier(
      [
        [0.5, 0.2],
        [0.6, 0.1],
        [0.8, 0.3],
        [0.9, 0.4],
      ],
      12,
    )

    expect(samples[0]).toEqual({ x: 0.5, y: 0.2 })
    expect(samples.at(-1)).toEqual({ x: 0.9, y: 0.4 })
  })

  it('keeps the signal field biased away from the main reading column', () => {
    const model = createSignalFieldModel({
      performanceTier: 'high',
      isPhone: false,
      isTablet: false,
    })

    expect(model.routes).toHaveLength(12)

    model.routes.forEach((route) => {
      const minimumX = Math.min(...route.samples.map((point) => point.x))
      expect(minimumX).toBeGreaterThanOrEqual(0.48)
    })

    model.relayNodes.forEach((node) => {
      expect(node.x).toBeGreaterThanOrEqual(0.48)
    })

    expect(model.relayLinks.length).toBeGreaterThan(0)
  })

  it('degrades route, relay, and dust counts on low-tier phones', () => {
    const desktopModel = createSignalFieldModel({
      performanceTier: 'high',
      isPhone: false,
      isTablet: false,
    })
    const phoneModel = createSignalFieldModel({
      performanceTier: 'low',
      isPhone: true,
      isTablet: false,
    })

    expect(phoneModel.routes.length).toBeLessThan(desktopModel.routes.length)
    expect(phoneModel.relayNodes.length).toBeLessThan(desktopModel.relayNodes.length)
    expect(phoneModel.relayLinks.length).toBeLessThanOrEqual(desktopModel.relayLinks.length)
    expect(phoneModel.dust.length).toBeLessThan(desktopModel.dust.length)
  })
})
