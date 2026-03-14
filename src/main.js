import './style.css'
import { renderPage, siteContent } from './content/sections'
import { prefersReducedMotion } from './utils/device'

const app = document.querySelector('#app')
const description = document.querySelector('meta[name="description"]')

document.title = siteContent.meta.title
description?.setAttribute('content', siteContent.meta.description)
app.innerHTML = renderPage(siteContent)

const reducedMotion = prefersReducedMotion()

async function bootstrapExperience() {
  try {
    const [
      { default: gsap },
      { ScrollTrigger },
      { setupScene },
      { startAnimation },
      { createHeroTimeline },
      { createScrollTimeline },
      { createSectionTransitions },
    ] = await Promise.all([
      import('gsap'),
      import('gsap/ScrollTrigger'),
      import('./scene/setupScene'),
      import('./scene/animate'),
      import('./animations/heroTimeline'),
      import('./animations/scrollTimeline'),
      import('./animations/sectionTransitions'),
    ])

    gsap.registerPlugin(ScrollTrigger)

    let sceneController = null
    let stopAnimation = null
    const canvas = document.querySelector('.webgl')

    try {
      sceneController = setupScene({ canvas, reducedMotion })
      stopAnimation = startAnimation({
        ...sceneController,
        reducedMotion,
      })
    } catch {
      document.body.classList.add('scene-disabled')
    }

    const heroTimeline = createHeroTimeline({ gsap, reducedMotion })
    const sectionTransitions = createSectionTransitions({ gsap, reducedMotion })
    let scrollTimeline = null

    if (sceneController) {
      scrollTimeline = createScrollTimeline({
        gsap,
        reducedMotion,
        sceneController,
      })
    }

    ScrollTrigger.refresh()

    if (import.meta.hot) {
      import.meta.hot.dispose(() => {
        scrollTimeline?.kill()
        heroTimeline?.kill()
        sectionTransitions?.thesisTimeline?.kill()
        sectionTransitions?.revealAnimations?.forEach((animation) => animation.kill())
        ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
        stopAnimation?.()
        sceneController?.cleanup()
      })
    }
  } catch {
    document.body.classList.add('motion-disabled')
    document.body.classList.add('scene-disabled')
  }
}

bootstrapExperience()
