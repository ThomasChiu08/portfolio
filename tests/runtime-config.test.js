import { describe, expect, it } from 'vitest'

import {
  getViewportFlags,
  runtimeBreakpoints,
  runtimeMedia,
  shouldEnableDesktopMotion,
} from '../src/experience/runtimeConfig'

describe('runtimeConfig', () => {
  it('returns viewport flags from the shared breakpoints', () => {
    expect(getViewportFlags(runtimeBreakpoints.phone - 1)).toMatchObject({
      isPhone: true,
      isTablet: false,
      isCompact: true,
    })

    expect(getViewportFlags(runtimeBreakpoints.phone)).toMatchObject({
      isPhone: false,
      isTablet: true,
      isCompact: true,
    })

    expect(getViewportFlags(runtimeBreakpoints.wideDesktop)).toMatchObject({
      isWideDesktop: true,
      isLargeDesktop: true,
      isUltraWide: false,
    })
  })

  it('uses the shared desktop-motion threshold and mobile media query', () => {
    expect(shouldEnableDesktopMotion({ width: runtimeBreakpoints.desktopMotion - 1, reducedMotion: false })).toBe(false)
    expect(shouldEnableDesktopMotion({ width: runtimeBreakpoints.desktopMotion, reducedMotion: false })).toBe(true)
    expect(shouldEnableDesktopMotion({ width: runtimeBreakpoints.desktopMotion, reducedMotion: true })).toBe(false)
    expect(runtimeMedia.mobileHero).toBe(`(max-width: ${runtimeBreakpoints.phone}px)`)
  })
})
