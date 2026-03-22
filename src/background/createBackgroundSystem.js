import { getDeviceProfile } from '../utils/device'
import { lerp } from '../utils/math'
import { getBackgroundState } from './backgroundConfig'
import { createRouteLayouts, createRelayLayouts } from './backgroundFieldLayouts'
import {
  drawDust,
  drawRelayLinks,
  drawRelayNodes,
  drawRoutes,
} from './backgroundFieldRenderer'
import { interpolateBackgroundState } from './backgroundMath'
import { createSignalFieldModel } from './pathGenerator'
import { createSectionStateController } from './createSectionStateController'

function createNoop() {
  return {
    destroy() {},
  }
}

export function createBackgroundSystem({
  scopeElement = document,
  reducedMotion = false,
}) {
  const shell = scopeElement.querySelector('.scene-shell')
  const canvas = shell?.querySelector('.scene-shell__signals')
  const atmospherePrimary = shell?.querySelector('.scene-shell__atmosphere--primary')
  const atmosphereSecondary = shell?.querySelector('.scene-shell__atmosphere--secondary')
  const grid = shell?.querySelector('.scene-shell__grid')
  const vignette = shell?.querySelector('.scene-shell__vignette')

  if (!shell || !canvas || !atmospherePrimary || !atmosphereSecondary || !grid || !vignette) {
    return createNoop()
  }

  const context = canvas.getContext('2d')

  if (!context) {
    return createNoop()
  }

  let profile = getDeviceProfile()
  let model = createSignalFieldModel(profile)
  let pixelRatio = profile.pixelRatio
  let animationFrame = 0
  let destroyed = false
  let lastFrame = 0
  let activeSectionId = 'hero'
  let isDarkTheme = false

  const targetState = getBackgroundState('hero')
  const currentState = getBackgroundState('hero')
  const pointer = {
    x: 0,
    y: 0,
    targetX: 0,
    targetY: 0,
    screenX: 0,
    screenY: 0,
    targetScreenX: 0,
    targetScreenY: 0,
    activation: 0,
    targetActivation: 0,
  }

  shell.dataset.sceneMode = reducedMotion ? 'static' : 'active'
  shell.dataset.performanceTier = profile.performanceTier

  function setPointerHomePosition(force = false) {
    pointer.targetScreenX = window.innerWidth * 0.82
    pointer.targetScreenY = window.innerHeight * 0.32

    if (force || (!pointer.screenX && !pointer.screenY)) {
      pointer.screenX = pointer.targetScreenX
      pointer.screenY = pointer.targetScreenY
    }
  }

  // Cache previous CSS values to skip redundant DOM writes
  let prevAccentRgb = ''
  let prevSecondaryRgb = ''

  function applyShellStyles(time = 0) {
    const primaryDriftX = Math.sin(time * 0.045) * 10 + Math.cos(time * 0.022) * 5
    const primaryDriftY = Math.cos(time * 0.04) * 7
    const secondaryDriftX = Math.cos(time * 0.032 + 0.4) * 14
    const secondaryDriftY = Math.sin(time * 0.028 + 0.8) * 9

    const displayAccent = isDarkTheme
      ? currentState.accent.map((v) => Math.min(255, Math.round(v + 32)))
      : currentState.accent.map(Math.round)
    const displaySecondary = isDarkTheme ? [28, 26, 24] : currentState.secondary.map(Math.round)

    // Only write CSS custom properties when values actually change
    const accentRgb = `${displayAccent[0]}, ${displayAccent[1]}, ${displayAccent[2]}`
    const secondaryRgb = `${displaySecondary[0]}, ${displaySecondary[1]}, ${displaySecondary[2]}`
    if (accentRgb !== prevAccentRgb) {
      shell.style.setProperty('--signal-accent-rgb', accentRgb)
      prevAccentRgb = accentRgb
    }
    if (secondaryRgb !== prevSecondaryRgb) {
      shell.style.setProperty('--signal-secondary-rgb', secondaryRgb)
      prevSecondaryRgb = secondaryRgb
    }

    // Batch opacity + transform writes via cssText to minimize style recalcs
    const gridOp = Math.round(currentState.gridOpacity * 1000) / 1000
    const vigOp = Math.round(currentState.vignetteOpacity * 1000) / 1000
    const primOp = Math.round(currentState.primaryAtmosphereOpacity * 1000) / 1000
    const secOp = Math.round(currentState.secondaryAtmosphereOpacity * 1000) / 1000

    grid.style.opacity = gridOp
    vignette.style.opacity = vigOp

    const pX = Math.round((currentState.fieldShiftX + primaryDriftX + pointer.x * 12 * currentState.pointerStrength) * 100) / 100
    const pY = Math.round((currentState.fieldShiftY + primaryDriftY + pointer.y * 9 * currentState.pointerStrength) * 100) / 100
    const sX = Math.round((currentState.fieldShiftX * -0.45 + secondaryDriftX + pointer.x * -16 * currentState.pointerStrength) * 100) / 100
    const sY = Math.round((currentState.fieldShiftY * -0.28 + secondaryDriftY + pointer.y * -12 * currentState.pointerStrength) * 100) / 100

    atmospherePrimary.style.cssText = `opacity:${primOp};transform:translate3d(${pX}px,${pY}px,0) scale(1.04)`
    atmosphereSecondary.style.cssText = `opacity:${secOp};transform:translate3d(${sX}px,${sY}px,0) scale(1.08)`
  }

  function resize() {
    profile = getDeviceProfile()
    model = createSignalFieldModel(profile)
    pixelRatio = profile.pixelRatio
    shell.dataset.performanceTier = profile.performanceTier
    canvas.width = Math.round(window.innerWidth * pixelRatio)
    canvas.height = Math.round(window.innerHeight * pixelRatio)
    canvas.style.width = `${window.innerWidth}px`
    canvas.style.height = `${window.innerHeight}px`
    setPointerHomePosition()
  }

  function render(time) {
    context.setTransform(1, 0, 0, 1, 0, 0)
    context.clearRect(0, 0, canvas.width, canvas.height)
    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0)

    // In dark mode, boost accent luminance so canvas elements glow against dark bg
    const drawState = isDarkTheme
      ? {
          ...currentState,
          accent: currentState.accent.map((v) => Math.min(255, v + 32)),
          secondary: [28, 26, 24],
        }
      : currentState

    const viewportWidth = window.innerWidth
    const viewportHeight = window.innerHeight
    const routeLayouts = createRouteLayouts({
      routes: model.routes,
      width: viewportWidth,
      height: viewportHeight,
      currentState: drawState,
      pointer,
      activeSectionId,
      time,
    })
    const relayLayouts = createRelayLayouts({
      model,
      routeLayouts,
      pointer,
      profile,
      time,
      width: viewportWidth,
      height: viewportHeight,
    })

    drawDust({
      context,
      model,
      currentState: drawState,
      pointer,
      width: viewportWidth,
      height: viewportHeight,
      time,
    })
    drawRoutes({
      context,
      currentState: drawState,
      routeLayouts,
      time,
      reducedMotion,
    })
    drawRelayLinks({
      context,
      currentState: drawState,
      links: relayLayouts.links,
    })
    drawRelayNodes({
      context,
      currentState: drawState,
      nodes: relayLayouts.nodes,
    })
  }

  function tick(timestamp) {
    if (destroyed) {
      return
    }

    animationFrame = window.requestAnimationFrame(tick)

    if (document.visibilityState === 'hidden') {
      lastFrame = timestamp
      return
    }

    const frameBudget = 1000 / profile.maxFps

    if (!reducedMotion && timestamp - lastFrame < frameBudget * 0.95) {
      return
    }

    const delta = lastFrame ? (timestamp - lastFrame) / 1000 : 1 / 60
    lastFrame = timestamp
    pointer.x = lerp(pointer.x, pointer.targetX, reducedMotion ? 0.12 : Math.min(0.1, delta * 6.4))
    pointer.y = lerp(pointer.y, pointer.targetY, reducedMotion ? 0.12 : Math.min(0.1, delta * 6.4))
    pointer.screenX = lerp(
      pointer.screenX,
      pointer.targetScreenX,
      reducedMotion ? 0.12 : Math.min(0.12, delta * 7),
    )
    pointer.screenY = lerp(
      pointer.screenY,
      pointer.targetScreenY,
      reducedMotion ? 0.12 : Math.min(0.12, delta * 7),
    )
    pointer.activation = lerp(
      pointer.activation,
      pointer.targetActivation,
      reducedMotion ? 0.14 : Math.min(0.12, delta * 7.4),
    )
    interpolateBackgroundState(
      currentState,
      targetState,
      reducedMotion ? 0.18 : Math.min(0.1, delta * 6.2),
    )
    applyShellStyles(timestamp / 1000)
    render(timestamp / 1000)
  }

  function handlePointerMove(event) {
    if (reducedMotion || profile.isTouch) {
      return
    }

    pointer.targetX = (event.clientX / window.innerWidth) * 2 - 1
    pointer.targetY = -((event.clientY / window.innerHeight) * 2 - 1)
    pointer.targetScreenX = event.clientX
    pointer.targetScreenY = event.clientY
    pointer.targetActivation = 1
  }

  function handlePointerLeave() {
    pointer.targetX = 0
    pointer.targetY = 0
    pointer.targetActivation = 0
    setPointerHomePosition()
  }

  function handleResize() {
    resize()
    applyShellStyles(lastFrame / 1000 || 0)
    render(lastFrame / 1000 || 0)
  }

  const sectionController = createSectionStateController({
    scopeElement,
    onChange(sectionId) {
      activeSectionId = sectionId || 'hero'
      const nextState = getBackgroundState(activeSectionId)
      Object.assign(targetState, nextState)
      shell.dataset.sceneSection = activeSectionId

      if (reducedMotion) {
        Object.assign(currentState, nextState)
        applyShellStyles(lastFrame / 1000 || 0)
        render(lastFrame / 1000 || 0)
      }
    },
  })

  activeSectionId = sectionController?.getActiveSection?.() ?? 'hero'
  Object.assign(targetState, getBackgroundState(activeSectionId))
  shell.dataset.sceneSection = activeSectionId

  resize()
  setPointerHomePosition(true)
  applyShellStyles()
  window.addEventListener('resize', handleResize)

  if (reducedMotion) {
    render(0)
  } else {
    window.addEventListener('pointermove', handlePointerMove)
    window.addEventListener('pointerleave', handlePointerLeave)
    animationFrame = window.requestAnimationFrame(tick)
  }

  return {
    setTheme(theme) {
      isDarkTheme = theme === 'dark'
      // Immediately flush themed colors — critical in reduced-motion/static mode
      // where the RAF loop may not redraw soon enough
      const time = lastFrame / 1000 || 0
      applyShellStyles(time)
      render(time)
    },
    destroy() {
      destroyed = true

      if (animationFrame) {
        window.cancelAnimationFrame(animationFrame)
      }

      sectionController?.destroy()
      if (!reducedMotion) {
        window.removeEventListener('pointermove', handlePointerMove)
        window.removeEventListener('pointerleave', handlePointerLeave)
      }
      window.removeEventListener('resize', handleResize)
      shell.style.removeProperty('--signal-accent-rgb')
      shell.style.removeProperty('--signal-secondary-rgb')
      shell.removeAttribute('data-scene-mode')
      shell.removeAttribute('data-scene-section')
      shell.removeAttribute('data-performance-tier')
    },
  }
}
