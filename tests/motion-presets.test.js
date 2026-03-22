import { describe, expect, it } from 'vitest'

import { getHeroMotionPreset } from '../src/animations/motionPresets'

describe('motion presets', () => {
  it('returns desktop hero presets without changing the existing intro semantics', () => {
    const preset = getHeroMotionPreset({
      reducedMotion: false,
      desktopMotion: true,
      baseCameraZ: 7.8,
    })

    expect(preset.duration).toBe(1)
    expect(preset.anchorLift).toBe(0.18)
    expect(preset.introScale).toBe(0.88)
    expect(preset.introZ).toBeCloseTo(8.7)
    expect(preset.title.fromY).toBe(34)
    expect(preset.visual.scale).toBe(1.03)
  })

  it('returns reduced-motion hero presets with the shorter timings', () => {
    const preset = getHeroMotionPreset({
      reducedMotion: true,
      desktopMotion: false,
      baseCameraZ: 6.5,
    })

    expect(preset.duration).toBe(0.55)
    expect(preset.positioning.duration).toBe(0.5)
    expect(preset.visual.duration).toBe(0.5)
    expect(preset.actions.stagger).toBe(0.05)
  })
})
