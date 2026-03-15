import * as THREE from 'three'

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max)
}

function resolveNodeMeta(object) {
  let current = object

  while (current) {
    if (current.userData?.node) {
      return current.userData.node
    }

    current = current.parent
  }

  return null
}

function renderTooltipContent(meta) {
  const action = meta?.href ? 'Click to inspect' : 'Hovering node'

  return `
    <p class="hero-tooltip__eyebrow">${meta.eyebrow}</p>
    <p class="hero-tooltip__title">${meta.title}</p>
    <p class="hero-tooltip__body">${meta.description}</p>
    <p class="hero-tooltip__action">${action}</p>
  `
}

export function createInteractionController({
  camera,
  core,
  heroVisual,
  reducedMotion,
  sceneState,
  enabled = true,
  touchMode = false,
}) {
  const tooltip = heroVisual?.querySelector('.js-hero-tooltip')

  if (!enabled || !heroVisual || !tooltip || !core?.interactiveObjects?.length) {
    return {
      update() {},
      destroy() {},
    }
  }

  const raycaster = new THREE.Raycaster()
  const pointer = new THREE.Vector2(2, 2)
  const projected = new THREE.Vector3()
  let pointerActive = false
  let pointerClientX = 0
  let pointerClientY = 0
  let pointerOnOverlay = false
  let hoveredMeta = null
  let hoveredObject = null

  function setTooltipVisible(visible) {
    tooltip.dataset.visible = visible ? 'true' : 'false'
    tooltip.hidden = !visible
  }

  function isInsideHero(event) {
    const rect = heroVisual.getBoundingClientRect()

    return (
      event.clientX >= rect.left &&
      event.clientX <= rect.right &&
      event.clientY >= rect.top &&
      event.clientY <= rect.bottom
    )
  }

  function isOverlayTarget(target) {
    return Boolean(target?.closest('.hero-systems-card, .button-link, .text-link'))
  }

  function clearHoveredState() {
    hoveredMeta = null
    hoveredObject = null
    sceneState.hoveredNodeId = null
    document.body.classList.remove('has-node-hover')
    setTooltipVisible(false)
  }

  function navigateToMeta(meta) {
    if (!meta?.href) {
      return
    }

    const target = document.querySelector(meta.href)

    if (!target) {
      return
    }

    target.scrollIntoView({
      behavior: reducedMotion ? 'auto' : 'smooth',
      block: 'start',
    })

    if (window.history?.replaceState) {
      window.history.replaceState(null, '', meta.href)
    }
  }

  function resolveHitFromEvent(event) {
    pointer.x = (event.clientX / window.innerWidth) * 2 - 1
    pointer.y = -((event.clientY / window.innerHeight) * 2 - 1)
    raycaster.setFromCamera(pointer, camera)

    return raycaster
      .intersectObjects(core.interactiveObjects, false)
      .find((entry) => resolveNodeMeta(entry.object))
  }

  function handlePointerMove(event) {
    pointerClientX = event.clientX
    pointerClientY = event.clientY
    pointerOnOverlay = isOverlayTarget(event.target)
    pointerActive = isInsideHero(event) && !pointerOnOverlay

    if (!pointerActive) {
      pointer.set(2, 2)
      clearHoveredState()
      return
    }

    pointer.x = (event.clientX / window.innerWidth) * 2 - 1
    pointer.y = -((event.clientY / window.innerHeight) * 2 - 1)
  }

  function handlePointerLeave() {
    pointerActive = false
    pointerOnOverlay = false
    pointer.set(2, 2)
    clearHoveredState()
  }

  function handleClick(event) {
    if (!pointerActive || isOverlayTarget(event.target) || !hoveredMeta?.href) {
      return
    }

    event.preventDefault()
    navigateToMeta(hoveredMeta)
  }

  function handlePointerDown(event) {
    if (!touchMode || isOverlayTarget(event.target) || !isInsideHero(event)) {
      return
    }

    const hit = resolveHitFromEvent(event)

    if (!hit) {
      return
    }

    const meta = resolveNodeMeta(hit.object)

    if (!meta?.href) {
      return
    }

    event.preventDefault()
    navigateToMeta(meta)
  }

  function updateTooltipPosition() {
    if (!hoveredMeta || !hoveredObject) {
      setTooltipVisible(false)
      return
    }

    hoveredObject.getWorldPosition(projected)
    projected.project(camera)

    if (projected.z > 1) {
      setTooltipVisible(false)
      return
    }

    const viewportX = (projected.x * 0.5 + 0.5) * window.innerWidth
    const viewportY = (-projected.y * 0.5 + 0.5) * window.innerHeight
    const rect = heroVisual.getBoundingClientRect()

    if (
      viewportX < rect.left ||
      viewportX > rect.right ||
      viewportY < rect.top ||
      viewportY > rect.bottom
    ) {
      setTooltipVisible(false)
      return
    }

    const tooltipWidth = Math.min(240, Math.max(200, rect.width * 0.48))
    const offsetX = clamp(viewportX - rect.left + 18, 12, rect.width - tooltipWidth - 12)
    const offsetY = clamp(viewportY - rect.top - 90, 12, rect.height - 120)

    tooltip.style.width = `${tooltipWidth}px`
    tooltip.style.transform = `translate(${offsetX}px, ${offsetY}px)`
    tooltip.innerHTML = renderTooltipContent(hoveredMeta)
    setTooltipVisible(true)
  }

  function update() {
    const rect = heroVisual.getBoundingClientRect()
    const isStillInside =
      pointerClientX >= rect.left &&
      pointerClientX <= rect.right &&
      pointerClientY >= rect.top &&
      pointerClientY <= rect.bottom

    pointerActive = isStillInside && !pointerOnOverlay

    if (!pointerActive) {
      clearHoveredState()
      return
    }

    raycaster.setFromCamera(pointer, camera)
    const hit = raycaster
      .intersectObjects(core.interactiveObjects, false)
      .find((entry) => resolveNodeMeta(entry.object))

    if (!hit) {
      clearHoveredState()
      return
    }

    hoveredObject = hit.object
    hoveredMeta = resolveNodeMeta(hit.object)
    sceneState.hoveredNodeId = hoveredMeta.id ?? hoveredMeta.title
    document.body.classList.toggle('has-node-hover', Boolean(hoveredMeta.href))
    updateTooltipPosition()
  }

  window.addEventListener('pointermove', handlePointerMove)
  window.addEventListener('pointerleave', handlePointerLeave)
  window.addEventListener('click', handleClick)
  window.addEventListener('pointerdown', handlePointerDown)

  return {
    update,
    destroy() {
      clearHoveredState()
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerleave', handlePointerLeave)
      window.removeEventListener('click', handleClick)
      window.removeEventListener('pointerdown', handlePointerDown)
    },
  }
}
