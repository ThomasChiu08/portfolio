export function createCleanupQueue() {
  const steps = []
  let destroyed = false

  return {
    add(step) {
      if (destroyed) {
        return step
      }

      if (typeof step === 'function') {
        steps.push(step)
      }

      return step
    },
    destroy() {
      if (destroyed) {
        return
      }

      destroyed = true

      for (const step of steps.splice(0)) {
        step()
      }
    },
  }
}
