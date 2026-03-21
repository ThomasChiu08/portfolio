import { runtimeMedia } from './runtimeConfig'

export function mountExperiencePage({ content, renderPage }) {
  const app = document.querySelector('#app')
  const description = document.querySelector('meta[name="description"]')
  const mobileHero = window.matchMedia(runtimeMedia.mobileHero).matches

  if (!app) {
    console.error('mountExperiencePage: missing #app mount node')

    return {
      mobileHero,
      scopeElement: document,
      heroVisual: null,
    }
  }

  document.title = content.meta.title
  description?.setAttribute('content', content.meta.description)
  app.innerHTML = renderPage(content)

  return {
    mobileHero,
    scopeElement: app,
    heroVisual: document.querySelector('.hero-visual'),
  }
}
