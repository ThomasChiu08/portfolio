// @vitest-environment jsdom

import { describe, expect, it, vi, beforeEach } from 'vitest'
import { mockMatchMedia } from './helpers/browserMocks'
import { createThemeController } from '../src/experience/createThemeController'

beforeEach(() => {
  document.documentElement.removeAttribute('data-theme')
  localStorage.clear()
  mockMatchMedia(() => false) // default: light system preference
})

describe('createThemeController — initialization', () => {
  it('applies light theme when no saved preference and system is light', () => {
    createThemeController()
    expect(document.documentElement.getAttribute('data-theme')).toBe('light')
  })

  it('applies dark theme when system prefers dark and no saved preference', () => {
    mockMatchMedia((q) => q === '(prefers-color-scheme: dark)')
    createThemeController()
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark')
  })

  it('applies saved preference over system preference', () => {
    localStorage.setItem('portfolio-theme', 'dark')
    mockMatchMedia(() => false) // system is light but saved is dark
    createThemeController()
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark')
  })
})

describe('createThemeController — toggle', () => {
  it('toggles from light to dark', () => {
    const ctrl = createThemeController()
    ctrl.toggle()
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark')
  })

  it('toggles from dark back to light', () => {
    localStorage.setItem('portfolio-theme', 'dark')
    const ctrl = createThemeController()
    ctrl.toggle()
    expect(document.documentElement.getAttribute('data-theme')).toBe('light')
  })

  it('persists theme to localStorage after toggle', () => {
    const ctrl = createThemeController()
    ctrl.toggle()
    expect(localStorage.getItem('portfolio-theme')).toBe('dark')
  })

  it('getCurrentTheme returns the active theme', () => {
    const ctrl = createThemeController()
    expect(ctrl.getCurrentTheme()).toBe('light')
    ctrl.toggle()
    expect(ctrl.getCurrentTheme()).toBe('dark')
  })
})

describe('createThemeController — theme toggle button', () => {
  it('updates aria-pressed on toggle button when theme changes', () => {
    document.body.innerHTML = '<button data-theme-toggle aria-pressed="false"></button>'
    const ctrl = createThemeController()
    ctrl.toggle()
    const btn = document.querySelector('[data-theme-toggle]')
    expect(btn.getAttribute('aria-pressed')).toBe('true')
  })

  it('delegates toggle to backgroundSystem.setTheme', () => {
    const backgroundSystem = { setTheme: vi.fn() }
    const ctrl = createThemeController({ backgroundSystem })
    ctrl.toggle()
    expect(backgroundSystem.setTheme).toHaveBeenCalledWith('dark')
  })
})

describe('createThemeController — destroy', () => {
  it('removes data-theme attribute on destroy', () => {
    const ctrl = createThemeController()
    ctrl.destroy()
    expect(document.documentElement.hasAttribute('data-theme')).toBe(false)
  })
})
