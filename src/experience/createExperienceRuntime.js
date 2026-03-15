export function createExperienceRuntime({
  gsap,
  ScrollTrigger,
  createHeroTimeline,
  createSectionTransitions,
  createHeroProjectController,
  reducedMotion,
  desktopMotion,
  scopeElement,
  heroVisual,
  heroProjects,
}) {
  gsap.registerPlugin(ScrollTrigger)

  const root = document.documentElement
  let animationContext = null
  const heroProjectController = createHeroProjectController({
    scopeElement,
    projects: heroProjects,
  })

  animationContext = gsap.context(() => {
    createHeroTimeline({
      gsap,
      reducedMotion,
      desktopMotion,
      sceneController: null,
    })
    createSectionTransitions({ gsap, reducedMotion })
  }, scopeElement)

  ScrollTrigger.refresh()

  return {
    destroy() {
      animationContext?.revert()
      heroProjectController?.destroy()
      root.style.removeProperty('--accent')
      root.style.removeProperty('--accent-soft')
      root.style.removeProperty('--scene-wash')
    },
  }
}
