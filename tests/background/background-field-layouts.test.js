import { describe, expect, it } from 'vitest'

import { getBackgroundState } from '../../src/background/backgroundConfig'
import { createRouteLayouts, createRelayLayouts } from '../../src/background/backgroundFieldLayouts'
import { createSignalFieldModel } from '../../src/background/pathGenerator'

describe('backgroundFieldLayouts', () => {
  it('creates routed layouts with viewport-aware offsets and emphasis', () => {
    const currentState = getBackgroundState('hero')
    const pointer = {
      x: 0.25,
      y: -0.1,
      screenX: 420,
      screenY: 280,
      activation: 0.8,
    }
    const routes = [
      {
        id: 'alpha',
        samples: [
          { x: 0.5, y: 0.2 },
          { x: 0.75, y: 0.3 },
        ],
        weights: { hero: 1, projects: 0.6 },
        opacity: 0.9,
        lineWidth: 1,
        parallax: 10,
        pulseSpeed: 0.06,
        phase: 0.2,
        ambientDrift: 3,
        ambientSpeed: 0.04,
        nodes: [0.2, 0.8],
      },
    ]

    const routeLayouts = createRouteLayouts({
      routes,
      width: 1200,
      height: 900,
      currentState,
      pointer,
      activeSectionId: 'hero',
      time: 1,
    })

    expect(routeLayouts).toHaveLength(1)
    expect(routeLayouts[0].routeStrength).toBe(1)
    expect(routeLayouts[0].screenSamples[0].x).not.toBeCloseTo(routes[0].samples[0].x)
  })

  it('creates relay nodes and links from the signal model', () => {
    const profile = {
      performanceTier: 'high',
      isPhone: false,
      isTablet: false,
    }
    const currentState = getBackgroundState('hero')
    const model = createSignalFieldModel(profile)
    const pointer = {
      x: 0,
      y: 0,
      screenX: 0,
      screenY: 0,
      activation: 0,
    }

    const routeLayouts = createRouteLayouts({
      routes: model.routes,
      width: 1280,
      height: 900,
      currentState,
      pointer,
      activeSectionId: 'hero',
      time: 0.5,
    })
    const baselineRelayLayouts = createRelayLayouts({
      model,
      routeLayouts,
      pointer,
      profile,
      time: 0.5,
      width: 1280,
      height: 900,
    })
    const targetNode = baselineRelayLayouts.nodes[0]

    expect(targetNode).toBeTruthy()

    const activeRelayLayouts = createRelayLayouts({
      model,
      routeLayouts,
      pointer: {
        ...pointer,
        screenX: targetNode.x,
        screenY: targetNode.y,
        activation: 1,
      },
      profile,
      time: 0.5,
      width: 1280,
      height: 900,
    })

    expect(activeRelayLayouts.nodes).toHaveLength(model.relayNodes.length)
    expect(activeRelayLayouts.links.length).toBeGreaterThan(0)
    expect(activeRelayLayouts.nodes.some((node) => node.activation > 0)).toBe(true)
  })
})
