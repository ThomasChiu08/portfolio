import { formatProjectIndex } from './heroProjectSwitcherModel'

export function collectHeroProjectSwitcherElements(root) {
  return {
    panel: root.querySelector('[data-project-panel]'),
    panelBody: root.querySelector('[data-project-body]'),
    panelIndex: root.querySelector('[data-project-index]'),
    panelStage: root.querySelector('[data-project-stage]'),
    panelName: root.querySelector('[data-project-name]'),
    panelThesis: root.querySelector('[data-project-thesis]'),
    openButton: root.querySelector('[data-project-open]'),
    dotButtons: Array.from(root.querySelectorAll('[data-project-rail]')),
  }
}

function syncProjectPanel(elements, project, projectIndex) {
  const projectNumber = formatProjectIndex(projectIndex.get(project.slug) ?? 0)

  elements.panel?.setAttribute('data-panel-project', project.slug)
  elements.panelIndex?.replaceChildren(projectNumber)
  elements.panelName?.replaceChildren(project.name)
  elements.panelThesis?.replaceChildren(project.thesis)

  if (elements.panelStage) {
    const dot = elements.panelStage.querySelector('.hero-projects__status-dot')
    elements.panelStage.textContent = ''
    if (dot) elements.panelStage.appendChild(dot)
    elements.panelStage.append(` ${project.stage}`)
  }

  if (elements.openButton) {
    elements.openButton.setAttribute('aria-label', `Open ${project.name}`)
  }
}

function syncProjectDots(elements, projectIndex, activeIndex) {
  elements.dotButtons.forEach((button) => {
    const slug = button.dataset.projectRail
    const index = projectIndex.get(slug)
    const isActive = index === activeIndex

    button.dataset.active = isActive ? 'true' : 'false'
    button.setAttribute('aria-pressed', isActive ? 'true' : 'false')
    button.tabIndex = isActive ? 0 : -1
  })
}

export function syncHeroProjectSwitcherView({
  root,
  elements,
  activeProject,
  committedProject,
  activeIndex,
  committedIndex,
  projectIndex,
  switchState,
  touchMode,
}) {
  root.dataset.activeProject = activeProject.slug
  root.dataset.committedProject = committedProject.slug
  root.dataset.switchState = switchState
  root.dataset.touchMode = touchMode ? 'true' : 'false'

  syncProjectPanel(elements, activeProject, projectIndex)
  syncProjectDots(elements, projectIndex, activeIndex)
}
