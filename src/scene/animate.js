import * as THREE from 'three'
import { clamp, lerp, mapRange } from '../utils/math'

const paletteStops = [
  {
    shell: new THREE.Color('#d5dfec'),
    inner: new THREE.Color('#4e5d74'),
    ring: new THREE.Color('#7f90a9'),
    rings: [
      new THREE.Color('#98a9c4'),
      new THREE.Color('#6f8098'),
      new THREE.Color('#5f6f86'),
    ],
    node: new THREE.Color('#f8fbff'),
    particle: new THREE.Color('#b0bfde'),
    accent: new THREE.Color('#9aabff'),
    wash: new THREE.Color('#5d74b6'),
  },
  {
    shell: new THREE.Color('#dbe5f2'),
    inner: new THREE.Color('#3e4a61'),
    ring: new THREE.Color('#8aa0bd'),
    rings: [
      new THREE.Color('#a8b7d0'),
      new THREE.Color('#7f95b1'),
      new THREE.Color('#66798f'),
    ],
    node: new THREE.Color('#eef4ff'),
    particle: new THREE.Color('#bfcbdf'),
    accent: new THREE.Color('#7ea9ff'),
    wash: new THREE.Color('#4767b8'),
  },
  {
    shell: new THREE.Color('#ddd4c3'),
    inner: new THREE.Color('#61584a'),
    ring: new THREE.Color('#aa987b'),
    rings: [
      new THREE.Color('#c0ab89'),
      new THREE.Color('#9f8c70'),
      new THREE.Color('#7d6d56'),
    ],
    node: new THREE.Color('#f7f1e6'),
    particle: new THREE.Color('#d1bf9e'),
    accent: new THREE.Color('#cfaf7d'),
    wash: new THREE.Color('#8a6b42'),
  },
  {
    shell: new THREE.Color('#d2dae5'),
    inner: new THREE.Color('#495462'),
    ring: new THREE.Color('#7d90a7'),
    rings: [
      new THREE.Color('#96a7bf'),
      new THREE.Color('#718298'),
      new THREE.Color('#59697f'),
    ],
    node: new THREE.Color('#f5f7fb'),
    particle: new THREE.Color('#a9b7ca'),
    accent: new THREE.Color('#95aaf3'),
    wash: new THREE.Color('#506a9b'),
  },
]

const scratch = {
  shell: new THREE.Color(),
  inner: new THREE.Color(),
  ringA: new THREE.Color(),
  ringB: new THREE.Color(),
  ringC: new THREE.Color(),
  node: new THREE.Color(),
  particle: new THREE.Color(),
  accent: new THREE.Color(),
  wash: new THREE.Color(),
}

const mixedPalette = {
  shell: scratch.shell,
  inner: scratch.inner,
  ring: scratch.ringA,
  rings: [scratch.ringA, scratch.ringB, scratch.ringC],
  node: scratch.node,
  particle: scratch.particle,
  accent: scratch.accent,
  wash: scratch.wash,
}

function toRGBA(color, alpha) {
  return `rgba(${Math.round(color.r * 255)}, ${Math.round(color.g * 255)}, ${Math.round(color.b * 255)}, ${alpha})`
}

function buildPalette(index) {
  const safeIndex = clamp(index, 0, paletteStops.length - 1)
  const lowerIndex = Math.floor(safeIndex)
  const upperIndex = Math.min(lowerIndex + 1, paletteStops.length - 1)
  const mix = safeIndex - lowerIndex
  const lower = paletteStops[lowerIndex]
  const upper = paletteStops[upperIndex]

  scratch.shell.lerpColors(lower.shell, upper.shell, mix)
  scratch.inner.lerpColors(lower.inner, upper.inner, mix)
  scratch.ringA.lerpColors(lower.rings[0], upper.rings[0], mix)
  scratch.ringB.lerpColors(lower.rings[1], upper.rings[1], mix)
  scratch.ringC.lerpColors(lower.rings[2], upper.rings[2], mix)
  scratch.node.lerpColors(lower.node, upper.node, mix)
  scratch.particle.lerpColors(lower.particle, upper.particle, mix)
  scratch.accent.lerpColors(lower.accent, upper.accent, mix)
  scratch.wash.lerpColors(lower.wash, upper.wash, mix)

  return mixedPalette
}

export function startAnimation({
  camera,
  core,
  particles,
  renderer,
  reducedMotion,
  scene,
  sceneState,
  timer,
}) {
  const root = document.documentElement
  let frameId = 0
  let lastAccent = ''
  let lastWash = ''

  function frame(timestamp) {
    timer.update(timestamp)
    const elapsed = timer.getElapsed()
    const motion = reducedMotion ? 0.35 : 1
    const palette = buildPalette(sceneState.palette)

    core.system.rotation.y = elapsed * 0.12 * motion + sceneState.drift * 0.4
    core.system.rotation.x = Math.sin(elapsed * 0.24) * 0.1 * motion
    core.system.position.y = Math.sin(elapsed * 0.45) * 0.09 * motion

    core.shell.rotation.x = elapsed * 0.16 * motion
    core.shell.rotation.z = elapsed * 0.12 * motion
    core.innerCore.rotation.y = -elapsed * 0.38 * motion
    core.innerCore.rotation.x = elapsed * 0.22 * motion

    core.ringPivots[0].rotation.x = elapsed * 0.18 * motion + sceneState.corePulse * 0.4
    core.ringPivots[1].rotation.y = elapsed * 0.14 * motion + sceneState.drift * 0.6
    core.ringPivots[2].rotation.z = elapsed * 0.1 * motion + sceneState.particleTilt * 0.65

    core.nodes.forEach((node, index) => {
      const { lift, offset, radius, speed } = node.userData
      const orbit = elapsed * speed * motion + offset + sceneState.drift
      const altitude = Math.sin(elapsed * (speed * 0.75) + offset) * lift
      const depth = Math.sin(orbit * 0.8) * mapRange(index, 0, 5, 0.45, 0.95)
      const scale = lerp(0.86, 1.26, (Math.sin(elapsed * 1.3 + index) + 1) / 2)

      node.position.set(
        Math.cos(orbit) * radius,
        altitude,
        Math.sin(orbit) * (radius - depth),
      )
      node.scale.setScalar(scale)
    })

    particles.points.rotation.y = elapsed * 0.012 * motion + sceneState.particleSpin
    particles.points.rotation.x = Math.sin(elapsed * 0.08) * 0.06 + sceneState.particleTilt * 0.14

    const distanceOffset = Math.sin(elapsed * 0.18) * (reducedMotion ? 0.02 : 0.04)
    const baseZ = camera.position.z
    camera.position.z = baseZ + distanceOffset
    camera.lookAt(0, 0, 0)

    core.applyPalette(palette)
    particles.applyPalette(palette)

    const accent = palette.accent.getStyle()
    const wash = toRGBA(palette.wash, 0.15)

    if (accent !== lastAccent) {
      root.style.setProperty('--accent', accent)
      root.style.setProperty('--accent-soft', toRGBA(palette.accent, 0.14))
      lastAccent = accent
    }

    if (wash !== lastWash) {
      root.style.setProperty('--scene-wash', wash)
      lastWash = wash
    }

    renderer.render(scene, camera)
    camera.position.z = baseZ
    frameId = window.requestAnimationFrame(frame)
  }

  frameId = window.requestAnimationFrame(frame)

  return () => window.cancelAnimationFrame(frameId)
}
