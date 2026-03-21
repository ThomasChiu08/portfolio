# Bug Fix Lessons Learned — V1 Portfolio

> Session: 2026-03-20 to 2026-03-21
> Bugs fixed: BUG-001, BUG-003, BUG-004, BUG-005, BUG-006, BUG-007, BUG-008, MISS-001, MISS-002

---

## Executive Summary

A systematic scan of the V1 portfolio runtime identified 9 bugs concentrated in three areas: resource lifecycle management, accessibility semantics, and silent failure modes. The majority of bugs stemmed from incomplete cleanup symmetry — systems that set up state but didn't fully tear it down — and from accessibility features added structurally but not semantically (DOM present, ARIA attributes missing).

---

## Bug Pattern Analysis

### Pattern 1: Incomplete Cleanup Symmetry

**Bugs:** BUG-001, BUG-005, MISS-001, MISS-002

Every system that registers resources (event listeners, RAF loops, CSS vars, GSAP contexts) must clean them up in the correct order. When cleanup is added after-the-fact, it's easy to miss an item or get the order wrong.

**Root cause:** Cleanup was written as an afterthought rather than paired immediately with resource creation.

**Prevention rule:** Register cleanup immediately after resource creation — not at the end of the function. The pattern is:
```js
const resource = createSomething()
cleanup.add(() => resource.destroy())  // ← right here, not later
```

**FIFO vs LIFO note:** `createCleanupQueue.js` is FIFO. Registration order determines teardown order. Document it explicitly with a comment and register in the intended teardown sequence (animations → controllers → CSS vars).

---

### Pattern 2: Conditional Initialization Skipping Callbacks

**Bugs:** BUG-005, MISS-002

When a feature is conditionally disabled (`reducedMotion`, `isTouch`), the temptation is to skip creating the subsystem entirely. But this silently disables related functionality — like section-aware background updates for reduced-motion users.

**Root cause:** `sectionController` was conditionally `null` in reduced-motion mode, so section changes never triggered background updates.

**Prevention rule:** Create the subsystem always. Handle the behavioral difference inside the callback, not at construction time:
```js
// ❌ Wrong — skips section tracking entirely
const controller = reducedMotion ? null : createSectionStateController(...)

// ✅ Correct — always track sections, adapt behavior inside
const controller = createSectionStateController({
  onChange(sectionId) {
    Object.assign(targetState, nextState)
    if (reducedMotion) {
      Object.assign(currentState, nextState)
      applyShellStyles(lastFrame / 1000 || 0)
      render(lastFrame / 1000 || 0)
    }
  }
})
```

---

### Pattern 3: Silent Failures

**Bugs:** BUG-001 (partial init), BUG-006 (navigation), BUG-007 (dead branch)

Code that returns early or falls into a dead branch without any signal is hard to debug. BUG-001's GSAP context initialization could partially succeed, leaving listeners registered without a corresponding cleanup. BUG-006's `navigateToProject` silently returned when the target DOM element was missing.

**Root cause:** Error paths were written as simple `return` without logging or cleanup.

**Prevention rules:**
- Wrap multi-resource initialization in `try/finally` — cleanup runs even on partial failure
- Use `console.warn` (dev-gated) for missing DOM targets rather than silent `return`
- Gate dev warnings with `import.meta.env?.DEV` to keep production clean
- Delete dead code branches immediately (BUG-007: unreachable Three.js path)

---

### Pattern 4: Incomplete Optional Chaining

**Bug:** BUG-008

`window.matchMedia` was guarded with `?.()` but the return value wasn't guarded — `window.matchMedia?.()` can return `null` if the call is no-op'd by the optional chain falling through.

**Prevention rule:** Chain optionals consistently:
```js
// ❌ Incomplete — matchMedia() might return null
window.matchMedia?.('(...)').matches

// ✅ Complete — guards both call and property access
window.matchMedia?.('(...)')?.matches
```

---

### Pattern 5: Accessibility as Structural Afterthought

**Bugs:** BUG-003, BUG-004

The hero project switcher had correct DOM structure and keyboard support but incomplete ARIA semantics. `aria-pressed` tracked committed state, but there was no `aria-current` to distinguish the previewed (candidate) state. Keyboard users could tab into preview state and tab away without any restoration.

**Root cause:** Accessibility was added structurally (elements exist) but semantically incomplete (state attributes didn't match all state machine states).

**Prevention rules:**
- Map every state machine state to its ARIA attribute: idle → default, candidate → `aria-current="true"`, committed → `aria-pressed="true"`
- Pair every `focus`/`pointerenter` event with a corresponding `focusout`/`pointerleave` cleanup
- Test keyboard navigation by tabbing through all states without pressing Enter or Escape

---

## Architectural Insights

**1. The cleanup queue contract must be explicit.** `createCleanupQueue.js` is FIFO, but `CLAUDE.md` called it "LIFO destruction stack." Documentation and implementation diverged. The rule: the comment in `createExperienceRuntime.js` is the source of truth — it correctly says `(queue runs FIFO)`.

**2. State machines need full coverage at every layer.** The hero switcher has a clean model (idle → candidate → committed → transition) but the view layer only tracked two states in ARIA. Every new state in the model requires a corresponding ARIA update.

**3. Conditional feature flags create invisible dark paths.** `reducedMotion` disabled an entire subsystem rather than adapting its behavior. The reduced-motion path should be a variation, not an absence.

**4. Dev tooling surfaced what code review missed.** MISS-001 and MISS-002 were caught by a CCB reviewer cross-checking runtime behavior against architecture docs — not by reading the code alone. Static code review misses behavioral contracts.

---

## Prevention Checklist

For every new system added to `createExperienceRuntime`:

- [ ] Cleanup registered immediately after resource creation (not at end of function)
- [ ] Cleanup registration order matches intended teardown sequence with a comment
- [ ] Conditional features adapt behavior inside callbacks, not at construction
- [ ] `try/finally` around multi-step initialization that can partially fail
- [ ] `applyShellStyles()` called whenever `currentState` is mutated outside the RAF loop
- [ ] Optional chains complete end-to-end (`?.()?.property`, not just `?.()`)
- [ ] Every event listener has a corresponding `removeEventListener` in `destroy()`
- [ ] Dev warnings (`console.warn` behind `import.meta.env?.DEV`) on missing DOM targets
- [ ] ARIA attributes cover all state machine states, not just terminal states

---

## Code Review Blind Spots

**Why MISS-001 and MISS-002 slipped through initial review:**

Both were behavioral issues requiring knowledge of runtime execution order — not visible from reading the code linearly. MISS-001 required knowing the queue is FIFO and tracing that through to registration order. MISS-002 required knowing that `applyShellStyles` is responsible for shell CSS vars and that those vars don't self-update without it.

**Mitigation:** Cross-provider review (Claude → Codex second opinion) caught both. Single-reviewer code review has blind spots for system-level behavioral contracts. The dual-review workflow is effective for these classes of bugs.
