import { formatColor, mixColor, pointAlongSamples } from './backgroundMath'

export function drawDust({ context, model, currentState, pointer, width, height, time }) {
  if (currentState.dustOpacity <= 0.01) {
    return
  }

  const moteColor = mixColor(currentState.secondary, currentState.accent, 0.38)

  model.dust.forEach((particle) => {
    const driftX = Math.cos(time * particle.speed + particle.phase) * particle.drift
    const driftY =
      Math.sin(time * particle.speed * 0.76 + particle.phase) * particle.drift * 0.64
    const x = particle.x * width + driftX + pointer.x * particle.drift * 0.3
    const y = particle.y * height + driftY + pointer.y * particle.drift * 0.24

    if (x < width * 0.42) {
      return
    }

    const alpha =
      currentState.dustOpacity *
      particle.alpha *
      (0.62 + 0.38 * Math.sin(time * particle.speed * 1.6 + particle.phase))

    context.fillStyle = formatColor(moteColor, alpha)
    context.beginPath()
    context.arc(x, y, particle.radius, 0, Math.PI * 2)
    context.fill()
  })
}

export function drawRoutes({ context, currentState, routeLayouts, time, reducedMotion }) {
  const broadColor = mixColor(currentState.secondary, currentState.accent, 0.5)
  const coreColor = mixColor(currentState.accent, currentState.secondary, 0.28)

  routeLayouts.forEach((route) => {
    if (route.opacity < 0.02) {
      return
    }

    context.beginPath()
    context.moveTo(route.screenSamples[0].x, route.screenSamples[0].y)

    for (let index = 1; index < route.screenSamples.length; index += 1) {
      context.lineTo(route.screenSamples[index].x, route.screenSamples[index].y)
    }

    context.strokeStyle = formatColor(broadColor, route.opacity * 0.08)
    context.lineWidth = route.lineWidth * 3.4
    context.lineCap = 'round'
    context.lineJoin = 'round'
    context.stroke()

    context.strokeStyle = formatColor(coreColor, route.opacity * 0.42)
    context.lineWidth = route.lineWidth * 0.92
    context.stroke()

    if (reducedMotion || currentState.pulseIntensity <= 0.01 || route.routeStrength <= 0.34) {
      return
    }

    const pulseGate = 0.5 + Math.sin(time * route.pulseSpeed * 5.2 + route.phase) * 0.5

    if (pulseGate < 0.76) {
      return
    }

    const pulseProgress = (time * route.pulseSpeed + route.phase * 0.08) % 1
    const pulse = pointAlongSamples(route.screenSamples, pulseProgress)
    const pulseAlpha = currentState.pulseIntensity * route.routeStrength * pulseGate * 0.5

    context.fillStyle = formatColor(currentState.secondary, pulseAlpha)
    context.beginPath()
    context.arc(pulse.x, pulse.y, 2.2 + route.lineWidth * 0.48, 0, Math.PI * 2)
    context.fill()
  })
}

export function drawRelayLinks({ context, currentState, links }) {
  const linkColor = mixColor(currentState.secondary, currentState.accent, 0.62)

  links.forEach((link) => {
    const alpha =
      currentState.linkOpacity *
      link.opacity *
      (0.48 + (link.source.ambientPulse + link.target.ambientPulse) * 0.16) *
      (1 + link.activation * 1.9)

    if (alpha < 0.02) {
      return
    }

    context.strokeStyle = formatColor(linkColor, alpha)
    context.lineWidth = 0.72 + link.activation * 0.44
    context.beginPath()
    context.moveTo(link.source.x, link.source.y)
    context.lineTo(link.target.x, link.target.y)
    context.stroke()
  })
}

export function drawRelayNodes({ context, currentState, nodes }) {
  const outerColor = mixColor(currentState.secondary, currentState.accent, 0.2)
  const coreColor = mixColor(currentState.secondary, [255, 255, 255], 0.22)

  nodes.forEach((node) => {
    const baseAlpha =
      currentState.nodeOpacity * (0.38 + node.ambientPulse * 0.18 + node.routeStrength * 0.22)
    const outerAlpha = baseAlpha * 0.36 + node.activation * 0.16
    const coreAlpha = baseAlpha * 0.84 + node.activation * 0.28

    if (outerAlpha > 0.01) {
      context.fillStyle = formatColor(outerColor, outerAlpha)
      context.beginPath()
      context.arc(node.x, node.y, node.radius + node.activation * 3.4, 0, Math.PI * 2)
      context.fill()
    }

    context.fillStyle = formatColor(coreColor, coreAlpha)
    context.beginPath()
    context.arc(node.x, node.y, node.radius * 0.82 + node.activation * 0.6, 0, Math.PI * 2)
    context.fill()
  })
}
