export async function loadExperienceModules() {
  const [
    { default: gsap },
    { ScrollTrigger },
    { createHeroTimeline },
    { createSectionTransitions },
    { createHeroProjectController },
    { createBackgroundSystem },
  ] = await Promise.all([
    import('gsap'),
    import('gsap/ScrollTrigger'),
    import('../animations/heroTimeline'),
    import('../animations/sectionTransitions'),
    import('./createHeroProjectController'),
    import('../background/createBackgroundSystem'),
  ])

  return {
    gsap,
    ScrollTrigger,
    createHeroTimeline,
    createSectionTransitions,
    createHeroProjectController,
    createBackgroundSystem,
  }
}
