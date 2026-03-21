import { SplitText } from 'gsap/SplitText'

/**
 * Wraps each word in `.js-split-title` elements into individually animatable
 * spans, then triggers a staggered reveal on scroll. CSS pre-styles the
 * `.word` spans for reduced-motion safety (see style.css).
 *
 * SplitText plugin is registered centrally in createExperienceRuntime.
 */
export function createSplitTextReveal({ gsap, scopeElement, reducedMotion }) {
  if (reducedMotion) {
    return { destroy() {} }
  }

  const targets = scopeElement?.querySelectorAll?.('.js-split-title') ?? []
  if (!targets.length) {
    return { destroy() {} }
  }

  const splits = []
  const triggers = []

  targets.forEach((el) => {
    const split = new SplitText(el, { type: 'words', wordsClass: 'word' })
    splits.push(split)

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: el,
        start: 'top 88%',
        toggleActions: 'play none none none',
      },
    })

    tl.fromTo(
      split.words,
      { y: '60%', opacity: 0 },
      {
        y: '0%',
        opacity: 1,
        duration: 0.9,
        ease: 'brand.reveal',
        stagger: 0.06,
      },
    )

    triggers.push(tl.scrollTrigger)
  })

  return {
    destroy() {
      triggers.forEach((t) => t?.kill())
      splits.forEach((s) => s?.revert())
    },
  }
}
