import { describe, expect, it } from 'vitest'

import {
  HERO_PROJECT_SWITCH_STATES,
  clampIndex,
  createHeroProjectSwitcherModel,
  formatProjectIndex,
} from '../src/experience/heroProjectSwitcherModel'

describe('heroProjectSwitcherModel', () => {
  const projects = [
    {
      slug: 'agentos',
      stage: 'Active build',
      name: 'agentOS',
    },
    {
      slug: 'focusbox',
      stage: 'Product design',
      name: 'FocusBox',
    },
  ]

  it('wraps indexes and formats project numbers', () => {
    expect(clampIndex(-1, projects.length)).toBe(1)
    expect(clampIndex(2, projects.length)).toBe(0)
    expect(clampIndex(0, 0)).toBe(0)
    expect(formatProjectIndex(0)).toBe('01')
    expect(formatProjectIndex(9)).toBe('10')
  })

  it('resolves project lookups from slug and index', () => {
    const model = createHeroProjectSwitcherModel(projects)

    expect(model.getProject(0)).toBe(projects[0])
    expect(model.getProject(3)).toBe(projects[1])
    expect(model.getProjectIndex('focusbox')).toBe(1)
    expect(model.getProjectIndex('missing')).toBe(-1)
    expect(model.getProjectBySlug('agentos')).toBe(projects[0])
    expect(model.getProjectBySlug('missing')).toBeNull()
    expect(model.getProjectNumber('focusbox')).toBe('02')
    expect(model.getProjectNumber('missing')).toBe('01')
  })

  it('exposes frozen switch state enum', () => {
    expect(HERO_PROJECT_SWITCH_STATES.idle).toBe('idle')
    expect(HERO_PROJECT_SWITCH_STATES.candidate).toBe('candidate')
    expect(HERO_PROJECT_SWITCH_STATES.committed).toBe('committed')
    expect(HERO_PROJECT_SWITCH_STATES.transition).toBe('transition')
    expect(Object.isFrozen(HERO_PROJECT_SWITCH_STATES)).toBe(true)
  })
})
