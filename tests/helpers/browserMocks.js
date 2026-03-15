import { vi } from 'vitest'

export function setViewportSize({ width, height, devicePixelRatio = 2 }) {
  Object.defineProperty(window, 'innerWidth', {
    configurable: true,
    writable: true,
    value: width,
  })
  Object.defineProperty(window, 'innerHeight', {
    configurable: true,
    writable: true,
    value: height,
  })
  Object.defineProperty(window, 'devicePixelRatio', {
    configurable: true,
    writable: true,
    value: devicePixelRatio,
  })
}

export function setNavigatorCapabilities({
  deviceMemory = 8,
  hardwareConcurrency = 8,
} = {}) {
  Object.defineProperty(navigator, 'deviceMemory', {
    configurable: true,
    value: deviceMemory,
  })
  Object.defineProperty(navigator, 'hardwareConcurrency', {
    configurable: true,
    value: hardwareConcurrency,
  })
}

export function mockMatchMedia(matchesForQuery) {
  Object.defineProperty(window, 'matchMedia', {
    configurable: true,
    writable: true,
    value: vi.fn().mockImplementation((query) => ({
      matches: matchesForQuery(query),
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  })
}
