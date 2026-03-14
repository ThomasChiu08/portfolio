import * as THREE from 'three'

export function createParticles(count = 180) {
  const geometry = new THREE.BufferGeometry()
  const positions = new Float32Array(count * 3)

  for (let index = 0; index < count; index += 1) {
    const stride = index * 3
    const radius = 3.8 + Math.random() * 5.8
    const theta = Math.random() * Math.PI * 2
    const phi = Math.acos(2 * Math.random() - 1)

    positions[stride] = radius * Math.sin(phi) * Math.cos(theta)
    positions[stride + 1] = (Math.random() - 0.5) * 6
    positions[stride + 2] = radius * Math.sin(phi) * Math.sin(theta)
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))

  const material = new THREE.PointsMaterial({
    color: '#aebcdb',
    size: 0.03,
    transparent: true,
    opacity: 0.72,
    sizeAttenuation: true,
  })

  const points = new THREE.Points(geometry, material)

  function applyPalette(palette) {
    material.color.copy(palette.particle)
  }

  function dispose() {
    geometry.dispose()
    material.dispose()
  }

  return {
    points,
    material,
    applyPalette,
    dispose,
  }
}
