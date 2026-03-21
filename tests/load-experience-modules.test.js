// @vitest-environment jsdom

import { describe, expect, it, vi } from 'vitest'

// Mock all dynamic imports that loadExperienceModules uses
vi.mock('gsap', () => ({ default: { registerPlugin: vi.fn() } }))
vi.mock('gsap/ScrollTrigger', () => ({ ScrollTrigger: { version: 'mock' } }))
vi.mock('../src/animations/heroTimeline', () => ({ createHeroTimeline: vi.fn() }))
vi.mock('../src/animations/sectionTransitions', () => ({ createSectionTransitions: vi.fn() }))
vi.mock('../src/experience/createHeroProjectController', () => ({
  createHeroProjectController: vi.fn(),
}))
vi.mock('../src/background/createBackgroundSystem', () => ({
  createBackgroundSystem: vi.fn(),
}))
vi.mock('../src/experience/createThemeController', () => ({
  createThemeController: vi.fn(),
}))
vi.mock('../src/animations/splitTextReveal', () => ({
  createSplitTextReveal: vi.fn(),
}))

import { loadExperienceModules } from '../src/experience/loadExperienceModules'

describe('loadExperienceModules', () => {
  it('resolves all required modules', async () => {
    const modules = await loadExperienceModules()

    expect(modules).toHaveProperty('gsap')
    expect(modules).toHaveProperty('ScrollTrigger')
    expect(modules).toHaveProperty('createHeroTimeline')
    expect(modules).toHaveProperty('createSectionTransitions')
    expect(modules).toHaveProperty('createHeroProjectController')
    expect(modules).toHaveProperty('createBackgroundSystem')
    expect(modules).toHaveProperty('createThemeController')
    expect(modules).toHaveProperty('createSplitTextReveal')
  })

  it('returns an object with exactly the expected keys', async () => {
    const modules = await loadExperienceModules()
    const keys = Object.keys(modules).sort()

    expect(keys).toEqual([
      'ScrollTrigger',
      'createBackgroundSystem',
      'createHeroProjectController',
      'createHeroTimeline',
      'createSectionTransitions',
      'createSplitTextReveal',
      'createThemeController',
      'gsap',
    ])
  })
})
