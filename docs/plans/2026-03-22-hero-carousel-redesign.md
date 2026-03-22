# V1 Portfolio — Three-Workstream Plan

## Context

The portfolio site has a functional but uninspiring hero section. The current editorial card shows one project at a time with dot navigation — it reads like a data display, not a showcase. On mobile (< 760px), the hero card is **completely invisible** — users see only headline text. The site also lacks HTTP security headers. This plan covers three workstreams in priority order.

---

## Workstream 1: Hero Carousel Redesign (Priority: HIGH)

### Design Direction
**Apple-style full-width carousel** with generative WebGL art backgrounds per project.

User choices:
- Full-viewport-width slides (not side cards)
- Shader-driven generative art per project (OGL/WebGL)
- Auto-play with pause on hover
- Swipe on mobile, keyboard/arrows on desktop
- GSAP timeline for slide transport, Flip for inner content morphing only

### Visual Concept: "Cinematic Immersion" (from Gemini brainstorm)

Full-bleed viewport slides with content floating over shader backgrounds. Each project gets a unique generative visual identity:

| Project | Visual Metaphor | Shader Style | Palette |
|---------|----------------|--------------|---------|
| **agentOS** | Neural synapse | 3D point cloud with pulsing filament connections | Deep obsidian + electric indigo/cyan pulses |
| **FocusBox** | Depth of field | Gaussian bokeh that resolves to sharp geometry on idle | Monochrome slate + single amber focus target |
| **Quant Research** | Signal in noise | High-velocity data grid with glowing scanline + cursor warp | Pitch black + emerald green highlights |
| **Research Lens** | Prismatic refraction | Glass slab refracting typography with chromatic aberration | Pearlescent white + soft violet iridescence |

### Slide Layout (Desktop)

```
┌────────────────────────────────────────────────────┐
│  [WebGL Shader Background — full viewport width]   │
│                                                    │
│     01 / 04                                        │
│                                                    │
│     agentOS                                        │
│     An operating system for agent                  │
│     memory, delegation, and execution.             │
│                                                    │
│     ● Active build                                 │
│                                                    │
│     [Explore →]                                    │
│                                                    │
│     ─── ─ ─ ─        ◄  ►    [progress ring]      │
│                                                    │
└────────────────────────────────────────────────────┘
```

### Slide Layout (Mobile < 760px)

```
┌──────────────────────┐
│ [Shader BG - static  │
│  WebP fallback on    │
│  low-end devices]    │
│                      │
│  01 / 04             │
│                      │
│  agentOS             │
│  Agent memory &      │
│  execution OS        │
│                      │
│  ● Active build      │
│                      │
│  [Explore →]         │
│                      │
│  ─── ─ ─ ─           │
│                      │
│  ← swipe →           │
└──────────────────────┘
```

### Transitions Between Slides
- **Primary:** Noise-based dissolve mask (GLSL threshold) — current shader dissolves into next
- **Content:** GSAP Flip morphs inner content (title/metadata) only — NOT full-slide transport
- **Fallback (reduced motion):** Simple crossfade, 150ms

### Auto-play Behavior
- **Interval:** 6 seconds per slide (Apple-standard rhythm)
- **Pause triggers:** hover, focus, keyboard interaction, touch
- **Resume:** on pointer leave / blur (3s delay before resuming)
- **Stop:** when user manually navigates (don't fight user intent)
- **Off-screen:** pause via IntersectionObserver
- **Progress indicator:** thin ring on active dot that fills over 6s

### Micro-interactions
- Auto-play progress ring on active dot (thin border fill animation, 6s cycle)
- Cursor acts as gravity well in shaders (particles lean toward mouse)
- Magnetic nav arrows (subtle pull within 40px radius)
- Mobile: haptic feedback on snap (`navigator.vibrate`)

### Architecture Plan (Codex-validated, feasibility 7/10)

**Replace hero controller internals, keep runtime shell** — per Codex review:

> The hover-era state names `idle/candidate/committed/transition` are the wrong abstraction for carousel. `transition` currently means "navigating to linked section", not "slide animating" — reusing it couples selection, autoplay, and navigation in fragile ways.

**What to KEEP:**
- `clampIndex()`, slug lookup utilities from model
- Runtime boot sequence, GSAP/OGL lazy loading, cleanup queue
- Project data flow (`siteContent → bootstrap → runtime → controller`)

**What to REPLACE:**

1. **New Carousel Controller** (`createHeroCarouselController.js`) — replaces `createHeroProjectController.js`:
   - Explicit state: `activeIndex`, `direction`, `playState`, `pauseReasons`, `interactionState`
   - `playState`: playing | paused | stopped
   - `pauseReasons`: Set<'hover' | 'focus' | 'keyboard' | 'offscreen' | 'reducedMotion'>
   - Auto-play resumes only when ALL pause reasons are cleared
   - Clear separation: slide transition ≠ page navigation

2. **New Carousel View** (`heroCarouselView.js`) — replaces `heroProjectSwitcherView.js`:
   - Full-width slide rendering with track container
   - Progress ring SVG sync
   - Slide counter ("01 / 04")
   - Prev/next arrow buttons + play/pause toggle
   - Hidden slides marked `inert` (not just visually hidden)

3. **Extend Existing Shader Layer** (`src/webgl/createHeroShaderLayer.js`):
   - Already has: device gating, DPR caps, FPS caps, resize handling, `webglcontextlost` cleanup
   - Add: per-project shader program registry, program hot-swapping
   - Compile first shader on boot, preload next on idle
   - Mobile: only keep active program hot
   - Low-tier: CSS poster fallback, no live shader

4. **Slide Transport** — GSAP timeline, NOT Flip:
   - Use normal GSAP timeline for full-viewport slide transitions (opacity crossfade + subtle scale)
   - Keep Flip only for inner content morphing (title, metadata between slides)
   - GLSL noise dissolve as shader-level transition (optional, can ship crossfade first)

5. **CSS Changes** (`style.css`):
   - `.hero-carousel` — full viewport width, `100vw × 100svh` (use `svh` for mobile Safari)
   - `.hero-carousel__slide` — absolute positioned, opacity transitions
   - `.hero-carousel__content` — floating content overlay with z-index
   - `.hero-carousel__progress` — SVG circle progress ring
   - `.hero-carousel__controls` — prev/next arrows + play/pause
   - Remove old `.hero-projects__panel` editorial styles

6. **HTML** (`sections.js` / `sectionRenderers.js`):
   - Replace `<aside class="hero-projects">` with carousel markup
   - Structure: `track > slides + controls + pagination`
   - Single `<canvas>` element for shader (shared OGL renderer)

### Performance Strategy (Codex-validated)
- **Single OGL renderer + single canvas** — swap shader programs, not contexts
- **Extend `createHeroShaderLayer.js`** — already has device gating, DPR caps, FPS caps, resize, context loss handling
- **Shader LOD tiers:**
  - Desktop high: Full shader with cursor reactivity
  - Desktop medium/Tablet: Simplified shader, reduced particle count
  - Phone/low-tier: Static WebP poster, no live shader (fits existing `desktopMotion >= 1180px` gate)
- **Lazy compilation:** First shader on boot, preload next on `requestIdleCallback`
- **Cold compile risk:** Pre-warm adjacent shader during idle to avoid hitch on first auto-play transition
- **RAF budget:** Shader renders at device target FPS (already in runtimeConfig)

### Accessibility (WAI-ARIA APG Carousel Pattern)
Per Codex review and [WAI-ARIA APG](https://www.w3.org/WAI/ARIA/apg/patterns/carousel/):
- Container: `role="region"` + `aria-roledescription="carousel"` + `aria-label`
- Each slide: `role="group"` + `aria-roledescription="slide"` + `aria-label="N of M"`
- Hidden slides: `inert` attribute (genuinely non-interactive, not just translated off-screen)
- Rotation control: visible play/pause button with `aria-label`
- Live region: quiet during auto-rotation, `aria-live="polite"` only when stopped
- Pagination: carousel picker semantics, NOT `aria-pressed` toggle buttons (current pattern is wrong)
- Keyboard: Arrow keys navigate, Enter/Space toggles play/pause, Tab moves to next control
- `prefers-reduced-motion`: static images, no shader, instant crossfade, auto-play disabled
- Per [WCAG 2.2.2](https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide.html): auto-play must have pause/stop mechanism

### Risk Mitigations (from Codex)
| Risk | Mitigation |
|------|-----------|
| GPU pressure / context loss on iOS Safari | Single context, program swapping, `webglcontextlost` handler already exists |
| Compile hitch on first transition | Pre-warm adjacent shader on idle |
| Layout jump from `vh` browser chrome changes | Use `svh`/`dvh`, deterministic dimensions before JS |
| Observer swipe fighting vertical scroll | `lockAxis: true` + increased `dragMinimum` threshold |
| Off-screen slides tabbable by assistive tech | Use `inert` attribute on non-active slides |
| Reduced motion still logically auto-playing | Disable auto-play entirely when `prefers-reduced-motion` |

### Key Files to Modify
- `src/content/sections.js` (lines 91-100) — hero HTML structure
- `src/content/sectionRenderers.js` (lines 85-132) — panel/dot renderers → carousel slide renderers
- `src/style.css` (lines 715-849) — hero card CSS → carousel CSS
- `src/webgl/createHeroShaderLayer.js` — extend with per-project shader registry
- `src/experience/createExperienceRuntime.js` — wire new carousel controller
- `src/animations/heroTimeline.js` — update entrance animation for carousel

### New Files
- `src/experience/createHeroCarouselController.js` — carousel state + auto-play + interaction
- `src/experience/heroCarouselView.js` — slide rendering + ARIA sync
- `src/shaders/agentosProgram.js` — Neural synapse point cloud shader
- `src/shaders/focusboxProgram.js` — Bokeh depth of field shader
- `src/shaders/quantProgram.js` — Data grid scanline shader
- `src/shaders/researchProgram.js` — Prismatic refraction shader
- `src/shaders/glsl/` — GLSL vertex/fragment source files

### Deprecated Files (to remove after migration)
- `src/experience/createHeroProjectController.js`
- `src/experience/heroProjectSwitcherModel.js`
- `src/experience/heroProjectSwitcherView.js`
- `src/animations/heroProjectFlip.js`

### Test Strategy (Codex-recommended)
```
inputs: keyboard | dot click | prev/next | Observer swipe | autoplay timer | visibility/focus/hover
  → carousel controller
  → state: activeIndex / playState / pauseReasons / interactionState
  → outputs: DOM sync + ARIA | GSAP calls | shader activate/deactivate
```
- **Unit tests:** Index wrapping, pause-reason merging, auto-play stop/resume rules, transition guards
- **JSDOM integration:** Keyboard nav, focus behavior, ARIA updates, hidden-slide inertness, fake-timer auto-play
- **Adapter tests:** Mocked Observer, mocked Flip, mocked OGL program cache/context loss
- **Manual QA (not automatable):** Frame pacing, gesture feel, GPU stability on real devices
- **Existing test baseline:** 16 tests, 5 files, all green — maintain backward compat during migration

---

## Workstream 2: Mobile Adaptation (Priority: MEDIUM)

### Current State
- Responsive CSS exists for < 760px but hero card is invisible on mobile
- Device profiling is solid (performance tiers, FPS targeting, pixel ratio capping)
- Touch support exists via Observer plugin (swipe on hero card)
- Navigation uses horizontal scroll overflow on mobile
- Background canvas adapts via motion scaling (0.74x phone)

### Key Issues to Fix
1. **Hero card missing on mobile** — carousel redesign (WS1) solves this
2. **Navigation UX** — horizontal scroll nav is functional but not ideal for thumb reach
3. **Content sections** — need verification that all sections render well on small screens
4. **Touch targets** — ensure all interactive elements meet 44px minimum
5. **Viewport height** — `100svh` not used consistently, `100vh` can be wrong on mobile Safari

### Plan
- Mobile carousel design included in WS1
- Additional mobile audit after carousel is built
- Consider bottom nav or hamburger menu for mobile navigation
- Audit all sections at 375px, 390px, 414px widths (iPhone SE, 15, Plus)
- Test on real devices (Safari iOS, Chrome Android)

### Approach: Subagent-driven
Use 2-3 subagents in parallel:
- Agent 1: CSS audit — scan all media queries, find gaps
- Agent 2: Touch/gesture audit — verify all interactive elements
- Agent 3: Performance audit — canvas/shader mobile benchmarks

---

## Workstream 3: Security Hardening (Priority: LOW)

### Current Posture: 8/10
The site is a static client-side portfolio. No APIs, no auth, no cookies, no external data loading. Main gap is deployment-level HTTP headers.

### Findings (from exploration)
- **Content rendering:** Safe — `innerHTML` used but all content is hardcoded static, `escapeAttribute()` exists
- **Dependencies:** All current (gsap 3.14.2, ogl 1.0.11, vite 8.0.0)
- **No secrets** in codebase
- **No external API calls** (mailto: only, properly encoded)
- **localStorage:** Only stores theme preference

### Recommendations
1. **HTTP Security Headers** (deploy config, not code):
   ```
   Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self'
   X-Content-Type-Options: nosniff
   X-Frame-Options: DENY
   Referrer-Policy: strict-origin-when-cross-origin
   Permissions-Policy: geolocation=(), microphone=(), camera=()
   ```

2. **HSTS** (if HTTPS-only): `Strict-Transport-Security: max-age=31536000`

3. **SRI** for any future CDN scripts

4. **Regular `npm audit`** in CI/CD

### Approach: Codex Review
- Send full security analysis to Codex for scoring and validation
- Configure headers in deployment platform (Vercel/Netlify/Cloudflare)
- This is a deployment task, not a code change

---

## Execution Order

```
Phase 1: Hero Carousel Design Doc (this plan + provider brainstorm)
   ↓
Phase 2: Hero Carousel Implementation
   - Shader system (OGL manager + 4 project shaders)
   - Carousel HTML/CSS (full-width slides)
   - Controller updates (auto-play, progress ring)
   - Transitions (GLSL dissolve + GSAP Flip)
   - Mobile carousel variant
   ↓
Phase 3: Mobile Adaptation Audit
   - Run subagent audit across CSS, touch, performance
   - Fix issues found
   - Test on real devices
   ↓
Phase 4: Security Headers
   - Deploy config for HTTP headers
   - npm audit automation
```

---

## Verification

- [ ] Desktop: Carousel renders 4 slides with unique shader backgrounds
- [ ] Desktop: Auto-play cycles every 6s, pauses on hover
- [ ] Desktop: Arrow keys and dot navigation work
- [ ] Desktop: Flip transitions between slides are smooth
- [ ] Mobile: Carousel visible and swipeable on iPhone SE (375px)
- [ ] Mobile: Static fallback on low-tier devices
- [ ] Accessibility: Screen reader announces slide changes
- [ ] Accessibility: Reduced motion shows static images
- [ ] Performance: No jank on desktop high-tier (60fps)
- [ ] Performance: Mobile renders at target FPS from runtimeConfig
- [ ] Security: HTTP headers configured in deployment
- [ ] Build: `npm run build` succeeds, chunk sizes reasonable

---

## Provider Contributions

### Gemini (Creative Brainstorm)
- 3 visual concepts: Cinematic Immersion, Kinetic Deck, Fluid Portal → selected Cinematic Immersion
- 4 project shader metaphors with color palettes (incorporated above)
- Transition ideas: morph-wipe, depth push, Flip text morphing
- Mobile: vertical snap-scroll, battery-safe static fallbacks, bottom tray
- Micro-interactions: magnetic nav, progress ring, cursor gravity, haptic snap

### Codex (Architecture Review — Score: 7/10)
- **Critical:** Replace controller, don't extend — hover-era state machine is wrong abstraction
- **Critical:** Single WebGL context with program swapping, NOT 4 contexts
- **Critical:** ARIA carousel pattern differs from current toggle-button dots
- Extend existing `createHeroShaderLayer.js` (already has lifecycle management)
- Use GSAP timeline for slide transport, Flip only for inner content
- Detailed risk analysis: GPU pressure, compile hitch, layout jump, swipe conflicts
- Test strategy: unit + JSDOM integration + adapter tests + manual device QA
