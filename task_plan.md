# Task Plan

## Goal
Refine the Vite starter into a premium founder-style personal website for Thomas Chiu, using vanilla Vite, Three.js, and GSAP `ScrollTrigger`, with modular scene and animation architecture.

## Phases
- [completed] Finalize design direction and content structure
- [completed] Refactor source into scene, animation, content, and utility modules
- [completed] Rebuild page layout, copy, and visual system
- [completed] Replace the current WebGL object with a more premium system-core scene
- [completed] Tune scroll pacing, responsive behavior, and final polish
- [completed] Validate build, browser rendering, and console cleanliness

## Decisions
- Keep the project in vanilla Vite with no framework layer.
- Preserve Three.js and GSAP `ScrollTrigger`.
- Refactor into modular folders for scene setup, animations, content, and utilities.
- Use a dark editorial layout with restrained product-style cards instead of translucent demo panels.
- Offset and scale the WebGL system core for compact viewports so it does not crowd the hero copy.
- Split GSAP and Three.js into dedicated chunks and raise the warning threshold slightly to keep build output actionable.

## Errors Encountered
- Existing validation screenshots remain in the repo root because the available patch tool cannot delete binary files.
- Vite 8 rejected the object form of `manualChunks`, so chunk splitting had to use a function-based configuration.
