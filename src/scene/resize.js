import { getDeviceProfile } from '../utils/device'

export function bindResize({ camera, onResize, renderer }) {
  function resize() {
    const profile = getDeviceProfile()

    camera.aspect = profile.width / profile.height
    camera.fov = profile.isCompact ? 40 : 34
    camera.updateProjectionMatrix()

    renderer.setPixelRatio(profile.pixelRatio)
    renderer.setSize(profile.width, profile.height, false)
    onResize?.(profile)
  }

  resize()
  window.addEventListener('resize', resize)

  return () => window.removeEventListener('resize', resize)
}
