import { createCleanupQueue } from './createCleanupQueue'

const runtimeCleanupProperties = ['--accent', '--accent-soft', '--scene-wash']

export function createExperienceRuntime({ modules, motion, scopeElement, heroProjects }) {
  const {
    gsap,
    ScrollTrigger,
    createHeroTimeline,
    createSectionTransitions,
    createHeroProjectController,
    createBackgroundSystem,
  } = modules
  const { reducedMotion, desktopMotion } = motion

  gsap.registerPlugin(ScrollTrigger)

  const root = document.documentElement
  const cleanup = createCleanupQueue()
  const heroProjectController = createHeroProjectController({
    scopeElement,
    projects: heroProjects,
  })
  const backgroundController = createBackgroundSystem({
    scopeElement,
    reducedMotion,
  })

  const animationContext = gsap.context(() => {
    createHeroTimeline({
      gsap,
      reducedMotion,
      desktopMotion,
      sceneController: null,
    })
    createSectionTransitions({ gsap, reducedMotion })
  }, scopeElement)

  cleanup.add(() => animationContext?.revert())
  cleanup.add(() => heroProjectController?.destroy())
  cleanup.add(() => backgroundController?.destroy())
  cleanup.add(() => {
    for (const property of runtimeCleanupProperties) {
      root.style.removeProperty(property)
    }
  })

  ScrollTrigger.refresh()

  return {
    destroy() {
      cleanup.destroy()
    },
  }
}
