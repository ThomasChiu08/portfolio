import { renderGlassyButton } from './glassyButton'

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

export function formatProjectIndex(index) {
  return String(index + 1).padStart(2, '0')
}

/* ── Hero Carousel ── */

export function renderHeroCarouselSlide(item, index, total) {
  return `
    <div
      class="hero-carousel__slide"
      role="group"
      aria-roledescription="slide"
      aria-label="${formatProjectIndex(index)} of ${formatProjectIndex(total - 1)}"
      data-carousel-slide="${item.slug}"
      ${index === 0 ? '' : 'inert'}
    >
      <div class="hero-carousel__content">
        <span class="hero-carousel__counter" data-carousel-counter>
          ${formatProjectIndex(index)} / ${formatProjectIndex(total - 1)}
        </span>
        <h2 class="hero-carousel__title" data-carousel-title>${item.name}</h2>
        <p class="hero-carousel__thesis" data-carousel-thesis>${item.thesis}</p>
        <p class="hero-carousel__status" data-carousel-stage>
          <span class="hero-carousel__status-dot" aria-hidden="true"></span>
          ${item.stage}
        </p>
        <a
          class="hero-carousel__explore"
          href="${item.links?.viewProject ?? '#'}"
          data-carousel-explore
        >
          Explore <span aria-hidden="true">&rarr;</span>
        </a>
      </div>
    </div>
  `
}

export function renderHeroCarouselDot(item, index, isActive) {
  return `
    <button
      type="button"
      class="hero-carousel__dot"
      data-carousel-dot="${item.slug}"
      data-carousel-dot-index="${index}"
      aria-label="Go to ${item.name}"
      ${isActive ? 'aria-current="true"' : ''}
    >
      <svg class="hero-carousel__dot-ring" viewBox="0 0 20 20" aria-hidden="true">
        <circle class="hero-carousel__dot-track" cx="10" cy="10" r="8" />
        <circle class="hero-carousel__dot-progress" cx="10" cy="10" r="8" />
      </svg>
    </button>
  `
}

export function renderHeroCarousel(activeProject, projects) {
  const slides = projects
    .map((item, i) => renderHeroCarouselSlide(item, i, projects.length))
    .join('')

  const dots = projects
    .map((item, i) => renderHeroCarouselDot(item, i, item.slug === activeProject.slug))
    .join('')

  return `
    <div class="hero-carousel__track">
      ${slides}
    </div>

    <div class="hero-carousel__controls">
      <div class="hero-carousel__pagination" role="tablist" aria-label="Project slides">
        ${dots}
      </div>

      <div class="hero-carousel__nav">
        <button
          type="button"
          class="hero-carousel__arrow hero-carousel__arrow--prev"
          data-carousel-prev
          aria-label="Previous project"
        >
          <span aria-hidden="true">&larr;</span>
        </button>
        <button
          type="button"
          class="hero-carousel__arrow hero-carousel__arrow--next"
          data-carousel-next
          aria-label="Next project"
        >
          <span aria-hidden="true">&rarr;</span>
        </button>
      </div>

      <button
        type="button"
        class="hero-carousel__play-toggle"
        data-carousel-play-toggle
        aria-label="Pause auto-play"
      >
        <span class="hero-carousel__play-icon" aria-hidden="true"></span>
      </button>
    </div>
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
