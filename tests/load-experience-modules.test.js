// @vitest-environment jsdom

import { describe, expect, it, vi } from 'vitest'

// Mock all dynamic imports that loadExperienceModules uses
vi.mock('gsap', () => ({ default: { registerPlugin: vi.fn() } }))
vi.mock('gsap/ScrollTrigger', () => ({ ScrollTrigger: { version: 'mock' } }))
vi.mock('gsap/ScrollSmoother', () => ({ ScrollSmoother: { create: vi.fn() } }))
vi.mock('gsap/Flip', () => ({ Flip: { getState: vi.fn(), from: vi.fn() } }))
vi.mock('gsap/Observer', () => ({ Observer: { create: vi.fn() } }))
vi.mock('gsap/CustomEase', () => ({ CustomEase: { create: vi.fn() } }))
vi.mock('gsap/SplitText', () => ({ SplitText: { version: 'mock' } }))
vi.mock('../src/animations/heroTimeline', () => ({ createHeroTimeline: vi.fn() }))
vi.mock('../src/animations/sectionTransitions', () => ({ createSectionTransitions: vi.fn() }))
vi.mock('../src/experience/createHeroCarouselController', () => ({
  createHeroCarouselController: vi.fn(),
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
vi.mock('../src/webgl/createHeroShaderLayer', () => ({
  createHeroShaderLayer: vi.fn(),
}))
vi.mock('../src/animations/brandEasing', () => ({
  registerBrandEasing: vi.fn(),
}))

import { loadExperienceModules } from '../src/experience/loadExperienceModules'

describe('loadExperienceModules', () => {
  it('resolves all required modules', async () => {
    const modules = await loadExperienceModules()

    expect(modules).toHaveProperty('gsap')
    expect(modules).toHaveProperty('ScrollTrigger')
    expect(modules).toHaveProperty('ScrollSmoother')
    expect(modules).toHaveProperty('Flip')
    expect(modules).toHaveProperty('Observer')
    expect(modules).toHaveProperty('CustomEase')
    expect(modules).toHaveProperty('SplitText')
    expect(modules).toHaveProperty('createHeroTimeline')
    expect(modules).toHaveProperty('createSectionTransitions')
    expect(modules).toHaveProperty('createHeroCarouselController')
    expect(modules).toHaveProperty('createBackgroundSystem')
    expect(modules).toHaveProperty('createThemeController')
    expect(modules).toHaveProperty('createSplitTextReveal')
    expect(modules).toHaveProperty('createHeroShaderLayer')
    expect(modules).toHaveProperty('registerBrandEasing')
  })

  it('returns an object with exactly the expected keys', async () => {
    const modules = await loadExperienceModules()
    const keys = Object.keys(modules).sort()

    expect(keys).toEqual([
      'CustomEase',
      'Flip',
      'Observer',
      'ScrollSmoother',
      'ScrollTrigger',
      'SplitText',
      'createBackgroundSystem',
      'createHeroCarouselController',
      'createHeroShaderLayer',
      'createHeroTimeline',
      'createSectionTransitions',
      'createSplitTextReveal',
      'createThemeController',
      'gsap',
      'registerBrandEasing',
    ])
  })
})
