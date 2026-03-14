import * as THREE from 'three'

export function createLights(scene) {
  const ambient = new THREE.HemisphereLight('#edf3ff', '#05070b', 0.85)
  const key = new THREE.DirectionalLight('#ffffff', 1.75)
  const fill = new THREE.DirectionalLight('#8fa4ff', 1.05)
  const warm = new THREE.PointLight('#e0b980', 1.3, 18, 2)

  key.position.set(4.6, 5.8, 7.2)
  fill.position.set(-6.5, 1.8, -4.5)
  warm.position.set(0, -2.4, 2.8)

  scene.add(ambient, key, fill, warm)

  return {
    ambient,
    key,
    fill,
    warm,
  }
}
