export async function loadExperienceModules() {
  const [
    { default: gsap },
    { ScrollTrigger },
    { createHeroTimeline },
    { createSectionTransitions },
    { createHeroProjectController },
    { createBackgroundSystem },
    { createThemeController },
    { createSplitTextReveal },
    { createHeroShaderLayer },
  ] = await Promise.all([
    import('gsap'),
    import('gsap/ScrollTrigger'),
    import('../animations/heroTimeline'),
    import('../animations/sectionTransitions'),
    import('./createHeroProjectController'),
    import('../background/createBackgroundSystem'),
    import('./createThemeController'),
    import('../animations/splitTextReveal'),
    import('../webgl/createHeroShaderLayer'),
  ])

  return {
    gsap,
    ScrollTrigger,
    createHeroTimeline,
    createSectionTransitions,
    createHeroProjectController,
    createBackgroundSystem,
    createThemeController,
    createSplitTextReveal,
    createHeroShaderLayer,
  }
}
