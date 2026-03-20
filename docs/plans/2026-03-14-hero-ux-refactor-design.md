# Hero UX Refactor Design

## Goal
Refactor the hero into a clearer systems-lab homepage for VCs, technical founders, AI builders, and researchers. The page should communicate Thomas Chiu's work within a few seconds while preserving the restrained research-lab aesthetic.

## Chosen Direction
Use a `narrative-left / functional-map-right` hero:

- Left column carries the systems story, positioning line, and primary actions
- Right column acts as an interactive system map instead of a decorative 3D object
- A structured `Current Systems` panel anchors the project narrative outside the 3D scene
- Mobile shifts to a simplified 2D systems layout instead of forcing the WebGL scene

## UX Changes

### 1. Legibility First
- Move away from pure black and pure white to blue-black surfaces and cool off-white text
- Reduce scene wash, glass opacity, and highlight intensity
- Keep motion subtle and secondary to the content hierarchy

### 2. Faster Narrative Comprehension
- Keep the headline focused on systems across markets, software, and AI agents
- Add a dedicated positioning line directly under the headline
- Keep CTA choices clear: explore systems or read research

### 3. Functional System Visualization
- Keep the topology-style Three.js scene, but turn it into a semantic systems map
- Primary nodes represent `agentOS`, `FocusBox`, and `Trading Research System`
- Secondary relay nodes represent infrastructure and research modules
- Hover shows a tooltip; click scrolls to the relevant section

### 4. Stronger Navigation
- Convert the top nav into a high-contrast sticky control bar
- Include `Systems`, `Research`, `About`, `Contact`, and `X`
- Make `Contact` and `X` visually more noticeable than passive nav items

### 5. Mobile Strategy
- Disable the heavy WebGL scene on small screens
- Keep the static research-lab background
- Replace the interactive map with a compact 2D systems stack

## Validation Targets
- Users should understand the site thesis in under 3 seconds
- Primary systems should be visible without interacting with the scene
- Desktop should feel interactive; mobile should feel stable and fast
