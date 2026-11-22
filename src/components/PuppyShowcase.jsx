import { useEffect, useRef, useState } from 'react'
import { ArrowUpRight, ChevronLeft, ChevronRight, PawPrint } from 'lucide-react'
import { Link } from 'react-router-dom'
import { availablePuppies } from '../data/puppies.js'
import { PuppyCard } from './PuppyCard.jsx'
import { StoryStop } from './PuppyCompanion.jsx'

const scrollTourQuery = '(min-width: 951px) and (min-height: 580px) and (prefers-reduced-motion: no-preference)'

function tourStart(section) {
  const padding = parseFloat(getComputedStyle(section).paddingTop)
  return window.scrollY + section.getBoundingClientRect().top + padding - 24
}

function useCatalogTour(sectionRef, trackRef) {
  useEffect(() => {
    const section = sectionRef.current
    const track = trackRef.current
    const media = window.matchMedia(scrollTourQuery)
    let frame = 0
    let distance = 0
    let maximum = 0
    let start = 0
    let position = track.scrollLeft
    let lastFrame = 0

    function syncScroll(time) {
      frame = 0
      if (!distance) return
      const progress = Math.min(1, Math.max(0, (window.scrollY - start) / distance))
      const target = maximum * progress
      const elapsed = lastFrame ? Math.min(time - lastFrame, 50) : 16
      position += (target - position) * (1 - Math.exp(-elapsed / 42))
      const settling = Math.abs(target - position) > .75
      track.scrollLeft = settling ? position : target
      lastFrame = settling ? time : 0
      if (settling) schedule()
    }

    function schedule() {
      if (!frame) frame = requestAnimationFrame(syncScroll)
    }

    function updateSize() {
      section.classList.toggle('has-scroll-tour', media.matches)
      maximum = Math.max(0, track.scrollWidth - track.clientWidth)
      distance = media.matches && maximum ? Math.round(maximum * .8) : 0
      section.classList.toggle('has-scroll-tour', Boolean(distance))
      section.style.setProperty('--catalog-distance', distance + 'px')
      start = tourStart(section)
      position = track.scrollLeft
      schedule()
    }

    const resize = new ResizeObserver(updateSize)
    resize.observe(track)
    if (section.previousElementSibling) resize.observe(section.previousElementSibling)
    media.addEventListener('change', updateSize)
    window.addEventListener('scroll', schedule, { passive: true })
    updateSize()
    return () => {
      resize.disconnect()
      media.removeEventListener('change', updateSize)
      window.removeEventListener('scroll', schedule)
      cancelAnimationFrame(frame)
    }
  }, [sectionRef, trackRef])
}

function cardPitch(track) {
  const card = track.firstElementChild
  return card.getBoundingClientRect().width + parseFloat(getComputedStyle(track).columnGap)
}

export default function PuppyShowcase() {
  const section = useRef(null)
  const track = useRef(null)
  const [ends, setEnds] = useState({ start: true, end: false })
  const [featured, setFeatured] = useState(-1)
  useCatalogTour(section, track)

  function updateEnds() {
    const node = track.current
    const { clientWidth, scrollLeft, scrollWidth } = node
    const maximum = scrollWidth - clientWidth
    if (maximum > 0) section.current.style.setProperty('--showcase-progress', Math.max(.04, scrollLeft / maximum))
    const pitch = cardPitch(node)
    const spotlight = section.current.classList.contains('has-scroll-tour') ? -.14 * pitch : clientWidth * .18
    setFeatured(Math.min(availablePuppies.length - 1, Math.floor((scrollLeft + spotlight) / pitch)))
    const start = scrollLeft <= 1
    const end = scrollLeft + clientWidth >= scrollWidth - 1
    setEnds(previous => previous.start === start && previous.end === end ? previous : { start, end })
  }

  function move(direction) {
    const node = track.current
    const maximum = node.scrollWidth - node.clientWidth
    const target = Math.max(0, Math.min(maximum, node.scrollLeft + direction * cardPitch(node)))
    const distance = parseFloat(section.current.style.getPropertyValue('--catalog-distance'))
    const smooth = !window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (distance && maximum) {
      window.scrollTo({ top: tourStart(section.current) + distance * target / maximum, behavior: smooth ? 'smooth' : 'instant' })
    } else {
      node.scrollTo({ left: target, behavior: smooth ? 'smooth' : 'instant' })
    }
  }

  return <section ref={section} className="section soft puppy-showcase">
    <StoryStop scene="catalog" />
    <StoryStop scene="catalog" end />
    <div className="puppy-showcase-window" data-motion="showcase">
      <div className="wrap">
        <div className="section-heading">
          <div className="showcase-title">
            <h2 id="showcase-heading">Meet the pups</h2>
            <p>Get to know the puppies looking for a home.</p>
          </div>
          <div className="showcase-actions">
            <Link className="text-link" to="/puppies">See all <span className="sr-only">{availablePuppies.length} </span>available puppies</Link>
            <div className="showcase-controls" aria-label="Puppy preview controls">
              <button type="button" className="icon-button" aria-label="Previous puppy cards" aria-controls="puppy-preview-track" aria-disabled={ends.start} onClick={() => !ends.start && move(-1)}><ChevronLeft aria-hidden="true" /></button>
              <button type="button" className="icon-button" aria-label="Next puppy cards" aria-controls="puppy-preview-track" aria-disabled={ends.end} onClick={() => !ends.end && move(1)}><ChevronRight aria-hidden="true" /></button>
            </div>
          </div>
        </div>
      </div>
      <div ref={track} className="puppy-preview-track" id="puppy-preview-track" role="region" aria-labelledby="showcase-heading" onScroll={updateEnds}>
        {availablePuppies.map((puppy, index) => {
          const isFeatured = index === featured
          const atEnd = ends.end && index >= availablePuppies.length - 3
          return <PuppyCard key={puppy.slug} puppy={puppy} featured={isFeatured} doorOpen={isFeatured || index === featured - 1 || atEnd} />
        })}
        <Link className="showcase-exit" to="/puppies"><PawPrint size={26} aria-hidden="true" /><span>Meet them all</span><ArrowUpRight size={18} aria-hidden="true" /></Link>
      </div>
      <div className="showcase-progress" aria-hidden="true"><span /></div>
    </div>
  </section>
}
