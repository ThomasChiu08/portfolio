# Bug Fix Plan — Portfolio Runtime

**Source**: Codex static + runtime analysis scan, 2026-03-20
**Scope**: Vanilla JS portfolio site (GSAP + canvas background + hero project switcher)
**Total bugs**: 8 (1 High, 5 Medium, 2 Low)

---

## Execution Order

Fix in dependency order — earlier fixes may affect later files.

```
Phase 1 (Safety): BUG-001, BUG-008           ← prevents crashes
Phase 2 (Logic):  BUG-003, BUG-005, BUG-006  ← behavioral correctness
Phase 3 (A11y):   BUG-004                    ← ARIA integrity
Phase 4 (Quality):BUG-002, BUG-007           ← polish + dead code
```

---

## Phase 1 — Safety

### BUG-001 · High
**File**: `src/experience/createExperienceRuntime.js`
**Problem**: `createHeroProjectController()` and `createBackgroundSystem()` are created before GSAP context is established. If `gsap.context()`, `createHeroTimeline()`, `createSectionTransitions()`, or `ScrollTrigger.refresh()` throws, `bootstrapExperience.js` catches the error but the already-created controller/background instances are never destroyed — leaving live event listeners, timeouts, RAF loops, and mutated DOM attributes.

**Fix**:
Register each resource in the cleanup queue immediately after creation. Wrap the remaining setup in try/finally that calls `cleanup.destroy()` on failure before rethrowing.

```js
// createExperienceRuntime.js — target shape
export function createExperienceRuntime({ modules, motion, scopeElement, heroProjects }) {
  // ...
  const cleanup = createCleanupQueue()

  const heroProjectController = createHeroProjectController({ scopeElement, projects: heroProjects })
  cleanup.add(() => heroProjectController?.destroy())  // ← register immediately

  const backgroundController = createBackgroundSystem({ scopeElement, reducedMotion })
  cleanup.add(() => backgroundController?.destroy())   // ← register immediately

  try {
    const animationContext = gsap.context(() => {
      createHeroTimeline({ gsap, reducedMotion, desktopMotion, sceneController: null })
      createSectionTransitions({ gsap, reducedMotion })
    }, scopeElement)

    cleanup.add(() => animationContext?.revert())
    cleanup.add(() => {
      for (const property of runtimeCleanupProperties) {
        root.style.removeProperty(property)
      }
    })

    ScrollTrigger.refresh()
  } catch (err) {
    cleanup.destroy()   // ← clean up everything created so far
    throw err           // ← let bootstrapExperience catch and add motion-disabled class
  }

  return { destroy() { cleanup.destroy() } }
}
```

---

### BUG-008 · Low
**File**: `src/experience/createHeroProjectController.js` lines 13–19
**Problem**: `window.matchMedia?.('(query)').matches` — the `?.` guards the function call but if `matchMedia` is absent, returns `undefined`, and then `.matches` access throws `TypeError`.

**Fix**: Add `?.` before `.matches`:
```js
// Before
function getScrollBehavior() {
  return window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'
}
function prefersCoarsePointer() {
  return window.matchMedia?.('(pointer: coarse)').matches ?? false
}

// After
function getScrollBehavior() {
  return window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ? 'auto' : 'smooth'
}
function prefersCoarsePointer() {
  return window.matchMedia?.('(pointer: coarse)')?.matches ?? false
}
```

---

## Phase 2 — Logic

### BUG-003 · Medium
**File**: `src/experience/createHeroProjectController.js` — `handleFocusIn()` ~line 219
**Problem**: `focusin` previews a project (enters `candidate` state), but there is no `focusout` path. If a keyboard user tabs away without pressing Enter/Escape, the deck stays in `candidate` state permanently. The CTA may then open the last *previewed* project instead of the last *committed* one.

**Fix**: Add a `focusout` handler that checks if focus is still within the rail. If not, restore the committed project.

```js
function handleFocusOut(event) {
  // Only restore if focus is leaving the entire switcher root
  if (root.contains(event.relatedTarget)) return
  if (switchState !== HERO_PROJECT_SWITCH_STATES.candidate) return
  restoreCommittedProject()
}

// Register alongside existing listeners:
root.addEventListener('focusout', handleFocusOut)

// Remove in destroy():
root.removeEventListener('focusout', handleFocusOut)
```

---

### BUG-005 · Medium
**File**: `src/background/createBackgroundSystem.js` ~lines 250–264
**Problem**: `createSectionStateController()` is skipped entirely when `reducedMotion === true`. So `activeSectionId` stays `'hero'` forever. Section-aware background state never updates as the user scrolls, which is an accessibility regression — reduced-motion users should still get section context, just without animation.

**Fix**: Always create `sectionController` for state tracking. Only gate the animated rendering (RAF loop, interpolation) on `reducedMotion`.

```js
// Before
const sectionController = reducedMotion
  ? null
  : createSectionStateController({ ... })

// After — section tracking always on
const sectionController = createSectionStateController({
  scopeElement,
  onChange(sectionId) {
    activeSectionId = sectionId || 'hero'
    const nextState = getBackgroundState(activeSectionId)
    Object.assign(targetState, nextState)
    // Only update shell attribute; skip RAF-driven interpolation when reducedMotion
    shell.dataset.sceneSection = activeSectionId
    if (reducedMotion) {
      // Apply state immediately without animation
      Object.assign(currentState, nextState)
      render(lastFrame / 1000 || 0)
    }
  },
})
```

Also update `destroy()` to always call `sectionController?.destroy()` (no change needed if it's already nullable-safe).

---

### BUG-006 · Medium
**File**: `src/experience/createHeroProjectController.js` — `navigateToProject()` ~lines 151–174
**Problem**: If `viewProject` link is missing, not a hash, or the target element doesn't exist in the DOM, the function returns silently. Users click the "Open memo" CTA and nothing happens with no visible feedback.

**Fix**: Two-part:
1. At controller init, validate each project's `viewProject` target and mark invalid CTAs as disabled.
2. In `navigateToProject()`, fall back to `window.location.assign()` for non-hash targets, and `console.warn()` for missing elements in dev.

```js
// At init, after collecting elements:
function validateCTA() {
  const project = getProject(activeIndex)
  const targetSelector = project?.links?.viewProject
  if (!elements.openButton) return

  const isValid = targetSelector?.startsWith('#') && !!document.querySelector(targetSelector)
  elements.openButton.disabled = !isValid
  elements.openButton.setAttribute('aria-disabled', isValid ? 'false' : 'true')
}

// In navigateToProject():
function navigateToProject(slug) {
  const project = model.getProjectBySlug(slug)
  const targetSelector = project?.links?.viewProject

  if (!targetSelector) return

  if (!targetSelector.startsWith('#')) {
    // Non-hash: navigate directly
    window.location.assign(targetSelector)
    return
  }

  const target = document.querySelector(targetSelector)
  if (!target) {
    if (import.meta.env?.DEV) {
      console.warn(`[hero] navigateToProject: no element for "${targetSelector}"`)
    }
    return
  }

  // ... existing scroll + history logic
}
```

---

## Phase 3 — Accessibility

### BUG-004 · Medium
**File**: `src/experience/heroProjectSwitcherView.js` — `syncProjectRail()` ~lines 43–54
**Problem**: `tabIndex` is driven by `activeIndex` (hover/keyboard preview), but `aria-pressed` is driven by `committedIndex`. During hover/keyboard preview, the focusable rail button announces itself as not pressed, while a different (non-focusable) button announces as pressed. Screen readers get contradictory state.

**Fix**: Decouple `aria-pressed` from committed state. The rail is a selection widget — use `aria-selected` for the active (focused/previewed) item and `aria-checked` or a separate attribute for committed. Simplest correct fix:

```js
function syncProjectRail(elements, projectIndex, activeIndex, committedIndex) {
  elements.railButtons.forEach((button) => {
    const slug = button.dataset.projectRail
    const index = projectIndex.get(slug)
    const isActive = index === activeIndex      // previewed/focused
    const isCommitted = index === committedIndex // pinned selection

    button.dataset.active = isActive ? 'true' : 'false'
    button.dataset.committed = isCommitted ? 'true' : 'false'

    // aria-pressed = true only when this button is the committed selection
    // aria-current = 'true' when this is the actively previewed item
    button.setAttribute('aria-pressed', isCommitted ? 'true' : 'false')
    button.setAttribute('aria-current', isActive && !isCommitted ? 'true' : 'false')
    button.tabIndex = isActive ? 0 : -1
  })
}
```

Alternatively, restructure the rail as a `role="tablist"` with `role="tab"` buttons using `aria-selected` — but that requires HTML changes too. The above fix works with the existing markup.

---

## Phase 4 — Polish

### BUG-002 · Medium
**File**: `src/main.js` top-level
**Problem**: `reducedMotion`, `desktopMotion`, and `mobileHero` are computed once at boot and never update. After resize, orientation change, or OS reduced-motion toggle, the stale values persist until reload.

**Fix**: For `mobileHero` (layout class), listen to resize. For `reducedMotion`, listen to `matchMedia` change. Recreating the full runtime on every resize is expensive — update body classes and recalculate motion flags lazily.

```js
// main.js additions after bootstrapExperience() call:
const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
motionQuery.addEventListener('change', () => {
  // Full reload is the safest option when motion preference changes mid-session
  // since GSAP contexts and RAF loops are already running
  location.reload()
})

// For mobileHero body class:
const resizeObserver = new ResizeObserver(() => {
  const nextMobileHero = shouldUseMobileHero(window.innerWidth)  // extract existing logic
  document.body.classList.toggle('hero-mobile-mode', nextMobileHero)
})
resizeObserver.observe(document.documentElement)
```

Note: Extracting `shouldUseMobileHero()` requires reading `mountExperiencePage.js` to understand the current `mobileHero` derivation logic.

---

### BUG-007 · Low
**File**: `src/animations/heroTimeline.js` lines 16–73
**File**: `src/experience/createExperienceRuntime.js` line 34
**Problem**: `sceneController: null` is always passed, so the Three.js scene branch in `heroTimeline.js` never runs. The dead branch still computes motion inputs for an absent scene object.

**Fix option A (remove dead code)**: Delete the `if (sceneController)` block in `heroTimeline.js` and remove the `sceneController` parameter. Also remove `baseCameraZ: sceneController?.sceneState?.cameraBaseZ ?? 0` from `getHeroMotionPreset()` call if unused.

**Fix option B (document for future)**: Add a `// @future: three.js scene integration` comment block and leave it, but make it explicit this is intentionally disabled.

Recommend **option A** unless Three.js scene is on the roadmap within this sprint.

---

## Constraints

- Vanilla JS, no framework
- GSAP + ScrollTrigger (already imported)
- CleanupQueue pattern for all destroyable resources
- All changes must be testable with existing Vitest + jsdom setup
- Do NOT introduce new dependencies
- Each fix is scoped to its listed file(s) only — no opportunistic refactors

## Acceptance Criteria

- [ ] BUG-001: `npm run dev` → trigger GSAP error manually → no leaked listeners or RAF after error
- [ ] BUG-002: OS reduced-motion toggle reloads page cleanly (or body class updates on resize)
- [ ] BUG-003: Tab through rail → tab away → deck returns to committed state
- [ ] BUG-004: Screen reader announces preview and committed state correctly (no contradictory `aria-pressed`)
- [ ] BUG-005: Scroll with reduced-motion enabled → `shell.dataset.sceneSection` updates per section
- [ ] BUG-006: Project with missing `#target` shows disabled CTA; clicking valid CTA scrolls correctly
- [ ] BUG-007: `heroTimeline.js` has no unreachable `if (sceneController)` branch
- [ ] BUG-008: `getScrollBehavior()` and `prefersCoarsePointer()` return safe fallback in matchMedia-free environments
- [ ] `npx vitest run` stays green after all changes
