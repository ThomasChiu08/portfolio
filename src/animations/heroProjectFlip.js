/**
 * Flip adapter for hero project switcher panel transitions.
 * Wraps the view's syncProjectPanel with FLIP capture/animate.
 */
export function createHeroProjectFlip({ Flip, gsap, reducedMotion }) {
  if (!Flip) {
    return null
  }

  const duration = reducedMotion ? 0.15 : 0.4
  const stagger = reducedMotion ? 0 : 0.04

  return {
    animatePanelSwap(panelElement, applyDomChanges) {
      if (!panelElement) {
        applyDomChanges()
        return
      }

      const targets = Array.from(panelElement.children)
      const state = Flip.getState(targets)

      applyDomChanges()

      Flip.from(state, {
        duration,
        ease: 'brand.smooth',
        stagger,
        fade: true,
        absolute: true,
        onComplete() {
          gsap.set(targets, { clearProps: 'all' })
        },
      })
    },
  }
}
