/**
 * Wires the CLI contact form. Enter key or execute button
 * opens a mailto: link prefilled with the typed message.
 */
export function createContactCli({ scopeElement, email }) {
  const input = scopeElement?.querySelector?.('.contact-cli__input')
  const execute = scopeElement?.querySelector?.('.contact-cli__execute')

  if (!input || !execute || !email) {
    return { destroy() {} }
  }

  function send() {
    const msg = input.value.trim()
    if (!msg) return
    window.location.href = `mailto:${email}?body=${encodeURIComponent(msg)}`
    input.value = ''
  }

  function handleKeydown(e) {
    if (e.key === 'Enter') {
      e.preventDefault()
      send()
    }
  }

  input.addEventListener('keydown', handleKeydown)
  execute.addEventListener('click', send)

  return {
    destroy() {
      input.removeEventListener('keydown', handleKeydown)
      execute.removeEventListener('click', send)
    },
  }
}
