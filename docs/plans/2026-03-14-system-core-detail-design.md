# System Core Detail Design

## Objective
Upgrade the existing abstract core into a more precise, premium "orbital lattice core" that feels engineered rather than generic.

## Direction
- Structure-first detail: add layered shell pieces, secondary orbital nodes, and restrained arc fragments
- Keep the visual language cinematic and minimal, closer to a product sculpture than a sci-fi prop
- Preserve performance through device-tiered geometry, particle counts, and animation intensity

## Geometry
- Keep the central shell, inner core, and primary orbit rings as the scene anchor
- Add partial shell plates and a thin equatorial seam so the core reads as designed, not monolithic
- Add 2-3 floating arc fragments around the core to imply a larger orbital mechanism
- Add a second class of smaller relay nodes outside the main orbiting nodes
- Avoid dense network lines or noisy wireframes

## Material And Light
- Maintain a cool metallic / ceramic surface language
- Use subtle roughness and clearcoat differences to separate shell, plates, seam, and fragments
- Preserve the current restrained lighting model; detail should come from form and motion, not bloom

## Motion
- The main core remains stable and calm
- Shell plates and arc fragments get slight asynchronous precession
- Relay nodes move on wider, quieter orbits than the main nodes
- Particles split into near-core drift and far-field drift for more depth without clutter

## Validation
Success means:
- the hero core looks more intentional at first glance on desktop
- motion remains controlled and premium
- low-tier devices still receive reduced geometry and particle load
- `npm run build` stays clean
