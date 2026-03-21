export function getHeroMotionPreset({ reducedMotion, desktopMotion, baseCameraZ = 0 }) {
  return {
    duration: reducedMotion ? 0.55 : desktopMotion ? 1 : 0.88,
    anchorLift: reducedMotion ? 0.06 : desktopMotion ? 0.18 : 0.1,
    anchorDrift: desktopMotion ? 0.14 : 0.05,
    introScale: desktopMotion ? 0.88 : 0.93,
    introZ: baseCameraZ + (desktopMotion ? 0.9 : 0.55),
    introPhaseStart: 0.02,
    introAnchorDuration: reducedMotion ? 0.6 : 1.2,
    introScaleDuration: reducedMotion ? 0.6 : 1.18,
    introStateDuration: reducedMotion ? 0.6 : 1.24,
    introCorePulseStart: 0.02,
    introCorePulseEnd: 0.12,
    masthead: { fromY: -18, duration: 0.72 },
    kicker: { fromY: 22, at: 0.08 },
    title: { fromY: desktopMotion ? 34 : 26, at: 0.14, durationOffset: 0.06 },
    positioning: { fromY: 18, at: 0.2, duration: reducedMotion ? 0.5 : 0.7 },
    body: { fromY: 22, at: 0.28 },
    proof: { fromY: 16, at: 0.32, duration: reducedMotion ? 0.45 : 0.62 },
    actions: { fromY: 18, at: 0.38, duration: 0.64, stagger: reducedMotion ? 0.05 : 0.08 },
    micro: { fromY: 14, at: 0.48, duration: 0.62 },
    visual: {
      fromY: desktopMotion ? 26 : 16,
      at: 0.18,
      scale: desktopMotion ? 1.03 : 1.01,
      duration: reducedMotion ? 0.5 : 0.96,
    },
    badge: { fromY: 18, at: 0.22, duration: 0.58 },
    hint: { fromY: 14, at: 0.28, duration: reducedMotion ? 0.44 : 0.68 },
    card: { fromY: desktopMotion ? 24 : 18, at: 0.34, duration: reducedMotion ? 0.5 : 0.82 },
    label: { fromY: 16, at: 0.42, duration: reducedMotion ? 0.45 : 0.72, stagger: 0.06 },
  }
}

export function getScrollMotionPreset({ reducedMotion, profile, sceneState }) {
  const strength = sceneState.scrollStrength ?? 1
  const mobileMode = profile.isPhone || profile.isTablet
  const cardShift = mobileMode ? 8 : strength > 1.1 ? 18 : 12

  return {
    scrub: reducedMotion ? 0.7 : mobileMode ? 0.95 : strength > 1.1 ? 1.45 : 1.25,
    stage0: mobileMode
      ? {
          groupPosition: { x: 0.08 * strength, y: 0.02 * strength },
          groupRotation: { y: 0.16 * strength, x: 0.04 * strength },
          camera: { x: 0.08 * strength, y: 0.03 * strength, z: sceneState.cameraBaseZ - 0.18 },
          scene: {
            palette: 0.7,
            drift: 0.18,
            particleSpin: 0.08,
            particleTilt: 0.06,
            corePulse: 0.16,
          },
          gridOpacity: 0.2,
          card: { y: -cardShift, x: 0, opacity: 0.98 },
          label: { y: -4, opacity: 0.72, stagger: 0.015 },
          badge: { y: -4, opacity: 0.84 },
        }
      : {
          groupPosition: { x: 0.16 * strength, y: 0.04 * strength },
          groupRotation: { y: 0.28 * strength, x: 0.06 * strength },
          camera: { x: 0.2 * strength, y: 0.1 * strength, z: 7.25 },
          scene: {
            palette: 0.9,
            drift: 0.22,
            particleSpin: 0.12,
            particleTilt: 0.08,
            corePulse: 0.18,
          },
          gridOpacity: 0.24,
          card: { y: -cardShift, x: 8, opacity: 1 },
          label: { y: -8, opacity: 0.9, stagger: 0.02 },
          badge: null,
        },
    stage1: mobileMode
      ? {
          groupPosition: { x: -0.04 * strength, y: -0.03 * strength },
          groupRotation: { y: 0.58 * strength, x: 0.14 * strength },
          camera: { x: -0.04 * strength, y: -0.06 * strength, z: sceneState.cameraBaseZ - 0.34 },
          scene: {
            palette: 1.45,
            drift: 0.4,
            particleSpin: 0.18,
            particleTilt: 0.14,
            corePulse: 0.32,
          },
          gridOpacity: 0.16,
          card: { y: 6, x: 0, opacity: 0.9 },
          label: { y: 6, opacity: 0.56, stagger: 0.01 },
          badge: { y: -8, opacity: 0.78 },
        }
      : {
          groupPosition: { x: -0.1 * strength, y: -0.04 * strength },
          groupRotation: { y: 1.02 * strength, x: 0.24 * strength },
          camera: { x: -0.16 * strength, y: -0.12 * strength, z: 6.95 },
          scene: {
            palette: 1.9,
            drift: 0.54,
            particleSpin: 0.28,
            particleTilt: 0.2,
            corePulse: 0.38,
          },
          gridOpacity: 0.18,
          card: { y: 4, x: 20, opacity: 0.88 },
          label: { y: 10, opacity: 0.74, stagger: 0.015 },
          badge: { y: -8, opacity: 0.76 },
        },
    stage2: mobileMode
      ? {
          groupPosition: { x: 0.05 * strength, y: -0.06 * strength },
          groupRotation: { y: 1.02 * strength, x: 0.24 * strength },
          camera: { x: 0.03 * strength, y: -0.05 * strength, z: sceneState.cameraBaseZ - 0.12 },
          scene: {
            palette: 2.1,
            drift: 0.66,
            particleSpin: 0.28,
            particleTilt: 0.22,
            corePulse: 0.46,
          },
          gridOpacity: 0.12,
          card: { y: -4, x: 0, opacity: 0.8 },
          label: { y: -2, opacity: 0.4, stagger: 0.008 },
        }
      : {
          groupPosition: { x: 0.08 * strength, y: -0.08 * strength },
          groupRotation: { y: 1.8 * strength, x: 0.36 * strength },
          camera: { x: 0.08 * strength, y: -0.08 * strength, z: 7.08 },
          scene: {
            palette: 2.7,
            drift: 0.84,
            particleSpin: 0.42,
            particleTilt: 0.32,
            corePulse: 0.58,
          },
          gridOpacity: 0.12,
          card: { y: -10, x: 10, opacity: 0.74 },
          label: { y: -4, opacity: 0.54, stagger: 0.01 },
        },
  }
}
