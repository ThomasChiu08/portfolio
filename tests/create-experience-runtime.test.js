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
    const heroProjectController = { destroy: vi.fn() }
    const createHeroProjectController = vi.fn(() => heroProjectController)
    const backgroundController = { destroy: vi.fn() }
    const createBackgroundSystem = vi.fn(() => backgroundController)
    const modules = {
      gsap: { registerPlugin, context },
      ScrollTrigger: { refresh },
      createHeroTimeline,
      createSectionTransitions,
      createHeroProjectController,
      createBackgroundSystem,
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
    expect(createHeroProjectController).toHaveBeenCalledTimes(1)
    expect(createBackgroundSystem).toHaveBeenCalledTimes(1)
    expect(createHeroTimeline).toHaveBeenCalledTimes(1)
    expect(createSectionTransitions).toHaveBeenCalledTimes(1)
    expect(refresh).toHaveBeenCalledTimes(1)

    runtime.destroy()

    expect(revert).toHaveBeenCalledTimes(1)
    expect(heroProjectController.destroy).toHaveBeenCalledTimes(1)
    expect(backgroundController.destroy).toHaveBeenCalledTimes(1)
    expect(document.documentElement.style.getPropertyValue('--accent')).toBe('')
    expect(document.documentElement.style.getPropertyValue('--accent-soft')).toBe('')
    expect(document.documentElement.style.getPropertyValue('--scene-wash')).toBe('')
  })
})
