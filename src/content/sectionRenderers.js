import { renderGlassyButton } from './glassyButton'
import { formatProjectIndex } from '../experience/heroProjectSwitcherModel'

export function renderAgentOSSection(agentos) {
  const { statusLine, githubHref, earlyAccess, buildLog, vcAnswers } = agentos

  const buildLogRows = buildLog
    .map(
      (entry) => `
        <div class="build-log__row build-log__row--${entry.status}">
          <span class="build-log__version">${entry.version}</span>
          <span class="build-log__note">${entry.note}</span>
          <span class="build-log__date">${entry.date}</span>
          ${entry.status === 'active' ? '<span class="build-log__active-dot" aria-label="In progress"></span>' : ''}
        </div>
      `,
    )
    .join('')

  const vcRows = Object.values(vcAnswers)
    .map(
      (item) => `
        <div class="vc-answer">
          <p class="vc-answer__label">${item.label}</p>
          <p class="vc-answer__body">${item.body}</p>
          ${
            item.cta
              ? renderGlassyButton({
                  href: item.cta.href,
                  label: item.cta.label,
                  icon: 'arrow-up-right',
                  size: 'sm',
                  tone: 'neutral',
                  className: 'vc-answer__cta',
                  attributes: item.cta.external ? { target: '_blank', rel: 'noreferrer' } : {},
                })
              : ''
          }
        </div>
      `,
    )
    .join('')

  return `
    <div class="agentos-status js-section-reveal">
      <span class="agentos-status__line">${statusLine}</span>
      <span class="agentos-status__access">${earlyAccess}</span>
      ${renderGlassyButton({
        href: githubHref,
        label: 'GitHub',
        icon: 'arrow-up-right',
        size: 'sm',
        tone: 'neutral',
        className: 'agentos-status__github',
        attributes: { target: '_blank', rel: 'noreferrer' },
      })}
    </div>
    <div class="agentos-grid">
      <div class="agentos-vc js-section-reveal">
        ${vcRows}
      </div>
      <div class="agentos-buildlog js-section-reveal">
        <p class="agentos-buildlog__label">Build log</p>
        <div class="agentos-buildlog__rows">
          ${buildLogRows}
        </div>
      </div>
    </div>
  `
}

export function renderNav(items) {
  return items
    .map((item) => `<a class="nav-link" href="${item.href}">${item.label}</a>`)
    .join('')
}

export function renderHeroProof(items) {
  return items.map((item) => `<span class="hero-proof__item">${item}</span>`).join('')
}

export function renderHeroProjectDots(items, activeSlug) {
  return items
    .map((item) => {
      const isActive = item.slug === activeSlug
      return `
        <button
          type="button"
          class="hero-projects__dot-btn"
          data-project-rail="${item.slug}"
          data-project-target="${item.links?.viewProject ?? ''}"
          data-active="${isActive}"
          aria-label="${item.name}"
          title="${item.name}"
        >
          <span class="hero-projects__dot" aria-hidden="true"></span>
        </button>
      `
    })
    .join('')
}

export function renderHeroProjectPanel(item, items) {
  const activeIndex = items.findIndex((project) => project.slug === item.slug)

  return `
    <article class="hero-projects__panel" data-project-panel data-panel-project="${item.slug}">
      <span class="hero-projects__eyebrow" data-project-index>${formatProjectIndex(activeIndex)}</span>

      <div class="hero-projects__panel-body" data-project-body>
        <h2 class="hero-projects__panel-name" data-project-name>${item.name}</h2>
        <p class="hero-projects__panel-thesis" data-project-thesis>${item.thesis}</p>
      </div>

      <p class="hero-projects__status" data-project-stage>
        <span class="hero-projects__status-dot" aria-hidden="true"></span>
        ${item.stage}
      </p>

      <nav class="hero-projects__dots" aria-label="Project index">
        ${renderHeroProjectDots(items, item.slug)}
      </nav>

      <a class="hero-projects__open" data-project-open href="#">
        Open <span aria-hidden="true">&rarr;</span>
      </a>
    </article>
  `
}

export function renderLeadProject(item) {
  return `
    <article id="${item.slug}" class="current-work-card current-work-card--lead js-section-reveal">
      <div class="current-work-card__topline">
        <p class="current-work-card__eyebrow">${item.eyebrow}</p>
        <p class="current-work-card__stage">${item.stage}</p>
      </div>
      <h3 class="current-work-card__title">${item.name}</h3>
      <p class="current-work-card__summary">${item.summary}</p>
      <p class="current-work-card__detail">${item.detail}</p>
      <dl class="current-work-card__facts">
        ${(item.facts ?? [])
          .map(
            (fact) => `
              <div class="current-work-card__fact">
                <dt class="current-work-card__fact-label">${fact.label}</dt>
                <dd class="current-work-card__fact-value">${fact.value}</dd>
              </div>
            `,
          )
          .join('')}
      </dl>
    </article>
  `
}

export function renderSupportingProjects(items) {
  return items
    .map(
      (item) => `
        <article id="${item.slug}" class="current-work-card current-work-card--support js-section-reveal">
          <div class="current-work-card__topline">
            <p class="current-work-card__eyebrow">${item.eyebrow}</p>
            <p class="current-work-card__stage">${item.stage}</p>
          </div>
          <h3 class="current-work-card__title">${item.name}</h3>
          <p class="current-work-card__summary">${item.summary}</p>
          <p class="current-work-card__detail">${item.detail}</p>
        </article>
      `,
    )
    .join('')
}

export function renderCurrentWork(items) {
  const [lead, ...supporting] = items

  return `
    <div class="current-work">
      ${renderLeadProject(lead)}
      <div class="current-work__support">
        ${renderSupportingProjects(supporting)}
      </div>
    </div>
  `
}

export function renderResearchDirections(items) {
  return items
    .map(
      (item) => `
        <article class="research-card js-section-reveal">
          <p class="research-card__eyebrow">${item.eyebrow}</p>
          <h3 class="research-card__title">${item.title}</h3>
          <p class="research-card__body">${item.body}</p>
        </article>
      `,
    )
    .join('')
}

export function renderResearchNotes(items) {
  return items
    .map(
      (item, index) => `
        <div class="research-note">
          <p class="research-note__index">0${index + 1}</p>
          <div class="research-note__head">
            <p class="research-note__title">${item.title}</p>
            ${item.date ? `<span class="research-note__date">${item.date}</span>` : ''}
          </div>
          <p class="research-note__body">${item.body}</p>
        </div>
      `,
    )
    .join('')
}

export function renderPrinciples(items) {
  return items
    .map(
      (item, index) => `
        <article class="principle-card js-section-reveal">
          <span class="principle-card__index">${String(index + 1).padStart(2, '0')}</span>
          <div class="principle-card__body">
            <p class="principle-card__text">${item.text}</p>
            <p class="principle-card__sub">${item.sub}</p>
          </div>
        </article>
      `,
    )
    .join('')
}

export function renderLinks(items) {
  return items
    .map((item) => {
      const external = item.external ? ' target="_blank" rel="noreferrer"' : ''

      return `
        <a class="contact-link js-section-reveal" href="${item.href}"${external}>
          ${item.label}
        </a>
      `
    })
    .join('')
}
