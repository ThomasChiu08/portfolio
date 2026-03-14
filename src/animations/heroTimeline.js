export function createHeroTimeline({ gsap, reducedMotion }) {
  const duration = reducedMotion ? 0.55 : 0.9

  return gsap
    .timeline({
      defaults: {
        ease: 'power3.out',
      },
    })
    .fromTo(
      '.js-masthead',
      {
        y: -18,
        opacity: 0,
      },
      {
        y: 0,
        opacity: 1,
        duration: 0.72,
      },
    )
    .fromTo(
      '.js-hero-kicker',
      {
        y: 26,
        opacity: 0,
      },
      {
        y: 0,
        opacity: 1,
        duration,
      },
      0.08,
    )
    .fromTo(
      '.js-hero-title',
      {
        y: 34,
        opacity: 0,
      },
      {
        y: 0,
        opacity: 1,
        duration: duration + 0.08,
      },
      0.14,
    )
    .fromTo(
      '.js-hero-body',
      {
        y: 24,
        opacity: 0,
      },
      {
        y: 0,
        opacity: 1,
        duration,
      },
      0.22,
    )
    .fromTo(
      '.js-hero-actions a',
      {
        y: 18,
        opacity: 0,
      },
      {
        y: 0,
        opacity: 1,
        duration: 0.64,
        stagger: reducedMotion ? 0.06 : 0.1,
      },
      0.34,
    )
}
