import * as THREE from 'three'
import { createCoreObject } from './createCoreObject'
import { createParticles } from './createParticles'
import { createLights } from './lights'
import { bindResize } from './resize'
import { getDeviceProfile } from '../utils/device'

function applyResponsiveLayout({ cameraRig, coreAnchor, profile }) {
  if (profile.isPhone) {
    cameraRig.position.set(0.02, -0.02, 0.18)
    coreAnchor.position.set(0.14, -0.04, 0)
    coreAnchor.scale.setScalar(0.92)
    return
  }

  if (profile.isTablet) {
    cameraRig.position.set(0.04, -0.01, 0.42)
    coreAnchor.position.set(0.24, -0.06, 0)
    coreAnchor.scale.setScalar(0.9)
    return
  }

  cameraRig.position.set(
    profile.isCompact
      ? 0.08
      : profile.isUltraWide
        ? -0.22
        : profile.isWideDesktop
          ? -0.14
          : -0.06,
    0,
    profile.isCompact
      ? 1.1
      : profile.isUltraWide
        ? -0.08
        : -0.02,
  )
  coreAnchor.position.set(
    profile.isCompact
      ? 0
      : profile.isUltraWide
        ? 0.94
        : profile.isWideDesktop
          ? 0.78
          : 0.52,
    profile.isCompact
      ? -0.16
      : profile.isUltraWide
        ? -0.02
        : -0.04,
    0,
  )
  coreAnchor.scale.setScalar(
    profile.isCompact
      ? 0.74
      : profile.isUltraWide
        ? 1.12
        : profile.isWideDesktop
          ? 1.04
          : 0.98,
  )
}

export function setupScene({ canvas, reducedMotion = false }) {
  let profile = getDeviceProfile()
  const renderer = new THREE.WebGLRenderer({
    canvas,
    // Opaque clear on touch devices avoids white compositor flashes while scrolling.
    alpha: !profile.isTouch,
    antialias: profile.performanceTier === 'high' && !profile.isCompact,
    powerPreference: 'high-performance',
  })

  renderer.outputColorSpace = THREE.SRGBColorSpace
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.02
  renderer.setClearColor('#efe7da', profile.isTouch ? 1 : 0)

  const scene = new THREE.Scene()
  scene.background = profile.isTouch ? new THREE.Color('#efe7da') : null
  scene.fog = new THREE.Fog('#efe7da', 8.8, 14.2)
  const camera = new THREE.PerspectiveCamera(
    profile.isPhone ? 44 : profile.isTablet ? 40 : profile.isCompact ? 38 : 34,
    profile.width / profile.height,
    0.1,
    100,
  )
  const cameraRig = new THREE.Group()
  camera.position.set(
    profile.isPhone ? 0.14 : profile.isTablet ? 0.26 : 0.55,
    profile.isPhone ? 0.12 : profile.isTablet ? 0.1 : 0.08,
    profile.isPhone ? 6.3 : profile.isTablet ? 6.85 : 7.8,
  )
  cameraRig.add(camera)
  scene.add(cameraRig)

  const lights = createLights(scene)
  const core = createCoreObject({
    performanceTier: profile.performanceTier,
    isPhone: profile.isPhone,
    isTablet: profile.isTablet,
  })
  const coreAnchor = new THREE.Group()
  const particleCount = profile.isPhone
    ? profile.performanceTier === 'low'
      ? 18
      : profile.performanceTier === 'medium'
        ? 26
        : 36
    : profile.isTablet
      ? profile.performanceTier === 'low'
        ? 28
        : profile.performanceTier === 'medium'
          ? 42
          : 60
      : profile.performanceTier === 'low'
        ? profile.isCompact
          ? 36
          : 72
        : profile.performanceTier === 'medium'
          ? profile.isCompact
            ? 64
            : 110
          : profile.isCompact
            ? 96
            : 156
  const particles = createParticles(particleCount, profile.performanceTier)
  const timer = new THREE.Timer()

  core.group.position.set(0, 0, 0)
  coreAnchor.add(core.group)
  scene.add(coreAnchor)
  scene.add(particles.points)

  timer.connect(document)
  applyResponsiveLayout({
    cameraRig,
    coreAnchor,
    profile,
  })

  const sceneState = {
    palette: 0,
    drift: 0,
    particleSpin: 0,
    particleTilt: 0,
    corePulse: 0,
    motionScale: profile.motionScale,
    scrollStrength: profile.scrollStrength,
    cameraFloat: profile.cameraFloat,
    cameraSway: profile.cameraSway,
    isPhone: profile.isPhone,
    isTablet: profile.isTablet,
    isCompact: profile.isCompact,
    isTouch: profile.isTouch,
    pointerX: 0,
    pointerY: 0,
    pointerTargetX: 0,
    pointerTargetY: 0,
    pointerStrength: 0,
    pointerTargetStrength: 0,
    hoveredNodeId: null,
    rigBaseX: cameraRig.position.x,
    rigBaseY: cameraRig.position.y,
    rigBaseZ: cameraRig.position.z,
    cameraBaseX: camera.position.x,
    cameraBaseY: camera.position.y,
    cameraBaseZ: camera.position.z,
    anchorBaseX: coreAnchor.position.x,
    anchorBaseY: coreAnchor.position.y,
    anchorBaseZ: coreAnchor.position.z,
    anchorBaseScale: coreAnchor.scale.x,
    sceneIntro: 1,
    maxFps: profile.maxFps,
  }

  function syncRigBase() {
    sceneState.rigBaseX = cameraRig.position.x
    sceneState.rigBaseY = cameraRig.position.y
    sceneState.rigBaseZ = cameraRig.position.z
  }

  function syncAnchorBase() {
    sceneState.anchorBaseX = coreAnchor.position.x
    sceneState.anchorBaseY = coreAnchor.position.y
    sceneState.anchorBaseZ = coreAnchor.position.z
    sceneState.anchorBaseScale = coreAnchor.scale.x
  }

  syncRigBase()
  syncAnchorBase()

  function handlePointerMove(event) {
    if (profile.isTouch || reducedMotion) {
      return
    }

    sceneState.pointerTargetX = (event.clientX / window.innerWidth) * 2 - 1
    sceneState.pointerTargetY = -((event.clientY / window.innerHeight) * 2 - 1)
    sceneState.pointerTargetStrength = 1
  }

  function handlePointerLeave() {
    sceneState.pointerTargetX = 0
    sceneState.pointerTargetY = 0
    sceneState.pointerTargetStrength = 0
  }

  window.addEventListener('pointermove', handlePointerMove)
  window.addEventListener('pointerleave', handlePointerLeave)

  const detachResize = bindResize({
    camera,
    onResize(nextProfile) {
      profile = nextProfile
      sceneState.maxFps = nextProfile.maxFps
      sceneState.motionScale = nextProfile.motionScale
      sceneState.scrollStrength = nextProfile.scrollStrength
      sceneState.cameraFloat = nextProfile.cameraFloat
      sceneState.cameraSway = nextProfile.cameraSway
      sceneState.isPhone = nextProfile.isPhone
      sceneState.isTablet = nextProfile.isTablet
      sceneState.isCompact = nextProfile.isCompact
      sceneState.isTouch = nextProfile.isTouch
      applyResponsiveLayout({
        cameraRig,
        coreAnchor,
        profile: nextProfile,
      })
      syncRigBase()
      syncAnchorBase()
    },
    renderer,
  })

  function cleanup() {
    detachResize()
    window.removeEventListener('pointermove', handlePointerMove)
    window.removeEventListener('pointerleave', handlePointerLeave)
    timer.dispose()
    particles.dispose()
    core.dispose()
    renderer.dispose()
  }

  return {
    scene,
    camera,
    cameraRig,
    renderer,
    lights,
    core,
    coreAnchor,
    particles,
    profile,
    timer,
    sceneState,
    cleanup,
  }
}
