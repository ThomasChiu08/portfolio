export const HERO_PROJECT_SWITCH_STATES = Object.freeze({
  idle: 'idle',
  candidate: 'candidate',
  committed: 'committed',
  transition: 'transition',
})

export function clampIndex(value, length) {
  if (length <= 0) {
    return 0
  }

  return ((value % length) + length) % length
}

export function formatProjectIndex(index) {
  return String(index + 1).padStart(2, '0')
}

export function createHeroProjectSwitcherModel(projects) {
  const projectIndex = new Map(projects.map((project, index) => [project.slug, index]))

  function getProject(index = 0) {
    return projects[clampIndex(index, projects.length)]
  }

  function getProjectIndex(slug) {
    return projectIndex.get(slug) ?? -1
  }

  function getProjectBySlug(slug) {
    const index = getProjectIndex(slug)

    return index < 0 ? null : projects[index]
  }

  function getProjectNumber(slug) {
    const index = getProjectIndex(slug)

    return formatProjectIndex(index < 0 ? 0 : index)
  }

  return {
    projectIndex,
    getProject,
    getProjectIndex,
    getProjectBySlug,
    getProjectNumber,
  }
}

export function getDeckNote({ state, touchMode }) {
  if (state === HERO_PROJECT_SWITCH_STATES.candidate) {
    return touchMode ? 'Tap to select memo' : 'Click to pin memo'
  }

  if (state === HERO_PROJECT_SWITCH_STATES.committed) {
    return touchMode ? 'Tap open memo' : 'Pinned selection'
  }

  if (state === HERO_PROJECT_SWITCH_STATES.transition) {
    return 'Opening memo'
  }

  return touchMode ? 'Tap a memo to select' : 'Hover a memo to preview'
}

export function getPanelStateLabel(state) {
  if (state === HERO_PROJECT_SWITCH_STATES.candidate) {
    return 'Previewing memo'
  }

  if (state === HERO_PROJECT_SWITCH_STATES.committed) {
    return 'Pinned selection'
  }

  if (state === HERO_PROJECT_SWITCH_STATES.transition) {
    return 'Opening memo'
  }

  return 'Current selection'
}

export function getStatusline(project, state) {
  if (state === HERO_PROJECT_SWITCH_STATES.candidate) {
    return `Preview memo / ${project.stage}`
  }

  if (state === HERO_PROJECT_SWITCH_STATES.committed) {
    return `Selected memo / ${project.stage}`
  }

  if (state === HERO_PROJECT_SWITCH_STATES.transition) {
    return `Opening memo / ${project.stage}`
  }

  return `Current memo / ${project.stage}`
}
