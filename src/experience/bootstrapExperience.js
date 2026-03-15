import { createExperienceRuntime } from './createExperienceRuntime'

export async function bootstrapExperience({
  reducedMotion,
  desktopMotion,
  scopeElement,
  heroVisual,
}) {
  try {
    const [
      { default: gsap },
      { ScrollTrigger },
      { createHeroTimeline },
      { createSectionTransitions },
    ] = await Promise.all([
      import('gsap'),
      import('gsap/ScrollTrigger'),
      import('../animations/heroTimeline'),
      import('../animations/sectionTransitions'),
    ])

    const runtime = createExperienceRuntime({
      gsap,
      ScrollTrigger,
      createHeroTimeline,
      createSectionTransitions,
      reducedMotion,
      desktopMotion,
      scopeElement,
      heroVisual,
    })

    if (import.meta.hot) {
      import.meta.hot.dispose(() => {
        runtime?.destroy()
      })
    }
  } catch (error) {
    console.error('Failed to bootstrap motion experience:', error)
    document.body.classList.add('motion-disabled')
  }
}
