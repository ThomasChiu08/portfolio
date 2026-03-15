import { getHeroMotionPreset } from './motionPresets'

export function createHeroTimeline({ gsap, reducedMotion, desktopMotion, sceneController }) {
  const motion = getHeroMotionPreset({
    reducedMotion,
    desktopMotion,
    baseCameraZ: sceneController?.sceneState?.cameraBaseZ ?? 0,
  })

  const timeline = gsap.timeline({
    defaults: {
      ease: 'power3.out',
    },
  })

  if (sceneController) {
    const { coreAnchor, sceneState } = sceneController
    const baseCameraZ = sceneState.cameraBaseZ

    coreAnchor.position.x = sceneState.anchorBaseX + motion.anchorDrift
    coreAnchor.position.y = sceneState.anchorBaseY + motion.anchorLift
    coreAnchor.scale.setScalar(sceneState.anchorBaseScale * motion.introScale)
    sceneState.sceneIntro = motion.introScale
    sceneState.cameraBaseZ = motion.introZ

    timeline
      .fromTo(
        coreAnchor.position,
        {
          x: sceneState.anchorBaseX + motion.anchorDrift,
          y: sceneState.anchorBaseY + motion.anchorLift,
        },
        {
          x: sceneState.anchorBaseX,
          y: sceneState.anchorBaseY,
          duration: motion.introAnchorDuration,
          ease: 'expo.out',
        },
        motion.introPhaseStart,
      )
      .fromTo(
        coreAnchor.scale,
        {
          x: sceneState.anchorBaseScale * motion.introScale,
          y: sceneState.anchorBaseScale * motion.introScale,
          z: sceneState.anchorBaseScale * motion.introScale,
        },
        {
          x: sceneState.anchorBaseScale,
          y: sceneState.anchorBaseScale,
          z: sceneState.anchorBaseScale,
          duration: motion.introScaleDuration,
          ease: 'expo.out',
        },
        motion.introPhaseStart,
      )
      .fromTo(
        sceneState,
        {
          sceneIntro: motion.introScale,
          cameraBaseZ: motion.introZ,
          corePulse: motion.introCorePulseStart,
        },
        {
          sceneIntro: 1,
          cameraBaseZ: baseCameraZ,
          corePulse: motion.introCorePulseEnd,
          duration: motion.introStateDuration,
          ease: 'expo.out',
        },
        motion.introPhaseStart,
      )
  }

  return timeline
    .fromTo(
      '.js-masthead',
      {
        y: motion.masthead.fromY,
        opacity: 0,
      },
      {
        y: 0,
        opacity: 1,
        duration: motion.masthead.duration,
      },
    )
    .fromTo(
      '.js-hero-kicker',
      {
        y: motion.kicker.fromY,
        opacity: 0,
      },
      {
        y: 0,
        opacity: 1,
        duration: motion.duration,
      },
      motion.kicker.at,
    )
    .fromTo(
      '.js-hero-title',
      {
        y: motion.title.fromY,
        opacity: 0,
      },
      {
        y: 0,
        opacity: 1,
        duration: motion.duration + motion.title.durationOffset,
      },
      motion.title.at,
    )
    .fromTo(
      '.js-hero-positioning',
      {
        y: motion.positioning.fromY,
        opacity: 0,
      },
      {
        y: 0,
        opacity: 1,
        duration: motion.positioning.duration,
      },
      motion.positioning.at,
    )
    .fromTo(
      '.js-hero-body',
      {
        y: motion.body.fromY,
        opacity: 0,
      },
      {
        y: 0,
        opacity: 1,
        duration: motion.duration,
      },
      motion.body.at,
    )
    .fromTo(
      '.js-hero-proof',
      {
        y: motion.proof.fromY,
        opacity: 0,
      },
      {
        y: 0,
        opacity: 1,
        duration: motion.proof.duration,
      },
      motion.proof.at,
    )
    .fromTo(
      '.js-hero-actions a',
      {
        y: motion.actions.fromY,
        opacity: 0,
      },
      {
        y: 0,
        opacity: 1,
        duration: motion.actions.duration,
        stagger: motion.actions.stagger,
      },
      motion.actions.at,
    )
    .fromTo(
      '.js-hero-micro',
      {
        y: motion.micro.fromY,
        opacity: 0,
      },
      {
        y: 0,
        opacity: 1,
        duration: motion.micro.duration,
      },
      motion.micro.at,
    )
    .fromTo(
      '.js-hero-visual',
      {
        y: motion.visual.fromY,
        opacity: 0,
        scale: motion.visual.scale,
      },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: motion.visual.duration,
      },
      motion.visual.at,
    )
    .fromTo(
      '.js-hero-visual-badge',
      {
        y: motion.badge.fromY,
        opacity: 0,
      },
      {
        y: 0,
        opacity: 1,
        duration: motion.badge.duration,
      },
      motion.badge.at,
    )
    .fromTo(
      '.js-hero-visual-hint',
      {
        y: motion.hint.fromY,
        opacity: 0,
      },
      {
        y: 0,
        opacity: 1,
        duration: motion.hint.duration,
      },
      motion.hint.at,
    )
    .fromTo(
      '.js-hero-card',
      {
        y: motion.card.fromY,
        opacity: 0,
      },
      {
        y: 0,
        opacity: 1,
        duration: motion.card.duration,
      },
      motion.card.at,
    )
}
