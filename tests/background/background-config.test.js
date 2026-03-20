import { describe, expect, it } from 'vitest'

import { backgroundSectionOrder, getBackgroundState } from '../../src/background/backgroundConfig'

describe('backgroundConfig', () => {
  it('returns cloned state objects and falls back to hero', () => {
    const heroState = getBackgroundState('hero')
    heroState.accent[0] = 0

    expect(getBackgroundState('hero').accent[0]).toBe(112)
    expect(getBackgroundState('missing-section')).toEqual(getBackgroundState('hero'))
  })

  it('keeps the section order stable', () => {
    expect(backgroundSectionOrder).toEqual(['hero', 'projects', 'research', 'about', 'contact'])
  })
})
