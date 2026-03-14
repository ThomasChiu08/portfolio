const nav = [
  { label: 'Work', href: '#projects' },
  { label: 'Thesis', href: '#thesis' },
  { label: 'Contact', href: '#contact' },
]

const domains = [
  {
    title: 'Markets',
    description: 'Research, risk, and execution shaped by discipline.',
  },
  {
    title: 'Systems',
    description: 'Software built to compound judgment over time.',
  },
  {
    title: 'AI Agents',
    description: 'Operational tools with memory, initiative, and leverage.',
  },
  {
    title: 'Focus',
    description: 'Environments designed for sustained attention.',
  },
]

const projects = [
  {
    name: 'agentOS',
    label: 'Software infrastructure',
    description:
      'An operating layer for agent-driven work, bringing context, memory, and execution into one system.',
    meta: 'Built for research loops, build loops, and high-leverage delegation.',
  },
  {
    name: 'FocusBox',
    label: 'Focus environment',
    description:
      'A hardware-software product for making deep work more deliberate, measurable, and repeatable.',
    meta: 'Part ritual design, part product system, part attention training.',
  },
  {
    name: 'Trading / research system',
    label: 'Private research stack',
    description:
      'A decision system for structuring market research, scenario mapping, and execution under uncertainty.',
    meta: 'Designed to reduce noise and preserve clarity under pressure.',
  },
]

const thesis = [
  'Leverage starts with judgment.',
  'Focus is a system, not a mood.',
  'Good software compresses execution.',
  'Discipline becomes real when it is repeatable.',
  'Build for compounding, not activity.',
]

const links = [
  { label: 'GitHub', href: 'https://github.com/ThomasChiu08' },
  { label: 'X', href: 'https://x.com/Thomas_0822' },
  { label: 'Email', href: 'mailto:thomaschiu0822@gmail.com' },
]

export const siteContent = {
  meta: {
    title: 'Thomas Chiu | Investor, trader, developer.',
    description:
      'Thomas Chiu builds systems across markets, software, AI agents, and focus.',
  },
  hero: {
    name: 'Thomas Chiu',
    identity: 'Investor, trader, developer.',
    support:
      'Building systems across markets, software, AI agents, and focus.',
    primaryCta: 'Selected work',
    secondaryCta: 'Get in touch',
  },
  nav,
  domains,
  projects,
  thesis,
  links,
  contact: {
    label: 'Closing',
    title: 'I build where markets, software, and human attention meet.',
    body:
      'Open to aligned conversations around systems, software, research, and long-horizon leverage.',
  },
}

function renderNav(items) {
  return items
    .map(
      (item) =>
        `<a href="${item.href}">${item.label}</a>`,
    )
    .join('')
}

function renderDomains(items) {
  return items
    .map(
      (item) => `
        <article class="domain-card js-section-reveal">
          <h3 class="domain-card__title">${item.title}</h3>
          <p class="domain-card__body">${item.description}</p>
        </article>
      `,
    )
    .join('')
}

function renderProjects(items) {
  return items
    .map(
      (item, index) => `
        <article class="project-card js-section-reveal">
          <p class="project-card__index">0${index + 1}</p>
          <div class="project-card__content">
            <p class="project-card__label">${item.label}</p>
            <h3 class="project-card__title">${item.name}</h3>
          </div>
          <p class="project-card__body">${item.description}</p>
          <p class="project-card__meta">${item.meta}</p>
        </article>
      `,
    )
    .join('')
}

function renderThesis(lines) {
  return lines
    .map(
      (line) => `<p class="thesis-line">${line}</p>`,
    )
    .join('')
}

function renderLinks(items) {
  return items
    .map(
      (item) => `
        <a class="contact-link js-section-reveal" href="${item.href}" target="_blank" rel="noreferrer">
          ${item.label}
        </a>
      `,
    )
    .join('')
}

export function renderPage(content = siteContent) {
  return `
    <div class="site-shell">
      <div class="scene-shell" aria-hidden="true">
        <canvas class="webgl"></canvas>
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
              <p class="section-kicker js-hero-kicker">${content.hero.name}</p>
              <h1 class="hero-title js-hero-title">${content.hero.identity}</h1>
              <p class="hero-support js-hero-body">${content.hero.support}</p>
              <div class="hero-actions js-hero-actions">
                <a class="button-link" href="#projects">${content.hero.primaryCta}</a>
                <a class="text-link" href="#contact">${content.hero.secondaryCta}</a>
              </div>
            </div>
          </div>
        </section>

        <section class="section section--identity" id="identity">
          <div class="container">
            <div class="section-heading js-section-reveal">
              <p class="section-label">Identity</p>
              <h2 class="section-title">Operating across four compounding domains.</h2>
            </div>
            <div class="domain-strip">
              ${renderDomains(content.domains)}
            </div>
          </div>
        </section>

        <section id="projects" class="section section--projects">
          <div class="container">
            <div class="section-heading js-section-reveal">
              <p class="section-label">Core projects</p>
              <h2 class="section-title">Systems built for leverage, discipline, and execution.</h2>
              <p class="section-intro">
                A small set of products and internal systems aimed at better judgment,
                cleaner workflows, and stronger attention.
              </p>
            </div>
            <div class="projects-grid">
              ${renderProjects(content.projects)}
            </div>
          </div>
        </section>

        <section id="thesis" class="section section--thesis">
          <div class="container thesis-layout">
            <div class="thesis-intro js-section-reveal">
              <p class="section-label">Thesis</p>
              <h2 class="section-title">The work is about preserving signal.</h2>
              <p class="section-intro">
                Better systems should make clear thinking easier to repeat when pressure rises.
              </p>
            </div>
            <div class="thesis-stage">
              ${renderThesis(content.thesis)}
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
