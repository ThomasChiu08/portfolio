import { clamp } from '../utils/math'
import { getRouteEmphasis, mapSamplePoints, pointAlongSamples } from './backgroundMath'

function getNodeActivation({
  x,
  y,
  pointerScreenX,
  pointerScreenY,
  pointerActivation,
  viewportWidth,
  viewportHeight,
  isPhone,
}) {
  if (pointerActivation <= 0.01) {
    return 0
  }

  const radius = Math.min(viewportWidth, viewportHeight) * (isPhone ? 0.16 : 0.2)
  const distance = Math.hypot(x - pointerScreenX, y - pointerScreenY)
  const falloff = 1 - clamp(distance / radius, 0, 1)

  return falloff * falloff * pointerActivation
}

export function createRouteLayouts({
  routes,
  width,
  height,
  currentState,
  pointer,
  activeSectionId,
  time,
}) {
  return routes.map((route) => {
    const routeStrength = getRouteEmphasis(route, activeSectionId)
    const shimmer = 0.94 + Math.sin(time * 0.18 + route.phase) * 0.06
    const ambientX =
      Math.sin(time * route.ambientSpeed + route.phase) * route.ambientDrift * 0.72
    const ambientY =
      Math.cos(time * route.ambientSpeed * 0.86 + route.phase) * route.ambientDrift * 0.42
    const shiftX =
      currentState.fieldShiftX + ambientX + pointer.x * route.parallax * currentState.pointerStrength
    const shiftY =
      currentState.fieldShiftY +
      ambientY +
      pointer.y * route.parallax * 0.64 * currentState.pointerStrength

    return {
      ...route,
      routeStrength,
      opacity: currentState.routeOpacity * route.opacity * routeStrength * shimmer,
      screenSamples: mapSamplePoints(route.samples, width, height, shiftX, shiftY),
    }
  })
}

export function createRelayLayouts({
  model,
  routeLayouts,
  pointer,
  profile,
  time,
  width,
  height,
}) {
  const routeLookup = new Map(routeLayouts.map((route) => [route.id, route]))
  const nodeLookup = new Map()

  const nodes = model.relayNodes
    .map((node) => {
      const route = routeLookup.get(node.routeId)

      if (!route) {
        return null
      }

      const point = pointAlongSamples(route.screenSamples, node.progress)
      const ambientPulse = 0.72 + Math.sin(time * 0.42 + node.phase) * 0.28
      const activation = getNodeActivation({
        x: point.x,
        y: point.y,
        pointerScreenX: pointer.screenX,
        pointerScreenY: pointer.screenY,
        pointerActivation: pointer.activation,
        viewportWidth: width,
        viewportHeight: height,
        isPhone: profile.isPhone,
      }) * route.routeStrength
      const presence = clamp(0.18 + ambientPulse * 0.2 + activation * 0.82, 0, 1)
      const layout = {
        ...node,
        x: point.x,
        y: point.y,
        ambientPulse,
        activation,
        presence,
        routeStrength: route.routeStrength,
      }

      nodeLookup.set(node.id, layout)
      return layout
    })
    .filter(Boolean)

  const links = model.relayLinks
    .map((link) => {
      const source = nodeLookup.get(link.sourceId)
      const target = nodeLookup.get(link.targetId)

      if (!source || !target) {
        return null
      }

      return {
        ...link,
        source,
        target,
        activation: Math.max(source.activation, target.activation),
      }
    })
    .filter(Boolean)

  return { nodes, links }
}
