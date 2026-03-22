// @vitest-environment jsdom

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { siteContent, renderPage } from '../src/content/sections'
import { createHeroCarouselController } from '../src/experience/createHeroCarouselController'
import { mockMatchMedia } from './helpers/browserMocks'

describe('createHeroCarouselController', () => {
  let controller

  beforeEach(() => {
    mockMatchMedia(() => false)
    document.body.innerHTML = renderPage(siteContent)
    vi.useFakeTimers()
  })

  afterEach(() => {
    controller?.destroy()
    controller = null
    vi.useRealTimers()
  })

  it('returns null when no carousel element exists', () => {
    document.body.innerHTML = '<div></div>'
    const result = createHeroCarouselController({
      scopeElement: document.body,
      projects: siteContent.hero.projects,
    })
    expect(result).toBeNull()
  })

  it('returns null when projects array is empty', () => {
    const result = createHeroCarouselController({
      scopeElement: document.body,
      projects: [],
    })
    expect(result).toBeNull()
  })

  it('initializes with first slide active', () => {
    controller = createHeroCarouselController({
      scopeElement: document.body,
      projects: siteContent.hero.projects,
      reducedMotion: true,
    })

    expect(controller.activeIndex).toBe(0)
    expect(controller.playState).toBe('stopped')

    const slides = document.querySelectorAll('[data-carousel-slide]')
    expect(slides[0].dataset.active).toBe('true')
    expect(slides[0].hasAttribute('inert')).toBe(false)
    expect(slides[1].dataset.active).toBe('false')
    expect(slides[1].hasAttribute('inert')).toBe(true)
  })

  it('navigates to next and previous slides', () => {
    controller = createHeroCarouselController({
      scopeElement: document.body,
      projects: siteContent.hero.projects,
      reducedMotion: true,
    })

    controller.next()
    expect(controller.activeIndex).toBe(1)

    controller.next()
    expect(controller.activeIndex).toBe(2)

    controller.prev()
    expect(controller.activeIndex).toBe(1)
  })

  it('wraps around at boundaries', () => {
    const projects = siteContent.hero.projects
    controller = createHeroCarouselController({
      scopeElement: document.body,
      projects,
      reducedMotion: true,
    })

    // Go to last slide
    for (let i = 0; i < projects.length; i++) {
      controller.next()
    }
    // Should wrap to 0
    expect(controller.activeIndex).toBe(0)

    // Go backwards from 0
    controller.prev()
    expect(controller.activeIndex).toBe(projects.length - 1)
  })

  it('navigates by slug', () => {
    controller = createHeroCarouselController({
      scopeElement: document.body,
      projects: siteContent.hero.projects,
      reducedMotion: true,
    })

    controller.goToSlug('focusbox')
    expect(controller.activeIndex).toBe(1)
  })

  it('auto-plays when not in reduced motion mode', () => {
    controller = createHeroCarouselController({
      scopeElement: document.body,
      projects: siteContent.hero.projects,
      reducedMotion: false,
    })

    expect(controller.playState).toBe('playing')
    expect(controller.activeIndex).toBe(0)

    // Advance past autoplay interval
    vi.advanceTimersByTime(6000)
    expect(controller.activeIndex).toBe(1)

    vi.advanceTimersByTime(6000)
    expect(controller.activeIndex).toBe(2)
  })

  it('toggles play/pause', () => {
    controller = createHeroCarouselController({
      scopeElement: document.body,
      projects: siteContent.hero.projects,
      reducedMotion: false,
    })

    expect(controller.playState).toBe('playing')

    controller.togglePlay()
    expect(controller.playState).toBe('stopped')

    // Should not advance
    vi.advanceTimersByTime(6000)
    expect(controller.activeIndex).toBe(0)

    controller.togglePlay()
    expect(controller.playState).toBe('playing')
  })

  it('stops autoplay on manual navigation', () => {
    controller = createHeroCarouselController({
      scopeElement: document.body,
      projects: siteContent.hero.projects,
      reducedMotion: false,
    })

    // Manual navigation via dot click
    const dot = document.querySelector('[data-carousel-dot-index="2"]')
    dot.click()

    expect(controller.activeIndex).toBe(2)
    expect(controller.playState).toBe('stopped')
  })

  it('navigates via prev/next button clicks', () => {
    controller = createHeroCarouselController({
      scopeElement: document.body,
      projects: siteContent.hero.projects,
      reducedMotion: true,
    })

    document.querySelector('[data-carousel-next]').click()
    expect(controller.activeIndex).toBe(1)

    document.querySelector('[data-carousel-prev]').click()
    expect(controller.activeIndex).toBe(0)
  })

  it('handles keyboard arrow navigation', () => {
    controller = createHeroCarouselController({
      scopeElement: document.body,
      projects: siteContent.hero.projects,
      reducedMotion: true,
    })

    const carousel = document.querySelector('.js-hero-carousel')

    carousel.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }))
    expect(controller.activeIndex).toBe(1)

    carousel.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }))
    expect(controller.activeIndex).toBe(0)
  })

  it('updates ARIA attributes on slide change', () => {
    controller = createHeroCarouselController({
      scopeElement: document.body,
      projects: siteContent.hero.projects,
      reducedMotion: true,
    })

    const dots = document.querySelectorAll('[data-carousel-dot]')
    expect(dots[0].getAttribute('aria-current')).toBe('true')
    expect(dots[1].hasAttribute('aria-current')).toBe(false)

    controller.next()

    expect(dots[0].hasAttribute('aria-current')).toBe(false)
    expect(dots[1].getAttribute('aria-current')).toBe('true')
  })

  it('calls onSlideChange callback', () => {
    const onSlideChange = vi.fn()

    controller = createHeroCarouselController({
      scopeElement: document.body,
      projects: siteContent.hero.projects,
      reducedMotion: true,
      onSlideChange,
    })

    controller.next()
    expect(onSlideChange).toHaveBeenCalledWith('focusbox')

    controller.next()
    expect(onSlideChange).toHaveBeenCalledWith('trading-research-system')
  })

  it('cleans up on destroy', () => {
    controller = createHeroCarouselController({
      scopeElement: document.body,
      projects: siteContent.hero.projects,
      reducedMotion: false,
    })

    controller.destroy()

    // Should not throw after destroy
    vi.advanceTimersByTime(6000)
    controller = null // prevent double destroy in afterEach
  })
})
