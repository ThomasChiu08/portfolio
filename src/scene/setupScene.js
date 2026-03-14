import * as THREE from 'three'
import { createCoreObject } from './createCoreObject'
import { createParticles } from './createParticles'
import { createLights } from './lights'
import { bindResize } from './resize'
import { getDeviceProfile } from '../utils/device'

function applyResponsiveLayout({ cameraRig, coreAnchor, profile }) {
  cameraRig.position.set(
    profile.isCompact ? 0.3 : 0,
    0,
    profile.isCompact ? 1.6 : 0,
  )
  coreAnchor.position.set(
    profile.isCompact ? 0.45 : 0,
    profile.isCompact ? -0.95 : 0,
    0,
  )
  coreAnchor.scale.setScalar(profile.isCompact ? 0.8 : 1)
}

export function setupScene({ canvas }) {
  const profile = getDeviceProfile()
  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: !profile.isCompact,
    powerPreference: 'high-performance',
  })

  renderer.outputColorSpace = THREE.SRGBColorSpace
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.1
  renderer.setClearColor('#000000', 0)

  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(
    profile.isCompact ? 40 : 34,
    profile.width / profile.height,
    0.1,
    100,
  )
  const cameraRig = new THREE.Group()
  camera.position.set(0.55, 0.08, 7.8)
  cameraRig.add(camera)
  scene.add(cameraRig)

  const lights = createLights(scene)
  const core = createCoreObject()
  const coreAnchor = new THREE.Group()
  const particles = createParticles(profile.isCompact ? 120 : 180)
  const timer = new THREE.Timer()

  core.group.position.set(1.35, -0.1, 0)
  coreAnchor.add(core.group)
  scene.add(coreAnchor)
  scene.add(particles.points)

  timer.connect(document)
  applyResponsiveLayout({
    cameraRig,
    coreAnchor,
    profile,
  })

  const detachResize = bindResize({
    camera,
    onResize(nextProfile) {
      applyResponsiveLayout({
        cameraRig,
        coreAnchor,
        profile: nextProfile,
      })
    },
    renderer,
  })

  const sceneState = {
    palette: 0,
    drift: 0,
    particleSpin: 0,
    particleTilt: 0,
    corePulse: 0,
  }

  function cleanup() {
    detachResize()
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
    timer,
    sceneState,
    cleanup,
  }
}
