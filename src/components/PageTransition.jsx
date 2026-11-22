import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { PawPrint } from 'lucide-react'
import { PuppyIllustration } from './PuppyCompanion.jsx'

const motionPreference = '(prefers-reduced-motion: reduce)'
const durations = { intro: 680, cover: 420, reveal: 400 }

function useReducedMotion() {
  const [reduced, setReduced] = useState(() => window.matchMedia(motionPreference).matches)
  useEffect(() => {
    const media = window.matchMedia(motionPreference)
    const update = () => setReduced(media.matches)
    update()
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [])
  return reduced
}

export function usePageTransition(location) {
  const latest = useRef(location)
  const reduced = useReducedMotion()
  const [view, setView] = useState({ location, phase: !reduced && location.pathname === '/' ? 'intro' : 'idle' })

  useLayoutEffect(() => {
    latest.current = location
    if (reduced || (view.phase === 'idle' && view.location.pathname === location.pathname)) {
      if (view.location !== location || view.phase !== 'idle') setView({ location, phase: 'idle' })
    } else if (view.phase === 'idle') {
      setView({ location: view.location, phase: 'cover' })
    }
  }, [location, reduced, view])

  const { phase } = view
  useEffect(() => {
    if (phase === 'idle') return
    const timer = window.setTimeout(() => {
      setView(previous => {
        if (previous.phase !== phase) return previous
        return phase === 'cover'
          ? { location: latest.current, phase: 'reveal' }
          : { location: previous.location, phase: 'idle' }
      })
    }, durations[phase])
    return () => window.clearTimeout(timer)
  }, [phase])

  return view
}

export function PageTransition({ phase }) {
  if (phase === 'idle') return null
  return <div className="route-curtain" data-phase={phase} style={{ '--curtain-time': durations[phase] + 'ms' }} aria-hidden="true">
    <div className="route-curtain-art">
      <div className="route-curtain-trail"><PawPrint /><PawPrint /><PawPrint /></div>
      <PuppyIllustration />
    </div>
  </div>
}
