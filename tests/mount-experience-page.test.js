// @vitest-environment jsdom

import { beforeEach, describe, expect, it } from 'vitest'

import { siteContent, renderPage } from '../src/content/sections'
import { mountExperiencePage } from '../src/experience/mountExperiencePage'
import { mockMatchMedia } from './helpers/browserMocks'

describe('mountExperiencePage', () => {
  beforeEach(() => {
    document.title = ''
    document.head.innerHTML = '<meta name="description" content="stale">'
    document.body.innerHTML = '<div id="app"></div>'
    mockMatchMedia((query) => query === '(max-width: 760px)')
  })

  it('renders the page, updates metadata, and returns runtime refs', () => {
    const result = mountExperiencePage({
      content: siteContent,
      renderPage,
    })

    expect(document.title).toBe(siteContent.meta.title)
    expect(document.querySelector('meta[name="description"]')?.getAttribute('content')).toBe(
      siteContent.meta.description,
    )
    expect(document.querySelector('#hero')).not.toBeNull()
    expect(result.mobileHero).toBe(true)
    expect(result.scopeElement?.id).toBe('app')
    expect(result.heroVisual).not.toBeNull()
  })
})
