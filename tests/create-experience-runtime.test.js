// @vitest-environment jsdom

import { beforeEach, describe, expect, it, vi } from 'vitest'

import { createExperienceRuntime } from '../src/experience/createExperienceRuntime'

describe('createExperienceRuntime', () => {
  beforeEach(() => {
    document.documentElement.style.setProperty('--accent', 'red')
    document.documentElement.style.setProperty('--accent-soft', 'pink')
    document.documentElement.style.setProperty('--scene-wash', 'blue')
    document.body.className = ''
    document.body.innerHTML = '<div id="app"></div>'
  })

  it('creates a scoped gsap runtime and cleans up owned resources on destroy', () => {
    const revert = vi.fn()
    const registerPlugin = vi.fn()
    const context = vi.fn((callback) => {
      callback()
      return { revert }
    })
    const refresh = vi.fn()
    const createHeroTimeline = vi.fn()
    const createSectionTransitions = vi.fn()
    const heroCarouselController = { destroy: vi.fn() }
    const createHeroCarouselController = vi.fn(() => heroCarouselController)
    const backgroundController = { destroy: vi.fn(), setTheme: vi.fn() }
    const createBackgroundSystem = vi.fn(() => backgroundController)
    const themeController = { destroy: vi.fn(), toggle: vi.fn(), getCurrentTheme: vi.fn() }
    const createThemeController = vi.fn(() => themeController)
    const splitTextReveal = { destroy: vi.fn() }
    const createSplitTextReveal = vi.fn(() => splitTextReveal)
    const heroShaderLayer = { destroy: vi.fn(), setTheme: vi.fn(), refresh: vi.fn() }
    const createHeroShaderLayer = vi.fn(() => heroShaderLayer)
    const ScrollSmoother = { create: vi.fn(() => ({ kill: vi.fn() })) }
    const Flip = { getState: vi.fn(), from: vi.fn() }
    const Observer = { create: vi.fn(() => ({ kill: vi.fn() })) }
    const CustomEase = { create: vi.fn() }
    const SplitText = { version: 'mock' }
    const registerBrandEasing = vi.fn()
    const modules = {
      gsap: { registerPlugin, context },
      ScrollTrigger: { refresh },
      ScrollSmoother,
      Flip,
      Observer,
      CustomEase,
      SplitText,
      createHeroTimeline,
      createSectionTransitions,
      createHeroCarouselController,
      createBackgroundSystem,
      createThemeController,
      createSplitTextReveal,
      createHeroShaderLayer,
      registerBrandEasing,
    }

    const runtime = createExperienceRuntime({
      modules,
      motion: {
        reducedMotion: false,
        desktopMotion: true,
      },
      scopeElement: document.querySelector('#app'),
      heroProjects: [{ slug: 'agentos' }],
    })

    expect(registerPlugin).toHaveBeenCalledTimes(1)
    expect(context).toHaveBeenCalledTimes(1)
    expect(createHeroCarouselController).toHaveBeenCalledTimes(1)
    expect(createBackgroundSystem).toHaveBeenCalledTimes(1)
    expect(createHeroTimeline).toHaveBeenCalledTimes(1)
    expect(createSectionTransitions).toHaveBeenCalledTimes(1)
    expect(refresh).toHaveBeenCalledTimes(1)

    runtime.destroy()

    expect(revert).toHaveBeenCalledTimes(1)
    expect(heroCarouselController.destroy).toHaveBeenCalledTimes(1)
    expect(backgroundController.destroy).toHaveBeenCalledTimes(1)
    expect(document.documentElement.style.getPropertyValue('--accent')).toBe('')
    expect(document.documentElement.style.getPropertyValue('--accent-soft')).toBe('')
    expect(document.documentElement.style.getPropertyValue('--scene-wash')).toBe('')
  })
})
