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
        ${item.facts
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
          <p class="research-note__title">${item.title}</p>
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
        <article class="principle-item js-section-reveal">
          <span class="principle-item__index">0${index + 1}</span>
          <p class="principle-item__text">${item}</p>
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
