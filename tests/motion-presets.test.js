import { describe, expect, it } from 'vitest'

import { getHeroMotionPreset, getScrollMotionPreset } from '../src/animations/motionPresets'

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

  it('returns mobile scroll presets using the current mobile branch values', () => {
    const preset = getScrollMotionPreset({
      reducedMotion: false,
      profile: { isPhone: true, isTablet: false },
      sceneState: { scrollStrength: 0.8, cameraBaseZ: 6.3 },
    })

    expect(preset.scrub).toBe(0.95)
    expect(preset.stage0.card).toEqual({ y: -8, x: 0, opacity: 0.98 })
    expect(preset.stage1.badge).toEqual({ y: -8, opacity: 0.78 })
    expect(preset.stage2.scene.palette).toBe(2.1)
  })

  it('returns desktop scroll presets using the current desktop branch values', () => {
    const preset = getScrollMotionPreset({
      reducedMotion: false,
      profile: { isPhone: false, isTablet: false },
      sceneState: { scrollStrength: 1.2, cameraBaseZ: 7.8 },
    })

    expect(preset.scrub).toBe(1.45)
    expect(preset.stage0.card).toEqual({ y: -18, x: 8, opacity: 1 })
    expect(preset.stage1.camera.z).toBe(6.95)
    expect(preset.stage2.label).toEqual({ y: -4, opacity: 0.54, stagger: 0.01 })
  })
})
