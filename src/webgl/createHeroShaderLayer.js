import { Renderer, Triangle, Program, Mesh } from 'ogl'

import { clamp, lerp } from '../utils/math.js'
import { getDeviceProfile } from '../utils/device.js'

const THEME_TRANSITION_MS = 200
const DEFAULT_POINTER = { x: 0.5, y: 0.5 }
const OFFSCREEN_POINTER = { x: -1, y: -1 }

const vertex = `
attribute vec2 position;
attribute vec2 uv;
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = vec4(position, 0.0, 1.0);
}
`

const fragment = `
precision highp float;

uniform float uTime;
uniform float uScroll;
uniform float uDark;
uniform vec2 uPointer;
uniform vec2 uResolution;

varying vec2 vUv;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(12.1, 78.2))) * 43758.5);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x),
    f.y
  );
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 3; i++) {
    v += a * noise(p);
    p *= 2.1;
    a *= 0.5;
  }
  return v;
}

void main() {
  vec2 uv = vUv;
  float aspect = uResolution.x / max(uResolution.y, 0.0001);
  uv.x *= aspect;

  vec2 p = uPointer;
  p.x *= aspect;

  float d = distance(uv, p);
  vec2 q = vec2(
    fbm(uv * 1.5 + uTime * 0.1),
    fbm(uv * 1.5 + 4.0)
  );
  float n = fbm(uv * 3.0 + q + uTime * 0.05);

  float ripple = smoothstep(0.4, 0.0, d) * sin(d * 35.0 - uTime * 5.0) * 0.04;
  n = clamp(n + ripple, 0.0, 1.0);

  vec3 bg = mix(vec3(0.98, 0.976, 0.96), vec3(0.1, 0.098, 0.094), uDark);
  vec3 ink = vec3(0.078, 0.078, 0.075);
  vec3 terra = vec3(0.85, 0.46, 0.34);

  float alpha = n * (0.12 * (1.0 - uScroll));
  vec3 color = mix(bg, ink, alpha);
  color += terra * smoothstep(0.25, 0.0, d) * (0.15 * (1.0 - uScroll));

  gl_FragColor = vec4(color, 1.0);
}
`

function createNoopController() {
  return {
    setTheme() {},
    refresh() {},
    destroy() {},
  }
}

function getPerformanceTier(profile) {
  return profile?.tier ?? profile?.performanceTier ?? 'high'
}

function getInitialDarkValue() {
  const rootTheme = document.documentElement.getAttribute('data-theme')

  if (rootTheme === 'dark') {
    return 1
  }

  if (rootTheme === 'light') {
    return 0
  }

  try {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 1 : 0
  } catch {
    return 0
  }
}

function getPointerPosition(event, element) {
  const rect = element.getBoundingClientRect()

  if (!rect.width || !rect.height) {
    return { ...DEFAULT_POINTER }
  }

  return {
    x: clamp((event.clientX - rect.left) / rect.width, 0, 1),
    y: clamp((event.clientY - rect.top) / rect.height, 0, 1),
  }
}

export function createHeroShaderLayer({
  scopeElement = document,
  ScrollTrigger,
  reducedMotion = false,
  desktopMotion = false,
} = {}) {
  if (reducedMotion || !desktopMotion) {
    return createNoopController()
  }

  let profile = getDeviceProfile()

  if (getPerformanceTier(profile) === 'low') {
    return createNoopController()
  }

  const heroVisual = scopeElement?.querySelector?.('.js-hero-visual')

  if (!heroVisual) {
    return createNoopController()
  }

  const heroSection =
    scopeElement?.querySelector?.('#hero') ??
    heroVisual.closest('#hero') ??
    heroVisual.closest('.section--hero')

  const host = document.createElement('div')
  host.className = 'hero-visual__shader-layer'
  host.setAttribute('aria-hidden', 'true')
  Object.assign(host.style, {
    position: 'absolute',
    inset: '0',
    zIndex: '0',
    pointerEvents: 'none',
    overflow: 'hidden',
  })

  let renderer
  let triangle
  let program
  let mesh

  try {
    renderer = new Renderer({
      alpha: true,
      antialias: false,
      premultipliedAlpha: true,
      dpr: profile?.pixelRatio ?? 1,
    })

    if (!renderer?.gl?.canvas) {
      throw new Error('WebGL context creation failed')
    }

    triangle = new Triangle(renderer.gl)
  } catch {
    return createNoopController()
  }

  const uniforms = {
    uTime: { value: 0 },
    uPointer: { value: [DEFAULT_POINTER.x, DEFAULT_POINTER.y] },
    uScroll: { value: 0 },
    uDark: { value: getInitialDarkValue() },
    uResolution: { value: [1, 1] },
  }

  try {
    program = new Program(renderer.gl, {
      vertex,
      fragment,
      uniforms,
    })
    mesh = new Mesh(renderer.gl, { geometry: triangle, program })
  } catch {
    triangle?.remove?.()
    return createNoopController()
  }

  const canvas = renderer.gl.canvas
  canvas.setAttribute('aria-hidden', 'true')
  Object.assign(canvas.style, {
    display: 'block',
    width: '100%',
    height: '100%',
  })

  host.appendChild(canvas)
  heroVisual.prepend(host)

  const pointer = {
    currentX: DEFAULT_POINTER.x,
    currentY: DEFAULT_POINTER.y,
    targetX: DEFAULT_POINTER.x,
    targetY: DEFAULT_POINTER.y,
  }
  const scroll = { value: 0 }
  const dark = {
    current: uniforms.uDark.value,
    from: uniforms.uDark.value,
    target: uniforms.uDark.value,
    startedAt: 0,
  }

  let destroyed = false
  let degraded = false
  let animationFrame = 0
  let lastFrame = 0
  let resizeObserver = null
  let scrollTriggerInstance = null

  function updateResolution() {
    profile = getDeviceProfile()
    renderer.dpr = profile?.pixelRatio ?? renderer.dpr ?? 1

    const rect = host.getBoundingClientRect()
    const width = Math.max(1, Math.round(rect.width || heroVisual.clientWidth || 1))
    const height = Math.max(1, Math.round(rect.height || heroVisual.clientHeight || 1))

    renderer.setSize(width, height)
    uniforms.uResolution.value[0] = width
    uniforms.uResolution.value[1] = height
  }

  function renderFrame(timestamp) {
    uniforms.uTime.value = timestamp / 1000
    uniforms.uPointer.value[0] = pointer.currentX
    uniforms.uPointer.value[1] = pointer.currentY
    uniforms.uScroll.value = scroll.value
    uniforms.uDark.value = dark.current

    renderer.render({ scene: mesh })
  }

  function updateThemeProgress(timestamp) {
    if (dark.current === dark.target) {
      return
    }

    const progress = clamp((timestamp - dark.startedAt) / THEME_TRANSITION_MS, 0, 1)
    const easedProgress = 1 - (1 - progress) * (1 - progress)

    dark.current = lerp(dark.from, dark.target, easedProgress)

    if (progress >= 1) {
      dark.current = dark.target
    }
  }

  function tick(timestamp) {
    if (destroyed || degraded) {
      return
    }

    animationFrame = window.requestAnimationFrame(tick)

    if (document.visibilityState === 'hidden') {
      lastFrame = timestamp
      return
    }

    const maxFps = profile?.maxFps ?? 0
    const frameBudget = maxFps > 0 ? 1000 / maxFps : 0

    if (frameBudget && lastFrame && timestamp - lastFrame < frameBudget) {
      return
    }

    const delta = lastFrame ? (timestamp - lastFrame) / 1000 : 1 / 60
    lastFrame = timestamp

    const pointerEase = Math.min(0.16, delta * 7)
    pointer.currentX = lerp(pointer.currentX, pointer.targetX, pointerEase)
    pointer.currentY = lerp(pointer.currentY, pointer.targetY, pointerEase)
    updateThemeProgress(timestamp)
    renderFrame(timestamp)
  }

  function handlePointerMove(event) {
    const position = getPointerPosition(event, heroVisual)

    pointer.targetX = position.x
    pointer.targetY = position.y
  }

  function handlePointerLeave() {
    pointer.targetX = OFFSCREEN_POINTER.x
    pointer.targetY = OFFSCREEN_POINTER.y
  }

  function handleResize() {
    refresh()
  }

  function handleContextLost(event) {
    if (destroyed || degraded) {
      return
    }

    event.preventDefault()
    degraded = true
    if (animationFrame) {
      window.cancelAnimationFrame(animationFrame)
      animationFrame = 0
    }
  }

  function handleContextRestored() {
    if (destroyed || !degraded) {
      return
    }
    degraded = false
    refresh()
    animationFrame = window.requestAnimationFrame(tick)
  }

  function teardown({ removeHost = true } = {}) {
    if (animationFrame) {
      window.cancelAnimationFrame(animationFrame)
      animationFrame = 0
    }

    scrollTriggerInstance?.kill?.()
    scrollTriggerInstance = null

    resizeObserver?.disconnect?.()
    resizeObserver = null

    heroVisual.removeEventListener('pointermove', handlePointerMove)
    heroVisual.removeEventListener('pointerleave', handlePointerLeave)
    window.removeEventListener('resize', handleResize)
    canvas.removeEventListener('webglcontextlost', handleContextLost)
    canvas.removeEventListener('webglcontextrestored', handleContextRestored)

    // Release OGL GPU resources to prevent buffer/shader leaks on HMR or remount
    triangle?.remove?.()
    program?.remove?.()

    if (removeHost) {
      host.remove()
    }
  }

  function refresh() {
    if (destroyed || degraded) {
      return
    }

    updateResolution()
    scrollTriggerInstance?.refresh?.()

    renderFrame(lastFrame || 0)
  }

  scrollTriggerInstance =
    typeof ScrollTrigger?.create === 'function' && heroSection
      ? ScrollTrigger.create({
          trigger: heroSection,
          start: 'top top',
          end: 'bottom top',
          onUpdate(self) {
            scroll.value = clamp(self?.progress ?? 0, 0, 1)
          },
        })
      : null

  scroll.value = clamp(scrollTriggerInstance?.progress ?? 0, 0, 1)

  if (typeof ResizeObserver !== 'undefined') {
    resizeObserver = new ResizeObserver(() => {
      refresh()
    })
    resizeObserver.observe(host)
  }

  heroVisual.addEventListener('pointermove', handlePointerMove)
  heroVisual.addEventListener('pointerleave', handlePointerLeave)
  window.addEventListener('resize', handleResize)
  canvas.addEventListener('webglcontextlost', handleContextLost)
  canvas.addEventListener('webglcontextrestored', handleContextRestored)

  refresh()
  animationFrame = window.requestAnimationFrame(tick)

  return {
    setTheme(theme) {
      if (destroyed || degraded) {
        return
      }

      const next = theme === 'dark' ? 1 : 0

      if (next === dark.target) {
        return
      }

      dark.from = dark.current
      dark.target = next
      dark.startedAt = typeof performance !== 'undefined' ? performance.now() : lastFrame
    },
    refresh,
    destroy() {
      if (destroyed) {
        return
      }

      destroyed = true
      teardown({ removeHost: true })
    },
  }
}
