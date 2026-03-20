import { renderGlassyButton } from '../glassyButton'

export function formatProjectIndex(index) {
  return String(index + 1).padStart(2, '0')
}

export function renderNav(items) {
  return items
    .map((item) => `<a class="nav-link" href="${item.href}">${item.label}</a>`)
    .join('')
}

export function renderHeroProof(items) {
  return items.map((item) => `<span class="hero-proof__item">${item}</span>`).join('')
}

export function renderHeroProjectRail(items, activeSlug) {
  return items
    .map((item, index) => {
      const isActive = item.slug === activeSlug

      return `
        <button
          type="button"
          class="hero-project-rail__item"
          data-project-rail="${item.slug}"
          data-project-target="${item.links?.viewProject ?? ''}"
          data-active="${isActive}"
          data-committed="${isActive}"
          aria-label="Switch to ${item.name}"
        >
          <span class="hero-project-rail__index">${formatProjectIndex(index)}</span>
          <span class="hero-project-rail__text">
            <span class="hero-project-rail__name">${item.name}</span>
            <span class="hero-project-rail__meta">${item.stage}</span>
          </span>
          <span class="hero-project-rail__dot" aria-hidden="true"></span>
        </button>
      `
    })
    .join('')
}

export function renderHeroProjectPanel(item, items) {
  const activeIndex = items.findIndex((project) => project.slug === item.slug)

  return `
    <div class="hero-projects__surface">
      <article class="hero-projects__panel" data-project-panel data-panel-project="${item.slug}">
        <div class="hero-projects__panel-head">
          <div class="hero-projects__panel-count">
            <span class="hero-projects__panel-index" data-project-index>${formatProjectIndex(activeIndex)}</span>
            <span class="hero-projects__panel-total">/ ${formatProjectIndex(items.length - 1)}</span>
          </div>
          <p class="hero-projects__panel-state" data-project-state-label>Current selection</p>
        </div>

        <div class="hero-projects__panel-topline">
          <span class="hero-projects__panel-label" data-project-label>${item.label}</span>
          <span class="hero-projects__panel-stage" data-project-stage>${item.stage}</span>
        </div>

        <div class="hero-projects__panel-body">
          <h2 class="hero-projects__panel-name" data-project-name>${item.name}</h2>
          <p class="hero-projects__panel-thesis" data-project-thesis>${item.thesis}</p>
          <p class="hero-projects__panel-support" data-project-support>${item.deckPreview}</p>
        </div>

        <div class="hero-projects__panel-footer">
          <p class="hero-projects__panel-statusline" data-project-statusline>Selected memo / ${item.stage}</p>
          ${renderGlassyButton({
            label: 'Open memo',
            icon: 'arrow-up-right',
            size: 'sm',
            tone: 'neutral',
            className: 'hero-projects__cta',
            attributes: {
              'data-project-open': true,
            },
          })}
        </div>
      </article>

      <div class="hero-projects__rail" aria-label="Project index">
        ${renderHeroProjectRail(items, item.slug)}
      </div>
    </div>
  `
}
