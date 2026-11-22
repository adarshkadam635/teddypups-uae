import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight, MapPin, Plane } from 'lucide-react'
import { StoryStop } from './PuppyCompanion.jsx'
import { SectionHeading } from './Layout.jsx'
import { Photo } from './PuppyCard.jsx'
import { visitPhoto } from '../data/photos.js'

const skyline = 'M20 171h440M38 171v-39h23v39m11 0v-84h26v84m66 0v-53h34v53m15 0V76l21-12v107m20 0v-64h18v64m49 0v-54h28v54m12 0V89h19v82m11 0v-31h32v31M288 171V89l9-14V51l5-13 5 13v24l9 14v82'

export function ShowroomScene({ skylineOnly = false }) {
  return <div className="route-scene showroom-scene" data-motion="showroom">
    <svg className="showroom-skyline" viewBox="0 0 480 194" aria-hidden="true">
      <circle cx="106" cy="60" r="36" fill="#e9c58d" />
      <path d={skyline} />
    </svg>
    {skylineOnly ? <span className="skyline-label">Downtown Dubai</span> : <div className="showroom-window">
      <div className="showroom-awning" aria-hidden="true" />
      <Photo photo={visitPhoto} />
    </div>}
  </div>
}

export function FlightScene({ withSkyline = false }) {
  const path = useRef(null)
  const plane = useRef(null)

  useEffect(() => {
    const route = path.current
    const craft = plane.current
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
    let flight
    let played = false
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting || played || reduced.matches) return
      played = true
      observer.disconnect()

      const length = route.getTotalLength()
      const frames = Array.from({ length: 25 }, (_, i) => {
        const distance = length * i / 24
        const point = route.getPointAtLength(distance)
        const before = route.getPointAtLength(Math.max(0, distance - 2))
        const after = route.getPointAtLength(Math.min(length, distance + 2))
        const tangent = Math.atan2(after.y - before.y, after.x - before.x) * 180 / Math.PI
        const angle = Math.max(-27, Math.min(25, tangent))
        return { transform: 'translate(' + point.x + 'px, ' + point.y + 'px) rotate(' + angle + 'deg)' }
      })
      flight = craft.animate(frames, { duration: 1850, delay: 160, easing: 'cubic-bezier(.23,.65,.36,1)', fill: 'both' })
    }, { threshold: .37 })

    function updatePreference() {
      if (reduced.matches) {
        observer.disconnect()
        flight?.cancel()
        played = false
      } else if (!played) {
        observer.observe(route.ownerSVGElement)
      }
    }

    updatePreference()
    reduced.addEventListener('change', updatePreference)
    return () => {
      observer.disconnect()
      reduced.removeEventListener('change', updatePreference)
      flight?.cancel()
    }
  }, [])

  return <div className="route-scene flight-scene">
    <svg className="flight-map" viewBox="0 0 480 194" role="img" aria-label="Illustrated flight from Korea to Dubai">
      {withSkyline && <path className="flight-skyline" d={skyline} />}
      <path className="flight-cloud" d="M42 63h52m18 0h13m250 13h32m-18-14h37" />
      <path ref={path} className="flight-path" d="M69 146 Q206 -21 414 126" />
      <circle cx="69" cy="146" r="4" />
      <circle cx="414" cy="126" r="4" />
      <text x="69" y="176">Korea</text>
      <text x="414" y="156">Dubai</text>
      <g ref={plane} className="route-plane">
        <path d="M-21 -3 -32 -17h10l15 13M-2 2l-14 17H-4L14 3M-2 -4l-13 -16H-3L14 -4" fill="#8b9a79" stroke="#46523d" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M-27 1c0-5 7-9 16-9h25c12 0 21 5 25 9-4 5-13 8-25 8h-25c-9 0-16-3-16-8Z" fill="#fff9ed" stroke="#46523d" strokeWidth="1.5" />
        <path d="M24 -5l5 5" stroke="#46523d" strokeWidth="1.7" strokeLinecap="round" />
        <circle cx="10" cy="1" r="2.1" fill="#9b472f" />
        <circle cx="2" cy="1" r="2.1" fill="#9b472f" />
      </g>
    </svg>
  </div>
}

export default function AdoptionRoutes() {
  return <section className="wrap section story-paths">
    <StoryStop scene="paths" />
    <SectionHeading title="Two ways to meet your puppy" />
    <div className="two-column">
      <article className="path-card route-card" data-motion="adoption">
        <h3><MapPin size={22} aria-hidden="true" /> Puppies in Dubai</h3>
        <ShowroomScene />
        <p>Plan a showroom visit and spend time with a puppy already in Dubai. Confirm local availability before travelling.</p>
        <Link className="text-link" to="/puppies?origin=local">View local puppies <ArrowUpRight size={17} aria-hidden="true" /></Link>
      </article>
      <article className="path-card route-card" data-motion="adoption">
        <h3><Plane size={22} aria-hidden="true" /> Imported for you</h3>
        <FlightScene />
        <p>Ask about teacup breeds sourced overseas and see which profiles are currently listed as imported.</p>
        <Link className="text-link" to="/puppies?origin=imported">View imported puppies <ArrowUpRight size={17} aria-hidden="true" /></Link>
      </article>
    </div>
  </section>
}
