// @vitest-environment jsdom

import { beforeEach, describe, expect, it, vi } from 'vitest'

const mockState = vi.hoisted(() => ({
  deviceProfile: {
    performanceTier: 'high',
    pixelRatio: 1.5,
    maxFps: 60,
  },
  programOptions: [],
  scrollTriggerConfig: null,
  scrollTriggerKill: vi.fn(),
  scrollTriggerRefresh: vi.fn(),
  rendererSetSize: vi.fn(),
  rafCallbacks: [],
  rafId: 0,
  observerInstance: null,
}))

vi.mock('../src/utils/device.js', () => ({
  getDeviceProfile: vi.fn(() => mockState.deviceProfile),
}))

vi.mock('ogl', () => {
  class Renderer {
    constructor({ dpr }) {
      const canvas = document.createElement('canvas')
      const gl = { canvas }

      this.dpr = dpr
      this.gl = gl
      this.setSize = mockState.rendererSetSize
      this.render = vi.fn()
    }
  }

  class Triangle {
    constructor(gl) {
      this.gl = gl
    }
  }

  class Program {
    constructor(gl, options) {
      this.gl = gl
      this.uniforms = options.uniforms
      mockState.programOptions.push(options)
    }
  }

  class Mesh {
    constructor(gl, options) {
      this.gl = gl
      this.options = options
    }
  }

  return { Renderer, Triangle, Program, Mesh }
})

import { createHeroShaderLayer } from '../src/webgl/createHeroShaderLayer'

class ResizeObserverMock {
  constructor(callback) {
    this.callback = callback
    this.observe = vi.fn()
    this.disconnect = vi.fn()
    mockState.observerInstance = this
  }
}

function stepFrame(timestamp) {
  const callback = mockState.rafCallbacks.shift()
  callback?.(timestamp)
}

describe('createHeroShaderLayer', () => {
  beforeEach(() => {
    document.documentElement.removeAttribute('data-theme')
    document.body.innerHTML = `
      <section id="hero">
        <div class="js-hero-carousel"></div>
      </section>
    `

    mockState.deviceProfile = {
      performanceTier: 'high',
      pixelRatio: 1.5,
      maxFps: 60,
    }
    mockState.programOptions.length = 0
    mockState.scrollTriggerConfig = null
    mockState.scrollTriggerKill.mockReset()
    mockState.scrollTriggerRefresh.mockReset()
    mockState.rendererSetSize.mockReset()
    mockState.rafCallbacks.length = 0
    mockState.rafId = 0
    mockState.observerInstance = null

    global.ResizeObserver = ResizeObserverMock
    global.requestAnimationFrame = vi.fn((callback) => {
      mockState.rafCallbacks.push(callback)
      mockState.rafId += 1
      return mockState.rafId
    })
    global.cancelAnimationFrame = vi.fn()
  })

  it('returns a noop controller when motion should be skipped', () => {
    const controller = createHeroShaderLayer({
      scopeElement: document,
      reducedMotion: true,
      desktopMotion: true,
    })

    expect(document.querySelector('.hero-visual__shader-layer')).toBeNull()
    expect(() => controller.setTheme('dark')).not.toThrow()
    expect(() => controller.refresh()).not.toThrow()
    expect(() => controller.destroy()).not.toThrow()
  })

  it('mounts a canvas, updates uniforms, and cleans up listeners', () => {
    const scrollTrigger = {
      create: vi.fn((config) => {
        mockState.scrollTriggerConfig = config
        return {
          progress: 0,
          kill: mockState.scrollTriggerKill,
          refresh: mockState.scrollTriggerRefresh,
        }
      }),
    }

    const heroVisual = document.querySelector('.js-hero-carousel')
    vi.spyOn(heroVisual, 'getBoundingClientRect').mockReturnValue({
      left: 0,
      top: 0,
      width: 400,
      height: 240,
      right: 400,
      bottom: 240,
      x: 0,
      y: 0,
      toJSON() {},
    })

    const controller = createHeroShaderLayer({
      scopeElement: document,
      ScrollTrigger: scrollTrigger,
      reducedMotion: false,
      desktopMotion: true,
    })

    const host = document.querySelector('.hero-visual__shader-layer')
    expect(host).not.toBeNull()
    expect(host?.querySelector('canvas')).not.toBeNull()
    expect(mockState.observerInstance?.observe).toHaveBeenCalledWith(host)
    expect(mockState.rendererSetSize).toHaveBeenCalled()
    expect(mockState.scrollTriggerConfig?.trigger).toBe(document.querySelector('#hero'))

    mockState.scrollTriggerConfig.onUpdate({ progress: 0.5 })
    heroVisual.dispatchEvent(new MouseEvent('pointermove', { clientX: 100, clientY: 60 }))

    const baseTime = performance.now()
    controller.setTheme('dark')

    stepFrame(baseTime + 100)
    stepFrame(baseTime + 260)

    const uniforms = mockState.programOptions[0].uniforms

    expect(uniforms.uScroll.value).toBe(0.5)
    expect(uniforms.uPointer.value[0]).toBeGreaterThan(0)
    expect(uniforms.uPointer.value[0]).toBeLessThan(0.5)
    expect(uniforms.uPointer.value[1]).toBeGreaterThan(0)
    expect(uniforms.uPointer.value[1]).toBeLessThan(0.5)
    expect(uniforms.uDark.value).toBeGreaterThan(0)

    controller.refresh()
    expect(mockState.scrollTriggerRefresh).toHaveBeenCalledTimes(2)

    controller.destroy()

    expect(mockState.scrollTriggerKill).toHaveBeenCalledTimes(1)
    expect(mockState.observerInstance?.disconnect).toHaveBeenCalledTimes(1)
    expect(document.querySelector('.hero-visual__shader-layer')).toBeNull()
  })
})
