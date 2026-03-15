import * as THREE from 'three'

function createLayer({
  count,
  radiusRange,
  heightRange,
  size,
  opacity,
}) {
  const geometry = new THREE.BufferGeometry()
  const positions = new Float32Array(count * 3)

  for (let index = 0; index < count; index += 1) {
    const stride = index * 3
    const radius = radiusRange[0] + Math.random() * (radiusRange[1] - radiusRange[0])
    const theta = Math.random() * Math.PI * 2
    const vertical = (Math.random() - 0.5) * heightRange

    positions[stride] = Math.cos(theta) * radius
    positions[stride + 1] = vertical
    positions[stride + 2] = Math.sin(theta) * radius
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))

  const material = new THREE.PointsMaterial({
    color: '#b8c1cb',
    size,
    transparent: true,
    opacity,
    sizeAttenuation: true,
  })

  return {
    geometry,
    material,
    points: new THREE.Points(geometry, material),
  }
}

export function createParticles(count = 180, performanceTier = 'high') {
  const group = new THREE.Group()
  const innerCount = Math.max(
    performanceTier === 'low' ? 14 : 24,
    Math.round(count * 0.32),
  )
  const outerCount = Math.max(
    performanceTier === 'low' ? 28 : 54,
    count - innerCount,
  )

  const innerLayer = createLayer({
    count: innerCount,
    radiusRange:
      performanceTier === 'low'
        ? [2.4, 4]
        : [2.2, 4.6],
    heightRange: performanceTier === 'low' ? 3.8 : 4.6,
    size: performanceTier === 'low' ? 0.028 : 0.034,
    opacity: performanceTier === 'low' ? 0.42 : 0.5,
  })
  const outerLayer = createLayer({
    count: outerCount,
    radiusRange: [4.2, performanceTier === 'high' ? 8.8 : 7.6],
    heightRange: performanceTier === 'low' ? 6.4 : 7.4,
    size: performanceTier === 'low' ? 0.018 : 0.022,
    opacity: performanceTier === 'low' ? 0.24 : 0.3,
  })

  group.add(innerLayer.points, outerLayer.points)

  function applyPalette(palette) {
    innerLayer.material.color.copy(palette.accent).lerp(palette.particle, 0.45)
    outerLayer.material.color.copy(palette.particle)
  }

  function dispose() {
    innerLayer.geometry.dispose()
    innerLayer.material.dispose()
    outerLayer.geometry.dispose()
    outerLayer.material.dispose()
  }

  return {
    group,
    points: group,
    innerPoints: innerLayer.points,
    outerPoints: outerLayer.points,
    applyPalette,
    dispose,
  }
}
