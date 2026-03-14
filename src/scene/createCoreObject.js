import * as THREE from 'three'

export function createCoreObject() {
  const group = new THREE.Group()
  const system = new THREE.Group()
  group.add(system)

  const shellGeometry = new THREE.IcosahedronGeometry(1.06, 2)
  const shellMaterial = new THREE.MeshPhysicalMaterial({
    color: '#d9e0ec',
    metalness: 0.42,
    roughness: 0.24,
    clearcoat: 0.9,
    clearcoatRoughness: 0.16,
  })
  const shell = new THREE.Mesh(shellGeometry, shellMaterial)
  system.add(shell)

  const innerGeometry = new THREE.OctahedronGeometry(0.42, 2)
  const innerMaterial = new THREE.MeshStandardMaterial({
    color: '#4f5c72',
    metalness: 0.28,
    roughness: 0.38,
  })
  const innerCore = new THREE.Mesh(innerGeometry, innerMaterial)
  system.add(innerCore)

  const ringConfigs = [
    { radius: 1.45, tube: 0.028, rotation: [0.6, 0.18, 0.12] },
    { radius: 2.1, tube: 0.034, rotation: [1.15, 0.72, 0.2] },
    { radius: 2.7, tube: 0.024, rotation: [0.18, 0.54, 1.1] },
  ]

  const ringPivots = []
  const rings = []
  const ringMaterials = []

  ringConfigs.forEach((config) => {
    const pivot = new THREE.Group()
    const material = new THREE.MeshStandardMaterial({
      color: '#8e9db4',
      metalness: 0.64,
      roughness: 0.28,
    })
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(config.radius, config.tube, 26, 220),
      material,
    )

    ring.rotation.set(...config.rotation)
    pivot.add(ring)
    system.add(pivot)

    ringPivots.push(pivot)
    rings.push(ring)
    ringMaterials.push(material)
  })

  const nodeMaterial = new THREE.MeshStandardMaterial({
    color: '#f8fbff',
    metalness: 0.16,
    roughness: 0.1,
  })
  const nodeGeometry = new THREE.SphereGeometry(0.08, 18, 18)
  const nodes = []

  for (let index = 0; index < 6; index += 1) {
    const node = new THREE.Mesh(nodeGeometry, nodeMaterial.clone())
    node.userData = {
      radius: 1.15 + index * 0.34,
      speed: 0.26 + index * 0.04,
      offset: (Math.PI * 2 * index) / 6,
      lift: 0.18 + index * 0.03,
    }
    system.add(node)
    nodes.push(node)
  }

  function applyPalette(palette) {
    shellMaterial.color.copy(palette.shell)
    innerMaterial.color.copy(palette.inner)

    ringMaterials.forEach((material, index) => {
      material.color.copy(palette.rings[index] || palette.ring)
    })

    nodes.forEach((node) => {
      node.material.color.copy(palette.node)
    })
  }

  function dispose() {
    shellGeometry.dispose()
    shellMaterial.dispose()
    innerGeometry.dispose()
    innerMaterial.dispose()
    nodeGeometry.dispose()
    nodeMaterial.dispose()

    ringMaterials.forEach((material) => material.dispose())
    rings.forEach((ring) => ring.geometry.dispose())
    nodes.forEach((node) => node.material.dispose())
  }

  return {
    group,
    system,
    shell,
    innerCore,
    ringPivots,
    rings,
    nodes,
    applyPalette,
    dispose,
  }
}
