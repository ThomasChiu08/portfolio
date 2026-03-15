const nav = [
  { label: 'Work', href: '#projects' },
  { label: 'Research', href: '#research' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
]

const projects = [
  {
    id: 'agentos',
    eyebrow: 'Primary current build',
    name: 'agentOS',
    stage: 'Active build',
    summary: 'An operating system for agent memory, delegation, and execution.',
    detail:
      'The ambition is to make complex research and build workflows durable as they become multi-step and multi-agent. My interest here is not automation theater. It is operational integrity.',
    facts: [
      {
        label: 'Thesis',
        value: 'Research-backed infrastructure for coordinated agent work.',
      },
      {
        label: 'Current focus',
        value: 'Memory, delegation, operator control, and durable shared state.',
      },
      {
        label: 'Edge',
        value: 'Agent workflows should compound as work becomes more complex, not decay.',
      },
    ],
  },
  {
    id: 'focusbox',
    eyebrow: 'Supporting work',
    name: 'FocusBox',
    stage: 'Product design',
    summary: 'A structured environment for deep work, ritual, and measured attention.',
    detail:
      'It treats focus as infrastructure by linking environment design, behavioral cues, and feedback loops.',
  },
  {
    id: 'trading-research-system',
    eyebrow: 'Supporting work',
    name: 'Quant Research Platform',
    stage: 'Internal system',
    summary:
      'A research system for signal mapping, scenario design, and execution under uncertainty.',
    detail:
      'The goal is to connect macro framing, quantitative models, and execution discipline inside one research surface.',
  },
]

const researchDirections = [
  {
    eyebrow: 'Domain',
    title: 'Markets',
    body:
      'I care about how signal is distorted by noise, pressure, and narrative drift. The research question is how better structure improves real decisions.',
  },
  {
    eyebrow: 'Domain',
    title: 'Systems',
    body:
      'I am interested in infrastructure that remains coherent as tasks become layered, multi-step, and interdependent. The question is how execution holds together.',
  },
  {
    eyebrow: 'Domain',
    title: 'AI agents',
    body:
      'The deeper question is not whether agents can act, but whether they can preserve context, memory, and control while working alongside humans.',
  },
]

const researchNotes = [
  {
    title: 'Agent memory is a systems problem',
    body:
      'Without continuity and retrieval, long-running workflows degrade into brittle prompts and manual patchwork.',
  },
  {
    title: 'Execution quality is structural',
    body:
      'Teams and agents both fail when coordination logic is implicit. The interface has to carry structure, not just intent.',
  },
  {
    title: 'Research should shape the build',
    body:
      'The right product architecture is often visible only after the underlying questions have been made explicit.',
  },
]

const principles = [
  'Build for signal, not activity.',
  'Treat execution as a design problem.',
  'Prefer systems that compound under pressure.',
]

const links = [
  { label: 'Email / thomaschiu0822@gmail.com', href: 'mailto:thomaschiu0822@gmail.com' },
  { label: 'GitHub / ThomasChiu08', href: 'https://github.com/ThomasChiu08', external: true },
  { label: 'X / Thomas_0822', href: 'https://x.com/Thomas_0822', external: true },
]

export const siteContent = {
  meta: {
    title: 'Thomas Chiu | Founder-builder across markets, systems, and AI agents',
    description:
      'Thomas Chiu is a founder-builder, investor, and trader building agentOS, quantitative research infrastructure, and execution systems across markets, software, and AI agents.',
  },
  hero: {
    name: 'Thomas Chiu',
    eyebrow: 'Thomas Chiu / Founder-builder, investor, trader',
    headline: 'I build systems for judgment, execution, and long-horizon leverage.',
    positioning:
      'Across markets, software, and AI agents, my work turns research into operational systems.',
    subtext:
      'agentOS is the clearest expression of that thesis: an operating system for agent memory, delegation, and execution, built from a research-first view of coordinated work.',
    proof: ['Founder-builder', 'Research-led', 'Markets + AI agents'],
    primaryCta: 'Current Work',
    secondaryCta: 'Research Lens',
    micro:
      'Founder-builder first. Investor and trader by discipline. Research depth as the edge.',
    visualBadge: 'Founder research memo',
    visualHint: 'Current note / Mar 2026',
    note: {
      label: 'Primary research memo',
      title: 'agentOS',
      body:
        'An operating system for agent memory, delegation, and execution. The idea is simple: research loops should not collapse when work becomes multi-step, multi-tool, and multi-agent.',
      rows: [
        {
          label: 'Thesis',
          value: 'Research-backed infrastructure for coordinated agent work.',
        },
        {
          label: 'Current focus',
          value: 'Memory, delegation, state continuity, and observability.',
        },
        {
          label: 'Why it matters',
          value: 'Execution quality should improve as work becomes more complex, not decay.',
        },
      ],
    },
  },
  nav,
  projects,
  research: {
    label: 'Research lens',
    title: 'How I think before I build.',
    intro:
      'The products are downstream of recurring questions about market structure, decision-making, and coordinated machine work.',
    archiveLabel: 'Selected working notes',
    archiveMeta: 'Research archive / Mar 2026',
    directions: researchDirections,
    notes: researchNotes,
  },
  about: {
    label: 'Operating principles',
    title: 'Systems are only useful when they hold under pressure.',
    intro:
      'The standards are simple: build for signal, treat execution as design, and prefer structures that compound when conditions get messy.',
    principles,
  },
  links,
  contact: {
    label: 'Closing note',
    title: 'Research depth is only useful if it leads to systems that hold.',
    body:
      'I am interested in conversations at the intersection of markets, software systems, and AI agents, especially where better structure leads to better execution.',
  },
}

function renderNav(items) {
  return items
    .map((item) => `<a class="nav-link" href="${item.href}">${item.label}</a>`)
    .join('')
}

function renderHeroProof(items) {
  return items.map((item) => `<span class="hero-proof__item">${item}</span>`).join('')
}

function renderHeroNoteRows(items) {
  return items
    .map(
      (item) => `
        <div class="hero-note__row">
          <dt class="hero-note__row-label">${item.label}</dt>
          <dd class="hero-note__row-value">${item.value}</dd>
        </div>
      `,
    )
    .join('')
}

function renderLeadProject(item) {
  return `
    <article id="${item.id}" class="current-work-card current-work-card--lead js-section-reveal">
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

function renderSupportingProjects(items) {
  return items
    .map(
      (item) => `
        <article id="${item.id}" class="current-work-card current-work-card--support js-section-reveal">
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

function renderCurrentWork(items) {
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

function renderResearchDirections(items) {
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

function renderResearchNotes(items) {
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

function renderPrinciples(items) {
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

function renderLinks(items) {
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

export function renderPage(content = siteContent) {
  return `
    <div class="site-shell">
      <div class="scene-shell" aria-hidden="true">
        <div class="scene-shell__grid"></div>
        <div class="scene-shell__vignette"></div>
      </div>

      <header class="masthead js-masthead">
        <div class="container masthead__inner">
          <a class="brand" href="#hero">${content.hero.name}</a>
          <nav class="masthead__nav" aria-label="Primary">
            ${renderNav(content.nav)}
          </nav>
        </div>
      </header>

      <main class="page">
        <section id="hero" class="section section--hero">
          <div class="container hero-grid">
            <div class="hero-copy">
              <p class="section-kicker js-hero-kicker">${content.hero.eyebrow}</p>
              <h1 class="hero-title js-hero-title">${content.hero.headline}</h1>
              <p class="hero-positioning js-hero-positioning">${content.hero.positioning}</p>
              <p class="hero-support js-hero-body">${content.hero.subtext}</p>
              <div class="hero-proof js-hero-proof">
                ${renderHeroProof(content.hero.proof)}
              </div>
              <div class="hero-actions js-hero-actions">
                <a class="button-link" href="#projects">${content.hero.primaryCta}</a>
                <a class="text-link" href="#research">${content.hero.secondaryCta}</a>
              </div>
              <p class="hero-micro js-hero-micro">${content.hero.micro}</p>
            </div>

            <div class="hero-visual js-hero-visual">
              <div class="hero-visual__badge js-hero-visual-badge">${content.hero.visualBadge}</div>
              <p class="hero-visual__hint js-hero-visual-hint">${content.hero.visualHint}</p>
              <div class="hero-tooltip js-hero-tooltip" hidden></div>
              <aside class="hero-systems-card hero-note js-hero-card" aria-label="${content.hero.note.title}">
                <div class="hero-note__head">
                  <p class="hero-systems-card__label">${content.hero.note.label}</p>
                </div>
                <h2 class="hero-note__title">${content.hero.note.title}</h2>
                <p class="hero-note__body">${content.hero.note.body}</p>
                <dl class="hero-note__rows">
                  ${renderHeroNoteRows(content.hero.note.rows)}
                </dl>
              </aside>
            </div>
          </div>
        </section>

        <section id="projects" class="section section--projects">
          <div class="container">
            <div class="section-heading js-section-reveal">
              <p class="section-label">Current work</p>
              <h2 class="section-title">What I am building now.</h2>
              <p class="section-intro">
                The work is organized around one main system and two adjacent experiments. The goal is not coverage. It is coherence.
              </p>
            </div>
            ${renderCurrentWork(content.projects)}
          </div>
        </section>

        <section id="research" class="section section--research">
          <div class="container research-layout">
            <div class="section-heading js-section-reveal">
              <p class="section-label">${content.research.label}</p>
              <h2 class="section-title">${content.research.title}</h2>
              <p class="section-intro">${content.research.intro}</p>
            </div>
            <div class="research-directions">
              ${renderResearchDirections(content.research.directions)}
            </div>
            <div class="research-notes js-section-reveal">
              <div class="research-notes__head">
                <p class="research-notes__title">${content.research.archiveLabel}</p>
                <p class="research-notes__meta">${content.research.archiveMeta}</p>
              </div>
              <div class="research-notes__rows">
                ${renderResearchNotes(content.research.notes)}
              </div>
            </div>
          </div>
        </section>

        <section id="about" class="section section--principles">
          <div class="container">
            <div class="section-heading js-section-reveal">
              <p class="section-label">${content.about.label}</p>
              <h2 class="section-title">${content.about.title}</h2>
              <p class="section-intro">${content.about.intro}</p>
            </div>
            <div class="principles-list">
              ${renderPrinciples(content.about.principles)}
            </div>
          </div>
        </section>

        <section id="contact" class="section section--contact">
          <div class="container">
            <div class="contact-panel js-section-reveal">
              <p class="section-label">${content.contact.label}</p>
              <h2 class="contact-title">${content.contact.title}</h2>
              <p class="contact-copy">${content.contact.body}</p>
              <div class="contact-links">
                ${renderLinks(content.links)}
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  `
}
