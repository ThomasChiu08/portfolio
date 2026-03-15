function clampIndex(value, length) {
  return ((value % length) + length) % length
}

function getScrollBehavior() {
  return window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'
}

export function createHeroProjectController({ scopeElement, projects = [] }) {
  const root = scopeElement?.querySelector('.js-hero-projects')

  if (!root || projects.length === 0) {
    return {
      destroy() {},
    }
  }

  const cards = Array.from(root.querySelectorAll('[data-project-card]'))
  const projectIndex = new Map(projects.map((project, index) => [project.slug, index]))
  let activeIndex = clampIndex(projectIndex.get(root.dataset.activeProject) ?? 0, projects.length)
  let spotlightTimeout = null

  function getActiveProject() {
    return projects[activeIndex]
  }

  function updateCards() {
    cards.forEach((card) => {
      const cardIndex = projectIndex.get(card.dataset.projectCard)
      const stackPosition = clampIndex(cardIndex - activeIndex, projects.length)
      const isActive = cardIndex === activeIndex

      card.dataset.stackPosition = String(stackPosition)
      card.dataset.active = isActive ? 'true' : 'false'
      card.style.zIndex = String(projects.length - stackPosition)
      card.tabIndex = isActive ? 0 : -1
      card.setAttribute('aria-current', isActive ? 'true' : 'false')
    })

    root.dataset.activeProject = getActiveProject().slug
  }

  function setActiveProject(slug) {
    const nextIndex = projectIndex.get(slug)

    if (typeof nextIndex !== 'number' || nextIndex === activeIndex) {
      return
    }

    activeIndex = nextIndex
    updateCards()
  }

  function spotlightTarget(target) {
    if (!target) {
      return
    }

    target.dataset.spotlight = 'true'

    if (spotlightTimeout) {
      window.clearTimeout(spotlightTimeout)
    }

    spotlightTimeout = window.setTimeout(() => {
      delete target.dataset.spotlight
      spotlightTimeout = null
    }, 1600)
  }

  function navigateToProject(slug) {
    const project = projects[projectIndex.get(slug)]
    const targetSelector = project?.links?.viewProject

    if (!targetSelector || !targetSelector.startsWith('#')) {
      return
    }

    const target = document.querySelector(targetSelector)

    if (!target) {
      return
    }

    spotlightTarget(target)
    target.scrollIntoView({
      behavior: getScrollBehavior(),
      block: 'start',
    })
    window.history.replaceState(null, '', targetSelector)
  }

  function handlePointerOver(event) {
    const card = event.target.closest('[data-project-card]')

    if (!card || !root.contains(card)) {
      return
    }

    setActiveProject(card.dataset.projectCard)
  }

  function handleFocusIn(event) {
    const card = event.target.closest('[data-project-card]')

    if (!card || !root.contains(card)) {
      return
    }

    setActiveProject(card.dataset.projectCard)
  }

  function handleClick(event) {
    const card = event.target.closest('[data-project-card]')

    if (!card || !root.contains(card)) {
      return
    }

    setActiveProject(card.dataset.projectCard)
    navigateToProject(card.dataset.projectCard)
  }

  function handleKeydown(event) {
    const card = event.target.closest('[data-project-card]')

    if (!card || !root.contains(card)) {
      return
    }

    if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') {
      return
    }

    event.preventDefault()
    const direction = event.key === 'ArrowRight' ? 1 : -1
    const nextIndex = clampIndex(activeIndex + direction, projects.length)
    const nextProject = projects[nextIndex]

    setActiveProject(nextProject.slug)
    root.querySelector(`[data-project-card="${nextProject.slug}"]`)?.focus()
  }

  root.addEventListener('pointerover', handlePointerOver)
  root.addEventListener('focusin', handleFocusIn)
  root.addEventListener('click', handleClick)
  root.addEventListener('keydown', handleKeydown)

  updateCards()

  return {
    destroy() {
      if (spotlightTimeout) {
        window.clearTimeout(spotlightTimeout)
      }

      root.removeEventListener('pointerover', handlePointerOver)
      root.removeEventListener('focusin', handleFocusIn)
      root.removeEventListener('click', handleClick)
      root.removeEventListener('keydown', handleKeydown)
    },
  }
}
