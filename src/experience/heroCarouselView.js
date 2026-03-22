// formatProjectIndex is not needed at runtime — view syncs DOM directly

export function collectCarouselElements(root) {
  return {
    track: root.querySelector('.hero-carousel__track'),
    slides: Array.from(root.querySelectorAll('[data-carousel-slide]')),
    dots: Array.from(root.querySelectorAll('[data-carousel-dot]')),
    dotProgressRings: Array.from(root.querySelectorAll('.hero-carousel__dot-progress')),
    prevButton: root.querySelector('[data-carousel-prev]'),
    nextButton: root.querySelector('[data-carousel-next]'),
    playToggle: root.querySelector('[data-carousel-play-toggle]'),
  }
}

export function syncCarouselView({ root, elements, activeIndex, totalSlides, playState }) {
  const { slides, dots, dotProgressRings } = elements
  const activeSlug = slides[activeIndex]?.dataset.carouselSlide ?? ''

  root.dataset.activeSlide = activeSlug
  root.dataset.playState = playState

  for (let i = 0; i < slides.length; i++) {
    const isActive = i === activeIndex

    if (isActive) {
      slides[i].removeAttribute('inert')
      slides[i].dataset.active = 'true'
      slides[i].style.opacity = '1'
    } else {
      slides[i].setAttribute('inert', '')
      slides[i].dataset.active = 'false'
      slides[i].style.opacity = '0'
    }
  }

  for (let i = 0; i < dots.length; i++) {
    const isActive = i === activeIndex
    if (isActive) {
      dots[i].setAttribute('aria-current', 'true')
    } else {
      dots[i].removeAttribute('aria-current')
    }
  }

  // Update play/pause toggle label
  const toggleLabel = playState === 'playing' ? 'Pause auto-play' : 'Resume auto-play'
  elements.playToggle?.setAttribute('aria-label', toggleLabel)
}

export function updateProgressRing(elements, activeIndex, progress) {
  const circumference = 2 * Math.PI * 8 // r=8 from SVG
  for (let i = 0; i < elements.dotProgressRings.length; i++) {
    if (i === activeIndex) {
      const offset = circumference * (1 - progress)
      elements.dotProgressRings[i].style.strokeDashoffset = `${offset}`
    } else {
      elements.dotProgressRings[i].style.strokeDashoffset = `${circumference}`
    }
  }
}
