import './style.css'
import { renderPage, siteContent } from './content/sections'
import { prefersReducedMotion } from './utils/device'
import { bootstrapExperience } from './experience/bootstrapExperience'
import { mountExperiencePage } from './experience/mountExperiencePage'
import { shouldEnableDesktopMotion } from './experience/runtimeConfig'
import { createContactCli } from './experience/createContactCli'

const { mobileHero, scopeElement } = mountExperiencePage({
  content: siteContent,
  renderPage,
})

const emailLink = siteContent.links?.find((l) => l.href?.startsWith('mailto:'))
createContactCli({ scopeElement, email: emailLink?.href?.replace('mailto:', '') })

const reducedMotion = prefersReducedMotion()
const desktopMotion = shouldEnableDesktopMotion({
  width: window.innerWidth,
  reducedMotion,
})

if (mobileHero) {
  document.body.classList.add('hero-mobile-mode')
}

bootstrapExperience({
  motion: {
    reducedMotion,
    desktopMotion,
  },
  scopeElement,
  heroProjects: siteContent.hero.projects,
})
