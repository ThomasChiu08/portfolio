# Founder Portfolio Design

## Objective
Transform the starter WebGL demo into a premium founder-style personal site for Thomas Chiu: dark, restrained, cinematic, and precise.

## Visual Direction
- Dark editorial layout with large whitespace and soft structural borders
- Strong type hierarchy and minimal chrome
- Motion that feels calm and intentional rather than decorative
- No noisy glow stacks, generic glass cards, or heavy assets

## Content Structure
- Hero with identity, concise thesis, and clear next action
- Domain strip for Markets, Systems, AI Agents, and Focus
- Three core project cards: agentOS, FocusBox, and the trading / research system
- Thesis section with scroll-paced statements
- Closing section with founder-style contact links

## Architecture
- `content/sections.js` owns page copy and markup generation
- `scene/` owns the Three.js system-core setup, lights, particles, animation loop, and resize behavior
- `animations/` owns hero entrance, global scroll choreography, and section reveals
- `utils/` holds reusable device and math helpers

## Scene Direction
Replace the torus-knot with an abstract system core:
- structured central form
- thin orbital rings
- sparse nodes and particle drift
- subtle palette changes driven by scroll

## Validation
Success means:
- the build stays clean
- the browser console stays clean
- the page feels premium on desktop and mobile
- the 3D layer supports the story instead of dominating it
