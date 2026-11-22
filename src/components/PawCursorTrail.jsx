import { useEffect, useRef } from 'react'
import { PawPrint } from 'lucide-react'

const trailLength = 24
const pawSize = 16

export default function PawCursorTrail() {
  const trail = useRef(null)

  useEffect(() => {
    const available = window.matchMedia('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)')
    const paws = Array.from(trail.current.children)
    let index = 0
    let lastPoint

    function move(event) {
      if (!available.matches || event.pointerType !== 'mouse' || event.target.closest?.('input, textarea, select, [contenteditable]')) return
      const { clientX: x, clientY: y, timeStamp: time } = event
      if (lastPoint && (time - lastPoint.time < 25 || Math.hypot(x - lastPoint.x, y - lastPoint.y) < 16)) return
      lastPoint = { x, y, time }
      const paw = paws[index]
      index = (index + 1) % paws.length
      paw.getAnimations().forEach(animation => animation.cancel())
      paw.style.translate = (x - pawSize / 2) + 'px ' + (y - pawSize / 2) + 'px'
      paw.animate([{ opacity: .52, scale: 1 }, { opacity: 0, scale: .72 }], { duration: 820, easing: 'ease-out' })
    }

    window.addEventListener('pointermove', move, { passive: true })
    return () => window.removeEventListener('pointermove', move)
  }, [])

  return <div className="pointer-paws" ref={trail} aria-hidden="true">
    {Array.from({ length: trailLength }, (_, index) => <PawPrint key={index} size={pawSize} />)}
  </div>
}
