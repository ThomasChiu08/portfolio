# Anthropic + Apple Fusion Redesign

**Date:** 2026-03-21
**Status:** In progress — awaiting Codex analysis
**Goal:** Fuse Anthropic (claude.ai) clarity with Apple spatial discipline

---

## Phase 1: Claude Analysis — Design Gap Assessment

| Dimension | Current | Anthropic/Apple Standard | Gap |
|-----------|---------|--------------------------|-----|
| Color temp | Warm parchment (#f4eee4) | Cool neutrals / pure white | 2-3 stops too warm |
| Typography | Serif headline + sans body | Extreme weight contrast, sans-dominant | Hierarchy imprecise |
| Whitespace | Moderate | Apple-level breathing room | Section padding needs +40-60% |
| Cards | Glass morphism, high density | Minimal cards, subtle depth | Visual noise in project deck |
| Navigation | Functional | Ultra-clean, restrained | Needs elevation |
| CTAs | Glassy buttons with icons | Text links or subtle buttons | Buttons too heavy |
| Grid | Two-column hero | Asymmetric tension | Lacks visual rhythm |

---

## Phase 2: Gemini Design Document — "Institutional Precision"

### 1. Color System: "Liquid Silver & Zinc"

```css
:root {
  /* Light Mode (Base: Studio White) */
  --ds-bg-primary: #FFFFFF;
  --ds-bg-secondary: #F5F5F7; /* Apple System Gray 6 */
  --ds-surface: rgba(255, 255, 255, 0.7);
  --ds-glass-blur: blur(20px) saturate(180%);

  /* Neutral Scale (Anthropic Zinc) */
  --ds-zinc-50: #FAFAFA;
  --ds-zinc-100: #F4F4F5;
  --ds-zinc-400: #A1A1AA;
  --ds-zinc-900: #18181B; /* Text Primary */

  /* Accents (Surgical Precision) */
  --ds-accent-blue: #0071E3; /* Apple Blue */
  --ds-accent-gold: #B6A48D; /* Subtle hardware gold for "Foundry" feel */
}
```

### 2. Typography System: "The Dramatic Grotesk"

- **Display:** 700-800 weight. Fluid size: `clamp(4rem, 10vw, 8rem)`. Letter-spacing: `-0.02em`.
- **Body:** 400 weight. 18px base. Line-height: `1.6`. Color: `var(--ds-zinc-400)` for secondary.

```css
h1 { font-weight: 800; letter-spacing: -0.022em; line-height: 1.1; }
.text-memo { font-family: 'Inter', sans-serif; font-feature-settings: "cv02", "cv03", "cv04"; }
```

### 3. Spacing & Grid: "Asymmetric Balance"

- 12-column grid, 80px safety margins (desktop)
- Hero Grid: 7-column content, 5-column visual
- Section Padding: `padding: 160px 0;`
- Container: `max-width: 1200px;`

### 4. Component Redesign

- **Navigation:** Floating "Precision Pill". `backdrop-filter: var(--ds-glass-blur)`. Text-only links.
- **Project Cards:** Remove borders. `1px` inner-glow stroke (`rgba(0,0,0,0.05)`). Shadow: `0 20px 40px rgba(0,0,0,0.04)`.
- **CTA Buttons:** Sharp 8px corners. Primary: Black bg, White text. Hover: `scale(1.02)` + bloom.

### 5. Interaction & Motion: "Fluid Physics"

- WebGL background reacts to scroll speed, not just position
- Text reveal: Staggered Slide-Up (`y: 40px → 0, opacity: 0 → 1`)
- Card hover: Content moves away from cursor, preview image scales 5%

### 6. Visual Hierarchy: "The Credibility Funnel"

1. Identity (Hero) → Massive headline + badge
2. Thesis (Context) → Centered 32px statement
3. Proof (Projects) → High-density glass cards
4. Action (Contact) → Full-screen dark takeover

### 7. Dark Mode: "Obsidian Studio"

```css
[data-theme='dark'] {
  --ds-bg-primary: #000000;
  --ds-bg-secondary: #0A0A0A;
  --ds-zinc-900: #FFFFFF;
  --ds-zinc-400: #A1A1AA;
  --ds-surface: rgba(20, 20, 20, 0.8);
}
```

### 8. Mobile: "Thumb-Driven Premium"

- Nav pins to bottom for reachability
- Cards use `100vw` bleed-edge imagery
- 44px minimum touch targets

---

## Phase 3: Problem Analysis

**Status:** Complete

Key risks identified and mitigated:
- Glass button system: restyled via CSS (black bg, white text, 12px radius) — JS unchanged
- Background canvas accents: shifted from warm to cool zinc RGB values
- Dark mode: moved from warm `#0f0e0d` to true obsidian `#000000`
- Typography: serif → sans-dominant with 800 weight, -0.022em tracking
- Test contracts: only 2 tests needed value updates (accent RGB), no structural breaks

---

## Phase 4: Implementation

**Status:** Complete — 2026-03-21

### Changes Applied
1. **Color system** — warm parchment (`#f4eee4`) → pure white (`#FFFFFF`) with zinc neutral scale
2. **Typography** — serif display → `SF Pro Display / Inter` sans-serif, weight 800
3. **Spacing** — section padding +40% (`clamp(120px, 14vw, 200px)`)
4. **Buttons** — glass morphism → solid black/white CTA with 12px radius
5. **Shadows** — brown-tinted `rgba(79,63,43)` → neutral `rgba(0,0,0)`
6. **Dark mode** — obsidian black `#000000` base, accent shifted to `#4DA3FF`
7. **Canvas background** — accent colors shifted to zinc spectrum
8. **Navigation** — updated to neutral glass pill with `saturate(180%)`

### Files Modified
- `src/style.css` — bulk redesign (color, typography, spacing, components)
- `src/background/backgroundConfig.js` — cool zinc accent colors
- `tests/background/background-config.test.js` — updated accent value assertion
- `tests/background/background-math.test.js` — fixed interpolation bounds check

### Verification
- 158/158 tests passing
- Production build successful
