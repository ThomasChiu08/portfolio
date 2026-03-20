import { describe, expect, it, vi } from 'vitest'

import { createCleanupQueue } from '../src/experience/createCleanupQueue'

describe('createCleanupQueue', () => {
  it('runs cleanup steps in registration order', () => {
    const queue = createCleanupQueue()
    const order = []

    queue.add(() => order.push('first'))
    queue.add(() => order.push('second'))
    queue.add(() => order.push('third'))

    queue.destroy()

    expect(order).toEqual(['first', 'second', 'third'])
  })

  it('ignores non-function cleanup registrations', () => {
    const queue = createCleanupQueue()
    const step = vi.fn()

    queue.add(step)
    queue.add(null)
    queue.add(undefined)
    queue.destroy()

    expect(step).toHaveBeenCalledTimes(1)
  })

  it('is idempotent across repeated destroy calls', () => {
    const queue = createCleanupQueue()
    const step = vi.fn()

    queue.add(step)
    queue.destroy()
    queue.destroy()
    queue.add(() => step())

    expect(step).toHaveBeenCalledTimes(1)
  })
})
