import { collectCarouselElements, syncCarouselView, updateProgressRing } from './heroCarouselView'

function clampIndex(value, length) {
  if (length <= 0) return 0
  return ((value % length) + length) % length
}

const AUTOPLAY_INTERVAL = 6000
const RESUME_DELAY = 3000

export function createHeroCarouselController({
  scopeElement,
  projects = [],
  Observer = null,
  gsap = null,
  reducedMotion = false,
  onSlideChange = null,
}) {
  const root = scopeElement?.querySelector('.js-hero-carousel')
  if (!root || projects.length === 0) return null

  const elements = collectCarouselElements(root)
  const totalSlides = projects.length

  let activeIndex = 0
  let playState = reducedMotion ? 'stopped' : 'playing'
  const pauseReasons = new Set()
  if (reducedMotion) pauseReasons.add('reducedMotion')

  let autoplayTimer = null
  let autoplayStartTime = 0
  let resumeTimer = null
  let progressRaf = 0
  let swipeObserver = null
  let intersectionObserver = null
  let destroyed = false

  function goTo(index, direction = 'next') {
    const newIndex = clampIndex(index, totalSlides)
    if (newIndex === activeIndex) return

    activeIndex = newIndex
    syncCarouselView({ root, elements, activeIndex, totalSlides, playState })

    // Notify shader layer of slide change
    const slug = projects[activeIndex]?.slug
    if (slug && onSlideChange) {
      onSlideChange(slug)
    }

    // Reset autoplay timer on manual navigation
    if (playState === 'playing') {
      startAutoplay()
    }
  }

  function next() {
    goTo(activeIndex + 1, 'next')
  }

  function prev() {
    goTo(activeIndex - 1, 'prev')
  }

  function goToSlug(slug) {
    const index = projects.findIndex((p) => p.slug === slug)
    if (index >= 0) goTo(index)
  }

  // ── Auto-play ──

  function startAutoplay() {
    stopAutoplayTimer()
    if (playState !== 'playing' || pauseReasons.size > 0) return

    autoplayStartTime = performance.now()
    autoplayTimer = setTimeout(() => {
      next()
    }, AUTOPLAY_INTERVAL)

    startProgressAnimation()
  }

  function stopAutoplayTimer() {
    if (autoplayTimer) {
      clearTimeout(autoplayTimer)
      autoplayTimer = null
    }
    cancelAnimationFrame(progressRaf)
    updateProgressRing(elements, activeIndex, 0)
  }

  function startProgressAnimation() {
    cancelAnimationFrame(progressRaf)

    function tick() {
      if (destroyed || playState !== 'playing' || pauseReasons.size > 0) return
      const elapsed = performance.now() - autoplayStartTime
      const progress = Math.min(elapsed / AUTOPLAY_INTERVAL, 1)
      updateProgressRing(elements, activeIndex, progress)
      if (progress < 1) {
        progressRaf = requestAnimationFrame(tick)
      }
    }

    progressRaf = requestAnimationFrame(tick)
  }

  function addPauseReason(reason) {
    const wasPaused = pauseReasons.size > 0
    pauseReasons.add(reason)
    if (!wasPaused) {
      stopAutoplayTimer()
    }
  }

  function removePauseReason(reason) {
    pauseReasons.delete(reason)
    if (pauseReasons.size === 0 && playState === 'playing') {
      // Delayed resume
      clearTimeout(resumeTimer)
      resumeTimer = setTimeout(() => {
        if (pauseReasons.size === 0 && playState === 'playing') {
          startAutoplay()
        }
      }, RESUME_DELAY)
    }
  }

  function togglePlay() {
    if (playState === 'playing') {
      playState = 'stopped'
      stopAutoplayTimer()
    } else {
      playState = 'playing'
      startAutoplay()
    }
    syncCarouselView({ root, elements, activeIndex, totalSlides, playState })
  }

  // ── Event handlers ──

  function handlePointerEnter() {
    addPauseReason('hover')
  }

  function handlePointerLeave() {
    removePauseReason('hover')
  }

  function handleFocusIn() {
    addPauseReason('focus')
  }

  function handleFocusOut(event) {
    if (!root.contains(event.relatedTarget)) {
      removePauseReason('focus')
    }
  }

  function handleDotClick(event) {
    const dot = event.target.closest('[data-carousel-dot]')
    if (!dot) return
    const index = parseInt(dot.dataset.carouselDotIndex, 10)
    if (!Number.isNaN(index)) {
      playState = 'stopped'
      goTo(index)
    }
  }

  function handlePrevClick(event) {
    event.preventDefault()
    playState = 'stopped'
    prev()
  }

  function handleNextClick(event) {
    event.preventDefault()
    playState = 'stopped'
    next()
  }

  function handlePlayToggle(event) {
    event.preventDefault()
    togglePlay()
  }

  function handleKeydown(event) {
    switch (event.key) {
      case 'ArrowLeft':
      case 'ArrowUp':
        event.preventDefault()
        playState = 'stopped'
        prev()
        break
      case 'ArrowRight':
      case 'ArrowDown':
        event.preventDefault()
        playState = 'stopped'
        next()
        break
      case ' ':
      case 'Enter':
        if (event.target === elements.playToggle) {
          event.preventDefault()
          togglePlay()
        }
        break
    }
  }

  // ── Setup ──

  // Event listeners
  root.addEventListener('pointerenter', handlePointerEnter)
  root.addEventListener('pointerleave', handlePointerLeave)
  root.addEventListener('focusin', handleFocusIn)
  root.addEventListener('focusout', handleFocusOut)
  root.addEventListener('keydown', handleKeydown)

  elements.prevButton?.addEventListener('click', handlePrevClick)
  elements.nextButton?.addEventListener('click', handleNextClick)
  elements.playToggle?.addEventListener('click', handlePlayToggle)

  // Dot clicks — delegate from pagination container
  const pagination = root.querySelector('.hero-carousel__pagination')
  pagination?.addEventListener('click', handleDotClick)

  // Swipe via GSAP Observer
  if (Observer && !reducedMotion) {
    swipeObserver = Observer.create({
      target: root,
      type: 'touch',
      dragMinimum: 40,
      tolerance: 60,
      lockAxis: true,
      onLeft() {
        playState = 'stopped'
        next()
      },
      onRight() {
        playState = 'stopped'
        prev()
      },
    })
  }

  // IntersectionObserver — pause when off-screen
  if (typeof IntersectionObserver !== 'undefined') {
    intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          removePauseReason('offscreen')
        } else {
          addPauseReason('offscreen')
        }
      },
      { threshold: 0.25 },
    )
    intersectionObserver.observe(root)
  }

  // Initial sync
  syncCarouselView({ root, elements, activeIndex, totalSlides, playState })

  // Start autoplay
  if (playState === 'playing') {
    startAutoplay()
  }

  return {
    goTo,
    next,
    prev,
    goToSlug,
    togglePlay,
    get activeIndex() {
      return activeIndex
    },
    get playState() {
      return playState
    },
    destroy() {
      destroyed = true
      stopAutoplayTimer()
      clearTimeout(resumeTimer)
      cancelAnimationFrame(progressRaf)

      root.removeEventListener('pointerenter', handlePointerEnter)
      root.removeEventListener('pointerleave', handlePointerLeave)
      root.removeEventListener('focusin', handleFocusIn)
      root.removeEventListener('focusout', handleFocusOut)
      root.removeEventListener('keydown', handleKeydown)

      elements.prevButton?.removeEventListener('click', handlePrevClick)
      elements.nextButton?.removeEventListener('click', handleNextClick)
      elements.playToggle?.removeEventListener('click', handlePlayToggle)
      pagination?.removeEventListener('click', handleDotClick)

      swipeObserver?.kill?.()
      intersectionObserver?.disconnect()
    },
  }
}
