export function createExperienceRuntime({
  gsap,
  ScrollTrigger,
  createHeroTimeline,
  createSectionTransitions,
  reducedMotion,
  desktopMotion,
  scopeElement,
  heroVisual,
}) {
  gsap.registerPlugin(ScrollTrigger)

  const root = document.documentElement
  let animationContext = null

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
      root.style.removeProperty('--accent')
      root.style.removeProperty('--accent-soft')
      root.style.removeProperty('--scene-wash')
    },
  }
}
