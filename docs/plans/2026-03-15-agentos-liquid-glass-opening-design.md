# agentOS Liquid Glass Opening Design

## Goal
Refine the hero-side project system so `agentOS` opens with a clearer founder-grade introduction, resolve the current selection/detail interaction conflict, and replace the generic frosted-glass treatment with a calmer liquid-glass surface language.

## Current Problems
- The current hero stack overloads one control with two actions: selecting a project and opening its memo.
- The inline detail panel grows underneath the same stacked-card surface, which makes the transition read as appended content instead of a deliberate entry into a project opening.
- `agentOS` is the strategic lead project, but the current stacked treatment presents the three projects too evenly.
- The material treatment reads as soft glassmorphism because it relies on blur, milky fill, and shadow more than edge tension, surface continuity, and optical depth.

## Recommended Direction
Use a two-state hero project system:

1. `Selection state`
- `agentOS` appears as the lead card.
- Supporting projects are still present, but as subordinate selectors or slim companion cards rather than equal-weight stacked surfaces.
- Selecting a project swaps the lead-card preview only.
- The lead card contains a single explicit action: `Open memo`.

2. `Opening state`
- Clicking `Open memo` transitions the hero surface into a focused project opening.
- The selection controls remain available but recede visually or compact into a quieter header row.
- The opening state reads like the front page of a research memo, not an expanded product card.
- There is a single `Back` affordance that returns the surface to selection state.

## Interaction Model
### Selection state
- Top row: lightweight project pills for `agentOS`, `FocusBox`, and `Quant Research Platform`.
- Main surface: one lead card for the active project.
- Companion surface: one or two low-emphasis supporting project chips or mini-cards to maintain discoverability without competing with the lead card.
- Clicking a pill or supporting chip only changes the active project.

### Opening state
- The lead card transitions into a taller opening panel.
- The project title, thesis, and first supporting paragraph gain more space and hierarchy.
- Supporting sections are limited to a compact structure:
  - Current focus
  - Why it matters
  - Key ideas
  - Actions
- The main CTA remains `View project`, with `Read research` secondary.

### Accessibility
- Project selectors remain semantic `button` elements with `aria-selected`.
- `Open memo` is a separate semantic button.
- `Escape` closes the opening state.
- Focus returns to the lead card trigger after closing.

## Visual Direction
### Material language
- Keep the warm ivory base and editorial typography.
- Shift from frosted glass to liquid glass by reducing full-surface haze and emphasizing:
  - cleaner fill
  - brighter top-edge highlight
  - internal reflective banding near edges
  - more coherent surface silhouette
  - soft depth that feels poured, not fogged

### Composition
- Preserve the current hero grid and card footprint.
- Let the lead surface feel more singular and intentional.
- Reduce the sense of stacked collision and visual overlap.
- Favor one strong object over three equal visual planes.

### Motion
- Selection changes: gentle crossfade plus slight lateral or vertical surface drift.
- Opening transition: lead surface rises slightly, supporting selectors soften, opening panel resolves in place.
- Avoid springy or overshooting motion.

## Content Direction For agentOS
The `agentOS` opening should read like a memo cover rather than a generic product card.

Recommended structure:
- Label: `Primary Research Memo`
- Name: `agentOS`
- Thesis: one precise line on agent memory, delegation, and execution
- Supporting statement: one short paragraph on operational integrity and durable workflows
- Compact structure fields:
  - Current focus
  - Why it matters
  - Key ideas
- Actions:
  - View project
  - Read research
  - Back

## Implementation Notes
- Update the hero data model so each project has preview content and opening content separated cleanly.
- Refactor the hero project controller around two explicit states:
  - active project
  - opening open/closed
- Replace the old stacked-card detail panel logic with lead-card preview + opening surface logic.
- Rework the hero CSS surface treatment to deliver liquid-glass cues without turning the page into glossy consumer UI.

## Success Criteria
- Users can tell the difference between selecting a project and opening a memo without thinking about it.
- `agentOS` clearly reads as the lead project in the hero.
- The right-side surface feels calmer and more premium.
- The card reads as liquid glass rather than standard blur-heavy glassmorphism.
- Desktop remains elegant, and mobile keeps the same hierarchy in a simplified single-card format.
