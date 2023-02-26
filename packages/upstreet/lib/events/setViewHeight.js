
/**
 * Calculate view height to compensate for mobile browsers.
 */
export function setViewHeight() {
  const doc = document.documentElement
  doc.style.setProperty(
    '--viewHeight',
    ( window.innerHeight * .01 ) + 'px',
  )
}
