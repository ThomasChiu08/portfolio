import { describe, expect, it } from 'vitest'

import { renderGlassyButton } from '../src/content/glassyButton'

describe('renderGlassyButton', () => {
  it('renders an icon-only anchor button with default structure', () => {
    const markup = renderGlassyButton({
      href: '#hero',
      icon: 'home',
      ariaLabel: 'Back to top',
      size: 'sm',
    })

    expect(markup).toContain('<a ')
    expect(markup).toContain('class="glassy-button glassy-button--icon"')
    expect(markup).toContain('href="#hero"')
    expect(markup).toContain('aria-label="Back to top"')
    expect(markup).toContain('data-size="sm"')
    expect(markup).toContain('glassy-button__surface')
    expect(markup).toContain('glassy-button__icon')
  })

  it('renders a pill button with label, icon, and passthrough attributes', () => {
    const markup = renderGlassyButton({
      label: 'Open memo',
      icon: 'arrow-up-right',
      tone: 'warm',
      attributes: {
        'data-project-open': true,
      },
    })

    expect(markup).toContain('<button ')
    expect(markup).toContain('class="glassy-button glassy-button--pill"')
    expect(markup).toContain('type="button"')
    expect(markup).toContain('data-tone="warm"')
    expect(markup).toContain('data-project-open')
    expect(markup).toContain('glassy-button__label">Open memo<')
  })
})
