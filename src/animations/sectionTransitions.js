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
        ease: 'power2.out',
        scrollTrigger: {
          trigger: element,
          start: 'top 84%',
          once: true,
        },
      },
    )

    revealAnimations.push(animation)
  })

  const thesisLines = gsap.utils.toArray('.thesis-line')

  gsap.set(thesisLines, {
    opacity: 0.18,
    y: reducedMotion ? 0 : 36,
  })

  const thesisTimeline = gsap.timeline({
    scrollTrigger: {
      trigger: '#thesis',
      start: 'top 30%',
      end: 'bottom bottom',
      scrub: reducedMotion ? 0.5 : 1.1,
    },
  })

  thesisLines.forEach((line, index) => {
    thesisTimeline.to(
      line,
      {
        opacity: 1,
        y: 0,
        duration: 0.75,
      },
      index,
    )

    if (index < thesisLines.length - 1) {
      thesisTimeline.to(
        line,
        {
          opacity: 0.24,
          duration: 0.55,
        },
        index + 0.45,
      )
    }
  })

  return {
    revealAnimations,
    thesisTimeline,
  }
}
