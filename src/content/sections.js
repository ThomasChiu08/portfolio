import { renderGlassyButton } from './glassyButton'

const nav = [
  { label: 'Work', href: '#projects' },
  { label: 'Research', href: '#research' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
]

const projectRecords = [
  {
    slug: 'agentos',
    eyebrow: 'Primary current build',
    label: 'Primary research memo',
    name: 'agentOS',
    stage: 'Active build',
    thesis: 'An operating system for agent memory, delegation, and execution.',
    deckPreview: 'Research-backed infrastructure for durable multi-agent workflows.',
    summary: 'An operating system for agent memory, delegation, and execution.',
    detail:
      'The ambition is to make complex research and build workflows durable as they become multi-step and multi-agent. My interest here is not automation theater. It is operational integrity.',
    description:
      'agentOS is built from the view that agent workflows should not collapse into brittle prompt chains as they become multi-step, multi-tool, and multi-agent. The system is designed to preserve memory, expose delegation logic, and keep operator control intact.',
    focus: 'Memory, delegation, state continuity, and observability.',
    whyItMatters: 'Execution quality should improve as work becomes more complex, not decay.',
    principles: [
      'State continuity over prompt fragility.',
      'Operator control over opaque automation.',
      'Shared memory for coordinated agent work.',
    ],
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
    links: {
      viewProject: '#agentos',
      readResearch: '#research',
    },
  },
  {
    slug: 'focusbox',
    eyebrow: 'Supporting work',
    label: 'Attention memo',
    name: 'FocusBox',
    stage: 'Product design',
    thesis: 'A structured environment for deep work, ritual, and measured attention.',
    deckPreview: 'A focus system built around ritual, environment, and feedback loops.',
    summary: 'A structured environment for deep work, ritual, and measured attention.',
    detail:
      'It treats focus as infrastructure by linking environment design, behavioral cues, and feedback loops.',
    description:
      'FocusBox explores the idea that builders do their best work when attention is designed with the same rigor as software. It combines ritual design, environmental cues, and measurable feedback to make deep work more repeatable.',
    focus: 'Deliberate sessions, behavioral cues, and recovery-aware feedback loops.',
    whyItMatters: 'Attention is leverage. Better focus systems create better decisions and better output.',
    principles: [
      'Environment before willpower.',
      'Ritual creates repeatability.',
      'Feedback closes the attention loop.',
    ],
    links: {
      viewProject: '#focusbox',
      readResearch: '#research',
    },
  },
  {
    slug: 'trading-research-system',
    eyebrow: 'Supporting work',
    label: 'Market systems memo',
    name: 'Quant Research Platform',
    stage: 'Internal system',
    thesis:
      'A research system for signal mapping, scenario design, and execution under uncertainty.',
    deckPreview: 'A structured surface for conviction, scenarios, and disciplined execution.',
    summary:
      'A research system for signal mapping, scenario design, and execution under uncertainty.',
    detail:
      'The goal is to connect macro framing, quantitative models, and execution discipline inside one research surface.',
    description:
      'This platform is a working environment for turning fragmented market information into structured conviction. It links macro framing, model libraries, and execution scenarios so the research process remains coherent under pressure.',
    focus: 'Macro framing, systematic models, and disciplined execution scenarios.',
    whyItMatters: 'Better decisions come from better structure, not simply more information.',
    principles: [
      'Signal first, narrative second.',
      'Scenario design before action.',
      'Structure should survive pressure.',
    ],
    links: {
      viewProject: '#trading-research-system',
      readResearch: '#research',
    },
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

function renderNav(items) {
  return items
    .map((item) => `<a class="nav-link" href="${item.href}">${item.label}</a>`)
    .join('')
}

function renderHeroProof(items) {
  return items.map((item) => `<span class="hero-proof__item">${item}</span>`).join('')
}

function formatProjectIndex(index) {
  return String(index + 1).padStart(2, '0')
}

function renderHeroProjectRail(items, activeSlug) {
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

function renderHeroProjectPanel(item, items) {
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

function renderLeadProject(item) {
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

function renderSupportingProjects(items) {
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

const heroProjects = projectRecords
const defaultHeroProject = heroProjects[0]

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
      'agentOS is the clearest expression of that thesis, but the larger pattern is consistent: research first, then infrastructure, then execution.',
    proof: ['Founder-builder', 'Research-led', 'Markets + AI agents'],
    primaryCta: 'Current Work',
    secondaryCta: 'Research Lens',
    micro:
      'Founder-builder first. Investor and trader by discipline. Research depth as the edge.',
    visualBadge: 'Project memo deck',
    visualHint: 'Preview a project memo, then open the section.',
    projectsLabel: 'Project deck',
    activeProject: defaultHeroProject.slug,
    projects: heroProjects,
  },
  nav,
  projects: projectRecords,
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

export function renderPage(content = siteContent) {
  const activeHeroProject =
    content.hero.projects.find((item) => item.slug === content.hero.activeProject) ??
    content.hero.projects[0]

  return `
    <div class="site-shell">
      <div class="scene-shell" aria-hidden="true">
        <div class="scene-shell__atmosphere scene-shell__atmosphere--primary"></div>
        <div class="scene-shell__atmosphere scene-shell__atmosphere--secondary"></div>
        <div class="scene-shell__grid"></div>
        <canvas class="scene-shell__signals"></canvas>
        <div class="scene-shell__vignette"></div>
      </div>

      <header class="masthead js-masthead">
        <div class="container masthead__inner">
          <a class="brand" href="#hero">${content.hero.name}</a>
          <nav class="masthead__nav" aria-label="Primary">
            ${renderGlassyButton({
              href: '#hero',
              icon: 'home',
              size: 'sm',
              tone: 'neutral',
              className: 'masthead__home-button',
              ariaLabel: 'Back to top',
            })}
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
                ${renderGlassyButton({
                  href: '#projects',
                  label: content.hero.primaryCta,
                  icon: 'arrow-right',
                  size: 'md',
                  tone: 'warm',
                  className: 'hero-actions__primary',
                })}
                ${renderGlassyButton({
                  href: '#research',
                  label: content.hero.secondaryCta,
                  icon: 'spark',
                  size: 'md',
                  tone: 'neutral',
                  className: 'hero-actions__secondary',
                })}
              </div>
              <p class="hero-micro js-hero-micro">${content.hero.micro}</p>
            </div>

            <div class="hero-visual js-hero-visual">
              <div class="hero-visual__badge js-hero-visual-badge">${content.hero.visualBadge}</div>
              <p class="hero-visual__hint js-hero-visual-hint">${content.hero.visualHint}</p>
              <aside
                class="hero-systems-card hero-projects js-hero-card js-hero-projects"
                aria-label="${content.hero.projectsLabel}"
                data-active-project="${activeHeroProject.slug}"
                data-switch-state="idle"
              >
                <div class="hero-projects__aura" aria-hidden="true"></div>
                <div class="hero-projects__veil" aria-hidden="true"></div>
                <div class="hero-projects__nav">
                  <p class="hero-systems-card__label">${content.hero.projectsLabel}</p>
                  <p class="hero-projects__nav-note" data-project-deck-note>Hover a memo to preview</p>
                </div>

                <div id="hero-project-surface" class="hero-projects__switcher">
                  ${renderHeroProjectPanel(activeHeroProject, content.hero.projects)}
                </div>
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
