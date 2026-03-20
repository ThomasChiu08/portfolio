# Findings & Decisions

## Requirements
- Create a technical feasibility assessment for the current V1 project.
- Write the report to `docs/tech-feasibility-report.md`.
- Evaluate lightweight WebGL introduction without restoring the old `scene/` system.
- Evaluate current GSAP/ScrollTrigger complexity and the feasibility of adding more GSAP plugins.
- Evaluate iPhone mobile performance risks and current adaptation gaps.
- Format the report in Markdown with clear sections, tables, and lists.
- Reply in English.

## Research Findings
- Prior audit context confirms the live runtime is driven by `src/main.js`, `src/experience/*`, `src/content/sections.js`, and the Canvas 2D background system under `src/background/`.
- The legacy `src/scene/` tree still exists and still imports `three`, but it is not connected to the current live entrypoint.
- `package.json` still includes `three` as a runtime dependency and `vite.config.js` still contains a manual `three` chunk rule, even though the active build path may no longer use it.
- `heroTimeline.js` is currently modest in complexity: one sequential intro timeline for masthead, hero copy, actions, and the hero visual/card. The optional `sceneController` branch remains present but is unused by the live runtime because `createExperienceRuntime()` passes `sceneController: null`.
- `sectionTransitions.js` is simple: one `gsap.fromTo()` reveal per `.js-section-reveal` with `start: 'top 84%'` and `once: true`. There is no current use of `pin`, `scrub`, or long-lived ScrollTrigger scenes in the active runtime.
- `motionPresets.js` still contains a `getScrollMotionPreset()` API with scrub-oriented values, but the active runtime does not currently call `scrollTimeline.js`.
- `createBackgroundSystem.js` is the main always-on visual workload: one full-screen 2D canvas, continuous RAF animation when motion is enabled, section-aware state changes, pointer-driven drift, visibility pause behavior, FPS caps, and DPR caps from `getDeviceProfile()`.
- `getDeviceProfile()` already applies meaningful mobile guards: reduced FPS on phones, capped DPR on touch devices, and lower motion scales on constrained hardware.
- `index.html` currently uses a minimal viewport meta tag (`width=device-width, initial-scale=1.0`) and does not set `viewport-fit=cover`.
- `style.css` uses `100svh` for the hero and contact sections, which is good for modern mobile viewport handling, but it does not use any `env(safe-area-inset-*)` padding rules.
- CSS uses multiple `backdrop-filter: blur(...)` surfaces in the masthead, glassy buttons, hero systems card, and project panel. This is likely a bigger iPhone GPU/compositing risk than the current GSAP timelines.
- CSS already disables smooth scroll under `prefers-reduced-motion` and reduces scene opacity in mobile/reduced-motion paths; it also removes tap highlight on `.glassy-button`.
- The hero project controller uses pointer/click/keydown rather than separate touch events. This avoids dual event stacks, but there is no explicit `touch-action` tuning on the rail or card surfaces.
- `createSectionStateController()` uses passive scroll listeners plus RAF scheduling, which is a good baseline for scroll-linked state updates.
- Current production build baseline: no `three` chunk is emitted; output includes `gsap` (~113 kB raw / ~44 kB gzip), `createBackgroundSystem` (~15.8 kB raw / ~5.4 kB gzip), `createHeroProjectController` (~6.5 kB raw / ~2.2 kB gzip), `heroTimeline` (~3.4 kB raw), `sectionTransitions` (~0.3 kB raw), main JS (~25.6 kB raw), and CSS (~30.0 kB raw / ~7.0 kB gzip).
- Final recommendation direction:
  - If WebGL is reintroduced, prefer a lazy-loaded OGL shader layer for one narrow visual job instead of reviving the old Three.js scene graph.
  - Treat `backdrop-filter` glass surfaces as the main iPhone performance risk, ahead of the current GSAP timelines.
  - Keep ScrollTrigger conservative on phones; avoid long `pin`/`scrub` scenes on iPhone Safari.

## Technical Decisions
| Decision | Rationale |
|----------|-----------|
| Reuse the repo-root planning files for this assessment | The task is still multi-step and benefits from persistent notes. |
| Ground WebGL and iPhone recommendations in current code/build behavior first | The project already has a live visual runtime, so feasibility depends on current integration boundaries more than abstract library comparisons. |
| Treat iPhone performance assessment as a mix of code facts and platform heuristics | The repo can show likely hotspots, but some Safari performance characteristics still require reasoned judgment rather than exact guarantees. |

## Issues Encountered
| Issue | Resolution |
|-------|------------|
| Unsynced prior-session context existed without planning files | Captured the context in new planning files and continued with a fresh repository inspection. |

## Resources
- `/Users/thomaschiu/Public/ClaudeCode/0xThomas/V1/AGENTS.md`
- `/Users/thomaschiu/Public/ClaudeCode/0xThomas/V1/task_plan.md`
- `/Users/thomaschiu/Public/ClaudeCode/0xThomas/V1/findings.md`
- `/Users/thomaschiu/Public/ClaudeCode/0xThomas/V1/progress.md`
- `docs/v1-codebase-audit.md`
- `docs/commander-assessment.md`

## Visual/Browser Findings
- None. This audit is based on filesystem and git inspection rather than browser or image review.

## Completion Note
- Wrote `docs/tech-feasibility-report.md` and verified it against the live code paths plus a fresh `npm run build` baseline.

---
*Update this file after every 2 view/browser/search operations*
*This prevents visual information from being lost*
