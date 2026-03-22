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

  return {
    projectIndex,
    getProject,
    getProjectIndex,
    getProjectBySlug,
  }
}

