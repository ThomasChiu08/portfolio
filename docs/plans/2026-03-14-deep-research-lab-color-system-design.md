# Deep Research Lab Color System Design

## Goal
Rebuild the site's color system around the approved five-color palette so the website feels deeper, calmer, and more like a research systems lab homepage than a dark tech portfolio.

## Palette Roles
- `#112132` — primary background, deepest scene space, footer/base surfaces
- `#202c45` — secondary background, elevated sections, sticky navigation shell
- `#4f6c90` — primary accent, system-line emphasis, primary CTA fill
- `#839ab8` — soft accent, hover/focus states, secondary highlights, node pulses
- `#e7e4e2` — primary text, high-contrast labels, quiet neutral highlight

## Direction
This pass should move the site toward a darker and more restrained research aesthetic:
- softer contrast than the current near-black / icy-white pairing
- more disciplined component hierarchy
- reduced glow and lighter glass effects
- tighter visual alignment between CSS surfaces and the Three.js scene

## System Rules

### Backgrounds
- Replace the current blue-black gradient with a deeper layered blend built from `#112132` and `#202c45`
- Keep section shifts subtle, using low-opacity elevated surfaces rather than obvious color banding

### Typography
- Move primary text to `#e7e4e2`
- Keep secondary and tertiary text cooler and dimmer, but avoid sharp OLED-style contrast

### Components
- Sticky nav, system cards, project cards, and thesis panels should all use the same surface family
- Borders should be thinner and slightly cooler, with less white opacity
- Primary CTA should use `#4f6c90`; focus and hover should move toward `#839ab8`

### Three.js Scene
- Background atmosphere should align with `#112132` / `#202c45`
- Rings, relays, connections, and particles should use restrained blue-gray tones from `#4f6c90` and `#839ab8`
- Scene lighting should become softer and less icy so the system map looks integrated with the page

## Validation
- Check that the hero headline remains the clearest element on the page
- Confirm cards are readable without bright glass edges
- Ensure desktop and mobile still feel like the same product
- Run `npm run build` after the color-system refactor
