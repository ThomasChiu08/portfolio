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

    const runtime = createExperienceRuntime({
      gsap: { registerPlugin, context },
      ScrollTrigger: { refresh },
      createHeroTimeline,
      createSectionTransitions,
      reducedMotion: false,
      desktopMotion: true,
      scopeElement: document.querySelector('#app'),
      heroVisual: document.createElement('div'),
    })

    expect(registerPlugin).toHaveBeenCalledTimes(1)
    expect(context).toHaveBeenCalledTimes(1)
    expect(createHeroTimeline).toHaveBeenCalledTimes(1)
    expect(createSectionTransitions).toHaveBeenCalledTimes(1)
    expect(refresh).toHaveBeenCalledTimes(1)

    runtime.destroy()

    expect(revert).toHaveBeenCalledTimes(1)
    expect(document.documentElement.style.getPropertyValue('--accent')).toBe('')
    expect(document.documentElement.style.getPropertyValue('--accent-soft')).toBe('')
    expect(document.documentElement.style.getPropertyValue('--scene-wash')).toBe('')
  })
})
