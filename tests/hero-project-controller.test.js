// @vitest-environment jsdom

import { beforeEach, describe, expect, it, vi } from 'vitest'

import { siteContent, renderPage } from '../src/content/sections'
import { createHeroProjectController } from '../src/experience/createHeroProjectController'

describe('createHeroProjectController', () => {
  beforeEach(() => {
    document.body.innerHTML = `<div id="app">${renderPage(siteContent)}</div>`
  })

  it('brings hovered and focused cards to the front', () => {
    const controller = createHeroProjectController({
      scopeElement: document.querySelector('#app'),
      projects: siteContent.hero.projects,
    })
    const root = document.querySelector('.js-hero-projects')
    const focusboxCard = document.querySelector('[data-project-card="focusbox"]')
    const quantCard = document.querySelector('[data-project-card="trading-research-system"]')

    focusboxCard.dispatchEvent(new Event('pointerover', { bubbles: true }))

    expect(root?.dataset.activeProject).toBe('focusbox')
    expect(focusboxCard?.dataset.active).toBe('true')
    expect(focusboxCard?.dataset.stackPosition).toBe('0')

    quantCard.dispatchEvent(new FocusEvent('focusin', { bubbles: true }))

    expect(root?.dataset.activeProject).toBe('trading-research-system')
    expect(quantCard?.dataset.active).toBe('true')
    expect(quantCard?.dataset.stackPosition).toBe('0')

    controller.destroy()
  })

  it('scrolls to the matching project section when a card is clicked', () => {
    const controller = createHeroProjectController({
      scopeElement: document.querySelector('#app'),
      projects: siteContent.hero.projects,
    })
    const focusboxCard = document.querySelector('[data-project-card="focusbox"]')
    const focusboxSection = document.querySelector('#focusbox')
    const scrollIntoView = vi.fn()

    focusboxSection.scrollIntoView = scrollIntoView
    focusboxCard.click()

    expect(scrollIntoView).toHaveBeenCalledWith({
      behavior: 'smooth',
      block: 'start',
    })
    expect(focusboxSection?.dataset.spotlight).toBe('true')

    controller.destroy()
  })

  it('cycles cards with arrow keys', () => {
    const controller = createHeroProjectController({
      scopeElement: document.querySelector('#app'),
      projects: siteContent.hero.projects,
    })
    const root = document.querySelector('.js-hero-projects')
    const agentCard = document.querySelector('[data-project-card="agentos"]')

    agentCard.focus()
    agentCard.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }))

    expect(root?.dataset.activeProject).toBe('focusbox')

    agentCard.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }))
    expect(root?.dataset.activeProject).toBe('agentos')

    controller.destroy()
  })
})
