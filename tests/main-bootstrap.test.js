// @vitest-environment jsdom

import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mockMatchMedia, setViewportSize } from './helpers/browserMocks'

// Mock the heavy dependencies so main.js can be imported safely in jsdom
vi.mock('../src/experience/bootstrapExperience', () => ({
  bootstrapExperience: vi.fn(),
}))
vi.mock('../src/experience/mountExperiencePage', () => ({
  mountExperiencePage: vi.fn().mockReturnValue({
    mobileHero: false,
    scopeElement: document.createElement('div'),
    heroVisual: document.createElement('div'),
  }),
}))
vi.mock('../src/style.css', () => ({}))

import { bootstrapExperience } from '../src/experience/bootstrapExperience'
import { mountExperiencePage } from '../src/experience/mountExperiencePage'

describe('main.js bootstrap wiring', () => {
  beforeEach(() => {
    document.body.className = ''
    document.body.innerHTML = '<div id="app"></div>'
    setViewportSize({ width: 1280, height: 800 })
    mockMatchMedia(() => false)
    vi.clearAllMocks()
  })

  it('calls mountExperiencePage then bootstrapExperience', async () => {
    await import('../src/main.js')

    expect(mountExperiencePage).toHaveBeenCalledOnce()
    expect(bootstrapExperience).toHaveBeenCalledOnce()
  })

  it('passes heroProjects from siteContent to bootstrapExperience', async () => {
    vi.resetModules()
    await import('../src/main.js')

    const callArgs = bootstrapExperience.mock.calls[0][0]
    expect(callArgs).toHaveProperty('heroProjects')
    expect(Array.isArray(callArgs.heroProjects)).toBe(true)
  })

  it('adds hero-mobile-mode class when mountExperiencePage returns mobileHero: true', async () => {
    vi.resetModules()
    mountExperiencePage.mockReturnValueOnce({
      mobileHero: true,
      scopeElement: document.createElement('div'),
      heroVisual: document.createElement('div'),
    })

    await import('../src/main.js')

    expect(document.body.classList.contains('hero-mobile-mode')).toBe(true)
  })
})
