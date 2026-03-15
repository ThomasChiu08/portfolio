import * as THREE from 'three'
import { clamp, lerp } from '../utils/math'

const paletteStops = [
  {
    shell: new THREE.Color('#eee5d8'),
    inner: new THREE.Color('#8793a0'),
    ring: new THREE.Color('#93a1b1'),
    rings: [
      new THREE.Color('#acb8c5'),
      new THREE.Color('#8b99a8'),
      new THREE.Color('#c8b9a9'),
    ],
    node: new THREE.Color('#f7f0e4'),
    particle: new THREE.Color('#bac4ce'),
    accent: new THREE.Color('#6f8297'),
    wash: new THREE.Color('#d9cdc0'),
  },
  {
    shell: new THREE.Color('#f2e9de'),
    inner: new THREE.Color('#8f9aa6'),
    ring: new THREE.Color('#9daab8'),
    rings: [
      new THREE.Color('#b3bfcb'),
      new THREE.Color('#95a2b0'),
      new THREE.Color('#d1c2b3'),
    ],
    node: new THREE.Color('#faf3e9'),
    particle: new THREE.Color('#c0cad3'),
    accent: new THREE.Color('#7b8fa5'),
    wash: new THREE.Color('#ddd2c6'),
  },
  {
    shell: new THREE.Color('#e8ded2'),
    inner: new THREE.Color('#7c8896'),
    ring: new THREE.Color('#8997a7'),
    rings: [
      new THREE.Color('#a9b6c3'),
      new THREE.Color('#8693a2'),
      new THREE.Color('#c3b5a4'),
    ],
    node: new THREE.Color('#f5ecdf'),
    particle: new THREE.Color('#b3bdc8'),
    accent: new THREE.Color('#71849a'),
    wash: new THREE.Color('#d4c9bc'),
  },
  {
    shell: new THREE.Color('#f1e8dc'),
    inner: new THREE.Color('#8a95a2'),
    ring: new THREE.Color('#98a5b5'),
    rings: [
      new THREE.Color('#b2beca'),
      new THREE.Color('#909daa'),
      new THREE.Color('#d0c0af'),
    ],
    node: new THREE.Color('#faf2e8'),
    particle: new THREE.Color('#bcc5ce'),
    accent: new THREE.Color('#667a90'),
    wash: new THREE.Color('#dbd0c3'),
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

const scratchWorld = new THREE.Vector3()
const scratchProjected = new THREE.Vector3()
const scratchPosition = new THREE.Vector3()

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

function getPointerInfluence(object, camera, sceneState, strengthScale = 1) {
  object.getWorldPosition(scratchWorld)
  scratchProjected.copy(scratchWorld).project(camera)

  const distance = Math.hypot(
    scratchProjected.x - sceneState.pointerX,
    scratchProjected.y - sceneState.pointerY,
  )

  return clamp(1 - distance / 0.62, 0, 1) * sceneState.pointerStrength * strengthScale
}

export function startAnimation({
  camera,
  cameraRig,
  core,
  interactionController,
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
  let lastRenderTime = 0

  function frame(timestamp) {
    frameId = window.requestAnimationFrame(frame)
    timer.update(timestamp)
    const frameBudget = 1000 / sceneState.maxFps

    if (lastRenderTime !== 0 && timestamp - lastRenderTime < frameBudget) {
      return
    }

    lastRenderTime = timestamp
    const elapsed = timer.getElapsed()
    const motion = reducedMotion ? 0.35 : 1
    const motionScale = (sceneState.motionScale ?? 1) * motion
    const cameraFloat = (sceneState.cameraFloat ?? 0.04) * motion
    const cameraSway = (sceneState.cameraSway ?? 0.06) * motion
    const sceneIntro = sceneState.sceneIntro ?? 1

    sceneState.pointerX = lerp(sceneState.pointerX ?? 0, sceneState.pointerTargetX ?? 0, 0.075)
    sceneState.pointerY = lerp(sceneState.pointerY ?? 0, sceneState.pointerTargetY ?? 0, 0.075)
    sceneState.pointerStrength = lerp(
      sceneState.pointerStrength ?? 0,
      sceneState.pointerTargetStrength ?? 0,
      0.08,
    )

    if (cameraRig) {
      cameraRig.position.x =
        sceneState.rigBaseX + sceneState.pointerX * 0.18 * sceneState.pointerStrength
      cameraRig.position.y =
        sceneState.rigBaseY + sceneState.pointerY * 0.1 * sceneState.pointerStrength
      cameraRig.position.z = sceneState.rigBaseZ
    }

    const palette = buildPalette(sceneState.palette)
    const signalFlow = (elapsed * 0.06 + sceneState.particleSpin * 0.35 + sceneState.corePulse * 0.12) % 1

    core.system.rotation.y = elapsed * 0.06 * motionScale + sceneState.drift * 0.16
    core.system.rotation.x =
      Math.sin(elapsed * 0.12) * 0.04 * motionScale - sceneState.pointerY * 0.035 * sceneState.pointerStrength
    core.system.rotation.z = sceneState.pointerX * 0.02 * sceneState.pointerStrength
    core.system.position.y = Math.sin(elapsed * 0.32) * 0.05 * motionScale + (1 - sceneIntro) * 0.18
    core.group.scale.setScalar(sceneIntro)

    core.coreGroup.rotation.y = -elapsed * 0.18 * motionScale + sceneState.corePulse * 0.12
    core.coreGroup.rotation.x = Math.sin(elapsed * 0.24) * 0.05 * motionScale
    core.coreFrame.rotation.y = elapsed * 0.22 * motionScale
    core.coreRing.rotation.z = elapsed * 0.12 * motionScale + sceneState.drift * 0.08

    core.orbitLines.forEach((orbit, index) => {
      const baseRotation = orbit.userData.baseRotation
      orbit.rotation.x =
        baseRotation.x + Math.sin(elapsed * (0.12 + index * 0.03)) * 0.02 * motionScale
      orbit.rotation.y =
        baseRotation.y + elapsed * (0.02 + index * 0.015) * motionScale + sceneState.drift * 0.05
      orbit.rotation.z =
        baseRotation.z + Math.cos(elapsed * (0.1 + index * 0.04)) * 0.018 * motionScale
    })

    core.modules.forEach((module, index) => {
      const data = module.group.userData
      const angle = elapsed * data.speed * motionScale + data.angleOffset + sceneState.drift * 0.2
      const pulse = (Math.sin(elapsed * data.pulseSpeed + data.pulseOffset) + 1) / 2
      const isHovered =
        Boolean(sceneState.hoveredNodeId) &&
        sceneState.hoveredNodeId === (data.node?.id ?? data.node?.title)

      scratchPosition.set(
        Math.cos(angle) * data.radiusX,
        Math.sin(elapsed * (data.speed * 1.8) + data.pulseOffset) * data.lift,
        Math.sin(angle) * data.radiusZ,
      )
      scratchPosition.applyEuler(data.rotation)

      module.group.position.copy(scratchPosition)
      module.group.rotation.y = -angle * 0.42
      module.group.rotation.z = Math.sin(elapsed * 0.2 + index) * 0.08 * motionScale

      const pointerInfluence = getPointerInfluence(module.group, camera, sceneState, 1.1)
      const hoverBoost = isHovered ? 0.18 : 0
      const scale = data.baseScale * (1 + pulse * 0.1 + pointerInfluence * 0.18 + hoverBoost)

      module.group.scale.setScalar(scale)
      module.beacon.scale.setScalar(1 + pulse * 0.55 + pointerInfluence * 0.45 + hoverBoost * 1.4)
      module.beacon.material.emissiveIntensity = 0.18 + pulse * 0.32 + pointerInfluence * 0.46 + hoverBoost
      module.halo.material.opacity = 0.18 + pulse * 0.18 + pointerInfluence * 0.14 + hoverBoost * 0.3
    })

    core.relayNodes.forEach((relay, index) => {
      const data = relay.mesh.userData
      const angle = elapsed * data.speed * motionScale + data.angleOffset - sceneState.drift * 0.12
      const pulse = (Math.sin(elapsed * data.pulseSpeed + data.pulseOffset) + 1) / 2
      const isHovered =
        Boolean(sceneState.hoveredNodeId) &&
        sceneState.hoveredNodeId === (data.node?.id ?? data.node?.title)

      scratchPosition.set(
        Math.cos(angle) * data.radiusX,
        data.height + Math.sin(elapsed * 0.22 + index) * 0.04 * motionScale,
        Math.sin(angle) * data.radiusZ,
      )
      scratchPosition.applyEuler(data.rotation)

      relay.mesh.position.copy(scratchPosition)

      const pointerInfluence = getPointerInfluence(relay.mesh, camera, sceneState, 0.8)
      const hoverBoost = isHovered ? 0.16 : 0
      relay.mesh.scale.setScalar(
        data.baseScale * (1 + pulse * 0.22 + pointerInfluence * 0.16 + hoverBoost),
      )
      relay.material.emissiveIntensity = 0.06 + pulse * 0.18 + pointerInfluence * 0.18 + hoverBoost
    })

    core.updateConnections(elapsed, signalFlow)

    core.connections.forEach((connection, index) => {
      const pulse = (Math.sin(elapsed * (0.7 + index * 0.18) + connection.pulseOffset * Math.PI * 2) + 1) / 2
      connection.material.opacity = index < 3 ? 0.22 + pulse * 0.08 : 0.16 + pulse * 0.06
      connection.pulseMaterial.emissiveIntensity = 0.22 + pulse * 0.3
      connection.pulse.scale.setScalar(0.9 + pulse * 0.5)
    })

    particles.innerPoints.rotation.y = elapsed * 0.018 * motionScale + sceneState.particleSpin * 0.9
    particles.innerPoints.rotation.x =
      Math.sin(elapsed * 0.08) * 0.05 * motionScale + sceneState.particleTilt * 0.12
    particles.outerPoints.rotation.y = elapsed * 0.008 * motionScale + sceneState.particleSpin * 0.45
    particles.outerPoints.rotation.x =
      Math.sin(elapsed * 0.05) * 0.025 * motionScale + sceneState.particleTilt * 0.08

    const swayOffset = Math.sin(elapsed * 0.11) * cameraSway
    const liftOffset = Math.cos(elapsed * 0.17) * cameraFloat * 0.65
    const distanceOffset = Math.sin(elapsed * 0.18) * cameraFloat
    const baseX = sceneState.cameraBaseX ?? camera.position.x
    const baseY = sceneState.cameraBaseY ?? camera.position.y
    const baseZ = sceneState.cameraBaseZ ?? camera.position.z

    camera.position.x = baseX + swayOffset
    camera.position.y = baseY + liftOffset
    camera.position.z = baseZ + distanceOffset
    camera.lookAt(0, 0, 0)

    core.applyPalette(palette)
    particles.applyPalette(palette)

    const accent = palette.accent.getStyle()
    const wash = toRGBA(palette.wash, 0.1)

    if (accent !== lastAccent) {
      root.style.setProperty('--accent', accent)
      root.style.setProperty('--accent-soft', toRGBA(palette.accent, 0.12))
      lastAccent = accent
    }

    if (wash !== lastWash) {
      root.style.setProperty('--scene-wash', wash)
      lastWash = wash
    }

    interactionController?.update()
    renderer.render(scene, camera)
    camera.position.x = baseX
    camera.position.y = baseY
    camera.position.z = baseZ
  }

  frameId = window.requestAnimationFrame(frame)

  return () => window.cancelAnimationFrame(frameId)
}
