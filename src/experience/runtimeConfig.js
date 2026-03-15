export const runtimeBreakpoints = {
  phone: 760,
  tablet: 1080,
  compact: 900,
  desktopMotion: 1180,
  largeDesktop: 1280,
  wideDesktop: 1440,
  ultraWide: 1680,
}

export const runtimeMedia = {
  mobileHero: `(max-width: ${runtimeBreakpoints.phone}px)`,
}

export function getViewportFlags(width) {
  return {
    isPhone: width < runtimeBreakpoints.phone,
    isTablet: width >= runtimeBreakpoints.phone && width < runtimeBreakpoints.tablet,
    isCompact: width < runtimeBreakpoints.compact,
    isLargeDesktop: width >= runtimeBreakpoints.largeDesktop,
    isWideDesktop: width >= runtimeBreakpoints.wideDesktop,
    isUltraWide: width >= runtimeBreakpoints.ultraWide,
  }
}

export function shouldEnableDesktopMotion({ width, reducedMotion }) {
  return width >= runtimeBreakpoints.desktopMotion && !reducedMotion
}
