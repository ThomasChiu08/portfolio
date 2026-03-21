// @vitest-environment jsdom
// Contract test: renderPage() must emit the DOM selectors that runtime controllers depend on.
// This guards against selector regressions during the sections.js refactor.

import { describe, expect, it, beforeEach } from 'vitest'
import { renderPage } from '../src/content/sections'

beforeEach(() => {
  document.body.innerHTML = renderPage()
})

describe('renderPage DOM contract', () => {
  describe('background system (createBackgroundSystem)', () => {
    it('emits .scene-shell', () => {
      expect(document.querySelector('.scene-shell')).not.toBeNull()
    })

    it('emits .scene-shell__signals canvas', () => {
      expect(document.querySelector('.scene-shell__signals')).not.toBeNull()
    })
  })

  describe('theme controller (createThemeController)', () => {
    it('emits [data-theme-toggle] button', () => {
      expect(document.querySelector('[data-theme-toggle]')).not.toBeNull()
    })
  })

  describe('CLI contact form (createContactCli)', () => {
    it('emits .contact-cli__input', () => {
      expect(document.querySelector('.contact-cli__input')).not.toBeNull()
    })

    it('emits .contact-cli__execute', () => {
      expect(document.querySelector('.contact-cli__execute')).not.toBeNull()
    })
  })

  describe('SplitText animation (splitTextReveal)', () => {
    it('emits at least one .js-split-title', () => {
      expect(document.querySelectorAll('.js-split-title').length).toBeGreaterThan(0)
    })
  })

  describe('section state logic', () => {
    it('emits .section elements with id attributes', () => {
      const sections = document.querySelectorAll('.section[id]')
      expect(sections.length).toBeGreaterThan(0)
    })
  })

  describe('hero project controller (createHeroProjectController)', () => {
    it('emits .js-hero-projects', () => {
      expect(document.querySelector('.js-hero-projects')).not.toBeNull()
    })

    it('emits #hero-project-surface', () => {
      expect(document.querySelector('#hero-project-surface')).not.toBeNull()
    })

    it('emits [data-active-project]', () => {
      expect(document.querySelector('[data-active-project]')).not.toBeNull()
    })
  })
})
