function getSectionId(section) {
  return section?.id || section?.dataset?.sceneSection || null
}

export function pickActiveSection(sections, viewportHeight = window.innerHeight) {
  const candidates = sections.filter(Boolean)

  if (!candidates.length) {
    return null
  }

  const anchorY = viewportHeight * 0.38
  let bestSection = candidates[0]
  let bestScore = Number.POSITIVE_INFINITY

  candidates.forEach((section) => {
    const rect = section.getBoundingClientRect()
    const visibleBias =
      rect.bottom > viewportHeight * 0.16 && rect.top < viewportHeight * 0.84 ? 0 : viewportHeight * 0.24
    const distance = Math.abs(rect.top - anchorY)
    const score = distance + visibleBias

    if (score < bestScore) {
      bestScore = score
      bestSection = section
    }
  })

  return getSectionId(bestSection)
}

export function createSectionStateController({
  scopeElement = document,
  onChange,
}) {
  const sections = Array.from(scopeElement.querySelectorAll('.section[id]'))
  let activeSection = pickActiveSection(sections) ?? 'hero'
  let rafId = 0

  function measure() {
    rafId = 0
    const nextSection = pickActiveSection(sections) ?? activeSection

    if (nextSection !== activeSection) {
      activeSection = nextSection
      onChange?.(nextSection)
    }
  }

  function schedule() {
    if (rafId) {
      return
    }

    rafId = window.requestAnimationFrame(measure)
  }

  window.addEventListener('scroll', schedule, { passive: true })
  window.addEventListener('resize', schedule)

  onChange?.(activeSection)

  return {
    getActiveSection() {
      return activeSection
    },
    destroy() {
      if (rafId) {
        window.cancelAnimationFrame(rafId)
      }

      window.removeEventListener('scroll', schedule, { passive: true })
      window.removeEventListener('resize', schedule)
    },
  }
}
