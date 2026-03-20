# Hero Project Card System Design

## Goal
Upgrade the hero-side `agentOS` memo card into a reusable multi-project interaction system without changing the overall page structure or visual tone.

## Chosen Direction
- Keep the existing hero copy and overall two-column layout
- Replace the single memo card with a stacked project-card system
- Use an inline expandable detail panel inside the hero card area
- Avoid routing and modal complexity for this pass

## Interaction Model
- One active project at a time
- Users can switch active projects through selector pills or by clicking a visible stacked card
- Clicking the active project opens the inline detail view
- If the detail view is open, switching projects updates the detail content in place
- `Back` and `Escape` close the detail panel

## Content Model
Each hero project includes:
- `slug`
- `name`
- `label`
- `thesis`
- `description`
- `focus`
- `whyItMatters`
- `principles`
- `links`

## UX Notes
- Desktop: layered card stack with subtle offset and scale changes
- Mobile: cards become a vertical selectable list with the detail panel below
- Motion stays restrained: soft fade, translate, and scale only
- Keep semantic buttons and keyboard support
