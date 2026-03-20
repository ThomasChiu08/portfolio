import { pointAlongSamples } from './backgroundMath'
import { routeTemplates } from './signalFieldTemplates'

function createSeededRandom(seed) {
  let state = seed >>> 0

  return function next() {
    state = (1664525 * state + 1013904223) >>> 0
    return state / 4294967296
  }
}

function cubicPoint(points, progress) {
  const inverse = 1 - progress
  const [start, controlA, controlB, end] = points

  return {
    x:
      inverse * inverse * inverse * start[0] +
      3 * inverse * inverse * progress * controlA[0] +
      3 * inverse * progress * progress * controlB[0] +
      progress * progress * progress * end[0],
    y:
      inverse * inverse * inverse * start[1] +
      3 * inverse * inverse * progress * controlA[1] +
      3 * inverse * progress * progress * controlB[1] +
      progress * progress * progress * end[1],
  }
}

export function sampleCubicBezier(points, segments = 28) {
  return Array.from({ length: segments + 1 }, (_, index) => cubicPoint(points, index / segments))
}

function createDustParticles(profile) {
  const random = createSeededRandom(profile.isPhone ? 17 : profile.isTablet ? 23 : 31)
  const dustCount =
    profile.performanceTier === 'low'
      ? profile.isPhone
        ? 8
        : 12
      : profile.performanceTier === 'medium'
        ? profile.isPhone
          ? 10
          : 16
        : profile.isPhone
          ? 12
          : 20

  return Array.from({ length: dustCount }, (_, index) => ({
    x: 0.56 + random() * 0.4,
    y: 0.06 + random() * 0.88,
    radius: 0.6 + random() * 1.2,
    alpha: 0.08 + random() * 0.18,
    drift: 4 + random() * 8,
    speed: 0.05 + random() * 0.12,
    phase: random() * Math.PI * 2 + index * 0.18,
  }))
}

function createRelayNodes(routes, profile) {
  const maxNodesPerRoute =
    profile.performanceTier === 'low' ? 2 : profile.performanceTier === 'medium' ? 3 : 4

  return routes.flatMap((route, routeIndex) => {
    const progressPoints = [...route.nodes]

    if (!profile.isPhone && progressPoints.length < maxNodesPerRoute) {
      progressPoints.splice(1, 0, 0.46)
    }

    return progressPoints.slice(0, maxNodesPerRoute).map((progress, nodeIndex) => {
      const point = pointAlongSamples(route.samples, progress)

      return {
        id: `${route.id}-${nodeIndex}`,
        routeId: route.id,
        progress,
        x: point.x,
        y: point.y,
        radius: 1.2 + route.lineWidth * 0.85 + nodeIndex * 0.08,
        phase: route.phase + nodeIndex * 0.42 + routeIndex * 0.06,
      }
    })
  })
}

function createRelayLinks(nodes, profile) {
  const maxDistance = profile.isPhone ? 0.13 : profile.isTablet ? 0.16 : 0.18
  const linkLimit =
    profile.performanceTier === 'low' ? 8 : profile.performanceTier === 'medium' ? 12 : 18
  const seen = new Set()
  const links = []

  nodes.forEach((node) => {
    const closest = nodes
      .filter((candidate) => candidate.id !== node.id && candidate.routeId !== node.routeId)
      .map((candidate) => {
        const dx = candidate.x - node.x
        const dy = candidate.y - node.y
        const distance = Math.hypot(dx, dy)

        return {
          targetId: candidate.id,
          distance,
        }
      })
      .filter((candidate) => candidate.distance <= maxDistance)
      .sort((left, right) => left.distance - right.distance)
      .slice(0, 2)

    closest.forEach((candidate) => {
      const edgeId = [node.id, candidate.targetId].sort().join('::')

      if (seen.has(edgeId) || links.length >= linkLimit) {
        return
      }

      seen.add(edgeId)
      links.push({
        id: edgeId,
        sourceId: node.id,
        targetId: candidate.targetId,
        opacity: 0.34 + (1 - candidate.distance / maxDistance) * 0.44,
      })
    })
  })

  return links
}

export function createSignalFieldModel(profile) {
  const routeCount =
    profile.performanceTier === 'low'
      ? profile.isPhone
        ? 5
        : 7
      : profile.performanceTier === 'medium'
        ? profile.isPhone
          ? 7
          : 9
        : profile.isPhone
          ? 8
          : 12
  const sampleCount = profile.isPhone ? 18 : profile.isTablet ? 22 : 28
  const routes = routeTemplates.slice(0, routeCount).map((route, routeIndex) => ({
    ...route,
    ambientDrift:
      (profile.isPhone ? 2 : profile.isTablet ? 2.8 : 3.8) + (routeIndex % 4) * 0.55,
    ambientSpeed: 0.024 + (routeIndex % 5) * 0.004,
    samples: sampleCubicBezier(route.points, sampleCount),
  }))
  const relayNodes = createRelayNodes(routes, profile)

  return {
    routes,
    relayNodes,
    relayLinks: createRelayLinks(relayNodes, profile),
    dust: createDustParticles(profile),
  }
}
