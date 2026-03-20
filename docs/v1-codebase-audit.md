# V1 Codebase Audit

Snapshot date: `2026-03-20`

Scope note: this report describes the repository state **before** this audit file was created, so the tracked/untracked counts below do not include `docs/v1-codebase-audit.md` itself.

## Executive Summary

- V1 is a Vite + vanilla JavaScript portfolio site with GSAP-driven motion, a current canvas-based background system, and an older Three.js scene subsystem that is no longer connected to the active entrypoint.
- The working tree is mid-refactor: `42` tracked files, `12` modified tracked files, and `36` untracked files at the time of inspection.
- The live runtime path is `index.html` -> `src/main.js` -> `mountExperiencePage()` / `bootstrapExperience()` -> `loadExperienceModules()` -> `createExperienceRuntime()` -> hero-controller + background + animation subsystems.
- Testing is present and runnable: `npm test` passed with `14` test files and `35` tests. Coverage is solid around runtime helpers and the new background subsystem, but weak around the entrypoint, animation choreography, background rendering internals, and the dormant `scene/` tree.

## 1. Project Structure Overview

Note: nested vendor packages inside `node_modules/` are not enumerated individually because they are third-party dependencies rather than project-owned modules.

| Directory | Responsibility | Core or Auxiliary | Notes |
|---|---|---|---|
| `.` | Project root and top-level config/docs | Auxiliary | Holds config, docs, audit/planning notes, and package manifests. |
| `.ccb/` | Local agent/session state | Auxiliary | Tool-generated session files; not part of the application runtime. |
| `.ccb/history/` | Conversation history snapshots | Auxiliary | Local-only audit trail for assistant tooling. |
| `dist/` | Generated production build output | Auxiliary | Ignored by git; should be reproducible from `npm run build`. |
| `dist/assets/` | Bundled JS/CSS assets | Auxiliary | Generated Vite chunks. |
| `docs/` | Design notes, plans, verification docs, and audit output | Auxiliary | Product/design documentation, not runtime code. |
| `docs/plans/` | Dated design plan files | Auxiliary | Main design-history archive. |
| `docs/verification/` | Verification index and screenshot buckets | Auxiliary | README is documentable; PNGs are intentionally git-ignored. |
| `docs/verification/background/` | Background-system review captures | Auxiliary | Local visual QA for canvas/background states. |
| `docs/verification/components/` | Isolated component captures | Auxiliary | Currently used for `glassy-button` checks. |
| `docs/verification/deck/` | Hero deck / hero project interaction captures | Auxiliary | Used to compare interaction variants and focus states. |
| `docs/verification/homepage/` | Full-page/homepage captures | Auxiliary | Used for desktop/mobile and older homepage variants. |
| `node_modules/` | Installed npm dependencies | Auxiliary | Vendor tree; ignored by git. |
| `public/` | Static public assets | Core support | Currently only contains `favicon.svg`. |
| `src/` | Application source code | Core | Main codebase. |
| `src/animations/` | GSAP timelines and motion presets | Core support | Motion layer for hero/sections; one file appears unused. |
| `src/background/` | Canvas background system | Core | Current visual system for the homepage background. Entire subtree is currently untracked. |
| `src/content/` | Content data and DOM markup generation | Core | Owns site copy and most rendered HTML. |
| `src/experience/` | Runtime orchestration and hero project interactions | Core | Main application control layer. |
| `src/scene/` | Three.js scene system | Auxiliary / legacy | Substantial code remains, but it is not imported by the live entrypoint. |
| `src/utils/` | Shared device and math helpers | Core support | Shared low-level utilities used across active subsystems. |
| `tests/` | Vitest test suite | Auxiliary / quality | Covers selected source modules. |
| `tests/background/` | Background subsystem tests | Auxiliary / quality | Focused on the new untracked background modules. |
| `tests/helpers/` | Test-only browser mocks | Auxiliary / quality | Shared test scaffolding for jsdom/browser API simulation. |

### Core Modules

- `src/main.js`
- `src/content/`
- `src/experience/`
- `src/background/`
- `src/utils/`
- `src/style.css`

### Auxiliary / Support Modules

- `src/animations/`
- `src/scene/` (currently legacy/dormant)
- `tests/`
- `docs/`
- `public/`
- `.ccb/`
- `dist/`
- `node_modules/`

## 2. File Inventory And Status

### Snapshot Counts

| Status bucket | Count |
|---|---:|
| Tracked and modified | 12 |
| Tracked and clean | 30 |
| Untracked | 36 |
| Ignored/generated trees present locally | `dist/**`, `node_modules/**`, `docs/verification/**/*.png` |

### Tracked And Modified

These are tracked files with local changes at audit time.

| File | Notes |
|---|---|
| `.gitignore` | Recently updated ignore rules. |
| `findings.md` | Audit/planning note, modified during this audit workflow. |
| `progress.md` | Audit/planning note, modified during this audit workflow. |
| `src/content/sections.js` | Active content/markup refactor. |
| `src/experience/bootstrapExperience.js` | Runtime bootstrap changed. |
| `src/experience/createExperienceRuntime.js` | Central runtime orchestration changed. |
| `src/experience/createHeroProjectController.js` | Main hero interaction controller changed heavily. |
| `src/main.js` | Live entrypoint changed. |
| `src/style.css` | Large visual-system/style refactor in progress. |
| `task_plan.md` | Audit/planning note, modified during this audit workflow. |
| `tests/create-experience-runtime.test.js` | Runtime coverage updated. |
| `tests/hero-project-controller.test.js` | Hero interaction coverage updated. |

### Tracked And Clean

These are tracked files with no local modifications at audit time.

| File | Category |
|---|---|
| `AGENTS.md` | Repository instructions |
| `docs/plans/2026-03-13-founder-portfolio-design.md` | Design plan |
| `docs/plans/2026-03-13-vite-webgl-scroll-design.md` | Design plan |
| `docs/plans/2026-03-15-founder-research-memo-pencil-design.md` | Design plan |
| `docs/plans/2026-03-15-project-deck-hover-navigation-design.md` | Design plan |
| `index.html` | Application shell |
| `package-lock.json` | Dependency lockfile |
| `package.json` | Package manifest |
| `public/favicon.svg` | Static asset |
| `src/animations/heroTimeline.js` | Source |
| `src/animations/motionPresets.js` | Source |
| `src/animations/scrollTimeline.js` | Source |
| `src/animations/sectionTransitions.js` | Source |
| `src/experience/mountExperiencePage.js` | Source |
| `src/experience/runtimeConfig.js` | Source |
| `src/scene/animate.js` | Source |
| `src/scene/createCoreObject.js` | Source |
| `src/scene/createInteractionController.js` | Source |
| `src/scene/createParticles.js` | Source |
| `src/scene/lights.js` | Source |
| `src/scene/resize.js` | Source |
| `src/scene/setupScene.js` | Source |
| `src/utils/device.js` | Source |
| `src/utils/math.js` | Source |
| `tests/device.test.js` | Test |
| `tests/helpers/browserMocks.js` | Test helper |
| `tests/motion-presets.test.js` | Test |
| `tests/mount-experience-page.test.js` | Test |
| `tests/runtime-config.test.js` | Test |
| `vite.config.js` | Build config |

### Untracked

These files existed locally but were not tracked by git at audit time.

| File | Notes |
|---|---|
| `.ccb/.claude-session` | Local tool/session artifact |
| `.ccb/.codex-session` | Local tool/session artifact |
| `.ccb/.gemini-session` | Local tool/session artifact |
| `.ccb/history/claude-20260320-140411-c2911d30-2b99-42eb-944c-8ce37955f3ce.md` | Local conversation history |
| `CLAUDE.md` | Local assistant-context file; useful but not product code |
| `docs/background-animation-brainstorm.md` | Exploratory design/technical note |
| `docs/card-interaction-redesign.md` | Interaction-spec note |
| `docs/plans/2026-03-14-deep-research-lab-color-system-design.md` | Design plan |
| `docs/plans/2026-03-14-hero-ux-refactor-design.md` | Design plan |
| `docs/plans/2026-03-14-mobile-3d-hero-motion-design.md` | Design plan |
| `docs/plans/2026-03-14-surface-detail-experimental-accent-design.md` | Design plan |
| `docs/plans/2026-03-14-system-core-detail-design.md` | Design plan |
| `docs/plans/2026-03-15-agentos-liquid-glass-opening-design.md` | Design plan |
| `docs/plans/2026-03-15-hero-project-card-system-design.md` | Design plan |
| `docs/verification/README.md` | Verification index |
| `src/background/backgroundConfig.js` | Source |
| `src/background/backgroundFieldLayouts.js` | Source |
| `src/background/backgroundFieldRenderer.js` | Source |
| `src/background/backgroundMath.js` | Source |
| `src/background/createBackgroundSystem.js` | Source |
| `src/background/createSectionStateController.js` | Source |
| `src/background/pathGenerator.js` | Source |
| `src/background/signalFieldTemplates.js` | Source |
| `src/content/glassyButton.js` | Source |
| `src/experience/createCleanupQueue.js` | Source |
| `src/experience/heroProjectSwitcherModel.js` | Source |
| `src/experience/heroProjectSwitcherView.js` | Source |
| `src/experience/loadExperienceModules.js` | Source |
| `tests/background/background-config.test.js` | Test |
| `tests/background/background-field-layouts.test.js` | Test |
| `tests/background/background-math.test.js` | Test |
| `tests/background/path-generator.test.js` | Test |
| `tests/background/section-state-controller.test.js` | Test |
| `tests/create-cleanup-queue.test.js` | Test |
| `tests/glassy-button.test.js` | Test |
| `tests/hero-project-switcher-model.test.js` | Test |

### Likely Deprecated, Dormant, Or Experimental

This section is partly inferential; these labels are based on import topology, naming, and doc intent rather than commit history.

| File or area | Why it looks deprecated / dormant / experimental |
|---|---|
| `src/scene/setupScene.js` | Zero inbound imports; not referenced by `src/main.js`. |
| `src/scene/animate.js` | Zero inbound imports; appears to belong to the inactive Three.js path. |
| `src/scene/createInteractionController.js` | Zero inbound imports; inactive scene subtree. |
| `src/scene/createCoreObject.js`, `createParticles.js`, `lights.js`, `resize.js` | Still imported by `setupScene.js`, but the entire `setupScene` root is unused. |
| `src/animations/scrollTimeline.js` | Zero inbound imports; not part of the current runtime fanout. |
| `docs/background-animation-brainstorm.md` | Explicit brainstorm document, exploratory by nature. |
| `docs/plans/2026-03-14-surface-detail-experimental-accent-design.md` | Explicitly labeled experimental; no clear active runtime linkage. |
| `docs/plans/2026-03-13-vite-webgl-scroll-design.md` | Describes the older WebGL foundation; current runtime has shifted toward the canvas background system. |
| `.ccb/**` | Local tooling/session files, not repository content. |
| `CLAUDE.md` | Useful local architecture note, but currently not part of the tracked repo. |

## 3. Code Module Dependency Relationships

### Active Entrypoint And Call Chain

```text
index.html
  -> src/main.js
    -> mountExperiencePage()
      -> renderPage(content)
    -> prefersReducedMotion()
    -> shouldEnableDesktopMotion()
    -> bootstrapExperience()
      -> loadExperienceModules()
        -> gsap
        -> ScrollTrigger
        -> createHeroTimeline()
        -> createSectionTransitions()
        -> createHeroProjectController()
          -> heroProjectSwitcherModel
          -> heroProjectSwitcherView
        -> createBackgroundSystem()
          -> backgroundConfig
          -> backgroundFieldLayouts
          -> backgroundFieldRenderer
          -> backgroundMath
          -> pathGenerator
          -> signalFieldTemplates
          -> createSectionStateController
          -> utils/device
          -> utils/math
```

### Subsystem-Level Dependency Map

| Module area | Depends on | Role |
|---|---|---|
| `src/main.js` | `src/style.css`, `src/content/sections.js`, `src/utils/device.js`, `src/experience/bootstrapExperience.js`, `src/experience/mountExperiencePage.js`, `src/experience/runtimeConfig.js` | Live application entrypoint |
| `src/content/` | `src/content/glassyButton.js` | Content records and HTML generation |
| `src/experience/bootstrapExperience.js` | `createExperienceRuntime.js`, `loadExperienceModules.js` | Async runtime bootstrap boundary |
| `src/experience/loadExperienceModules.js` | Dynamic imports of GSAP, `heroTimeline.js`, `sectionTransitions.js`, `createHeroProjectController.js`, `createBackgroundSystem.js` | Lazy module loader / code split fanout |
| `src/experience/createExperienceRuntime.js` | `createCleanupQueue.js` + loaded modules | Central orchestration / cleanup owner |
| `src/experience/createHeroProjectController.js` | `heroProjectSwitcherModel.js`, `heroProjectSwitcherView.js` | Hero project interaction state machine/controller |
| `src/background/` | `src/utils/device.js`, `src/utils/math.js`, internal background helpers | Current visual background engine |
| `src/animations/heroTimeline.js` | `motionPresets.js` | Active hero GSAP choreography |
| `src/animations/sectionTransitions.js` | none | Active section reveal transitions |
| `src/animations/scrollTimeline.js` | `motionPresets.js` | Present but unused animation file |
| `src/utils/device.js` | `src/experience/runtimeConfig.js` | Shared device/profile logic |
| `src/utils/math.js` | none | Shared math helpers |
| `src/scene/` | `three`, `src/utils/device.js`, internal scene helpers | Legacy/dormant Three.js system |

### Per-File Import Topology

| File | Imports | Imported by / role |
|---|---|---|
| `src/main.js` | `content/sections`, `utils/device`, `experience/bootstrapExperience`, `experience/mountExperiencePage`, `experience/runtimeConfig`, `style.css` | Root entrypoint |
| `src/content/sections.js` | `content/glassyButton` | Used by `src/main.js`; also defines `.scene-shell` markup required by the background system |
| `src/content/glassyButton.js` | none | Used by `src/content/sections.js` |
| `src/experience/bootstrapExperience.js` | `createExperienceRuntime`, `loadExperienceModules` | Used by `src/main.js` |
| `src/experience/loadExperienceModules.js` | dynamic imports of `gsap`, `gsap/ScrollTrigger`, `animations/heroTimeline`, `animations/sectionTransitions`, `createHeroProjectController`, `background/createBackgroundSystem` | Used by `bootstrapExperience.js` |
| `src/experience/createExperienceRuntime.js` | `createCleanupQueue` | Used by `bootstrapExperience.js` |
| `src/experience/createCleanupQueue.js` | none | Used by `createExperienceRuntime.js` |
| `src/experience/createHeroProjectController.js` | `heroProjectSwitcherModel`, `heroProjectSwitcherView` | Loaded dynamically through `loadExperienceModules.js` |
| `src/experience/heroProjectSwitcherModel.js` | none | Used by controller and view |
| `src/experience/heroProjectSwitcherView.js` | `heroProjectSwitcherModel` | Used by controller |
| `src/experience/mountExperiencePage.js` | `runtimeConfig` | Used by `src/main.js` |
| `src/experience/runtimeConfig.js` | none | Used by `main.js`, `mountExperiencePage.js`, `utils/device.js` |
| `src/animations/heroTimeline.js` | `motionPresets` | Loaded dynamically in active runtime |
| `src/animations/sectionTransitions.js` | none | Loaded dynamically in active runtime |
| `src/animations/motionPresets.js` | none | Reused motion constants |
| `src/animations/scrollTimeline.js` | `motionPresets` | Present but not currently imported |
| `src/background/createBackgroundSystem.js` | `utils/device`, `utils/math`, `backgroundConfig`, `backgroundFieldLayouts`, `backgroundFieldRenderer`, `backgroundMath`, `pathGenerator`, `createSectionStateController` | Loaded dynamically in active runtime |
| `src/background/backgroundConfig.js` | none | Used by background system |
| `src/background/backgroundFieldLayouts.js` | `backgroundMath`, `utils/math` | Used by background system |
| `src/background/backgroundFieldRenderer.js` | `backgroundMath` | Used by background system |
| `src/background/backgroundMath.js` | `utils/math` | Used widely inside background subsystem |
| `src/background/pathGenerator.js` | `backgroundMath`, `signalFieldTemplates` | Used by background system |
| `src/background/signalFieldTemplates.js` | none | Used by `pathGenerator.js` |
| `src/background/createSectionStateController.js` | none | Used by background system |
| `src/utils/device.js` | `experience/runtimeConfig` | Used by `main.js`, `background/createBackgroundSystem.js`, `scene/setupScene.js`, `scene/resize.js` |
| `src/utils/math.js` | none | Used by background and legacy scene helpers |
| `src/scene/setupScene.js` | `three`, `createCoreObject`, `createParticles`, `lights`, `resize`, `utils/device` | Zero inbound imports; dormant legacy root |
| `src/scene/animate.js` | `utils/math` | Zero inbound imports; dormant legacy file |
| `src/scene/createInteractionController.js` | none | Zero inbound imports; dormant legacy file |
| `src/scene/createCoreObject.js` | none | Only used by dormant `setupScene.js` |
| `src/scene/createParticles.js` | none | Only used by dormant `setupScene.js` |
| `src/scene/lights.js` | none | Only used by dormant `setupScene.js` |
| `src/scene/resize.js` | `utils/device` | Only used by dormant `setupScene.js` |

### High-Reuse Modules

These are the most frequently imported internal files based on the import graph.

| File | Inbound internal imports | Why it matters |
|---|---:|---|
| `src/background/backgroundMath.js` | 4 | Shared math/transition helper for the background engine |
| `src/utils/device.js` | 4 | Central runtime/device capability logic |
| `src/utils/math.js` | 4 | Shared low-level math helpers |
| `src/experience/runtimeConfig.js` | 3 | Central breakpoint/runtime rules |
| `src/animations/motionPresets.js` | 2 | Shared animation timing/easing presets |
| `src/experience/heroProjectSwitcherModel.js` | 2 | Shared state definitions/helpers for hero project interactions |

### Isolated Or Zero-Inbound Modules

| File | Interpretation |
|---|---|
| `src/main.js` | Expected zero-inbound root entrypoint |
| `src/animations/scrollTimeline.js` | Likely old or unfinished animation path |
| `src/scene/animate.js` | Dormant legacy scene file |
| `src/scene/createInteractionController.js` | Dormant legacy scene file |
| `src/scene/setupScene.js` | Dormant legacy root; its subtree is effectively isolated from the live app |

## 4. Test Coverage Analysis

### Test Execution Status

| Command | Result |
|---|---|
| `npm test` | Passed: `14` files, `35` tests, `0` failures |

Important limitation: no line/branch coverage tool is configured, so the assessment below is based on direct test imports and behavioral reach, not numeric coverage percentages.

### Coverage By Subsystem

| Subsystem | Source files | Directly tested files | Directly untested files | Assessment |
|---|---:|---:|---:|---|
| `animations` | 4 | 1 | 3 | Light coverage. Only `motionPresets.js` is directly tested. |
| `background` | 8 | 5 | 3 | Good targeted unit coverage for math/config/layouts/path generation/state; renderer and top-level system are untested. |
| `content` | 2 | 2 | 0 | Good direct coverage, though `sections.js` still deserves more focused content/render tests. |
| `experience` | 9 | 6 | 3 | Good runtime/controller/model coverage; bootstrap, view, and lazy-loader are untested. |
| `main.js` | 1 | 0 | 1 | No direct entrypoint test. |
| `scene` | 7 | 0 | 7 | No direct coverage for the legacy scene subtree. |
| `utils` | 2 | 1 | 1 | `device.js` tested; `math.js` not directly tested. |

### Modules With Direct Tests

| Source module | Direct test files |
|---|---|
| `src/animations/motionPresets.js` | `tests/motion-presets.test.js` |
| `src/background/backgroundConfig.js` | `tests/background/background-config.test.js`, `tests/background/background-field-layouts.test.js`, `tests/background/background-math.test.js` |
| `src/background/backgroundFieldLayouts.js` | `tests/background/background-field-layouts.test.js` |
| `src/background/backgroundMath.js` | `tests/background/background-math.test.js` |
| `src/background/createSectionStateController.js` | `tests/background/section-state-controller.test.js` |
| `src/background/pathGenerator.js` | `tests/background/background-field-layouts.test.js`, `tests/background/path-generator.test.js` |
| `src/content/glassyButton.js` | `tests/glassy-button.test.js` |
| `src/content/sections.js` | `tests/hero-project-controller.test.js`, `tests/mount-experience-page.test.js` |
| `src/experience/createCleanupQueue.js` | `tests/create-cleanup-queue.test.js` |
| `src/experience/createExperienceRuntime.js` | `tests/create-experience-runtime.test.js` |
| `src/experience/createHeroProjectController.js` | `tests/hero-project-controller.test.js` |
| `src/experience/heroProjectSwitcherModel.js` | `tests/hero-project-switcher-model.test.js` |
| `src/experience/mountExperiencePage.js` | `tests/mount-experience-page.test.js` |
| `src/experience/runtimeConfig.js` | `tests/runtime-config.test.js` |
| `src/utils/device.js` | `tests/device.test.js` |

### Modules Without Direct Tests

| Source module | Risk note |
|---|---|
| `src/main.js` | Live entrypoint; integration bugs would only surface at runtime/manual QA |
| `src/experience/bootstrapExperience.js` | Error handling and fallback path are unverified |
| `src/experience/loadExperienceModules.js` | Dynamic import fanout not directly tested |
| `src/experience/heroProjectSwitcherView.js` | DOM sync behavior only indirectly covered through controller tests |
| `src/background/createBackgroundSystem.js` | Top-level lifecycle, pointer behavior, and canvas orchestration untested |
| `src/background/backgroundFieldRenderer.js` | Rendering primitives untested |
| `src/background/signalFieldTemplates.js` | Template generation only indirectly covered |
| `src/animations/heroTimeline.js` | No direct GSAP timeline coverage |
| `src/animations/sectionTransitions.js` | No direct transition coverage |
| `src/animations/scrollTimeline.js` | Untested and also unused |
| `src/utils/math.js` | Small helper, but widely reused |
| `src/scene/setupScene.js` and the rest of `src/scene/` | Entire dormant subsystem is untested |

### Coverage Completeness Assessment

- **Strongest areas:** background math/config/path generation, hero controller/model, runtime config, cleanup queue, browser/device helpers.
- **Moderate areas:** content rendering and runtime orchestration. These are exercised, but still deserve broader integration tests.
- **Weakest areas:** entry bootstrap, lazy loading, direct GSAP timelines, canvas renderer internals, and the dormant scene subtree.
- **Overall:** the suite is healthy for the actively changing runtime helper layer, but not yet complete enough to protect a large refactor of the entrypoint, full rendering flow, or the visual systems.

## 5. `docs/` Folder Audit

### Dated Design Plans

| Date | File | Theme | Inferred status | Evidence / rationale |
|---|---|---|---|---|
| 2026-03-13 | `docs/plans/2026-03-13-founder-portfolio-design.md` | Founder-style portfolio pivot from starter WebGL demo | Partially implemented historically, later superseded | Architecture matches current codebase shape; homepage verification images include `founder-portfolio-*`, but the dark visual direction has been replaced by a warmer memo aesthetic. |
| 2026-03-13 | `docs/plans/2026-03-13-vite-webgl-scroll-design.md` | Initial Vite + WebGL + ScrollTrigger foundation | Implemented historically; now mostly legacy | `src/scene/*` and `webgl-scroll-*` verification captures still exist, but the live entrypoint no longer imports the scene system. |
| 2026-03-14 | `docs/plans/2026-03-14-deep-research-lab-color-system-design.md` | Darker research-lab palette | Draft / superseded | Current code uses a warm editorial base (`#efe7da`), not the five-color blue-gray palette proposed here. |
| 2026-03-14 | `docs/plans/2026-03-14-hero-ux-refactor-design.md` | Narrative-left / systems-right hero refactor | Largely implemented | Current runtime mounts a structured hero, keeps a functional visual surface on the right, and uses a mobile fallback strategy described in the plan. |
| 2026-03-14 | `docs/plans/2026-03-14-mobile-3d-hero-motion-design.md` | Restore 3D hero on mobile | Not implemented / superseded | `runtimeConfig.mobileHero` and `hero-mobile-mode` still indicate a mobile fallback path rather than shared 3D behavior. |
| 2026-03-14 | `docs/plans/2026-03-14-surface-detail-experimental-accent-design.md` | Experimental visual accents for the core object | Exploratory draft | No clear active runtime evidence; plan is explicitly experimental. |
| 2026-03-14 | `docs/plans/2026-03-14-system-core-detail-design.md` | Upgrade the 3D orbital core | Partially implemented in dormant code | `src/scene/createCoreObject.js` is very large and likely embodies this work, but the scene path is no longer active. |
| 2026-03-15 | `docs/plans/2026-03-15-agentos-liquid-glass-opening-design.md` | Lead-card + open-memo interaction refinement | Partially implemented / being replaced | Current code has a separate `Open memo` CTA and glassy button styling, but later deck-navigation work appears to be superseding this model. |
| 2026-03-15 | `docs/plans/2026-03-15-founder-research-memo-pencil-design.md` | Warm editorial founder/research memo aesthetic | Implemented / current baseline | Current content structure and warm palette align closely with this doc. |
| 2026-03-15 | `docs/plans/2026-03-15-hero-project-card-system-design.md` | Reusable multi-project hero card system | Largely implemented / current baseline | `projectRecords`, hero project controller, model/view split, and open-memo content model all align with this plan. |
| 2026-03-15 | `docs/plans/2026-03-15-project-deck-hover-navigation-design.md` | Equal-weight hover deck navigation | Partially implemented / active transition | Controller state names (`idle`, `candidate`, `committed`, `transition`) and deck verification captures align, but the current DOM still looks more like panel + rail than an equal-weight stacked deck. |

### Other Design Notes In `docs/`

| File | Type | Inferred status | Notes |
|---|---|---|---|
| `docs/background-animation-brainstorm.md` | Brainstorm / technical design note | Partially reflected in current code | Its "ambient signal field" direction aligns with the current canvas background system. |
| `docs/card-interaction-redesign.md` | Detailed interaction spec | Partially reflected in current code | The hero project controller’s multi-state interaction model appears to draw from this document. |
| `docs/verification/README.md` | Verification index | Current and useful | Documents what each screenshot folder is for and why PNGs are ignored by git. |

### Verification Screenshot Usage

`docs/verification/` is a local visual-QA archive. The markdown README is trackable, but the PNG files are intentionally ignored by git.

| Folder | What it is used for |
|---|---|
| `docs/verification/background/` | Compare canvas/background states, missing-layer regressions, refined visual passes, and pointer/hero background checks |
| `docs/verification/components/` | Isolated component review, currently centered on the `glassy-button` implementation |
| `docs/verification/deck/` | Hero project deck / command surface interaction states, focus states, and alternate structure experiments |
| `docs/verification/homepage/` | Full-page desktop/mobile/homepage state captures, including older `webgl-scroll` and newer `founder-portfolio` variants |

### Documentation Hygiene Issues

- Plan docs do not currently carry an explicit status header such as `draft`, `implemented`, `superseded`, or `archived`; the only way to infer status is by comparing them against source and screenshots.
- Several important current design/runtime notes are untracked (`docs/background-animation-brainstorm.md`, `docs/card-interaction-redesign.md`, `docs/verification/README.md`, many plan files), so collaborators or CI would not see them.
- The docs tree contains both historical plans and active plans, but no index page to explain what is current versus superseded.

## 6. Cleanup Recommendations

### A. Safe Or Likely Cleanup Candidates

| Candidate | Recommendation |
|---|---|
| `.ccb/**` | Keep local-only and add to `.gitignore` unless these session files are intentionally part of the repo workflow. |
| `CLAUDE.md` | Either formalize it as a tracked contributor note or ignore it as a local assistant-specific file. |
| `dist/**` | Continue treating as generated output; do not track build artifacts. |
| `src/scene/**` + `src/animations/scrollTimeline.js` | If the canvas background system has fully replaced the Three.js path, archive or remove this dormant tree. If not, reconnect and test it explicitly. |

### B. Modules That Should Be Split Or Reorganized

| Module | Why it should be reorganized | Suggested direction |
|---|---|---|
| `src/content/sections.js` (`562` lines) | Combines content data, markup templates, and page composition in one file | Split into `siteContent`, hero/project renderers, and section render helpers |
| `src/experience/createHeroProjectController.js` (`332` lines) | Mixes state changes, event wiring, pointer glow, keyboard handling, and scroll navigation | Split into controller state orchestration, input bindings, and navigation helpers |
| `src/background/createBackgroundSystem.js` (`298` lines) | Mixes lifecycle, resize, pointer state, animation loop, render orchestration, and DOM style syncing | Split into lifecycle/bootstrap, input state, render loop, and shell-style sync modules |
| `src/experience/heroProjectSwitcherModel.js` + `heroProjectSwitcherView.js` | Already form a pair, but live directly in `experience/` | Group under a dedicated `experience/heroProjectSwitcher/` folder for clarity |
| `docs/plans/` | Historical and active plans are mixed together | Add a `docs/plans/README.md` index with status tags and links |

### C. Tests That Should Be Added Next

Priority order reflects impact on the active runtime, not simply missing count.

| Module | Why it needs tests |
|---|---|
| `src/main.js` | Live entrypoint; currently no direct protection for mount/bootstrap wiring |
| `src/experience/bootstrapExperience.js` | Contains the motion-disabled fallback path and runtime bootstrap error handling |
| `src/experience/loadExperienceModules.js` | Central lazy-load fanout; breakage here would disable the entire experience layer |
| `src/experience/heroProjectSwitcherView.js` | DOM projection logic deserves direct assertions separate from controller input handling |
| `src/background/createBackgroundSystem.js` | Active visual engine lifecycle, resize, and pointer behavior are untested |
| `src/background/backgroundFieldRenderer.js` | Rendering math and draw routines are untested |
| `src/background/signalFieldTemplates.js` | Underpins path generation but has no direct guardrail |
| `src/utils/math.js` | Small file, but heavily reused across active modules |
| `src/animations/heroTimeline.js` and `src/animations/sectionTransitions.js` | Active animation choreography currently lacks direct regression tests |
| `src/scene/**` | Only if the legacy scene path is kept; otherwise remove instead of testing dormant code |

### D. Documentation And Repository Hygiene

- Track or intentionally ignore the new background system, new tests, and current plan docs as a coherent set. Right now source, tests, and docs for the same feature are split between tracked, modified, and untracked states.
- Add explicit status frontmatter or a simple header to every design plan, for example: `Status: current`, `Status: draft`, `Status: superseded`, `Status: archived`.
- Consider a small `docs/architecture.md` or keep `CLAUDE.md` tracked if the boot-sequence explanation should be available to humans as well as tooling.
- If verification screenshots are important to long-term design review, keep the README tracked and consider a naming/index convention so screenshots can be located from the corresponding plan or module.

## Appendix: Key Findings By Importance

1. The current app is no longer centered on the old Three.js `scene/` system. The live path uses `src/main.js` plus an async experience loader and a canvas background engine under `src/background/`.
2. The repository is in a transitional state: major runtime code, tests, and docs for the new background/hero interaction work are still untracked.
3. The test suite is healthy but not comprehensive; it protects helpers and model logic better than it protects the true boot path and visual-runtime integration.
4. The docs folder contains strong design history, but statuses are implicit. Several plans are clearly superseded, and that is not documented in the files themselves.
