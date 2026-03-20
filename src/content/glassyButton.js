const glassyIcons = {
  'arrow-right': `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  `,
  'arrow-up-right': `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M7 17 17 7" />
      <path d="M9 7h8v8" />
    </svg>
  `,
  home: `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4.5 10.5 12 4l7.5 6.5" />
      <path d="M7.5 10v9h9v-9" />
    </svg>
  `,
  spark: `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m12 4 1.9 4.8L19 10.7l-4.3 2.3L13.3 18l-1.8-4.5L7 11.7l4.2-2.2L12 4Z" />
    </svg>
  `,
}

function escapeAttribute(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
}

function renderAttributes(attributes = {}) {
  return Object.entries(attributes)
    .filter(([, value]) => value !== null && value !== undefined && value !== false)
    .map(([key, value]) => {
      if (value === true) {
        return key
      }

      return `${key}="${escapeAttribute(value)}"`
    })
    .join(' ')
}

function renderIcon(icon) {
  return glassyIcons[icon] ?? glassyIcons.home
}

export function renderGlassyButton({
  href,
  label,
  icon = 'home',
  ariaLabel,
  size = 'md',
  tone = 'neutral',
  className = '',
  iconStroke = 1.8,
  iconPosition = 'leading',
  attributes = {},
}) {
  const hasLabel = Boolean(label)
  const tag = href ? 'a' : 'button'
  const shapeClass = hasLabel ? 'glassy-button--pill' : 'glassy-button--icon'
  const classes = ['glassy-button', shapeClass, className].filter(Boolean).join(' ')
  const resolvedAriaLabel = ariaLabel ?? label ?? icon
  const buttonAttributes = renderAttributes({
    class: classes,
    href,
    type: href ? undefined : 'button',
    'aria-label': resolvedAriaLabel,
    'data-size': size,
    'data-tone': tone,
    ...attributes,
  })
  const iconMarkup = `
    <span class="glassy-button__icon" aria-hidden="true" style="--glassy-button-icon-stroke: ${iconStroke}">
      ${renderIcon(icon)}
    </span>
  `
  const labelMarkup = hasLabel ? `<span class="glassy-button__label">${label}</span>` : ''
  const contentMarkup =
    hasLabel && iconPosition === 'trailing'
      ? `${labelMarkup}${iconMarkup}`
      : `${iconMarkup}${labelMarkup}`

  return `
    <${tag} ${buttonAttributes}>
      <span class="glassy-button__surface" aria-hidden="true"></span>
      <span class="glassy-button__sheen" aria-hidden="true"></span>
      <span class="glassy-button__noise" aria-hidden="true"></span>
      <span class="glassy-button__content">${contentMarkup}</span>
    </${tag}>
  `
}
