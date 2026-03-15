# Project Deck Hover Navigation Design

## Goal
Replace the current hero-side lead-card opening system with an equal-weight stacked project deck that feels calm, premium, and readable while matching the site's editorial liquid-glass direction.

## Approved Constraints
- The three hero projects are equal-weight, not permanently ordered by importance.
- The cards should stack front-to-back so users can perceive multiple projects immediately.
- Hovering a card should bring it forward and reveal a short preview only.
- Clicking a card should jump to the corresponding project section on the homepage.
- Dedicated project pages are deferred.

## Current Problems
- The current lead-card plus supporting memo layout no longer matches the desired interaction model.
- The explicit opening state is too heavy for a hero-side project navigator.
- Supporting cards read as secondary utilities, not as first-class project objects.
- The current right-side surface is cleaner than before, but it is still optimized for preview plus detail, not hover-based comparison.

## Recommended Direction
Use a single interactive `Project Deck` surface:

1. `Idle`
- Three overlapping cards are visible.
- One card sits in front by default.
- The rear cards remain readable enough to signal there are multiple projects.

2. `Hover / focus`
- The hovered card rises to the front.
- The active card reveals:
  - project label
  - project name
  - one-line thesis
  - short preview sentence
- Inactive cards compress down to the essentials.

3. `Click`
- Clicking the active or hovered card scrolls to the matching project section in the page.
- The click transition should feel intentional but brief, not like entering a modal state.

## UI Structure
- Keep the hero right column and outer shell.
- Remove the current selector pills and inline opening panel.
- Use one small shell label, such as `Project deck`.
- Make the deck itself the primary navigator.

Each card contains:
- memo label
- project name
- thesis
- one short hover preview
- a quiet cue like `View section`

## Motion
- Rear cards use restrained vertical offsets and slight scale reduction.
- Hover or focus:
  - card moves to front
  - opacity strengthens
  - preview sentence fades in
  - rear cards settle back slightly
- Click:
  - small press response
  - smooth scroll to target section

Avoid:
- springy motion
- dramatic fan rotation
- modal-like expansion

## Material Direction
- Preserve the liquid-glass shell around the deck.
- The cards themselves should feel like lighter liquid memo tiles inside that shell.
- Keep edge highlights, clean fill, and restrained translucency.
- Do not return to foggy blur-heavy glassmorphism.

## Mobile Direction
- Desktop keeps the stacked hover deck.
- Mobile falls back to a simple vertical card list or compressed stack because hover is unavailable.
- Mobile click still jumps to the corresponding section.

## Accessibility
- Cards remain semantic buttons.
- Focus state should mirror hover state.
- Click target is the whole card.
- Reduced-motion users still get hierarchy changes without large translations.

## Success Criteria
- The hero immediately communicates that there are multiple projects.
- Hover comparison feels elegant and understandable.
- Clicking a project reliably takes users to the matching section.
- The deck feels integrated with the site's editorial liquid-glass language.
