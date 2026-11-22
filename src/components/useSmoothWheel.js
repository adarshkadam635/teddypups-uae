import { useEffect } from 'react'

function usesNativeWheel(target) {
  if (!(target instanceof Element)) return true
  if (target.closest('dialog, textarea, select, input[type="number"], video, [contenteditable="true"]')) return true
  for (let node = target; node && node !== document.body; node = node.parentElement) {
    if (node.scrollHeight > node.clientHeight && /auto|scroll/.test(getComputedStyle(node).overflowY)) return true
  }
  return false
}

export function useSmoothWheel(pathname) {
  useEffect(() => {
    const preference = window.matchMedia('(pointer: fine) and (prefers-reduced-motion: no-preference)')
    let frame = 0
    let lastTime = 0
    let lastWritten = 0
    let position = 0
    let target = 0
    let velocity = 0
    let response = 0

    function stop() {
      cancelAnimationFrame(frame)
      frame = 0
      velocity = 0
    }

    function maxScroll() {
      return Math.max(0, document.documentElement.scrollHeight - window.innerHeight)
    }

    function step(time) {
      if (Math.abs(window.scrollY - lastWritten) > 2) {
        stop()
        return
      }
      target = Math.min(target, maxScroll())
      const elapsed = lastTime ? Math.min(time - lastTime, 50) : 16
      const offset = position - target
      const approach = velocity + offset / response
      const decay = Math.exp(-elapsed / response)
      // A critically damped spring eases into each wheel step and settles without bouncing.
      const remaining = (offset + approach * elapsed) * decay
      velocity = (velocity - approach * elapsed / response) * decay
      const finished = offset * remaining <= 0 || (Math.abs(remaining) < .8 && Math.abs(velocity) < .05)
      position = finished ? target : target + remaining
      window.scrollTo({ top: position, behavior: 'instant' })
      lastWritten = window.scrollY
      lastTime = time
      if (finished) stop()
      else frame = requestAnimationFrame(step)
    }

    function wheel(event) {
      const mode = event.deltaMode
      const { deltaX, deltaY } = event
      if (!preference.matches || event.defaultPrevented || !event.cancelable ||
        !deltaY || Math.abs(deltaX) >= Math.abs(deltaY) || event.ctrlKey || event.metaKey ||
        event.shiftKey || event.altKey || usesNativeWheel(event.target)) {
        stop()
        return
      }

      const current = window.scrollY
      if (frame && Math.abs(current - lastWritten) > 2) stop()
      const units = mode === 1 ? 16 : mode === 2 ? window.innerHeight : 1
      const delta = deltaY * units
      // Reversing direction should move from the visible position immediately.
      if (frame && delta * (target - current) < 0) stop()
      const next = Math.max(0, Math.min(maxScroll(), (frame ? target : current) + delta))
      if (!frame && next === current) return

      event.preventDefault()
      if (!frame) {
        position = current
        lastWritten = current
        lastTime = 0
        frame = requestAnimationFrame(step)
      }
      // Small deltas stay responsive while large wheel steps get a gentler ramp.
      response = 34 + Math.min(1, Math.abs(delta) / 120) * 44
      target = next
    }

    function updatePreference() {
      window.removeEventListener('wheel', wheel)
      stop()
      if (preference.matches) window.addEventListener('wheel', wheel, { passive: false })
    }

    updatePreference()
    preference.addEventListener('change', updatePreference)
    window.addEventListener('pointerdown', stop, { passive: true })
    window.addEventListener('keydown', stop)
    return () => {
      stop()
      preference.removeEventListener('change', updatePreference)
      window.removeEventListener('wheel', wheel)
      window.removeEventListener('pointerdown', stop)
      window.removeEventListener('keydown', stop)
    }
  }, [pathname])
}
