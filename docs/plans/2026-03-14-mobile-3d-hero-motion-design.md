# Mobile 3D Hero Motion Design

## Goal
Restore the Three.js hero on mobile while keeping the same systems-lab design language across desktop and mobile. The mobile version should feel like the same product, not a downgraded alternate layout.

## Chosen Direction
Use one shared 3D hero system with two motion densities:

- Desktop keeps richer depth, wider composition, and pointer-aware motion
- Mobile keeps the same 3D world but uses fewer nodes, tighter framing, lower motion amplitude, and touch-safe layout
- GSAP and ScrollTrigger act as the cinematic choreography layer for both

## Key Decisions

### 1. Keep 3D On Mobile
- Do not replace the hero with a separate 2D card stack
- Keep the same system-map visual language on all breakpoints
- Lower scene density and motion intensity on mobile instead of removing the scene

### 2. Same Visual Language, Different Density
- Same color system, same card style, same narrative hierarchy
- Fewer labels and fewer particles on small screens
- Closer camera framing and stronger composition control for phone widths

### 3. Motion As Narrative
- Use GSAP intro motion to stage the hero, card, and scene together
- Use ScrollTrigger to gently reframe the system map as the user scrolls
- Mobile motion should feel stable and precise, not busy

### 4. Mobile-First Optimization
- Keep touch targets large and avoid hover-dependent UX
- Use lower DPR caps, lower FPS caps, and lighter geometry on mobile
- Preserve a smooth hero before adding decorative complexity

## Implementation Outline
- Remove the current mobile-only 2D hero fallback
- Add dedicated mobile scene-profile values for camera, composition, particles, and motion
- Refine hero layout so the systems card still fits naturally on phones
- Expand hero and scroll timelines so the 3D scene participates in the motion system
- Keep reduced-motion and low-performance escape hatches

## Validation Targets
- Mobile and desktop should look like the same website
- The hero should remain readable on narrow screens
- Scroll and animation should stay smooth on mobile-class hardware
