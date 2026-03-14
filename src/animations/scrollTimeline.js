export function createScrollTimeline({ gsap, reducedMotion, sceneController }) {
  const { camera, core, sceneState } = sceneController

  return gsap
    .timeline({
      defaults: {
        ease: 'none',
      },
      scrollTrigger: {
        trigger: '.page',
        start: 'top top',
        end: 'bottom bottom',
        scrub: reducedMotion ? 0.75 : 1.35,
      },
    })
    .to(
      core.group.position,
      {
        x: 0.8,
        y: 0.1,
      },
      0,
    )
    .to(
      core.group.rotation,
      {
        y: 0.35,
        x: 0.08,
      },
      0,
    )
    .to(
      camera.position,
      {
        x: 0.25,
        y: 0.12,
        z: 7.2,
      },
      0,
    )
    .to(
      sceneState,
      {
        palette: 0.9,
        drift: 0.28,
        particleSpin: 0.18,
        corePulse: 0.2,
      },
      0,
    )
    .to(
      '.scene-shell__grid',
      {
        opacity: 0.26,
      },
      0,
    )
    .to(
      core.group.position,
      {
        x: -1.05,
        y: -0.08,
      },
      1,
    )
    .to(
      core.group.rotation,
      {
        y: 1.3,
        x: 0.38,
      },
      1,
    )
    .to(
      camera.position,
      {
        x: -0.28,
        y: -0.18,
        z: 6.8,
      },
      1,
    )
    .to(
      sceneState,
      {
        palette: 1.95,
        drift: 0.62,
        particleSpin: 0.34,
        particleTilt: 0.25,
        corePulse: 0.44,
      },
      1,
    )
    .to(
      '.scene-shell__grid',
      {
        opacity: 0.18,
      },
      1,
    )
    .to(
      core.group.position,
      {
        x: 0.55,
        y: -0.18,
      },
      2,
    )
    .to(
      core.group.rotation,
      {
        y: 2.35,
        x: 0.64,
      },
      2,
    )
    .to(
      camera.position,
      {
        x: 0.12,
        y: -0.08,
        z: 7.05,
      },
      2,
    )
    .to(
      sceneState,
      {
        palette: 2.8,
        drift: 0.9,
        particleSpin: 0.5,
        particleTilt: 0.42,
        corePulse: 0.72,
      },
      2,
    )
    .to(
      '.scene-shell__grid',
      {
        opacity: 0.12,
      },
      2,
    )
}
