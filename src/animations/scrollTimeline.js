import { getScrollMotionPreset } from './motionPresets'

export function createScrollTimeline({ gsap, reducedMotion, sceneController }) {
  const { core, sceneState, profile } = sceneController
  const { scrub, stage0, stage1, stage2 } = getScrollMotionPreset({
    reducedMotion,
    profile,
    sceneState,
  })

  return gsap
    .timeline({
      defaults: {
        ease: 'none',
      },
      scrollTrigger: {
        trigger: '.page',
        start: 'top top',
        end: 'bottom bottom',
        scrub,
      },
    })
    .to(
      core.group.position,
      stage0.groupPosition,
      0,
    )
    .to(
      core.group.rotation,
      stage0.groupRotation,
      0,
    )
    .to(
      sceneState,
      {
        cameraBaseX: stage0.camera.x,
        cameraBaseY: stage0.camera.y,
        cameraBaseZ: stage0.camera.z,
      },
      0,
    )
    .to(
      sceneState,
      stage0.scene,
      0,
    )
    .to(
      '.scene-shell__grid',
      {
        opacity: stage0.gridOpacity,
      },
      0,
    )
    .to(
      '.js-hero-card',
      stage0.card,
      0,
    )
    .to(
      '.js-hero-visual-badge',
      stage0.badge ?? {},
      0,
    )
    .to(
      core.group.position,
      stage1.groupPosition,
      1,
    )
    .to(
      core.group.rotation,
      stage1.groupRotation,
      1,
    )
    .to(
      sceneState,
      {
        cameraBaseX: stage1.camera.x,
        cameraBaseY: stage1.camera.y,
        cameraBaseZ: stage1.camera.z,
      },
      1,
    )
    .to(
      sceneState,
      stage1.scene,
      1,
    )
    .to(
      '.scene-shell__grid',
      {
        opacity: stage1.gridOpacity,
      },
      1,
    )
    .to(
      '.js-hero-card',
      stage1.card,
      1,
    )
    .to(
      '.js-hero-visual-badge',
      stage1.badge ?? {},
      1,
    )
    .to(
      core.group.position,
      stage2.groupPosition,
      2,
    )
    .to(
      core.group.rotation,
      stage2.groupRotation,
      2,
    )
    .to(
      sceneState,
      {
        cameraBaseX: stage2.camera.x,
        cameraBaseY: stage2.camera.y,
        cameraBaseZ: stage2.camera.z,
      },
      2,
    )
    .to(
      sceneState,
      stage2.scene,
      2,
    )
    .to(
      '.scene-shell__grid',
      {
        opacity: stage2.gridOpacity,
      },
      2,
    )
    .to(
      '.js-hero-card',
      stage2.card,
      2,
    )
}
