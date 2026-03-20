import { describe, expect, it } from 'vitest'

import { pickActiveSection } from '../../src/background/createSectionStateController'

function createSection(id, top, height = 320) {
  return {
    id,
    getBoundingClientRect() {
      return {
        top,
        bottom: top + height,
      }
    },
  }
}

describe('sectionStateController', () => {
  it('picks the section nearest the reading anchor', () => {
    const viewportHeight = 1000
    const sections = [
      createSection('hero', -420),
      createSection('projects', 80),
      createSection('research', 360),
      createSection('about', 760),
    ]

    expect(pickActiveSection(sections, viewportHeight)).toBe('research')
  })

  it('favors visible sections over distant offscreen ones', () => {
    const viewportHeight = 1000
    const sections = [
      createSection('hero', -900),
      createSection('projects', -540),
      createSection('research', 1200),
      createSection('about', 180),
    ]

    expect(pickActiveSection(sections, viewportHeight)).toBe('about')
  })
})
