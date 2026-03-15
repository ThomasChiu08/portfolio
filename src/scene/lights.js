import * as THREE from 'three'

export function createLights(scene) {
  const ambient = new THREE.HemisphereLight('#fff9f1', '#d7cdc0', 0.82)
  const key = new THREE.DirectionalLight('#f7efe3', 1.08)
  const fill = new THREE.DirectionalLight('#8e9eb1', 0.34)
  const rim = new THREE.DirectionalLight('#c6b29d', 0.24)
  const cool = new THREE.PointLight('#6b7f95', 0.2, 16, 2)

  key.position.set(4.2, 5.4, 7.2)
  fill.position.set(-6.4, 2.2, -4.2)
  rim.position.set(-3.4, 2, 5.2)
  cool.position.set(0.8, -1.6, 3)

  scene.add(ambient, key, fill, rim, cool)

  return {
    ambient,
    key,
    fill,
    rim,
    cool,
  }
}
