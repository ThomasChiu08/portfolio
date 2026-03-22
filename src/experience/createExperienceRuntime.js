import { createCleanupQueue } from './createCleanupQueue'

const runtimeCleanupProperties = ['--accent', '--accent-soft', '--scene-wash']

export function createExperienceRuntime({ modules, motion, scopeElement, heroProjects }) {
  const {
    gsap,
    ScrollTrigger,
    ScrollSmoother,
    Flip,
    Observer,
    CustomEase,
    SplitText,
    createHeroTimeline,
    createSectionTransitions,
    createHeroProjectController,
    createBackgroundSystem,
    createThemeController,
    createSplitTextReveal,
    createHeroShaderLayer,
    createHeroProjectFlip,
    registerBrandEasing,
  } = modules
  const { reducedMotion, desktopMotion } = motion

  // Register all plugins in dependency order (ScrollTrigger before ScrollSmoother)
  gsap.registerPlugin(ScrollTrigger, ScrollSmoother, Flip, Observer, CustomEase, SplitText)

  // Brand easing curves — available site-wide as ease: 'brand.smooth' etc.
  registerBrandEasing(CustomEase)

  const root = document.documentElement
  const cleanup = createCleanupQueue()

  // Register in intended teardown order (queue runs FIFO):
  // 1. stop animations, 2. destroy controllers, 3. clean CSS props, 4. kill smoother last
  let animationContext = null
  cleanup.add(() => animationContext?.revert())

  // ScrollSmoother — must be created BEFORE any ScrollTrigger instances
  let smoother = null
  const smoothWrapper = document.querySelector('#smooth-wrapper')
  const smoothContent = document.querySelector('#smooth-content')
  if (smoothWrapper && smoothContent) {
    smoother = ScrollSmoother.create({
      wrapper: smoothWrapper,
      content: smoothContent,
      smooth: reducedMotion ? 0 : 1.2,
      effects: !reducedMotion,
      normalizeScroll: false,
    })
    // Register smoother cleanup immediately — LAST to run (after ScrollTriggers)
    cleanup.add(() => smoother?.kill())
  }

  // Smooth-scroll nav anchors via ScrollSmoother (replaces CSS scroll-behavior)
  if (smoother) {
    const navLinks = scopeElement.querySelectorAll('.nav-link, .brand, .masthead__home-button')
    const handleNavClick = (e) => {
      const href = e.currentTarget.getAttribute('href')
      if (href?.startsWith('#')) {
        e.preventDefault()
        smoother.scrollTo(href, true, 'top top')
      }
    }
    navLinks.forEach((link) => link.addEventListener('click', handleNavClick))
    cleanup.add(() => navLinks.forEach((link) => link.removeEventListener('click', handleNavClick)))
  }

  // Flip adapter for hero project switcher
  const flipAdapter = createHeroProjectFlip({ Flip, gsap, reducedMotion })

  const heroProjectController = createHeroProjectController({
    scopeElement,
    projects: heroProjects,
    Observer: reducedMotion ? null : Observer,
    flipAdapter,
  })
  cleanup.add(() => heroProjectController?.destroy())

  const backgroundController = createBackgroundSystem({
    scopeElement,
    reducedMotion,
  })
  cleanup.add(() => backgroundController?.destroy())

  const heroShaderLayer = createHeroShaderLayer({
    scopeElement,
    ScrollTrigger,
    reducedMotion,
    desktopMotion,
  })
  cleanup.add(() => heroShaderLayer?.destroy())

  const themeController = createThemeController({
    backgroundSystem: backgroundController,
    heroShaderLayer,
  })
  cleanup.add(() => themeController?.destroy())

  cleanup.add(() => {
    for (const property of runtimeCleanupProperties) {
      root.style.removeProperty(property)
    }
  })

  let runtimeReady = false

  try {
    animationContext = gsap.context(() => {
      createHeroTimeline({
        gsap,
        reducedMotion,
        desktopMotion,
      })
      createSectionTransitions({ gsap, reducedMotion })
    }, scopeElement)

    ScrollTrigger.refresh()

    // SplitText runs outside GSAP context — owns its own ScrollTriggers
    const splitTextReveal = createSplitTextReveal({ gsap, scopeElement, reducedMotion })
    cleanup.add(() => splitTextReveal?.destroy())

    runtimeReady = true
  } finally {
    if (!runtimeReady) {
      cleanup.destroy()
    }
  }

  return {
    destroy() {
      cleanup.destroy()
    },
  }
}
