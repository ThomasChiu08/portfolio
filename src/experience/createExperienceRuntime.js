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

  // Register in intended teardown order (queue runs FIFO):
  // 1. stop animations, 2. destroy controllers, 3. clean CSS props
  let animationContext = null
  cleanup.add(() => animationContext?.revert())

  const heroProjectController = createHeroProjectController({
    scopeElement,
    projects: heroProjects,
  })
  cleanup.add(() => heroProjectController?.destroy())

  const backgroundController = createBackgroundSystem({
    scopeElement,
    reducedMotion,
  })
  cleanup.add(() => backgroundController?.destroy())

  cleanup.add(() => {
    for (const property of runtimeCleanupProperties) {
      root.style.removeProperty(property)
    }
  })

  let runtimeReady = false

  try {
    animationContext = gsap.context(() => {
      createHeroTimeline({
        gsap,
        reducedMotion,
        desktopMotion,
      })
      createSectionTransitions({ gsap, reducedMotion })
    }, scopeElement)

    ScrollTrigger.refresh()
    runtimeReady = true
  } finally {
    if (!runtimeReady) {
      cleanup.destroy()
    }
  }

  return {
    destroy() {
      cleanup.destroy()
    },
  }
}
