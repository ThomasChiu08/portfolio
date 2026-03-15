// @vitest-environment jsdom

import { beforeEach, describe, expect, it } from 'vitest'

import { getDeviceProfile } from '../src/utils/device'
import { mockMatchMedia, setNavigatorCapabilities, setViewportSize } from './helpers/browserMocks'

describe('getDeviceProfile', () => {
  beforeEach(() => {
    setViewportSize({ width: 1440, height: 900 })
    setNavigatorCapabilities()
    mockMatchMedia(() => false)
  })

  it('returns a desktop high-tier profile when motion and hardware allow it', () => {
    const profile = getDeviceProfile()

    expect(profile.isPhone).toBe(false)
    expect(profile.isTablet).toBe(false)
    expect(profile.isWideDesktop).toBe(true)
    expect(profile.performanceTier).toBe('high')
    expect(profile.maxFps).toBe(60)
    expect(profile.pixelRatio).toBe(1.85)
  })

  it('returns a low-tier reduced-motion phone profile on constrained touch devices', () => {
    setViewportSize({ width: 390, height: 844 })
    setNavigatorCapabilities({ deviceMemory: 2, hardwareConcurrency: 4 })
    mockMatchMedia((query) => {
      if (query === '(prefers-reduced-motion: reduce)') {
        return true
      }

      if (query === '(pointer: coarse)') {
        return true
      }

      return false
    })

    const profile = getDeviceProfile()

    expect(profile.isPhone).toBe(true)
    expect(profile.isTouch).toBe(true)
    expect(profile.reducedMotion).toBe(true)
    expect(profile.performanceTier).toBe('low')
    expect(profile.maxFps).toBe(26)
    expect(profile.pixelRatio).toBe(1.05)
  })
})
