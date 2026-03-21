const STORAGE_KEY = 'portfolio-theme'
const THEME_ATTR = 'data-theme'

export function createThemeController({ backgroundSystem, heroShaderLayer } = {}) {
  const root = document.documentElement

  function getSystemPreference() {
    try {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    } catch {
      return 'light'
    }
  }

  function getSavedTheme() {
    try {
      return localStorage.getItem(STORAGE_KEY)
    } catch {
      return null
    }
  }

  function saveTheme(theme) {
    try {
      localStorage.setItem(STORAGE_KEY, theme)
    } catch {
      // Private browsing — silently ignore
    }
  }

  function applyTheme(theme) {
    root.setAttribute(THEME_ATTR, theme)
    backgroundSystem?.setTheme?.(theme)
    heroShaderLayer?.setTheme?.(theme)

    const btn = document.querySelector('[data-theme-toggle]')
    if (btn) {
      btn.setAttribute('aria-pressed', String(theme === 'dark'))
      btn.setAttribute(
        'aria-label',
        theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode',
      )
    }
  }

  function getCurrentTheme() {
    return root.getAttribute(THEME_ATTR) ?? 'light'
  }

  function toggle() {
    const next = getCurrentTheme() === 'dark' ? 'light' : 'dark'
    applyTheme(next)
    saveTheme(next)
  }

  // System preference listener
  let mediaQuery = null
  try {
    mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
  } catch {
    // ignore
  }

  function handleSystemChange(e) {
    // Only auto-follow system if user hasn't saved a manual preference
    if (!getSavedTheme()) {
      applyTheme(e.matches ? 'dark' : 'light')
    }
  }

  mediaQuery?.addEventListener('change', handleSystemChange)

  // Toggle button click — delegated to document to survive re-renders
  function handleClick(e) {
    if (e.target?.closest('[data-theme-toggle]')) {
      toggle()
    }
  }

  document.addEventListener('click', handleClick)

  // Initialize
  const initialTheme = getSavedTheme() ?? getSystemPreference()
  applyTheme(initialTheme)

  return {
    toggle,
    getCurrentTheme,
    destroy() {
      mediaQuery?.removeEventListener('change', handleSystemChange)
      document.removeEventListener('click', handleClick)
      root.removeAttribute(THEME_ATTR)
    },
  }
}
