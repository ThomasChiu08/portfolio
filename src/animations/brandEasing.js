/**
 * Brand easing curves — Apple-inspired institutional motion.
 * Register once at boot, then reference by name in any GSAP tween:
 *   ease: 'brand.smooth'
 */
export function registerBrandEasing(CustomEase) {
  CustomEase.create('brand.smooth', '0.25, 0.1, 0.25, 1.0')
  CustomEase.create('brand.decel', '0.0, 0.0, 0.2, 1.0')
  CustomEase.create('brand.accel', '0.4, 0.0, 1.0, 1.0')
  CustomEase.create('brand.spring', '0.175, 0.885, 0.32, 1.275')
  CustomEase.create('brand.reveal', '0.16, 1.0, 0.3, 1.0')
}
