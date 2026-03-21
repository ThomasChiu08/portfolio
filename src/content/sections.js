import { renderGlassyButton } from './glassyButton'
export { siteContent } from './siteContent'
import { siteContent } from './siteContent'
import {
  renderNav,
  renderHeroProof,
  renderHeroProjectPanel,
  renderAgentOSSection,
  renderCurrentWork,
  renderResearchDirections,
  renderResearchNotes,
  renderPrinciples,
  renderLinks,
} from './sectionRenderers'

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
            <button
              type="button"
              class="theme-toggle"
              data-theme-toggle
              aria-label="Switch to dark mode"
              aria-pressed="false"
            >
              <span class="theme-toggle__icon" aria-hidden="true"></span>
            </button>
          </nav>
        </div>
      </header>

      <main class="page">
        <section id="hero" class="section section--hero">
          <div class="container hero-grid">
            <div class="hero-copy">
              <p class="section-kicker js-hero-kicker">${content.hero.eyebrow}</p>
              <h1 class="hero-title js-hero-title js-split-title">${content.hero.headline}</h1>
              <p class="hero-positioning js-hero-positioning">${content.hero.positioning}</p>
              <p class="hero-support js-hero-body">${content.hero.subtext}</p>
              <div class="hero-proof js-hero-proof">
                ${renderHeroProof(content.hero.proof)}
              </div>
              <div class="hero-actions js-hero-actions">
                ${renderGlassyButton({
                  href: '#agentos',
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
                <div id="hero-project-surface" class="hero-projects__switcher">
                  ${renderHeroProjectPanel(activeHeroProject, content.hero.projects)}
                </div>
              </aside>
            </div>
          </div>
        </section>

        <section id="agentos" class="section section--agentos">
          <div class="container">
            <div class="section-heading js-section-reveal">
              <p class="section-label">${content.agentos.label}</p>
              <h2 class="section-title">agentOS</h2>
              <p class="section-intro">
                The reliability problem in agentic execution is structural. I'm building the fix at the substrate level.
              </p>
            </div>
            ${renderAgentOSSection(content.agentos)}
          </div>
        </section>

        <section id="projects" class="section section--projects">
          <div class="container">
            <div class="section-heading js-section-reveal">
              <p class="section-label">Field validations</p>
              <h2 class="section-title">The same thesis, different domains.</h2>
              <p class="section-intro">
                FocusBox and the Quant Research Platform are not side projects. They are the same question — how does execution hold under pressure — applied to human attention and market decisions.
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
              <h2 class="section-title js-split-title">${content.about.title}</h2>
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
              <h2 class="contact-title js-split-title">${content.contact.title}</h2>
              <p class="contact-copy">${content.contact.body}</p>
              ${
                content.contact.availability?.length
                  ? `<div class="contact-availability">
                ${content.contact.availability.map((item) => `<span class="contact-availability__tag">${item}</span>`).join('')}
              </div>`
                  : ''
              }
              <div class="contact-cli" role="group" aria-label="Send a message">
                <span class="contact-cli__prompt" aria-hidden="true">~/portfolio &gt;</span>
                <input
                  type="text"
                  class="contact-cli__input"
                  placeholder="Open a channel…"
                  aria-label="Message"
                  spellcheck="false"
                  autocomplete="off"
                />
                <button type="button" class="contact-cli__execute" aria-label="Send message">
                  <span aria-hidden="true">↵</span>
                </button>
              </div>
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
