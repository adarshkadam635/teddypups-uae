import { useEffect, useRef, useState } from 'react'
import { Check, PawPrint } from 'lucide-react'
import { Photo } from './PuppyCard.jsx'
import HeroKennel from './HeroKennel.jsx'
import { PuppyIllustration } from './PuppyCompanion.jsx'
import { availablePuppies } from '../data/puppies.js'
import { heroPhoto } from '../data/photos.js'

const portraitLines = [
  ['maltipoo-max-male', 'I saved you a spot in the sunshine.'],
  ['korean-teacup-maltipoo-female', 'Can we make cuddle time all the time?'],
  ['toy-poodle-male-female', 'You bring the treats. I’ll bring the tricks.'],
  ['copper-male', 'Every adventure starts with a good sniff.'],
  ['pomeranian-female', 'Yes, the fluff is all mine.'],
  ['shitzu-female', 'Walk first, lap nap later?'],
]
const portraits = portraitLines.flatMap(([slug, line]) => {
  const puppy = availablePuppies.find(entry => entry.slug === slug)
  return puppy ? [{ puppy, line }] : []
})

function usePortraitIntroductions(railRef, hasSelection) {
  const [visible, setVisible] = useState(false)
  const [speaker, setSpeaker] = useState(0)

  useEffect(() => {
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
    let inView = false
    const update = () => setVisible(inView && !motion.matches)
    const observer = new IntersectionObserver(([entry]) => {
      inView = entry.intersectionRatio >= .55
      update()
    }, { threshold: .55 })
    observer.observe(railRef.current)
    motion.addEventListener('change', update)
    return () => {
      observer.disconnect()
      motion.removeEventListener('change', update)
    }
  }, [railRef])

  useEffect(() => {
    if (!visible || hasSelection || speaker >= portraits.length) return
    const rail = railRef.current
    const timer = window.setInterval(() => {
      if (!document.hidden && !rail.querySelector('.portrait-tile:is(:hover, :focus-visible)')) {
        setSpeaker(index => index + 1)
      }
    }, 1850)
    return () => window.clearInterval(timer)
  }, [railRef, visible, hasSelection, speaker])

  return visible && !hasSelection ? speaker : -1
}

export default function HeroPortraits({ onPreview }) {
  const [selection, setSelection] = useState({ puppy: null, clicks: 0 })
  const { puppy, clicks } = selection
  const rail = useRef(null)
  const speakerIndex = usePortraitIntroductions(rail, Boolean(puppy))
  const speaker = portraits[speakerIndex]?.puppy

  return <>
    <div className="hero-portraits">
      <figure className="hero-figure" data-portrait-selected={Boolean(puppy) || undefined}>
        <Photo key={puppy?.slug ?? 'hero'} photo={puppy?.photos[0] ?? heroPhoto} loading="eager" fetchPriority="high" />
        <span className="hero-portrait-seal" aria-hidden="true"><PawPrint size={24} /></span>
        <figcaption aria-live="polite"><PawPrint size={19} aria-hidden="true" /> <span>{puppy ? puppy.name + ' · Illustrative portrait' : 'Illustrative puppy portrait'}</span></figcaption>
      </figure>
      <HeroKennel />
    </div>
    <div className="portrait-picker">
      <PuppyIllustration peek />
      <div ref={rail} className="portrait-rail" role="group" aria-label="Choose a puppy portrait">
        <p className="portrait-label" aria-hidden="true"><PawPrint size={19} /> Puppy postcards</p>
        {speaker && <p className="portrait-intro portrait-name" aria-hidden="true" style={{ '--speaker-column': speakerIndex + (speakerIndex < 3 ? 1 : 2) }}>Hi, I’m {speaker.name}!</p>}
        {portraits.map(({ puppy: entry, line }) => {
          const active = puppy?.slug === entry.slug
          const lineId = `portrait-line-${entry.slug}`
          return <button key={entry.slug} type="button" className="portrait-tile" aria-label={'Preview ' + entry.name} aria-describedby={lineId} aria-pressed={active} data-speaking={speaker?.slug === entry.slug || undefined} onClick={() => {
            setSelection(previous => ({ puppy: entry, clicks: previous.clicks + 1 }))
            onPreview()
          }}>
            <span className="portrait-name"><strong aria-hidden="true">Hi, I’m {entry.name}!</strong><q id={lineId}>{line}</q></span>
            <span className="portrait-pop" key={active ? clicks : 'idle'}>
              <Photo photo={entry.photos[0]} alt="" />
              {active && <span className="portrait-check" aria-hidden="true"><Check size={13} /></span>}
            </span>
            <span className="portrait-caption" aria-hidden="true">{entry.name}</span>
          </button>
        })}
      </div>
    </div>
  </>
}
