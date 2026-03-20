# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start Vite dev server
npm run build    # Production build
npm run preview  # Preview production build
npm test         # Run Vitest in watch mode
npx vitest run   # Run tests once (CI-friendly)
npx vitest run tests/device.test.js  # Run a single test file
```

No linter is configured yet.

## Architecture

This is a **motion-first portfolio website** built with vanilla JS, GSAP animations, and a canvas-based background system.

### Boot Sequence

`index.html` → `src/main.js` → `bootstrapExperience()` → `createExperienceRuntime()`

1. **main.js** — Mounts DOM via `mountExperiencePage()`, detects device capabilities, calls bootstrap
2. **bootstrapExperience.js** — Async-loads all modules via `loadExperienceModules()`, creates runtime, registers HMR cleanup
3. **createExperienceRuntime.js** — Registers GSAP plugins, creates hero controller, background system, and animation context; returns a `destroy()` function

### Key Systems

- **experience/** — Runtime orchestration. The hero project switcher uses a **model/view split**: `heroProjectSwitcherModel.js` (state machine: idle → candidate → committed → transition) and `heroProjectSwitcherView.js` (DOM rendering)
- **background/** — High-performance 2D canvas renderer with signal field visualization, section-aware state transitions, and pointer tracking. Entry: `createBackgroundSystem.js`
- **animations/** — GSAP timelines and ScrollTrigger-driven section transitions. `heroTimeline.js`, `scrollTimeline.js`, `sectionTransitions.js`
- **scene/** — Three.js 3D scene (currently unused but chunked separately in build)
- **utils/device.js** — Device profiling with performance tiers (high/medium/low) that drive adaptive rendering decisions

### Patterns

- **Cleanup Queue** (`createCleanupQueue.js`) — LIFO destruction stack. Every system registers its cleanup function. Essential for HMR and preventing memory leaks.
- **Lazy Module Loading** — `loadExperienceModules.js` uses `Promise.all` with dynamic imports for code-splitting
- **Immutable Config** — `runtimeConfig.js` exports frozen breakpoint/config objects

### CSS

Global CSS variables in `src/style.css`. Responsive breakpoints defined in `src/experience/runtimeConfig.js` (phone: 760px, tablet: 1080px, desktopMotion: 1180px).

## Testing

- **Framework:** Vitest with jsdom environment
- **Setup file:** `tests/helpers/browserMocks.js` — provides `setViewportSize()`, `setNavigatorCapabilities()`, `mockMatchMedia()` for browser API mocking
- Each test file declares `// @vitest-environment jsdom` at the top
- Tests mock GSAP and ScrollTrigger rather than loading them

## Build

Vite with manual chunks splitting `three` and `gsap` into separate bundles (`vite.config.js`).
