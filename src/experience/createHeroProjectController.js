import {
  HERO_PROJECT_SWITCH_STATES,
  clampIndex,
  createHeroProjectSwitcherModel,
} from './heroProjectSwitcherModel'
import {
  collectHeroProjectSwitcherElements,
  syncHeroProjectSwitcherView,
} from './heroProjectSwitcherView'

const TRANSITION_RESET_MS = 420

function getScrollBehavior() {
  return window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ? 'auto' : 'smooth'
}

function prefersCoarsePointer() {
  return window.matchMedia?.('(pointer: coarse)')?.matches ?? false
}

export function createHeroProjectController({ scopeElement, projects = [] }) {
  const root = scopeElement?.querySelector('.js-hero-projects')

  if (!root || projects.length === 0) {
    return {
      destroy() {},
    }
  }

  const elements = collectHeroProjectSwitcherElements(root)
  const model = createHeroProjectSwitcherModel(projects)
  const touchMode = prefersCoarsePointer()
  const initialIndex = model.getProjectIndex(root.dataset.activeProject)

  let activeIndex = clampIndex(initialIndex < 0 ? 0 : initialIndex, projects.length)
  let committedIndex = activeIndex
  let switchState = HERO_PROJECT_SWITCH_STATES.idle
  let hasCommittedSelection = false
  let transitionResetTimeout = null
  let spotlightTimeout = null
  let spotlightElement = null

  function getProject(index = activeIndex) {
    return model.getProject(index)
  }

  function clearTransitionResetTimeout() {
    if (!transitionResetTimeout) {
      return
    }

    window.clearTimeout(transitionResetTimeout)
    transitionResetTimeout = null
  }

  function updateView() {
    syncHeroProjectSwitcherView({
      root,
      elements,
      activeProject: getProject(activeIndex),
      committedProject: getProject(committedIndex),
      activeIndex,
      committedIndex,
      projectIndex: model.projectIndex,
      switchState,
      touchMode,
    })
  }

  function setSwitchState(nextState) {
    switchState = nextState
    updateView()
  }

  function setActiveProject(slug) {
    const nextIndex = model.getProjectIndex(slug)

    if (nextIndex < 0) {
      return false
    }

    activeIndex = nextIndex
    updateView()
    return true
  }

  function previewProject(slug) {
    clearTransitionResetTimeout()

    if (!setActiveProject(slug)) {
      return
    }

    setSwitchState(HERO_PROJECT_SWITCH_STATES.candidate)
  }

  function commitActiveProject() {
    clearTransitionResetTimeout()
    committedIndex = activeIndex
    hasCommittedSelection = true
    setSwitchState(HERO_PROJECT_SWITCH_STATES.committed)
  }

  function restoreCommittedProject() {
    clearTransitionResetTimeout()
    activeIndex = committedIndex
    setSwitchState(hasCommittedSelection ? HERO_PROJECT_SWITCH_STATES.committed : HERO_PROJECT_SWITCH_STATES.idle)
  }

  function spotlightTarget(target) {
    if (!target) {
      return
    }

    if (spotlightElement && spotlightElement !== target) {
      delete spotlightElement.dataset.spotlight
    }

    spotlightElement = target
    target.dataset.spotlight = 'true'

    if (spotlightTimeout) {
      window.clearTimeout(spotlightTimeout)
    }

    spotlightTimeout = window.setTimeout(() => {
      delete target.dataset.spotlight
      spotlightElement = null
      spotlightTimeout = null
    }, 1600)
  }

  function navigateToProject(slug) {
    const project = model.getProjectBySlug(slug)
    const targetSelector = project?.links?.viewProject

    if (!targetSelector) {
      return
    }

    if (!targetSelector.startsWith('#')) {
      window.location.assign(targetSelector)
      return
    }

    const target = document.querySelector(targetSelector)

    if (!target) {
      if (typeof import.meta !== 'undefined' && import.meta.env?.DEV) {
        console.warn(`[hero] navigateToProject: no element found for "${targetSelector}"`)
      }
      return
    }

    setSwitchState(HERO_PROJECT_SWITCH_STATES.transition)
    spotlightTarget(target)
    target.scrollIntoView({
      behavior: getScrollBehavior(),
      block: 'start',
    })
    window.history.replaceState(null, '', targetSelector)
    transitionResetTimeout = window.setTimeout(() => {
      setSwitchState(
        hasCommittedSelection ? HERO_PROJECT_SWITCH_STATES.committed : HERO_PROJECT_SWITCH_STATES.idle,
      )
    }, TRANSITION_RESET_MS)
  }

  function getRailButton(target) {
    const railButton = target.closest?.('[data-project-rail]')

    if (!railButton || !root.contains(railButton)) {
      return null
    }

    return railButton
  }

  function handlePointerOver(event) {
    if (touchMode || switchState === HERO_PROJECT_SWITCH_STATES.transition) {
      return
    }

    const railButton = getRailButton(event.target)

    if (!railButton) {
      return
    }

    previewProject(railButton.dataset.projectRail)
  }

  function handlePointerLeave() {
    if (touchMode || switchState !== HERO_PROJECT_SWITCH_STATES.candidate) {
      return
    }

    restoreCommittedProject()
  }

  function handleFocusIn(event) {
    const railButton = getRailButton(event.target)

    if (!railButton || switchState === HERO_PROJECT_SWITCH_STATES.transition) {
      return
    }

    previewProject(railButton.dataset.projectRail)
  }

  function handleFocusOut(event) {
    if (root.contains(event.relatedTarget)) {
      return
    }

    if (switchState !== HERO_PROJECT_SWITCH_STATES.candidate) {
      return
    }

    restoreCommittedProject()
  }

  function handleClick(event) {
    const railButton = getRailButton(event.target)

    if (railButton) {
      setActiveProject(railButton.dataset.projectRail)
      commitActiveProject()
      return
    }

    const openTarget = event.target.closest?.('[data-project-open]')

    if (!openTarget || !root.contains(openTarget)) {
      return
    }

    event.preventDefault()
    const project = getProject(activeIndex)
    if (!project) return
    navigateToProject(project.slug)
  }

  function handleKeydown(event) {
    const railButton = getRailButton(event.target)
    const openTarget = event.target.closest?.('[data-project-open]')

    if (railButton) {
      const currentIndex = model.getProjectIndex(railButton.dataset.projectRail)
      const safeCurrentIndex = currentIndex < 0 ? activeIndex : currentIndex

      if (event.key === 'ArrowDown' || event.key === 'ArrowRight') {
        event.preventDefault()
        const nextIndex = clampIndex(safeCurrentIndex + 1, projects.length)
        const nextProject = getProject(nextIndex)

        previewProject(nextProject.slug)
        root.querySelector(`[data-project-rail="${nextProject.slug}"]`)?.focus()
        return
      }

      if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') {
        event.preventDefault()
        const nextIndex = clampIndex(safeCurrentIndex - 1, projects.length)
        const nextProject = getProject(nextIndex)

        previewProject(nextProject.slug)
        root.querySelector(`[data-project-rail="${nextProject.slug}"]`)?.focus()
        return
      }

      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault()
        setActiveProject(railButton.dataset.projectRail)
        commitActiveProject()
        return
      }
    }

    if (openTarget && (event.key === 'Enter' || event.key === ' ')) {
      event.preventDefault()
      const project = getProject(activeIndex)
      if (!project) return
      navigateToProject(project.slug)
      return
    }

    if (event.key === 'Escape') {
      event.preventDefault()
      restoreCommittedProject()
    }
  }

  root.addEventListener('pointerover', handlePointerOver)
  root.addEventListener('pointerleave', handlePointerLeave)
  root.addEventListener('focusin', handleFocusIn)
  root.addEventListener('focusout', handleFocusOut)
  root.addEventListener('click', handleClick)
  root.addEventListener('keydown', handleKeydown)

  updateView()

  return {
    destroy() {
      clearTransitionResetTimeout()

      if (spotlightTimeout) {
        window.clearTimeout(spotlightTimeout)
        spotlightTimeout = null
      }

      if (spotlightElement) {
        delete spotlightElement.dataset.spotlight
        spotlightElement = null
      }

      root.removeEventListener('pointerover', handlePointerOver)
      root.removeEventListener('pointerleave', handlePointerLeave)
      root.removeEventListener('focusin', handleFocusIn)
      root.removeEventListener('focusout', handleFocusOut)
      root.removeEventListener('click', handleClick)
      root.removeEventListener('keydown', handleKeydown)
      root.removeAttribute('data-touch-mode')
      root.removeAttribute('data-switch-state')
      root.removeAttribute('data-committed-project')
    },
  }
}
