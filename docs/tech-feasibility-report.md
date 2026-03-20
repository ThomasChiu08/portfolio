# Technical Feasibility Report

Date: `2026-03-20`

Scope: assessment based on the current V1 codebase, current production build behavior, and a small set of official external references for GSAP, OGL, MDN, and WebKit platform behavior.

## Executive Summary

- The current V1 runtime is already optimized around a **Canvas 2D background system** plus **moderate GSAP hero/reveal motion**. The old `src/scene/` Three.js path is not part of the live entrypoint.
- If the project wants WebGL back, the best technical path is **not** to revive the old `scene/` tree. The best path is a **small, lazy-loaded OGL-powered shader layer** for one narrow visual job, usually in the hero or as a subtle signal/liquid distortion overlay.
- GSAP is already a major shipped runtime dependency. Expanding motion with **Flip** and **SplitText** is feasible, but **DrawSVG** only makes sense if the design intentionally adds SVG linework. Long `pin`/`scrub` scenes should be treated cautiously on iPhone Safari.
- The biggest current iPhone risk is **not GSAP**. It is the combination of **multiple `backdrop-filter` glass layers**, a **fixed full-screen background**, and an **always-on animated canvas** under those layers.
- The project already has several good mobile safeguards: DPR caps, FPS caps, reduced-motion handling, `100svh` hero sizing, passive scroll scheduling, and touch-aware interaction fallbacks. The biggest missing pieces are **safe-area support**, **touch-action hints**, and **a stronger mobile blur downgrade**.

---

## 1. WebGL Introduction Assessment

### Current Technical Context

The live visual stack is currently:

- `src/main.js`
- `src/experience/createExperienceRuntime.js`
- `src/animations/heroTimeline.js`
- `src/animations/sectionTransitions.js`
- `src/background/createBackgroundSystem.js`
- `src/style.css`

Important constraints:

- The active runtime does **not** use `src/scene/`.
- `three` is still listed in `package.json`, but the current production build emits **no `three` chunk**.
- The current production build already ships:
  - `gsap` chunk: about `113.10 kB` raw / `44.48 kB` gzip
  - `createBackgroundSystem` chunk: about `15.78 kB` raw / `5.41 kB` gzip
  - main JS chunk: about `25.56 kB` raw / `8.07 kB` gzip
  - CSS: about `29.95 kB` raw / `7.01 kB` gzip

### Best WebGL Strategy Without Reviving `scene/`

**Recommendation: use OGL with a custom fragment shader, loaded lazily, for a single visual responsibility.**

Best-fit use cases:

- Hero-only fluid/light refraction layer
- Signal-field bloom/distortion overlay
- Subtle paper/liquid shimmer behind the hero memo deck
- Pointer-reactive but low-geometry shader plane

Avoid:

- Rebuilding the old scene graph
- Full 3D geometry and camera choreography
- A second always-on full-page renderer unless it replaces the current Canvas 2D system entirely

### Recommended Option Comparison

| Option | Fit for this project | Pros | Cons | Recommendation |
|---|---|---|---|---|
| **OGL + custom shader** | Best overall fit | Minimal abstraction, shader-friendly, tree-shakable, lower conceptual weight than Three.js | Still requires shader/WebGL expertise | **Recommended** |
| **Three.js** | Weak fit for current direction | Strong ecosystem, easy scene graph, proven tooling | Reintroduces the architecture the project is trying to retire; likely larger bundle and larger maintenance surface | **Only if product direction returns to true 3D scenes** |
| **Raw WebGL + GLSL** | Technically valid, operationally expensive | Smallest runtime surface | Highest engineering cost, lowest maintainability, more boilerplate | **Not recommended for this team/project phase** |
| **“GLSL shader” as a standalone answer** | Incomplete framing | Shaders are the right visual primitive | GLSL still needs a host runtime (OGL, raw WebGL, or Three.js ShaderMaterial) | **Use GLSL through OGL** |

### Why OGL Is the Best Fit

OGL’s own docs describe it as a **minimal WebGL library** with **zero dependencies**, a low abstraction level, and a full-library size guide of about **29 kB minzipped** before tree shaking. That makes it much better aligned with the current V1 architecture than Three.js, which is designed for broader scene-graph use.

Why this matters for V1:

- V1 already has a stable **DOM + GSAP + Canvas 2D** architecture.
- The next WebGL win is likely a **single procedural effect**, not a geometry-heavy scene.
- OGL makes it easy to build:
  - one renderer
  - one full-screen or hero-sized quad
  - one fragment shader
  - a few uniforms driven by time, pointer, and scroll state

That is exactly the level of complexity the current codebase can absorb safely.

### Coexistence With The Current Canvas 2D Background

The safest architecture is **coexistence**, not replacement.

#### Preferred coexistence model

- Keep `createBackgroundSystem()` as the full-page ambient background.
- Add a separate **hero-local WebGL surface** or a **secondary canvas layer inside `.scene-shell`**.
- Drive the WebGL effect from the same runtime signals already available:
  - reduced motion
  - device profile
  - section state
  - pointer position

Good integration points:

- New module: `src/webgl/createHeroShaderLayer.js`
- Loaded lazily from `src/experience/loadExperienceModules.js`
- Lifecycle owned by `createExperienceRuntime()`
- Cleanup registered with `createCleanupQueue()`

#### Recommended layering

Option A: hero-local

- Mount inside `.hero-visual`
- Only active in the hero
- Lowest performance risk

Option B: scene-shell overlay

- Mount as `.scene-shell__webgl`
- Place it between atmosphere and 2D signal canvas, or above the signal canvas if it is only a subtle distortion layer
- Higher visual payoff, but higher compositing risk on iPhone

### When WebGL Should Replace Canvas 2D Instead

Only replace the current Canvas 2D background if all of these become true:

- The visual goal requires true shader-space behavior that Canvas 2D cannot fake cleanly
- You are willing to reduce the current multi-layer glass treatment
- You want one renderer, not two
- You are ready to rebuild section-state color transitions and pointer behavior into shader uniforms

At the current project stage, **replacement is higher risk than reward**.

### Bundle Size And Performance Impact

#### Current baseline

- `gsap` is already the heaviest active bundle chunk.
- `three` is not in the current runtime output, despite still being in dependencies/config.

#### Expected impact by option

| Option | Bundle impact | Runtime impact | Practical note |
|---|---|---|---|
| OGL lazy-loaded for hero | Moderate | Moderate if kept local | Likely acceptable |
| OGL full-page always-on | Moderate | Higher | Still possible, but now competes with current Canvas + blur stack |
| Three.js reintroduced | High | Higher | Likely a large vendor chunk plus larger engineering scope |
| Raw WebGL | Low bundle | Depends entirely on implementation | Engineering cost is the real price |

#### Real recommendation

- If WebGL is added, **load it only on desktop-class devices first**
- Keep it **lazy-loaded**
- Prefer **one quad + one fragment shader**
- On phones:
  - disable it entirely, or
  - replace it with a static gradient/noise fallback

### Final WebGL Recommendation

**Best choice: OGL + a small custom fragment shader, lazy-loaded, scoped to the hero or one narrow overlay job.**

This gives the best balance of:

- visual upside
- bundle restraint
- maintainability
- compatibility with the existing Canvas 2D system
- low risk to the current runtime architecture

---

## 2. GSAP + ScrollTrigger Enhancement Assessment

### Current Animation Complexity

#### `heroTimeline.js`

Current complexity: **moderate-low**

What it does:

- One intro timeline
- About eleven `fromTo()` steps
- Mostly opacity + `y` + slight `scale`
- Optional scene-controller branch exists, but the live runtime passes `sceneController: null`

Current effect profile:

- editorial entrance
- staged hero reveal
- low mathematical complexity
- low ScrollTrigger complexity

This is not currently an over-engineered GSAP system. It is fairly restrained.

#### `sectionTransitions.js`

Current complexity: **low**

What it does:

- One reveal animation per `.js-section-reveal`
- `once: true`
- no pinning
- no scrubbed timeline
- no nested triggers

This is close to the safest way to use ScrollTrigger.

### Current ScrollTrigger Risk Level

**Current risk is low.**

Why:

- no `pin`
- no long scrubbed scenes
- no fake smooth scrolling layer
- no ScrollTrigger-driven full-page layout rewrites

The current ScrollTrigger use is conservative and appropriate.

### Feasibility Of More GSAP Plugins

GSAP’s official installation docs now state that **GSAP and all plugins are freely available on npm**. So the main constraint is no longer licensing friction; it is runtime cost and design fit.

#### SplitText

**Feasibility: medium-high**

Best use:

- hero title reveal
- section heading word/line staging
- short editorial moments

Benefits:

- stronger premium motion
- better control over text staging than pure CSS/DOM fades
- responsive re-splitting support with `autoSplit` and `onSplit()`

Risks in this codebase:

- the hero uses large serif typography and responsive line wrapping
- line-based splitting can break visually when fonts load or the viewport changes
- DOM inflation can become expensive on mobile if applied broadly

Recommendation:

- Use it only for:
  - hero title
  - 1-2 section headings
- Prefer `lines` or `words`, not `chars`, unless the text is very short
- Use GSAP’s recommended `autoSplit` + `onSplit()` pattern
- Disable on phone or reduced-motion

#### Flip

**Feasibility: high**

Best use:

- hero project deck transitions
- switching between panel/rail layouts
- future card-to-detail transitions

Why it fits:

- the current hero project system already has explicit state transitions (`idle`, `candidate`, `committed`, `transition`)
- Flip is strongest when the DOM layout changes while the user should perceive continuity

This is a strong candidate for the next meaningful GSAP upgrade.

#### DrawSVG

**Feasibility: low-medium**

Best use:

- if the design adds real SVG route lines, schematic strokes, or memo diagrams

Current mismatch:

- the current background system is Canvas 2D, not SVG
- the hero deck and content system are DOM/CSS, not SVG-led

Recommendation:

- Do **not** add DrawSVG just because it is available
- Only use it if the design intentionally introduces SVG path artwork

#### Other GSAP upgrades with better ROI than DrawSVG

Higher-fit options for this codebase:

- `Flip` for deck/layout continuity
- `CustomEase` for more authored motion language
- `Observer` if the project adds gesture- or wheel-driven state changes
- `SplitText` for selective editorial moments

### ScrollTrigger `pin` / `scrub` Risk Assessment

#### Desktop

Moderate and manageable if used carefully.

#### iPhone Safari

**High risk when combined with the current visual stack.**

Why:

- fixed full-screen background layer
- animated Canvas 2D
- multiple translucent/blurred glass surfaces
- responsive toolbar behavior in Safari
- potential heavy repaints during scroll-linked animation

Specific high-risk combinations:

- `pin: true` on hero or other full-height sections
- long scrubbed timelines tied to large DOM trees
- scrubbed transforms on elements that also use blur-heavy surfaces
- multiple overlapping pinned sections

#### Safe guidance

| Pattern | Feasibility |
|---|---|
| simple `once: true` reveals | Very safe |
| short `scrub` on one or two transforms | Safe on desktop, cautious on mobile |
| hero pinning on desktop only | Possible |
| hero pinning on iPhone Safari | Not recommended |
| long scrub + pin + full-screen glass layers | High risk |

#### Recommendation

- Keep the current reveal model on mobile
- If adding scrub:
  - limit it to desktop / large tablet via `matchMedia()`
  - animate lightweight properties only
  - avoid pinning the hero on iPhone
- If adding a marquee scroll moment:
  - use one short section
  - keep it local
  - do not stack it on top of the full mobile blur load

### Final GSAP Recommendation

- Keep the current GSAP baseline
- Add **Flip** first
- Add **SplitText** selectively and only on large, short text surfaces
- Treat **DrawSVG** as optional and only if SVG becomes a real visual primitive
- Avoid long `pin`/`scrub` scenes on iPhone Safari

---

## 3. iPhone Mobile Performance Baseline

### Current iPhone Risk Profile

The iPhone risk is mixed:

- **Good:** the JavaScript runtime already has thoughtful device-tier degradation
- **Risky:** the CSS visual system uses several concurrent glass/blur layers

### What Is Already Done Well

#### Runtime/device adaptation already present

From `src/utils/device.js`:

- phone/tablet/touch detection
- reduced-motion detection
- lower phone FPS caps
- lower phone DPR caps
- reduced motion scale on weaker hardware

This is real performance work, not just styling.

#### Background runtime already has good safeguards

From `src/background/createBackgroundSystem.js` and `createSectionStateController.js`:

- `requestAnimationFrame` only when motion is enabled
- visibility pause when the tab is hidden
- FPS throttling via `profile.maxFps`
- DPR capping
- passive scroll listener on section-state updates
- pointer listeners disabled for touch-mode interaction paths

#### Mobile layout adaptation already present

From `src/style.css` and runtime config:

- `100svh` on the hero
- `100svh`/`72svh` usage instead of relying only on old `100vh`
- reduced-motion scroll behavior fallback
- narrower mobile layout
- horizontal rail fallback instead of hover-only UI
- `hero-mobile-mode` visual reductions

#### Touch interaction strategy already present

From `createHeroProjectController.js`:

- one input model using pointer/click/keyboard
- touch devices switch to tap semantics rather than hover preview semantics

This is preferable to maintaining a separate custom touch event stack unless gesture complexity increases further.

### Current iPhone Risk Points

#### 1. `backdrop-filter: blur(...)` on iOS Safari

**Risk level: high**

Current usage appears in:

- masthead
- glassy buttons
- hero systems card
- hero project panel

Why it is risky:

- `backdrop-filter` applies effects to the pixels behind the element
- the page background behind those elements is already visually busy
- the site also has a fixed full-screen scene shell and animated canvas
- on iPhone Safari, this combination often increases GPU compositing cost and can create visible scroll softness or interaction jank

Practical implication:

- the glass system is probably the current mobile bottleneck before WebGL is even introduced

Recommendation:

- add a stronger mobile downgrade:
  - lower blur radius
  - fewer layered translucent surfaces
  - flatter fills on phone
- keep premium glass on desktop first, not equally on all devices

#### 2. Canvas animation under iPhone low-power conditions

**Risk level: medium**

Important platform fact:

- iOS Safari does not offer a reliable “low power mode” web API that the app can read directly

What the current code already does:

- caps FPS on phones
- caps DPR on phones
- reduces motion on weaker profiles
- pauses when hidden

What is still missing:

- dynamic quality reduction based on actual frame time
- a runtime “quality governor” if a phone starts missing frame budget

Recommendation:

- keep the current FPS/DPR caps
- add optional frame-time monitoring:
  - if the average frame delta spikes for a sustained window, reduce dust/node counts or reduce update frequency further

#### 3. Touch handling and the historical 300ms delay

**Risk level: low on modern iPhone Safari, but still worth tightening**

Relevant current facts:

- `index.html` already sets `width=device-width, initial-scale=1.0`
- interactions are driven by click/pointer events rather than custom delayed touch logic
- there is no FastClick-style workaround, which is good

WebKit’s fast-tap behavior has removed or reduced the old tap delay in modern responsive scenarios, so the project does **not** need a FastClick-era workaround.

What is still missing:

- explicit `touch-action` hints

Recommendation:

- add `touch-action: manipulation` to clearly tappable controls
- add `touch-action: pan-x` on the horizontal mobile rail if gesture arbitration becomes messy

This is a good hardening step even if the site already feels responsive.

#### 4. Viewport and safe-area handling

**Risk level: medium**

What is already good:

- `100svh` is used for key sections

What is missing:

- `viewport-fit=cover` in the viewport meta tag
- `env(safe-area-inset-top/right/bottom/left)` padding rules
- any explicit keyboard/interactive-widget viewport policy

Current implication:

- the site is not truly notch-aware
- it is likely okay because it is not currently trying to paint edge-to-edge into unsafe regions
- but the fixed masthead and future immersive hero treatments will eventually need proper safe-area support

Recommendation:

- add:
  - `viewport-fit=cover`
  - safe-area-aware padding for masthead and edge-sensitive surfaces
- consider `interactive-widget` only if form-heavy flows appear later

#### 5. Scroll-linked motion on iPhone Safari

**Risk level: currently low, potentially high if expanded**

Current state:

- current section reveals are simple and safe
- there is no live `pin`/`scrub` choreography

Risk if expanded:

- once pinning/scrubbing is combined with blur and fixed layers, Safari will be much less forgiving

Recommendation:

- preserve today’s “simple reveals on mobile” posture
- gate richer scroll-linked scenes to desktop unless mobile testing proves otherwise

### iPhone Adaptation Matrix

| Area | Already handled | Missing / weak |
|---|---|---|
| responsive breakpoints | Yes | No major issue |
| reduced motion | Yes | Could be extended into stronger mobile fallback tiers |
| phone FPS / DPR caps | Yes | No frame-time-based adaptive governor |
| mobile hover fallback | Yes | Could still refine touch-action hints |
| passive scroll scheduling | Yes | Good |
| safe-area / notch handling | No | Needs viewport-fit + env() |
| keyboard viewport handling | No | Low priority today |
| blur downgrade on phone | Weak | Needs stronger policy |
| low-power mode awareness | Partial only | No direct API-based detection possible; rely on adaptive degradation |
| 300ms tap delay mitigation | Implicitly okay | Could add touch-action hints |

### Final iPhone Recommendation

The project is **not unprepared for iPhone**. It already has several strong runtime-level performance controls.

However, the current iPhone bottleneck is likely:

1. heavy glass/blur compositing
2. then scroll-linked visual complexity
3. only after that, potential new WebGL work

So the correct order of optimization is:

1. reduce mobile blur cost
2. add safe-area handling
3. add touch-action hints
4. keep scroll-linked motion conservative on iPhone
5. only then consider adding a small WebGL layer

---

## Recommended Implementation Order

### Stage 1: Mobile Hardening First

- Add `viewport-fit=cover`
- Add safe-area padding with `env(safe-area-inset-*)`
- Add stronger mobile blur downgrade
- Add `touch-action` hints on controls and rail

### Stage 2: GSAP Motion Upgrade

- Add `Flip` for hero project deck continuity
- Optionally add `SplitText` for the hero title on desktop only
- Keep mobile section reveals simple

### Stage 3: WebGL Pilot

- Add one lazy-loaded OGL hero shader layer
- Desktop only at first
- No reintroduction of the old `scene/` architecture
- Measure on iPhone before any broader rollout

---

## Final Recommendations

### WebGL

- **Use OGL, not Three.js**
- **Use a custom shader, not a revived scene graph**
- **Coexist with Canvas 2D first**
- **Scope the first version to the hero**

### GSAP

- **Flip is the best next plugin**
- **SplitText is feasible, but use it selectively**
- **DrawSVG is only worth it if SVG enters the design**
- **Avoid hero pinning on iPhone Safari**

### iPhone

- **Treat blur as the main performance risk**
- **Current canvas runtime is already reasonably guarded**
- **Add safe-area and touch-action hardening before introducing more visual complexity**

---

## External References

- GSAP installation and plugin availability: https://gsap.com/docs/v3/Installation
- GSAP SplitText: https://gsap.com/docs/v3/Plugins/SplitText/
- GSAP Flip: https://gsap.com/docs/v3/Plugins/Flip/
- GSAP DrawSVG: https://gsap.com/docs/v3/Plugins/DrawSVGPlugin/
- GSAP ScrollTrigger: https://gsap.com/docs/v3/Plugins/ScrollTrigger/
- OGL docs: https://oframe.github.io/ogl/
- OGL repository: https://github.com/oframe/ogl
- MDN viewport meta: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/meta/name/viewport
- MDN `env()`: https://developer.mozilla.org/en-US/docs/Web/CSS/env
- MDN `backdrop-filter`: https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/backdrop-filter
- WebKit responsive tapping on iOS: https://webkit.org/blog/5610/more-responsive-tapping-on-ios/
