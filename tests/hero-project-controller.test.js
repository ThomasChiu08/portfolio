// @vitest-environment jsdom

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { siteContent, renderPage } from '../src/content/sections'
import { createHeroProjectController } from '../src/experience/createHeroProjectController'
import { mockMatchMedia } from './helpers/browserMocks'

describe('createHeroProjectController', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    document.body.innerHTML = `<div id="app">${renderPage(siteContent)}</div>`
    mockMatchMedia(() => false)
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('previews a memo on rail hover and restores the committed selection on leave', () => {
    const controller = createHeroProjectController({
      scopeElement: document.querySelector('#app'),
      projects: siteContent.hero.projects,
    })
    const root = document.querySelector('.js-hero-projects')
    const focusboxRail = document.querySelector('[data-project-rail="focusbox"]')

    focusboxRail.dispatchEvent(new Event('pointerover', { bubbles: true }))

    expect(root?.dataset.activeProject).toBe('focusbox')
    expect(root?.dataset.switchState).toBe('candidate')
    expect(focusboxRail?.dataset.active).toBe('true')

    root?.dispatchEvent(new Event('pointerleave', { bubbles: true }))

    expect(root?.dataset.activeProject).toBe('agentos')
    expect(root?.dataset.switchState).toBe('idle')

    controller.destroy()
  })

  it('commits a memo on rail click and opens it only from the CTA', () => {
    const controller = createHeroProjectController({
      scopeElement: document.querySelector('#app'),
      projects: siteContent.hero.projects,
    })
    const root = document.querySelector('.js-hero-projects')
    const focusboxRail = document.querySelector('[data-project-rail="focusbox"]')
    const openButton = document.querySelector('[data-project-open]')
    const focusboxSection = document.querySelector('#focusbox')
    const scrollIntoView = vi.fn()

    focusboxSection.scrollIntoView = scrollIntoView
    focusboxRail.click()

    expect(root?.dataset.activeProject).toBe('focusbox')
    expect(root?.dataset.committedProject).toBe('focusbox')
    expect(root?.dataset.switchState).toBe('committed')
    expect(scrollIntoView).not.toHaveBeenCalled()

    openButton.click()

    expect(root?.dataset.switchState).toBe('transition')
    expect(scrollIntoView).toHaveBeenCalledWith({
      behavior: 'smooth',
      block: 'start',
    })

    vi.advanceTimersByTime(421)

    expect(root?.dataset.switchState).toBe('committed')

    controller.destroy()
  })

  it('uses keyboard arrows to preview, enter to commit, and enter on CTA to open', () => {
    const controller = createHeroProjectController({
      scopeElement: document.querySelector('#app'),
      projects: siteContent.hero.projects,
    })
    const root = document.querySelector('.js-hero-projects')
    const agentRail = document.querySelector('[data-project-rail="agentos"]')
    const openButton = document.querySelector('[data-project-open]')
    const focusboxSection = document.querySelector('#focusbox')
    const scrollIntoView = vi.fn()

    focusboxSection.scrollIntoView = scrollIntoView
    agentRail.focus()
    agentRail.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }))

    expect(root?.dataset.activeProject).toBe('focusbox')
    expect(root?.dataset.switchState).toBe('candidate')

    const focusboxRail = document.querySelector('[data-project-rail="focusbox"]')
    focusboxRail.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }))

    expect(root?.dataset.switchState).toBe('committed')
    expect(root?.dataset.committedProject).toBe('focusbox')
    expect(scrollIntoView).not.toHaveBeenCalled()

    openButton.focus()
    openButton.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }))

    expect(root?.dataset.switchState).toBe('transition')
    expect(scrollIntoView).toHaveBeenCalledTimes(1)

    controller.destroy()
  })

  it('uses tap to select a memo and CTA tap to open on touch devices', () => {
    mockMatchMedia((query) => query === '(pointer: coarse)')
    document.body.innerHTML = `<div id="app">${renderPage(siteContent)}</div>`

    const controller = createHeroProjectController({
      scopeElement: document.querySelector('#app'),
      projects: siteContent.hero.projects,
    })
    const root = document.querySelector('.js-hero-projects')
    const focusboxRail = document.querySelector('[data-project-rail="focusbox"]')
    const openButton = document.querySelector('[data-project-open]')
    const focusboxSection = document.querySelector('#focusbox')
    const scrollIntoView = vi.fn()

    focusboxSection.scrollIntoView = scrollIntoView
    focusboxRail.click()

    expect(root?.dataset.switchState).toBe('committed')
    expect(root?.dataset.activeProject).toBe('focusbox')
    expect(scrollIntoView).not.toHaveBeenCalled()

    openButton.click()

    expect(root?.dataset.switchState).toBe('transition')
    expect(scrollIntoView).toHaveBeenCalledTimes(1)

    controller.destroy()
  })
})
