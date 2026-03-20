import {
  formatProjectIndex,
  getDeckNote,
  getPanelStateLabel,
  getStatusline,
} from './heroProjectSwitcherModel'

export function collectHeroProjectSwitcherElements(root) {
  return {
    note: root.querySelector('[data-project-deck-note]'),
    panel: root.querySelector('[data-project-panel]'),
    panelIndex: root.querySelector('[data-project-index]'),
    panelStateLabel: root.querySelector('[data-project-state-label]'),
    panelLabel: root.querySelector('[data-project-label]'),
    panelStage: root.querySelector('[data-project-stage]'),
    panelName: root.querySelector('[data-project-name]'),
    panelThesis: root.querySelector('[data-project-thesis]'),
    panelSupport: root.querySelector('[data-project-support]'),
    panelStatusline: root.querySelector('[data-project-statusline]'),
    openButton: root.querySelector('[data-project-open]'),
    railButtons: Array.from(root.querySelectorAll('[data-project-rail]')),
  }
}

function syncProjectPanel(elements, project, projectIndex, state) {
  const projectNumber = formatProjectIndex(projectIndex.get(project.slug) ?? 0)

  elements.panel?.setAttribute('data-panel-project', project.slug)
  elements.panelIndex?.replaceChildren(projectNumber)
  elements.panelStateLabel?.replaceChildren(getPanelStateLabel(state))
  elements.panelLabel?.replaceChildren(project.label)
  elements.panelStage?.replaceChildren(project.stage)
  elements.panelName?.replaceChildren(project.name)
  elements.panelThesis?.replaceChildren(project.thesis)
  elements.panelSupport?.replaceChildren(project.deckPreview)
  elements.panelStatusline?.replaceChildren(getStatusline(project, state))

  if (elements.openButton) {
    elements.openButton.setAttribute('aria-label', `Open ${project.name}`)
  }
}

function syncProjectRail(elements, projectIndex, activeIndex, committedIndex) {
  elements.railButtons.forEach((button) => {
    const slug = button.dataset.projectRail
    const index = projectIndex.get(slug)
    const isActive = index === activeIndex
    const isCommitted = index === committedIndex

    button.dataset.active = isActive ? 'true' : 'false'
    button.dataset.committed = isCommitted ? 'true' : 'false'
    button.setAttribute('aria-pressed', isCommitted ? 'true' : 'false')
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

  if (elements.note) {
    elements.note.textContent = getDeckNote({
      state: switchState,
      touchMode,
    })
  }

  syncProjectPanel(elements, activeProject, projectIndex, switchState)
  syncProjectRail(elements, projectIndex, activeIndex, committedIndex)
}
