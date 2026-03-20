// @vitest-environment jsdom

import { describe, expect, it } from 'vitest'
import { clamp, lerp, mapRange } from '../src/utils/math'

describe('clamp', () => {
  it('returns value when within range', () => {
    expect(clamp(5, 0, 10)).toBe(5)
  })

  it('clamps to min', () => {
    expect(clamp(-5, 0, 10)).toBe(0)
  })

  it('clamps to max', () => {
    expect(clamp(15, 0, 10)).toBe(10)
  })

  it('returns min when value equals min', () => {
    expect(clamp(0, 0, 10)).toBe(0)
  })

  it('returns max when value equals max', () => {
    expect(clamp(10, 0, 10)).toBe(10)
  })
})

describe('lerp', () => {
  it('returns start at amount 0', () => {
    expect(lerp(0, 100, 0)).toBe(0)
  })

  it('returns end at amount 1', () => {
    expect(lerp(0, 100, 1)).toBe(100)
  })

  it('returns midpoint at amount 0.5', () => {
    expect(lerp(0, 100, 0.5)).toBe(50)
  })

  it('interpolates between negative and positive', () => {
    expect(lerp(-50, 50, 0.5)).toBe(0)
  })
})

describe('mapRange', () => {
  it('maps min input to min output', () => {
    expect(mapRange(0, 0, 100, 0, 1)).toBe(0)
  })

  it('maps max input to max output', () => {
    expect(mapRange(100, 0, 100, 0, 1)).toBe(1)
  })

  it('maps midpoint correctly', () => {
    expect(mapRange(50, 0, 100, 0, 1)).toBe(0.5)
  })

  it('clamps below range to outMin', () => {
    expect(mapRange(-10, 0, 100, 0, 1)).toBe(0)
  })

  it('clamps above range to outMax', () => {
    expect(mapRange(200, 0, 100, 0, 1)).toBe(1)
  })

  it('maps to a different output range', () => {
    expect(mapRange(50, 0, 100, 200, 400)).toBe(300)
  })
})
