# Vite WebGL Scroll Design

## Objective
Bootstrap the repository as a small Vite application, then add GSAP `ScrollTrigger` and Three.js to create a scroll-reactive WebGL landing page foundation.

## Chosen Approach
Use Vite with the vanilla JavaScript template. This keeps the runtime surface small and makes direct integration with Three.js and GSAP straightforward.

## Architecture
- `index.html` provides the application shell.
- `src/main.js` initializes layout behavior, the Three.js scene, and GSAP scroll triggers.
- `src/style.css` defines the full-page scroll sections and fixed canvas presentation.

## Scene Design
Create a simple Three.js scene with:
- a perspective camera
- ambient and directional lighting
- a single torus-based mesh group
- continuous render loop plus resize handling

## Scroll Interaction
Register `ScrollTrigger` and map scroll progress to:
- mesh rotation
- mesh scale
- camera position
- overlay content motion

## Validation
Success means:
- the Vite dev server starts cleanly
- the WebGL canvas renders
- scroll changes the scene smoothly without console errors
- resizing the window keeps the scene aligned
