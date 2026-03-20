// @vitest-environment jsdom

import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mockMatchMedia } from './helpers/browserMocks'

// Mock loadExperienceModules so we don't spin up real GSAP/canvas
vi.mock('../src/experience/loadExperienceModules', () => ({
  loadExperienceModules: vi.fn().mockResolvedValue({
    gsap: {},
    ScrollTrigger: {},
    createHeroTimeline: vi.fn(),
    createSectionTransitions: vi.fn(),
    createHeroProjectController: vi.fn(),
    createBackgroundSystem: vi.fn(),
  }),
}))

// Mock createExperienceRuntime
vi.mock('../src/experience/createExperienceRuntime', () => ({
  createExperienceRuntime: vi.fn().mockReturnValue({ destroy: vi.fn() }),
}))

import { bootstrapExperience } from '../src/experience/bootstrapExperience'
import { createExperienceRuntime } from '../src/experience/createExperienceRuntime'

describe('bootstrapExperience', () => {
  beforeEach(() => {
    document.body.className = ''
    mockMatchMedia(() => false)
    vi.clearAllMocks()
  })

  it('calls createExperienceRuntime with motion and scopeElement', async () => {
    const scopeElement = document.createElement('div')
    const motion = { reducedMotion: false, desktopMotion: true }

    await bootstrapExperience({ motion, scopeElement, heroProjects: [] })

    expect(createExperienceRuntime).toHaveBeenCalledWith(
      expect.objectContaining({ motion, scopeElement }),
    )
  })

  it('adds motion-disabled class when loadExperienceModules throws', async () => {
    const { loadExperienceModules } = await import('../src/experience/loadExperienceModules')
    loadExperienceModules.mockRejectedValueOnce(new Error('load failed'))

    await bootstrapExperience({
      motion: { reducedMotion: false, desktopMotion: true },
      scopeElement: document.createElement('div'),
      heroProjects: [],
    })

    expect(document.body.classList.contains('motion-disabled')).toBe(true)
  })
})
