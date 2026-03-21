export function createSectionTransitions({ gsap, reducedMotion }) {
  const revealTargets = gsap.utils.toArray('.js-section-reveal')
  const revealAnimations = []

  revealTargets.forEach((element) => {
    const animation = gsap.fromTo(
      element,
      {
        y: reducedMotion ? 16 : 32,
        opacity: 0,
      },
      {
        y: 0,
        opacity: 1,
        duration: reducedMotion ? 0.55 : 0.9,
        ease: 'brand.decel',
        scrollTrigger: {
          trigger: element,
          start: 'top 84%',
          once: true,
        },
      },
    )

    revealAnimations.push(animation)
  })

  return {
    revealAnimations,
  }
}
