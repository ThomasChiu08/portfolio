// @vitest-environment jsdom

import { describe, expect, it, vi, beforeEach } from 'vitest'
import { createContactCli } from '../src/experience/createContactCli'

function makeScope(message = '') {
  const div = document.createElement('div')
  div.innerHTML = `
    <input class="contact-cli__input" type="text" value="${message}" />
    <button class="contact-cli__execute"></button>
  `
  return div
}

beforeEach(() => {
  vi.stubGlobal('location', { href: '' })
})

describe('createContactCli — graceful no-op', () => {
  it('returns destroy() when scopeElement is missing', () => {
    const ctrl = createContactCli({ scopeElement: null, email: 'hi@test.com' })
    expect(typeof ctrl.destroy).toBe('function')
  })

  it('returns destroy() when email is missing', () => {
    const scope = makeScope()
    const ctrl = createContactCli({ scopeElement: scope, email: '' })
    expect(typeof ctrl.destroy).toBe('function')
  })
})

describe('createContactCli — send', () => {
  it('opens mailto with message on execute button click', () => {
    const scope = makeScope()
    scope.querySelector('.contact-cli__input').value = 'Hello there'
    createContactCli({ scopeElement: scope, email: 'hi@test.com' })
    scope.querySelector('.contact-cli__execute').click()
    expect(window.location.href).toContain('mailto:hi@test.com')
    expect(window.location.href).toContain('Hello%20there')
  })

  it('opens mailto on Enter keydown', () => {
    const scope = makeScope()
    scope.querySelector('.contact-cli__input').value = 'Hey'
    createContactCli({ scopeElement: scope, email: 'hi@test.com' })
    const event = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true })
    scope.querySelector('.contact-cli__input').dispatchEvent(event)
    expect(window.location.href).toContain('mailto:hi@test.com')
  })

  it('clears the input after send', () => {
    const scope = makeScope()
    const input = scope.querySelector('.contact-cli__input')
    input.value = 'message'
    createContactCli({ scopeElement: scope, email: 'hi@test.com' })
    scope.querySelector('.contact-cli__execute').click()
    expect(input.value).toBe('')
  })

  it('does not navigate when message is empty', () => {
    const scope = makeScope()
    window.location.href = ''
    createContactCli({ scopeElement: scope, email: 'hi@test.com' })
    scope.querySelector('.contact-cli__execute').click()
    expect(window.location.href).toBe('')
  })
})

describe('createContactCli — destroy', () => {
  it('removes event listeners so clicks no longer trigger send', () => {
    const scope = makeScope()
    scope.querySelector('.contact-cli__input').value = 'test'
    const ctrl = createContactCli({ scopeElement: scope, email: 'hi@test.com' })
    ctrl.destroy()
    window.location.href = ''
    scope.querySelector('.contact-cli__execute').click()
    expect(window.location.href).toBe('')
  })
})
