import * as THREE from 'three'

function getTierValue(performanceTier, values) {
  if (performanceTier === 'low') {
    return values.low
  }

  if (performanceTier === 'medium') {
    return values.medium
  }

  return values.high
}

function createEllipseLine({ radiusX, radiusZ, segments, opacity = 0.24 }) {
  const points = []

  for (let index = 0; index <= segments; index += 1) {
    const angle = (index / segments) * Math.PI * 2
    points.push(new THREE.Vector3(Math.cos(angle) * radiusX, 0, Math.sin(angle) * radiusZ))
  }

  const geometry = new THREE.BufferGeometry().setFromPoints(points)
  const material = new THREE.LineBasicMaterial({
    color: '#97a5b6',
    transparent: true,
    opacity,
  })

  return {
    geometry,
    material,
    line: new THREE.LineLoop(geometry, material),
  }
}

function createPulseMaterial(color, intensity) {
  return new THREE.MeshStandardMaterial({
    color,
    emissive: color,
    emissiveIntensity: intensity,
    roughness: 0.18,
    metalness: 0.14,
  })
}

function createModuleNode({ performanceTier, isPhone, isTablet }) {
  const moduleGroup = new THREE.Group()
  const nodeDetail = getTierValue(performanceTier, {
    high: 1,
    medium: 0,
    low: 0,
  })
  const haloSegments = isPhone
    ? getTierValue(performanceTier, {
        high: 28,
        medium: 22,
        low: 18,
      })
    : isTablet
      ? getTierValue(performanceTier, {
          high: 36,
          medium: 28,
          low: 22,
        })
      : getTierValue(performanceTier, {
          high: 48,
          medium: 36,
          low: 24,
        })

  const shellGeometry = new THREE.OctahedronGeometry(0.16, nodeDetail)
  const shellMaterial = new THREE.MeshStandardMaterial({
    color: '#efe8dd',
    roughness: 0.34,
    metalness: 0.12,
  })
  const shell = new THREE.Mesh(shellGeometry, shellMaterial)

  const beaconGeometry = new THREE.SphereGeometry(0.045, 12, 12)
  const beaconMaterial = createPulseMaterial('#718399', 0.18)
  const beacon = new THREE.Mesh(beaconGeometry, beaconMaterial)
  beacon.position.y = 0.2

  const halo = createEllipseLine({
    radiusX: 0.26,
    radiusZ: 0.18,
    segments: haloSegments,
    opacity: 0.3,
  })
  halo.line.rotation.x = Math.PI * 0.5

  moduleGroup.add(halo.line, shell, beacon)

  return {
    group: moduleGroup,
    shell,
    beacon,
    halo: halo.line,
    materials: [shellMaterial, beaconMaterial, halo.material],
    geometries: [shellGeometry, beaconGeometry, halo.geometry],
  }
}

function createRelayNode({ isPhone, isTablet }) {
  const relaySegments = isPhone ? 8 : isTablet ? 9 : 10
  const geometry = new THREE.SphereGeometry(0.038, relaySegments, relaySegments)
  const material = createPulseMaterial('#a7b0ba', 0.1)
  const mesh = new THREE.Mesh(geometry, material)

  return {
    mesh,
    material,
    geometry,
  }
}

function createConnection({
  from,
  to,
  curveLift = 0.22,
  pulseOffset = 0,
  pulseSpeed = 0.12,
  segmentCount = 28,
  pulseRadius = 0.032,
}) {
  const geometry = new THREE.BufferGeometry()
  const positions = new Float32Array((segmentCount + 1) * 3)
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))

  const material = new THREE.LineBasicMaterial({
    color: '#94a5b8',
    transparent: true,
    opacity: 0.28,
  })
  const line = new THREE.Line(geometry, material)

  const pulseGeometry = new THREE.SphereGeometry(pulseRadius, 8, 8)
  const pulseMaterial = createPulseMaterial('#718399', 0.2)
  const pulse = new THREE.Mesh(pulseGeometry, pulseMaterial)

  return {
    from,
    to,
    line,
    material,
    geometry,
    segmentCount,
    pulse,
    pulseMaterial,
    pulseGeometry,
    pulseOffset,
    pulseSpeed,
    curveLift,
    curve: new THREE.CatmullRomCurve3([
      new THREE.Vector3(),
      new THREE.Vector3(),
      new THREE.Vector3(),
      new THREE.Vector3(),
    ]),
  }
}

const scratchStart = new THREE.Vector3()
const scratchEnd = new THREE.Vector3()
const scratchMidA = new THREE.Vector3()
const scratchMidB = new THREE.Vector3()
const scratchOffset = new THREE.Vector3()

function updateConnection(connection, elapsed, signalFlow) {
  connection.from.getWorldPosition(scratchStart)
  connection.to.getWorldPosition(scratchEnd)

  const distance = scratchStart.distanceTo(scratchEnd)
  const lift = Math.max(connection.curveLift, distance * 0.12)

  scratchOffset
    .subVectors(scratchEnd, scratchStart)
    .normalize()
    .cross(new THREE.Vector3(0, 1, 0))
    .multiplyScalar(distance * 0.08)

  scratchMidA.copy(scratchStart).lerp(scratchEnd, 0.34)
  scratchMidA.y += lift
  scratchMidA.addScaledVector(scratchOffset, 0.22)

  scratchMidB.copy(scratchStart).lerp(scratchEnd, 0.68)
  scratchMidB.y += lift * 0.8
  scratchMidB.addScaledVector(scratchOffset, -0.18)

  connection.curve.points[0].copy(scratchStart)
  connection.curve.points[1].copy(scratchMidA)
  connection.curve.points[2].copy(scratchMidB)
  connection.curve.points[3].copy(scratchEnd)

  const points = connection.curve.getPoints(connection.segmentCount)
  const positions = connection.geometry.attributes.position.array

  points.forEach((point, index) => {
    const stride = index * 3
    positions[stride] = point.x
    positions[stride + 1] = point.y
    positions[stride + 2] = point.z
  })

  connection.geometry.attributes.position.needsUpdate = true

  const pulseProgress = (elapsed * connection.pulseSpeed + signalFlow + connection.pulseOffset) % 1
  connection.pulse.position.copy(connection.curve.getPointAt(pulseProgress))
}

export function createCoreObject(options = {}) {
  const settings =
    typeof options === 'string'
      ? { performanceTier: options }
      : options
  const {
    performanceTier = 'high',
    isPhone = false,
    isTablet = false,
  } = settings
  const group = new THREE.Group()
  const system = new THREE.Group()
  const topology = new THREE.Group()
  group.add(system)
  system.add(topology)
  const interactiveObjects = []

  const orbitSegments = isPhone
    ? getTierValue(performanceTier, {
        high: 72,
        medium: 56,
        low: 40,
      })
    : isTablet
      ? getTierValue(performanceTier, {
          high: 92,
          medium: 72,
          low: 52,
        })
      : getTierValue(performanceTier, {
          high: 120,
          medium: 84,
          low: 56,
        })
  const relayCount = isPhone
    ? getTierValue(performanceTier, {
        high: 6,
        medium: 5,
        low: 4,
      })
    : isTablet
      ? getTierValue(performanceTier, {
          high: 8,
          medium: 7,
          low: 5,
        })
      : getTierValue(performanceTier, {
          high: 10,
          medium: 8,
          low: 6,
        })

  const coreGroup = new THREE.Group()
  const coreShellGeometry = new THREE.OctahedronGeometry(0.34, isPhone ? 0 : 1)
  const coreShellMaterial = new THREE.MeshPhysicalMaterial({
    color: '#f4ede2',
    roughness: 0.32,
    metalness: 0.12,
    clearcoat: 0.58,
    clearcoatRoughness: 0.24,
  })
  const coreShell = new THREE.Mesh(coreShellGeometry, coreShellMaterial)

  const coreInnerGeometry = new THREE.OctahedronGeometry(0.18, 0)
  const coreInnerMaterial = new THREE.MeshStandardMaterial({
    color: '#8994a1',
    roughness: 0.48,
    metalness: 0.08,
  })
  const coreInner = new THREE.Mesh(coreInnerGeometry, coreInnerMaterial)

  const coreFrameGeometry = new THREE.EdgesGeometry(new THREE.IcosahedronGeometry(0.48, 0))
  const coreFrameMaterial = new THREE.LineBasicMaterial({
    color: '#8f9dad',
    transparent: true,
    opacity: 0.24,
  })
  const coreFrame = new THREE.LineSegments(coreFrameGeometry, coreFrameMaterial)

  const coreRing = createEllipseLine({
    radiusX: 0.62,
    radiusZ: 0.42,
    segments: orbitSegments,
    opacity: 0.22,
  })
  coreRing.line.rotation.set(Math.PI * 0.44, 0.12, 0.54)

  coreGroup.add(coreFrame, coreRing.line, coreShell, coreInner)
  topology.add(coreGroup)

  const orbitDefinitions = [
    {
      radiusX: 1.74,
      radiusZ: 1.08,
      rotation: [0.42, 0.2, 0.12],
      opacity: 0.26,
    },
    {
      radiusX: 2.42,
      radiusZ: 1.52,
      rotation: [1.12, 0.66, 0.28],
      opacity: 0.2,
    },
    {
      radiusX: 3.08,
      radiusZ: 1.94,
      rotation: [0.26, 0.86, 1.02],
      opacity: 0.16,
    },
  ]

  const moduleMeta = [
    {
      id: 'agentos',
      eyebrow: 'Primary system',
      title: 'agentOS',
      description: 'Research-backed infrastructure for agent memory, delegation, and coordinated execution.',
      href: '#agentos',
      emphasis: 'primary',
    },
    {
      id: 'focusbox',
      eyebrow: 'Primary system',
      title: 'FocusBox',
      description: 'A deep-work environment designed around ritual, attention control, and measured output.',
      href: '#focusbox',
      emphasis: 'primary',
    },
    {
      id: 'trading-research-system',
      eyebrow: 'System lab',
      title: 'Quant Research Platform',
      description: 'A research system for signal mapping, scenario design, and execution under uncertainty.',
      href: '#trading-research-system',
      emphasis: 'secondary',
    },
  ]

  const relayMeta = [
    {
      eyebrow: 'Infrastructure node',
      title: 'Memory Layer',
      description: 'Context storage, retrieval, and state continuity for long-running agent workflows.',
      href: '#agentos',
    },
    {
      eyebrow: 'Infrastructure node',
      title: 'Execution Router',
      description: 'Delegation and task routing across tools, agents, and research loops.',
      href: '#agentos',
    },
    {
      eyebrow: 'Research node',
      title: 'Signal Models',
      description: 'Model libraries and scenario frames feeding the research stack.',
      href: '#research',
    },
    {
      eyebrow: 'Focus node',
      title: 'Attention Loop',
      description: 'Feedback systems for deep work, recovery, and sustained output.',
      href: '#focusbox',
    },
    {
      eyebrow: 'Research node',
      title: 'Macro Lens',
      description: 'Macro context and top-down framing layered into market research.',
      href: '#trading-research-system',
    },
    {
      eyebrow: 'Operating principle',
      title: 'Observability',
      description: 'System logging, feedback, and traceability for build and research loops.',
      href: '#about',
    },
    {
      eyebrow: 'Research node',
      title: 'Scenario Engine',
      description: 'Scenario construction and execution discipline under uncertainty.',
      href: '#trading-research-system',
    },
    {
      eyebrow: 'Focus node',
      title: 'Creator Workspace',
      description: 'Environment design for ritualized deep work and creator throughput.',
      href: '#focusbox',
    },
    {
      eyebrow: 'Infrastructure node',
      title: 'Coordination Bus',
      description: 'Shared state and coordination between systems, agents, and operators.',
      href: '#projects',
    },
    {
      eyebrow: 'Research node',
      title: 'Research Graph',
      description: 'Interlinked models, notes, and theses across active investigations.',
      href: '#research',
    },
  ]

  const orbitLines = orbitDefinitions.map((definition) => {
    const orbit = createEllipseLine({
      radiusX: definition.radiusX,
      radiusZ: definition.radiusZ,
      segments: orbitSegments,
      opacity: definition.opacity,
    })
    orbit.line.rotation.set(...definition.rotation)
    orbit.line.userData.baseRotation = {
      x: definition.rotation[0],
      y: definition.rotation[1],
      z: definition.rotation[2],
    }
    topology.add(orbit.line)

    return orbit
  })

  const moduleDefinitions = [
    {
      radiusX: 1.72,
      radiusZ: 1.08,
      rotation: new THREE.Euler(0.42, 0.2, 0.12),
      angleOffset: 0.12,
      speed: 0.16,
      lift: 0.16,
      pulseSpeed: 1.15,
      pulseOffset: 0.2,
      baseScale: 1.12,
    },
    {
      radiusX: 2.38,
      radiusZ: 1.5,
      rotation: new THREE.Euler(1.12, 0.66, 0.28),
      angleOffset: 2.32,
      speed: 0.11,
      lift: 0.22,
      pulseSpeed: 0.92,
      pulseOffset: 1.1,
      baseScale: 1.1,
    },
    {
      radiusX: 3.02,
      radiusZ: 1.88,
      rotation: new THREE.Euler(0.26, 0.86, 1.02),
      angleOffset: 4.08,
      speed: 0.09,
      lift: 0.18,
      pulseSpeed: 0.84,
      pulseOffset: 2.1,
      baseScale: 0.96,
    },
  ]

  const modules = moduleDefinitions.map((definition, index) => {
    const moduleNode = createModuleNode({ performanceTier, isPhone, isTablet })
    const nodeMeta = moduleMeta[index]

    moduleNode.group.userData = {
      ...definition,
      baseScale: definition.baseScale ?? 1,
      node: nodeMeta,
    }
    moduleNode.shell.userData.node = nodeMeta
    moduleNode.beacon.userData.node = nodeMeta
    topology.add(moduleNode.group)
    interactiveObjects.push(moduleNode.shell, moduleNode.beacon)

    return moduleNode
  })

  const relayNodes = Array.from({ length: relayCount }, (_, index) => {
    const relay = createRelayNode({ isPhone, isTablet })
    const nodeMeta = relayMeta[index % relayMeta.length]
    relay.mesh.userData = {
      radiusX: 1.4 + (index % 5) * 0.42,
      radiusZ: 1 + (index % 4) * 0.36,
      height: ((index % 3) - 1) * 0.22,
      speed: 0.045 + index * 0.006,
      angleOffset: (Math.PI * 2 * index) / relayCount,
      rotation: new THREE.Euler(
        0.08 + (index % 3) * 0.24,
        0.18 + (index % 4) * 0.34,
        0.12 + (index % 5) * 0.16,
      ),
      pulseSpeed: 0.6 + index * 0.08,
      pulseOffset: index * 0.24,
      baseScale: index < 4 ? 0.9 : 0.78,
      node: nodeMeta,
    }
    topology.add(relay.mesh)
    interactiveObjects.push(relay.mesh)

    return relay
  })

  const relayIndexA = Math.min(1, relayNodes.length - 1)
  const relayIndexB = Math.min(Math.max(2, Math.floor(relayNodes.length / 2)), relayNodes.length - 1)
  const relayIndexC = relayNodes.length - 1

  const connections = [
    createConnection({
      from: coreGroup,
      to: modules[0].group,
      curveLift: 0.4,
      pulseOffset: 0.06,
      pulseSpeed: 0.12,
      segmentCount: isPhone ? 18 : isTablet ? 22 : 28,
      pulseRadius: isPhone ? 0.026 : 0.032,
    }),
    createConnection({
      from: coreGroup,
      to: modules[1].group,
      curveLift: 0.46,
      pulseOffset: 0.34,
      pulseSpeed: 0.1,
      segmentCount: isPhone ? 18 : isTablet ? 22 : 28,
      pulseRadius: isPhone ? 0.026 : 0.032,
    }),
    createConnection({
      from: coreGroup,
      to: modules[2].group,
      curveLift: 0.5,
      pulseOffset: 0.64,
      pulseSpeed: 0.085,
      segmentCount: isPhone ? 18 : isTablet ? 22 : 28,
      pulseRadius: isPhone ? 0.026 : 0.032,
    }),
    createConnection({
      from: modules[0].group,
      to: relayNodes[relayIndexA].mesh,
      curveLift: 0.24,
      pulseOffset: 0.22,
      pulseSpeed: 0.16,
      segmentCount: isPhone ? 16 : isTablet ? 20 : 24,
      pulseRadius: isPhone ? 0.024 : 0.028,
    }),
    createConnection({
      from: modules[1].group,
      to: relayNodes[relayIndexB].mesh,
      curveLift: 0.2,
      pulseOffset: 0.48,
      pulseSpeed: 0.14,
      segmentCount: isPhone ? 16 : isTablet ? 20 : 24,
      pulseRadius: isPhone ? 0.024 : 0.028,
    }),
    createConnection({
      from: modules[2].group,
      to: relayNodes[relayIndexC].mesh,
      curveLift: 0.18,
      pulseOffset: 0.74,
      pulseSpeed: 0.12,
      segmentCount: isPhone ? 16 : isTablet ? 20 : 24,
      pulseRadius: isPhone ? 0.024 : 0.028,
    }),
  ]

  connections.forEach((connection) => {
    topology.add(connection.line, connection.pulse)
  })

  function updateConnections(elapsed, signalFlow) {
    topology.updateMatrixWorld(true)
    connections.forEach((connection) => updateConnection(connection, elapsed, signalFlow))
  }

  function applyPalette(palette) {
    coreShellMaterial.color.copy(palette.shell)
    coreInnerMaterial.color.copy(palette.inner)
    coreFrameMaterial.color.copy(palette.ring)
    coreRing.material.color.copy(palette.rings[0] || palette.ring)

    orbitLines.forEach((orbit, index) => {
      orbit.material.color.copy(palette.rings[index] || palette.ring)
    })

    modules.forEach((module, index) => {
      module.shell.material.color.copy(palette.node).lerp(palette.shell, 0.18)
      module.beacon.material.color.copy(palette.accent)
      module.beacon.material.emissive.copy(palette.accent)
      module.halo.material.color.copy(palette.rings[index] || palette.accent)
    })

    relayNodes.forEach((relay, index) => {
      relay.material.color.copy(index % 2 === 0 ? palette.particle : palette.node)
      relay.material.emissive.copy(palette.accent)
    })

    connections.forEach((connection, index) => {
      connection.material.color.copy(index < 3 ? palette.rings[index] || palette.accent : palette.particle)
      connection.pulseMaterial.color.copy(palette.accent)
      connection.pulseMaterial.emissive.copy(palette.accent)
    })
  }

  function dispose() {
    coreShellGeometry.dispose()
    coreShellMaterial.dispose()
    coreInnerGeometry.dispose()
    coreInnerMaterial.dispose()
    coreFrameGeometry.dispose()
    coreFrameMaterial.dispose()
    coreRing.geometry.dispose()
    coreRing.material.dispose()

    orbitLines.forEach((orbit) => {
      orbit.geometry.dispose()
      orbit.material.dispose()
    })

    modules.forEach((module) => {
      module.geometries.forEach((geometry) => geometry.dispose())
      module.materials.forEach((material) => material.dispose())
    })

    relayNodes.forEach((relay) => {
      relay.geometry.dispose()
      relay.material.dispose()
    })

    connections.forEach((connection) => {
      connection.geometry.dispose()
      connection.material.dispose()
      connection.pulseGeometry.dispose()
      connection.pulseMaterial.dispose()
    })
  }

  return {
    group,
    system,
    topology,
    coreGroup,
    coreShell,
    coreInner,
    coreFrame,
    coreRing: coreRing.line,
    orbitLines: orbitLines.map((orbit) => orbit.line),
    modules,
    relayNodes,
    interactiveObjects,
    connections,
    updateConnections,
    applyPalette,
    dispose,
  }
}
